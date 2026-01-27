import { Hono } from "hono";

const app = new Hono();

interface PerformanceStats {
    totalReturn: number;
    totalReturnPercent: number;
    winRate: number;
    totalTrades: number;
    profitableTrades: number;
    losingTrades: number;
    avgTradeReturn: number;
    bestTrade: { amount: number; date: string };
    worstTrade: { amount: number; date: string };
    sharpeRatio: number;
    maxDrawdown: number;
}

interface Comparison {
    vsHoldingUSDC: number;
    vsHoldingGold: number;
    vsInflation: number;
}

/**
 * Get performance analytics
 * GET /api/analytics/performance?address=0x...
 */
app.get("/performance", async (c) => {
    try {
        const address = c.req.query("address");
        const period = c.req.query("period") || "30d";

        if (!address) {
            return c.json({ success: false, error: "Address diperlukan" }, 400);
        }

        // Generate mock performance data
        const stats = getMockPerformanceStats(period);
        const comparison = getMockComparison(period);

        return c.json({
            success: true,
            performance: {
                period,
                stats,
                comparison,
            },
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return c.json({ success: false, error: "Gagal mengambil analytics" }, 500);
    }
});

/**
 * Get AI performance stats
 * GET /api/analytics/ai
 */
app.get("/ai", async (c) => {
    try {
        return c.json({
            success: true,
            aiStats: {
                totalSignals: 156,
                accurateSignals: 112,
                accuracy: 71.79,
                avgConfidence: 72.5,
                signalsFollowed: 89,
                profitFromSignals: 234.50,
                bestSignal: {
                    action: "BUY_GOLD",
                    confidence: 92,
                    profit: 45.20,
                    date: "2026-01-15",
                },
            },
        });
    } catch (error) {
        console.error("AI Analytics error:", error);
        return c.json({ success: false, error: "Gagal mengambil AI stats" }, 500);
    }
});

/**
 * Get market overview
 * GET /api/analytics/market
 */
app.get("/market", async (c) => {
    try {
        return c.json({
            success: true,
            market: {
                goldPrice: 2155.50,
                goldChange24h: 12.30,
                goldChangePercent: 0.57,
                inflationRate: 3.2,
                inflationTrend: "rising",
                marketSentiment: "bullish",
                fearGreedIndex: 65,
                lastUpdated: Date.now(),
            },
        });
    } catch (error) {
        console.error("Market error:", error);
        return c.json({ success: false, error: "Gagal mengambil market data" }, 500);
    }
});

/**
 * Get leaderboard
 * GET /api/analytics/leaderboard
 */
app.get("/leaderboard", async (c) => {
    try {
        return c.json({
            success: true,
            leaderboard: [
                {
                    rank: 1,
                    address: "0x1234...5678",
                    returnPercent: 45.2,
                    totalValue: 15234.50,
                },
                {
                    rank: 2,
                    address: "0x2345...6789",
                    returnPercent: 38.7,
                    totalValue: 12456.20,
                },
                {
                    rank: 3,
                    address: "0x3456...7890",
                    returnPercent: 32.1,
                    totalValue: 9876.80,
                },
                {
                    rank: 4,
                    address: "0x4567...8901",
                    returnPercent: 28.5,
                    totalValue: 8234.40,
                },
                {
                    rank: 5,
                    address: "0x5678...9012",
                    returnPercent: 25.3,
                    totalValue: 7123.60,
                },
            ],
            period: "30d",
        });
    } catch (error) {
        console.error("Leaderboard error:", error);
        return c.json({ success: false, error: "Gagal mengambil leaderboard" }, 500);
    }
});

/**
 * Mock performance stats
 */
function getMockPerformanceStats(period: string): PerformanceStats {
    const multiplier = period === "7d" ? 0.3 : period === "90d" ? 2.5 : period === "1y" ? 4 : 1;

    return {
        totalReturn: 127.85 * multiplier,
        totalReturnPercent: 11.28 * multiplier,
        winRate: 68,
        totalTrades: Math.floor(42 * multiplier),
        profitableTrades: Math.floor(28 * multiplier),
        losingTrades: Math.floor(14 * multiplier),
        avgTradeReturn: 3.04,
        bestTrade: { amount: 23.50, date: "2026-01-15" },
        worstTrade: { amount: -8.20, date: "2026-01-10" },
        sharpeRatio: 1.85,
        maxDrawdown: 8.5,
    };
}

/**
 * Mock comparison data
 */
function getMockComparison(period: string): Comparison {
    const multiplier = period === "7d" ? 0.3 : period === "90d" ? 2.5 : period === "1y" ? 4 : 1;

    return {
        vsHoldingUSDC: 78.50 * multiplier,
        vsHoldingGold: 45.20 * multiplier,
        vsInflation: 95.30 * multiplier,
    };
}

export { app as analyticsRoutes };
