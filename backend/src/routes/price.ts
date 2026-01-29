// ============================================
// Price Routes - Gold Price Data
// ============================================

import { Hono } from "hono";

export const priceRoutes = new Hono();

// ============================================
// Mock Price Data
// ============================================

const BASE_GOLD_PRICE = 2150.50;
let currentPrice = BASE_GOLD_PRICE;
let lastUpdate = Date.now();

// Price history for charts
const priceHistory: { timestamp: number; price: number }[] = [];

// Initialize price history
for (let i = 30; i >= 0; i--) {
    const timestamp = Date.now() - i * 24 * 60 * 60 * 1000;
    const price = BASE_GOLD_PRICE + (Math.random() - 0.5) * 100;
    priceHistory.push({ timestamp, price });
}

// ============================================
// GET /api/price - Current Gold Price
// ============================================

priceRoutes.get("/price", (c) => {
    // Update price with small random change every call
    const now = Date.now();
    if (now - lastUpdate > 60000) { // Update every minute
        currentPrice = currentPrice + (Math.random() - 0.5) * 5;
        lastUpdate = now;
        priceHistory.push({ timestamp: now, price: currentPrice });
        if (priceHistory.length > 100) {
            priceHistory.shift();
        }
    }

    const previousPrice = priceHistory[priceHistory.length - 2]?.price || currentPrice;
    const change24h = ((currentPrice - previousPrice) / previousPrice) * 100;

    return c.json({
        success: true,
        data: {
            symbol: "XAU/USD",
            price: Math.round(currentPrice * 100) / 100,
            change24h: Math.round(change24h * 100) / 100,
            high24h: Math.max(...priceHistory.slice(-24).map(p => p.price)),
            low24h: Math.min(...priceHistory.slice(-24).map(p => p.price)),
            updatedAt: new Date(lastUpdate).toISOString(),
        },
    });
});

// ============================================
// GET /api/price/history - Price History
// ============================================

priceRoutes.get("/price/history", (c) => {
    const period = c.req.query("period") || "7d";

    let dataPoints: typeof priceHistory;

    switch (period) {
        case "1d":
            dataPoints = priceHistory.slice(-24);
            break;
        case "7d":
            dataPoints = priceHistory.slice(-7);
            break;
        case "30d":
            dataPoints = priceHistory;
            break;
        default:
            dataPoints = priceHistory.slice(-7);
    }

    return c.json({
        success: true,
        period,
        data: dataPoints.map((p) => ({
            timestamp: p.timestamp,
            date: new Date(p.timestamp).toISOString(),
            price: Math.round(p.price * 100) / 100,
        })),
    });
});

// ============================================
// GET /api/price/stats - Market Stats
// ============================================

priceRoutes.get("/price/stats", (c) => {
    const prices = priceHistory.map(p => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    return c.json({
        success: true,
        stats: {
            currentPrice: Math.round(currentPrice * 100) / 100,
            avgPrice7d: Math.round(avgPrice * 100) / 100,
            high7d: Math.round(Math.max(...prices) * 100) / 100,
            low7d: Math.round(Math.min(...prices) * 100) / 100,
            volatility7d: calculateVolatility(prices),
            trend: currentPrice > avgPrice ? "bullish" : "bearish",
        },
    });
});

// ============================================
// Helper: Calculate Volatility
// ============================================

function calculateVolatility(prices: number[]): number {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const squaredDiffs = prices.map(p => Math.pow(p - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    const stdDev = Math.sqrt(avgSquaredDiff);
    return Math.round((stdDev / mean) * 10000) / 100; // as percentage
}
