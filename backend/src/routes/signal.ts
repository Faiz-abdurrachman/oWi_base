// ============================================
// AI Signal Routes - with x402 Micropayments
// ============================================

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================
// Types
// ============================================

interface AISignal {
    action: "BUY_GOLD" | "SELL_GOLD" | "HOLD";
    confidence: number;
    reasoning: string;
    suggestedAmount: number;
    goldPrice: number;
    timestamp: number;
}

interface MarketData {
    goldPrice: number;
    goldChange24h: number;
    inflationRate: number;
    usdStrength: number;
    marketSentiment: string;
}

// ============================================
// Initialize Gemini AI
// ============================================

const geminiApiKey = process.env.GEMINI_API_KEY || "";
let genAI: GoogleGenerativeAI | null = null;

if (geminiApiKey) {
    genAI = new GoogleGenerativeAI(geminiApiKey);
}

// ============================================
// Routes
// ============================================

export const signalRoutes = new Hono();

// ============================================
// Request Schema
// ============================================

const signalRequestSchema = z.object({
    userAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    portfolioValue: z.number().min(0),
    goldPercentage: z.number().min(0).max(100),
    riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
});

// ============================================
// GET /api/signal - Get AI Trading Signal
// ============================================

signalRoutes.post(
    "/signal",
    zValidator("json", signalRequestSchema),
    async (c) => {
        try {
            // Check for x402 payment receipt
            const receipt = c.req.header("X-402-Receipt");

            // For demo purposes, we'll accept requests without payment
            // In production, you would verify the x402 receipt here
            const isPaid = !!receipt || process.env.SKIP_PAYMENT === "true";

            if (!isPaid && process.env.NODE_ENV === "production") {
                // Return 402 Payment Required with payment details
                c.header("X-402-Required", JSON.stringify({
                    accepts: [
                        {
                            scheme: "exact",
                            network: "base-sepolia",
                            maxAmountRequired: "10000", // $0.01 in wei (6 decimals)
                            resource: "signal",
                            description: "AI Trading Signal",
                            payTo: process.env.PAYMENT_ADDRESS,
                        },
                    ],
                }));

                return c.json(
                    {
                        error: "Payment Required",
                        message: "Pay $0.01 USDC to access this AI signal",
                        price: "0.01",
                        currency: "USDC",
                    },
                    402
                );
            }

            const body = await c.req.json();

            // Get mock market data (in production, fetch from real APIs)
            const marketData = await getMarketData();

            // Generate AI signal
            const signal = await generateAISignal(
                marketData,
                body.portfolioValue,
                body.goldPercentage,
                body.riskTolerance
            );

            return c.json({
                success: true,
                signal,
                paid: isPaid,
                marketData,
            });
        } catch (error) {
            console.error("[Signal Error]", error);
            return c.json(
                {
                    error: "Failed to generate signal",
                    message: error instanceof Error ? error.message : "Unknown error",
                },
                500
            );
        }
    }
);

// ============================================
// GET /api/signal/preview - Free Preview
// ============================================

signalRoutes.get("/signal/preview", async (c) => {
    const marketData = await getMarketData();

    return c.json({
        success: true,
        preview: {
            action: "HIDDEN",
            confidence: "HIDDEN",
            reasoning: "Pay $0.01 to unlock this AI signal based on current market conditions...",
            price: "0.01",
            currency: "USDC",
        },
        marketData: {
            goldPrice: marketData.goldPrice,
            goldChange24h: marketData.goldChange24h,
        },
    });
});

// ============================================
// Helper: Get Market Data
// ============================================

async function getMarketData(): Promise<MarketData> {
    // In production, fetch real data from:
    // - CoinGecko API for gold price
    // - Federal Reserve API for inflation
    // - DXY index for USD strength

    // Mock data for demo
    const baseGoldPrice = 2150.50;
    const variation = (Math.random() - 0.5) * 50; // +/- $25

    return {
        goldPrice: baseGoldPrice + variation,
        goldChange24h: (Math.random() - 0.5) * 3, // +/- 1.5%
        inflationRate: 3.2 + (Math.random() - 0.5) * 0.5,
        usdStrength: 104.5 + (Math.random() - 0.5) * 2,
        marketSentiment: ["bullish", "bearish", "neutral"][Math.floor(Math.random() * 3)],
    };
}

// ============================================
// Helper: Generate AI Signal using Gemini
// ============================================

