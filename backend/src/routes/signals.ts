import { Hono } from "hono";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = new Hono();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// x402 payment configuration
const SIGNAL_PRICE = 0.01; // 0.01 USDC per signal
const PAYMENT_ADDRESS = process.env.PAYMENT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Signal cache (in production, use Redis)
interface CachedSignal {
    signal: TradingSignal;
    expires: number;
}
const signalCache = new Map<string, CachedSignal>();

interface TradingSignal {
    id: string;
    action: "BUY_GOLD" | "SELL_GOLD" | "HOLD";
    confidence: number;
    reasoning: string;
    suggestedAmount: number;
    goldPrice: number;
    inflationRate: number;
    timestamp: number;
    expiresAt: number;
}

/**
 * Get latest AI signal (x402 paywall)
 * GET /api/signals/latest
 */
app.get("/latest", async (c) => {
    try {
        // Check for x402 payment header
        const paymentHeader = c.req.header("X-402-Payment");

        if (!paymentHeader) {
            // Return payment required response
            c.header("X-402-Price", SIGNAL_PRICE.toString());
            c.header("X-402-Address", PAYMENT_ADDRESS);
            return c.json(
                {
                    success: false,
                    error: "Payment Required",
                    price: SIGNAL_PRICE,
                    currency: "USDC",
                    address: PAYMENT_ADDRESS,
                    message: "Bayar untuk mengakses sinyal AI",
                },
                402
            );
        }

        // TODO: Verify payment on-chain
        // For hackathon, we skip payment verification

        // Check cache
        const cacheKey = "latest_signal";
        const cached = signalCache.get(cacheKey);
        if (cached && cached.expires > Date.now()) {
            return c.json({
                success: true,
                signal: cached.signal,
                cached: true,
            });
        }

        // Generate new signal with AI
        const signal = await generateTradingSignal();

        // Cache for 15 minutes
        signalCache.set(cacheKey, {
            signal,
            expires: Date.now() + 15 * 60 * 1000,
        });

        return c.json({
            success: true,
            signal,
            cached: false,
        });
    } catch (error) {
        console.error("Signal error:", error);
        return c.json({ success: false, error: "Gagal generate sinyal" }, 500);
    }
});

/**
 * Get signal history
 * GET /api/signals/history
 */
app.get("/history", async (c) => {
    try {
        // Mock historical signals
        const history: Partial<TradingSignal>[] = [
            {
                id: "sig_001",
                action: "BUY_GOLD",
                confidence: 82,
                goldPrice: 2155.50,
                timestamp: Date.now() - 2 * 60 * 60 * 1000,
            },
            {
                id: "sig_002",
                action: "HOLD",
                confidence: 55,
                goldPrice: 2150.00,
                timestamp: Date.now() - 24 * 60 * 60 * 1000,
            },
            {
                id: "sig_003",
                action: "SELL_GOLD",
                confidence: 75,
                goldPrice: 2160.00,
                timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
            },
        ];

        return c.json({
            success: true,
            signals: history,
            total: history.length,
        });
    } catch (error) {
        console.error("History error:", error);
        return c.json({ success: false, error: "Gagal mengambil history" }, 500);
    }
});

/**
 * Generate trading signal using Gemini AI
 */
async function generateTradingSignal(): Promise<TradingSignal> {
    // Mock market data (in production, fetch from real API)
    const goldPrice = 2155.50 + (Math.random() - 0.5) * 50;
    const inflationRate = 3.2 + (Math.random() - 0.5) * 0.5;

    try {
        const prompt = `Kamu adalah AI trading advisor untuk oWi, sebuah platform yang membantu pengguna melindungi kekayaan dari inflasi dengan trading emas tokenized.

Analisis data berikut dan berikan rekomendasi trading:
- Harga Emas saat ini: $${goldPrice.toFixed(2)}/oz
- Tingkat Inflasi: ${inflationRate.toFixed(1)}%

Berikan respons dalam format JSON:
{
  "action": "BUY_GOLD" | "SELL_GOLD" | "HOLD",
  "confidence": number (0-100),
  "reasoning": "Penjelasan singkat dalam bahasa Indonesia (max 200 karakter)",
  "suggestedAmount": number (dalam USD, antara 50-500)
}

Pertimbangkan:
1. Jika inflasi tinggi (>3%), lebih cenderung BUY_GOLD
2. Jika harga emas sudah tinggi dan inflasi rendah, bisa SELL_GOLD
3. HOLD jika kondisi tidak jelas

Hanya berikan JSON, tanpa markdown atau penjelasan lain.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse JSON response
        let parsed;
        try {
            // Clean the response - remove markdown code blocks if present
            const cleanedText = responseText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            parsed = JSON.parse(cleanedText);
        } catch {
            // Fallback if parsing fails
            parsed = {
                action: "HOLD",
                confidence: 50,
                reasoning: "Tidak dapat menganalisis kondisi pasar saat ini.",
                suggestedAmount: 100,
            };
        }

        return {
            id: `sig_${Date.now()}`,
            action: parsed.action,
            confidence: Math.min(100, Math.max(0, parsed.confidence)),
            reasoning: parsed.reasoning,
            suggestedAmount: parsed.suggestedAmount,
            goldPrice,
            inflationRate,
            timestamp: Date.now(),
            expiresAt: Date.now() + 15 * 60 * 1000,
        };
    } catch (error) {
        console.error("Gemini API error:", error);

        // Fallback signal
        return {
            id: `sig_${Date.now()}`,
            action: "HOLD",
            confidence: 50,
            reasoning: "System sedang dalam maintenance. Disarankan untuk menahan posisi.",
            suggestedAmount: 100,
            goldPrice,
            inflationRate,
            timestamp: Date.now(),
            expiresAt: Date.now() + 15 * 60 * 1000,
        };
    }
}

export { app as signalRoutes };
