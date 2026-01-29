// ============================================
// oWi AI - x402 Micropayment Verification
// ============================================

import { createPublicClient, http, parseUnits, Address } from "viem";
import { baseSepolia } from "viem/chains";

// ============================================
// Types
// ============================================

export interface PaymentReceipt {
    transactionHash: string;
    from: Address;
    to: Address;
    amount: string;
    token: Address;
    timestamp: number;
}

export interface X402Header {
    accepts: {
        scheme: string;
        network: string;
        maxAmountRequired: string;
        resource: string;
        description: string;
        payTo: string;
    }[];
}

// ============================================
// Constants
// ============================================

const SIGNAL_PRICE_USDC = "10000"; // $0.01 in USDC (6 decimals)
const PAYMENT_ADDRESS = process.env.PAYMENT_ADDRESS as Address;

// ============================================
// Viem Client
// ============================================

const client = createPublicClient({
    chain: baseSepolia,
    transport: http(process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org"),
});

// ============================================
// Payment Verification Functions
// ============================================

/**
 * Generate x402 payment required header
 */
export function generateX402Header(resource: string): X402Header {
    return {
        accepts: [
            {
                scheme: "exact",
                network: "base-sepolia",
                maxAmountRequired: SIGNAL_PRICE_USDC,
                resource,
                description: "AI Trading Signal - $0.01 USDC",
                payTo: PAYMENT_ADDRESS || "0x0000000000000000000000000000000000000000",
            },
        ],
    };
}

/**
 * Verify a payment receipt
 */
export async function verifyPaymentReceipt(
    receiptHeader: string
): Promise<{ valid: boolean; error?: string }> {
    try {
        // Parse the receipt
        const receipt: PaymentReceipt = JSON.parse(receiptHeader);

        // Basic validation
        if (!receipt.transactionHash || !receipt.from || !receipt.amount) {
            return { valid: false, error: "Invalid receipt format" };
        }

        // Check if amount is sufficient
        if (BigInt(receipt.amount) < BigInt(SIGNAL_PRICE_USDC)) {
            return { valid: false, error: "Insufficient payment amount" };
        }

        // Check if payment was sent to correct address
        if (PAYMENT_ADDRESS && receipt.to.toLowerCase() !== PAYMENT_ADDRESS.toLowerCase()) {
            return { valid: false, error: "Payment sent to wrong address" };
        }

        // In production, you would verify the transaction on-chain
        // const tx = await client.getTransaction({ hash: receipt.transactionHash as `0x${string}` });
        // Verify tx details match receipt

        // For demo, we accept valid-looking receipts
        return { valid: true };
    } catch (error) {
        console.error("[x402] Receipt verification failed:", error);
        return { valid: false, error: "Receipt verification failed" };
    }
}

/**
 * Create a simple receipt for testing
 */
export function createTestReceipt(
    from: Address,
    txHash: string
): string {
    const receipt: PaymentReceipt = {
        transactionHash: txHash,
        from,
        to: PAYMENT_ADDRESS || "0x0000000000000000000000000000000000000000",
        amount: SIGNAL_PRICE_USDC,
        token: process.env.USDC_ADDRESS as Address || "0x0000000000000000000000000000000000000000",
        timestamp: Date.now(),
    };

    return JSON.stringify(receipt);
}

// ============================================
// Middleware Helper
// ============================================

export interface PaymentContext {
    isPaid: boolean;
    receipt?: PaymentReceipt;
}

/**
 * Check payment from request headers
 */
export async function checkPayment(
    headers: Headers
): Promise<PaymentContext> {
    const receiptHeader = headers.get("X-402-Receipt");

    // Skip payment check in development
    if (process.env.NODE_ENV !== "production" || process.env.SKIP_PAYMENT === "true") {
        return { isPaid: true };
    }

    if (!receiptHeader) {
        return { isPaid: false };
    }

    const verification = await verifyPaymentReceipt(receiptHeader);

    if (!verification.valid) {
        console.warn("[x402] Invalid payment:", verification.error);
        return { isPaid: false };
    }

    try {
        const receipt = JSON.parse(receiptHeader);
        return { isPaid: true, receipt };
    } catch {
        return { isPaid: false };
    }
}