async function generateAISignal(
    marketData: MarketData,
    portfolioValue: number,
    goldPercentage: number,
    riskTolerance: string
): Promise<AISignal> {
    // If Gemini is not configured, return mock signal
    if (!genAI) {
        console.log("[AI] Gemini not configured, using mock signal");
        return generateMockSignal(marketData, portfolioValue, goldPercentage);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an AI trading advisor for a gold/USDC hedging strategy. Analyze the following market conditions and user portfolio to provide a trading recommendation.

MARKET CONDITIONS:
- Gold Price: $${marketData.goldPrice.toFixed(2)}/oz
- Gold 24h Change: ${marketData.goldChange24h.toFixed(2)}%
- US Inflation Rate: ${marketData.inflationRate.toFixed(1)}%
- USD Strength Index: ${marketData.usdStrength.toFixed(1)}
- Market Sentiment: ${marketData.marketSentiment}

USER PORTFOLIO:
- Total Value: $${portfolioValue.toFixed(2)}
- Current Gold Allocation: ${goldPercentage.toFixed(1)}%
- Risk Tolerance: ${riskTolerance}

TRADING RULES:
- Conservative: Only recommend trades when confidence > 80%
- Moderate: Recommend trades when confidence > 60%
- Aggressive: Recommend trades when confidence > 50%

Provide your recommendation as a JSON object with ONLY these fields:
{
  "action": "BUY_GOLD" | "SELL_GOLD" | "HOLD",
  "confidence": <number 0-100>,
  "reasoning": "<2-3 sentence explanation>",
  "suggestedPercentage": <number 0-100, percentage of portfolio to trade>
}

Respond with ONLY the JSON, no markdown or explanation.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse AI response");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        // Calculate suggested amount
        const suggestedAmount = (portfolioValue * parsed.suggestedPercentage) / 100;

        return {
            action: parsed.action,
            confidence: Math.min(100, Math.max(0, parsed.confidence)),
            reasoning: parsed.reasoning,
            suggestedAmount: Math.round(suggestedAmount * 100) / 100,
            goldPrice: marketData.goldPrice,
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error("[AI Generation Error]", error);
        // Fallback to mock signal
        return generateMockSignal(marketData, portfolioValue, goldPercentage);
    }
}

// ============================================
// Helper: Generate Mock Signal (Fallback)
// ============================================

function generateMockSignal(
    marketData: MarketData,
    portfolioValue: number,
    goldPercentage: number
): AISignal {
    // Simple logic for mock signals
    let action: "BUY_GOLD" | "SELL_GOLD" | "HOLD";
    let confidence: number;
    let reasoning: string;

    if (marketData.inflationRate > 3.5 && goldPercentage < 40) {
        action = "BUY_GOLD";
        confidence = 75 + Math.random() * 15;
        reasoning = `Inflation is running at ${marketData.inflationRate.toFixed(1)}%, above target levels. Gold historically performs well during inflationary periods. Your current gold allocation of ${goldPercentage.toFixed(0)}% is below optimal for inflation protection.`;
    } else if (marketData.goldChange24h > 2 && goldPercentage > 60) {
        action = "SELL_GOLD";
        confidence = 65 + Math.random() * 15;
        reasoning = `Gold has risen ${marketData.goldChange24h.toFixed(1)}% in 24 hours. Consider taking some profits to rebalance your portfolio. Your current ${goldPercentage.toFixed(0)}% gold allocation is high.`;
    } else if (marketData.goldChange24h < -2 && goldPercentage < 50) {
        action = "BUY_GOLD";
        confidence = 70 + Math.random() * 10;
        reasoning = `Gold has dipped ${Math.abs(marketData.goldChange24h).toFixed(1)}% in 24 hours, presenting a buying opportunity. Current price of $${marketData.goldPrice.toFixed(2)} may be a good entry point.`;
    } else {
        action = "HOLD";
        confidence = 60 + Math.random() * 20;
        reasoning = `Market conditions are stable with gold at $${marketData.goldPrice.toFixed(2)}. Your current portfolio allocation appears balanced. No immediate action recommended.`;
    }

    // Calculate suggested amount (10-30% of portfolio)
    const suggestedPercentage = 10 + Math.random() * 20;
    const suggestedAmount = (portfolioValue * suggestedPercentage) / 100;

    return {
        action,
        confidence: Math.round(confidence),
        reasoning,
        suggestedAmount: Math.round(suggestedAmount * 100) / 100,
        goldPrice: marketData.goldPrice,
        timestamp: Date.now(),
    };
}
