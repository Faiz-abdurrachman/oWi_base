"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { CONTRACTS, USDC_CONFIG, GOLD_CONFIG } from "@/lib/constants";
import { VAULT_ABI, ERC20_ABI } from "@/lib/contracts";

// ============================================
// PORTFOLIO HOOKS
// ============================================

/**
 * Hook untuk membaca posisi user di vault
 */
export function useUserPosition() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "getUserPosition",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && CONTRACTS.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    const position = data
        ? {
            usdcAmount: formatUnits(data[0], USDC_CONFIG.decimals),
            goldAmount: formatUnits(data[1], GOLD_CONFIG.decimals),
            totalDeposited: formatUnits(data[2], USDC_CONFIG.decimals),
            totalWithdrawn: formatUnits(data[3], USDC_CONFIG.decimals),
            totalTrades: Number(data[4]),
            lastTradeTime: Number(data[5]),
        }
        : null;

    return { position, isLoading, error, refetch };
}

/**
 * Hook untuk membaca portfolio value
 */
export function usePortfolioValue() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "getPortfolioValue",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && CONTRACTS.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    const value = data ? formatUnits(data, USDC_CONFIG.decimals) : "0";

    return { value, isLoading, error, refetch };
}

/**
 * Hook untuk membaca portfolio breakdown
 */
export function usePortfolioBreakdown() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "getPortfolioBreakdown",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && CONTRACTS.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    const breakdown = data
        ? {
            usdcAmount: formatUnits(data[0], USDC_CONFIG.decimals),
            usdcValueUSD: formatUnits(data[1], USDC_CONFIG.decimals),
            goldAmount: formatUnits(data[2], GOLD_CONFIG.decimals),
            goldValueUSD: formatUnits(data[3], USDC_CONFIG.decimals),
            totalValueUSD: formatUnits(data[4], USDC_CONFIG.decimals),
            usdcPercentage: Number(data[5]),
            goldPercentage: Number(data[6]),
        }
        : null;

    return { breakdown, isLoading, error, refetch };
}

// ============================================
// GOLD PRICE HOOK
// ============================================

/**
 * Hook untuk membaca harga gold dari vault
 */
export function useGoldPrice() {
    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "goldPriceUSD",
        query: {
            enabled: CONTRACTS.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    // Price in 8 decimals
    const price = data ? formatUnits(data, 8) : "0";

    return { price, isLoading, error, refetch };
}

// ============================================
// TOKEN BALANCE HOOKS
// ============================================

/**
 * Hook untuk membaca USDC balance
 */
export function useUSDCBalance() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.usdc as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && CONTRACTS.usdc !== "0x0000000000000000000000000000000000000000",
        },
    });

    const balance = data ? formatUnits(data, USDC_CONFIG.decimals) : "0";

    return { balance, isLoading, error, refetch };
}

/**
 * Hook untuk membaca allowance USDC ke vault
 */
export function useUSDCAllowance() {
    const { address } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        address: CONTRACTS.usdc as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: address ? [address, CONTRACTS.vault as `0x${string}`] : undefined,
        query: {
            enabled: !!address && CONTRACTS.usdc !== "0x0000000000000000000000000000000000000000",
        },
    });

    const allowance = data ? formatUnits(data, USDC_CONFIG.decimals) : "0";

    return { allowance, isLoading, error, refetch };
}

// ============================================
// WRITE HOOKS
// ============================================

/**
 * Hook untuk approve USDC ke vault
 */
export function useApproveUSDC() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = (amount: string) => {
        const parsedAmount = parseUnits(amount, USDC_CONFIG.decimals);
        writeContract({
            address: CONTRACTS.usdc as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACTS.vault as `0x${string}`, parsedAmount],
        });
    };

    return {
        approve,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Hook untuk deposit USDC ke vault
 */
export function useDeposit() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const deposit = (amount: string) => {
        const parsedAmount = parseUnits(amount, USDC_CONFIG.decimals);
        writeContract({
            address: CONTRACTS.vault as `0x${string}`,
            abi: VAULT_ABI,
            functionName: "deposit",
            args: [parsedAmount],
        });
    };

    return {
        deposit,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Hook untuk withdraw dari vault
 */
export function useWithdraw() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const withdraw = (amount: string) => {
        const parsedAmount = parseUnits(amount, USDC_CONFIG.decimals);
        writeContract({
            address: CONTRACTS.vault as `0x${string}`,
            abi: VAULT_ABI,
            functionName: "withdraw",
            args: [parsedAmount],
        });
    };

    return {
        withdraw,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

/**
 * Hook untuk execute trade
 */
export function useExecuteTrade() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const executeTrade = (
        buyGold: boolean,
        amount: string,
        minAmountOut: string = "0"
    ) => {
        const decimals = buyGold ? USDC_CONFIG.decimals : GOLD_CONFIG.decimals;
        const minOutDecimals = buyGold ? GOLD_CONFIG.decimals : USDC_CONFIG.decimals;

        const parsedAmount = parseUnits(amount, decimals);
        const parsedMinOut = parseUnits(minAmountOut, minOutDecimals);

        writeContract({
            address: CONTRACTS.vault as `0x${string}`,
            abi: VAULT_ABI,
            functionName: "executeTrade",
            args: [buyGold, parsedAmount, parsedMinOut],
        });
    };

    return {
        executeTrade,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

// ============================================
// PREVIEW HOOKS
// ============================================

/**
 * Hook untuk preview buy gold
 */
export function usePreviewBuyGold(usdcAmount: string) {
    const parsedAmount = usdcAmount
        ? parseUnits(usdcAmount, USDC_CONFIG.decimals)
        : 0n;

    const { data, isLoading, error } = useReadContract({
        address: CONTRACTS.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "previewBuyGold",
        args: [parsedAmount],
        query: {
            enabled:
                parsedAmount > 0n &&
                CONTRACTS.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    const goldAmount = data ? formatUnits(data, GOLD_CONFIG.decimals) : "0";

    return { goldAmount, isLoading, error };
}

/**
 * Hook untuk preview sell gold
 */
export function usePreviewSellGold(goldAmount: string) {
    const parsedAmount = goldAmount
        ? parseUnits(goldAmount, GOLD_CONFIG.decimals)
        : 0n;

    const { data, isLoading, error } = useReadContract({
        address: CONTRACTS.vault as `0x${string}`,
        abi: VAULT_ABI,
        functionName: "previewSellGold",
        args: [parsedAmount],
        query: {
            enabled:
                parsedAmount > 0n &&
                CONTRACTS.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    const usdcAmount = data ? formatUnits(data, USDC_CONFIG.decimals) : "0";

    return { usdcAmount, isLoading, error };
}
