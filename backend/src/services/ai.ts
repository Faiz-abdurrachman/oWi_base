// ============================================
// oWi AI - AI Trading Service
// ============================================

import { GoogleGenerativeAI } from "@google/generative-ai";

// ============================================
// Types
// ============================================

export interface MarketData {
    goldPrice: number;
    goldChange24h: number;
    inflationRate: number;
    usdStrength: number;
    marketSentiment: "bullish" | "bearish" | "neutral";
}

export interface PortfolioData {
    totalValue: number;
    usdcAmount: number;
    goldAmount: number;
    goldPercentage: number;
}

export interface TradingSignal {
    action: "BUY_GOLD" | "SELL_GOLD" | "HOLD";
    confidence: number;
    reasoning: string;
    suggestedAmount: number;
    suggestedPercentage: number;
    targetGoldAllocation: number;
    riskLevel: "low" | "medium" | "high";
    timestamp: number;
}

export type RiskTolerance = "conservative" | "moderate" | "aggressive";

// ============================================
// AI Service Class
// ============================================

export class AITradingService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        } else {
            console.warn("[AI Service] GEMINI_API_KEY not set, using mock signals");
        }
    }

    /**
     * Generate a trading signal based on market and portfolio data
     */
    async generateSignal(
        marketData: MarketData,
        portfolio: PortfolioData,
        riskTolerance: RiskTolerance
    ): Promise<TradingSignal> {
        if (!this.model) {
            return this.generateMockSignal(marketData, portfolio, riskTolerance);
        }

        try {
            return await this.generateGeminiSignal(marketData, portfolio, riskTolerance);
        } catch (error) {
            console.error("[AI Service] Gemini error, falling back to mock:", error);
            return this.generateMockSignal(marketData, portfolio, riskTolerance);
        }
    }

    /**
     * Generate signal using Gemini AI
     */
    private async generateGeminiSignal(
        marketData: MarketData,
        portfolio: PortfolioData,
        riskTolerance: RiskTolerance
    ): Promise<TradingSignal> {
        const prompt = this.buildPrompt(marketData, portfolio, riskTolerance);

        const result = await this.model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse AI response");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return this.normalizeSignal(parsed, marketData, portfolio);
    }

    /**
     * Build the prompt for Gemini
     */
    private buildPrompt(
        marketData: MarketData,
        portfolio: PortfolioData,
        riskTolerance: RiskTolerance
    ): string {
        const confidenceThreshold = {
            conservative: 80,
            moderate: 60,
            aggressive: 50,
        }[riskTolerance];

        return `You are an AI trading advisor specializing in gold/USDC hedging strategies for inflation protection.

CURRENT MARKET CONDITIONS:
- Gold Spot Price: $${marketData.goldPrice.toFixed(2)}/oz
- 24h Price Change: ${marketData.goldChange24h > 0 ? '+' : ''}${marketData.goldChange24h.toFixed(2)}%
- US Inflation Rate: ${marketData.inflationRate.toFixed(1)}%
- USD Strength Index (DXY): ${marketData.usdStrength.toFixed(1)}
- Market Sentiment: ${marketData.marketSentiment.toUpperCase()}

USER PORTFOLIO:
- Total Portfolio Value: $${portfolio.totalValue.toFixed(2)}
- USDC Balance: $${portfolio.usdcAmount.toFixed(2)}
- Gold Holdings: ${portfolio.goldAmount.toFixed(4)} oz ($${(portfolio.goldAmount * marketData.goldPrice).toFixed(2)})
- Current Gold Allocation: ${portfolio.goldPercentage.toFixed(1)}%
- Risk Tolerance: ${riskTolerance.toUpperCase()}
- Minimum Confidence for Trade: ${confidenceThreshold}%

ANALYSIS GUIDELINES:
1. Consider gold as an inflation hedge - higher inflation should favor gold
2. Strong USD typically pressures gold prices
3. ${riskTolerance === 'conservative' ? 'Only suggest trades with very high conviction' : riskTolerance === 'aggressive' ? 'Be willing to make opportunistic trades' : 'Balance conviction with opportunity'}
4. Target gold allocation should be 30-70% for balanced portfolios
5. Consider transaction costs - don't suggest small rebalancing trades

Provide your recommendation as a JSON object:
{
  "action": "BUY_GOLD" | "SELL_GOLD" | "HOLD",
  "confidence": <0-100>,
  "reasoning": "<2-3 sentences explaining the recommendation>",
  "suggestedPercentage": <0-100, percentage of available funds to use>,
  "targetGoldAllocation": <0-100, ideal gold percentage after trade>,
  "riskLevel": "low" | "medium" | "high"
}

IMPORTANT: Respond with ONLY the JSON object, no markdown formatting or extra text.`;
    }

    /**
     * Normalize and validate the parsed signal
     */
    private normalizeSignal(
        parsed: any,
        marketData: MarketData,
        portfolio: PortfolioData
    ): TradingSignal {
        const suggestedPercentage = Math.min(100, Math.max(0, parsed.suggestedPercentage || 20));
        const availableFunds = parsed.action === "BUY_GOLD"
            ? portfolio.usdcAmount
            : portfolio.goldAmount * marketData.goldPrice;
        const suggestedAmount = (availableFunds * suggestedPercentage) / 100;

        return {
            action: parsed.action || "HOLD",
            confidence: Math.min(100, Math.max(0, parsed.confidence || 50)),
            reasoning: parsed.reasoning || "Unable to generate reasoning",
            suggestedAmount: Math.round(suggestedAmount * 100) / 100,
            suggestedPercentage,
            targetGoldAllocation: Math.min(100, Math.max(0, parsed.targetGoldAllocation || 50)),
            riskLevel: parsed.riskLevel || "medium",
            timestamp: Date.now(),
        };
    }

    /**
     * Generate mock signal (fallback when Gemini is not available)
     */
    private generateMockSignal(
        marketData: MarketData,
        portfolio: PortfolioData,
        riskTolerance: RiskTolerance
    ): TradingSignal {
        let action: "BUY_GOLD" | "SELL_GOLD" | "HOLD";
        let confidence: number;
        let reasoning: string;
        let riskLevel: "low" | "medium" | "high";
        let targetGoldAllocation: number;
        let suggestedPercentage: number;

        // Logic based on market conditions
        if (marketData.inflationRate > 3.5 && portfolio.goldPercentage < 40) {
            action = "BUY_GOLD";
            confidence = 72 + Math.random() * 18;
            reasoning = `With inflation at ${marketData.inflationRate.toFixed(1)}% (above the 2% target), gold provides important inflation protection. Your current ${portfolio.goldPercentage.toFixed(0)}% gold allocation is below optimal levels.`;
            targetGoldAllocation = 50;
            riskLevel = "low";
            suggestedPercentage = 25;
        } else if (marketData.goldChange24h > 3 && portfolio.goldPercentage > 55) {
            action = "SELL_GOLD";
            confidence = 65 + Math.random() * 15;
            reasoning = `Gold has surged ${marketData.goldChange24h.toFixed(1)}% in 24 hours. Consider taking profits and rebalancing your ${portfolio.goldPercentage.toFixed(0)}% gold position to lock in gains.`;
            targetGoldAllocation = 45;
            riskLevel = "medium";
            suggestedPercentage = 20;
        } else if (marketData.goldChange24h < -3 && portfolio.goldPercentage < 45) {
            action = "BUY_GOLD";
            confidence = 68 + Math.random() * 12;
            reasoning = `Gold has dipped ${Math.abs(marketData.goldChange24h).toFixed(1)}% in 24 hours, potentially offering a buying opportunity at $${marketData.goldPrice.toFixed(2)}/oz.`;
            targetGoldAllocation = 50;
            riskLevel = "medium";
            suggestedPercentage = 15;
        } else {
            action = "HOLD";
            confidence = 55 + Math.random() * 25;
            reasoning = `Market conditions are relatively stable. Your current ${portfolio.goldPercentage.toFixed(0)}% gold allocation is within reasonable bounds. Monitor for better entry/exit opportunities.`;
            targetGoldAllocation = portfolio.goldPercentage;
            riskLevel = "low";
            suggestedPercentage = 0;
        }

        // Adjust confidence based on risk tolerance
        const toleranceMultiplier = {
            conservative: 0.9,
            moderate: 1.0,
            aggressive: 1.1,
        }[riskTolerance];

        confidence = Math.min(95, confidence * toleranceMultiplier);

        // Calculate suggested amount
        const availableFunds = action === "BUY_GOLD"
            ? portfolio.usdcAmount
            : portfolio.goldAmount * marketData.goldPrice;
        const suggestedAmount = (availableFunds * suggestedPercentage) / 100;

        return {
            action,
            confidence: Math.round(confidence),
            reasoning,
            suggestedAmount: Math.round(suggestedAmount * 100) / 100,
            suggestedPercentage,
            targetGoldAllocation,
            riskLevel,
            timestamp: Date.now(),
        };
    }
}

// ============================================
// Singleton Export
// ============================================

export const aiService = new AITradingService();
