// ============================================
// oWi AI - Frontend API Client
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

// ============================================
// Types
// ============================================

export interface MarketData {
    goldPrice: number;
    goldChange24h: number;
    inflationRate?: number;
    usdStrength?: number;
    marketSentiment?: string;
}

export interface AISignal {
    action: "BUY_GOLD" | "SELL_GOLD" | "HOLD";
    confidence: number;
    reasoning: string;
    suggestedAmount: number;
    goldPrice: number;
    timestamp: number;
}

export interface SignalRequest {
    userAddress: string;
    portfolioValue: number;
    goldPercentage: number;
    riskTolerance: "conservative" | "moderate" | "aggressive";
}

export interface PriceData {
    symbol: string;
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    updatedAt: string;
}

export interface PriceHistory {
    timestamp: number;
    date: string;
    price: number;
}

// ============================================
// API Client
// ============================================

class APIClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Make an API request
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            // Check for 402 Payment Required
            if (response.status === 402) {
                const paymentInfo = response.headers.get("X-402-Required");
                throw new PaymentRequiredError(
                    "Payment required",
                    paymentInfo ? JSON.parse(paymentInfo) : null
                );
            }

            const error = await response.json().catch(() => ({}));
            throw new APIError(
                error.message || "Request failed",
                response.status
            );
        }

        return response.json();
    }

    // ============================================
    // Health
    // ============================================

    async checkHealth(): Promise<{ status: string; timestamp: string }> {
        return this.request("/api/health");
    }

    // ============================================
    // Price
    // ============================================

    async getPrice(): Promise<{ success: boolean; data: PriceData }> {
        return this.request("/api/price");
    }

    async getPriceHistory(
        period: "1d" | "7d" | "30d" = "7d"
    ): Promise<{ success: boolean; data: PriceHistory[] }> {
        return this.request(`/api/price/history?period=${period}`);
    }

    async getPriceStats(): Promise<{
        success: boolean;
        stats: {
            currentPrice: number;
            avgPrice7d: number;
            high7d: number;
            low7d: number;
            volatility7d: number;
            trend: string;
        };
    }> {
        return this.request("/api/price/stats");
    }

    // ============================================
    // AI Signal
    // ============================================

    async getSignalPreview(): Promise<{
        success: boolean;
        preview: {
            action: string;
            confidence: string;
            reasoning: string;
            price: string;
            currency: string;
        };
        marketData: MarketData;
    }> {
        return this.request("/api/signal/preview");
    }

    async getSignal(
        data: SignalRequest,
        paymentReceipt?: string
    ): Promise<{
        success: boolean;
        signal: AISignal;
        paid: boolean;
        marketData: MarketData;
    }> {
        const headers: Record<string, string> = {};

        if (paymentReceipt) {
            headers["X-402-Receipt"] = paymentReceipt;
        }

        return this.request("/api/signal", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
    }
}

// ============================================
// Custom Errors
// ============================================

export class APIError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "APIError";
        this.status = status;
    }
}

export class PaymentRequiredError extends Error {
    paymentInfo: any;

    constructor(message: string, paymentInfo: any) {
        super(message);
        this.name = "PaymentRequiredError";
        this.paymentInfo = paymentInfo;
    }
}

// ============================================
// Export Singleton
// ============================================

export const api = new APIClient();
