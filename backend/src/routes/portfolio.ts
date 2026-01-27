import { Hono } from "hono";
import { createPublicClient, http, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";

const app = new Hono();

// Viem client
const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
});

// Contract addresses
const VAULT_ADDRESS = process.env.VAULT_ADDRESS as `0x${string}`;
const USDC_ADDRESS = process.env.USDC_ADDRESS as `0x${string}`;
const GOLD_ADDRESS = process.env.GOLD_ADDRESS as `0x${string}`;

// ABI fragments
const vaultABI = [
    {
        name: "getUserPosition",
        type: "function",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "usdcAmount", type: "uint256" },
            { name: "goldAmount", type: "uint256" },
            { name: "totalDeposited", type: "uint256" },
            { name: "totalWithdrawn", type: "uint256" },
            { name: "totalTrades", type: "uint256" },
            { name: "lastTradeTime", type: "uint256" },
        ],
    },
    {
        name: "getPortfolioValue",
        type: "function",
        inputs: [{ name: "user", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getPortfolioBreakdown",
        type: "function",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "usdcAmount", type: "uint256" },
            { name: "usdcValueUSD", type: "uint256" },
            { name: "goldAmount", type: "uint256" },
            { name: "goldValueUSD", type: "uint256" },
            { name: "totalValueUSD", type: "uint256" },
            { name: "usdcPercentage", type: "uint256" },
            { name: "goldPercentage", type: "uint256" },
        ],
    },
    {
        name: "goldPriceUSD",
        type: "function",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;

/**
 * Get user portfolio
 * GET /api/portfolio?address=0x...
 */
app.get("/", async (c) => {
    try {
        const address = c.req.query("address");

        if (!address) {
            return c.json({ success: false, error: "Address diperlukan" }, 400);
        }

        // Check if contracts are configured
        if (!VAULT_ADDRESS || VAULT_ADDRESS === "0x0000000000000000000000000000000000000000") {
            // Return mock data for development
            return c.json({
                success: true,
                portfolio: getMockPortfolio(address),
            });
        }

        // Fetch from blockchain
        const [position, portfolioValue, breakdown, goldPrice] = await Promise.all([
            client.readContract({
                address: VAULT_ADDRESS,
                abi: vaultABI,
                functionName: "getUserPosition",
                args: [address as `0x${string}`],
            }),
            client.readContract({
                address: VAULT_ADDRESS,
                abi: vaultABI,
                functionName: "getPortfolioValue",
                args: [address as `0x${string}`],
            }),
            client.readContract({
                address: VAULT_ADDRESS,
                abi: vaultABI,
                functionName: "getPortfolioBreakdown",
                args: [address as `0x${string}`],
            }),
            client.readContract({
                address: VAULT_ADDRESS,
                abi: vaultABI,
                functionName: "goldPriceUSD",
            }),
        ]);

        return c.json({
            success: true,
            portfolio: {
                address,
                usdcAmount: formatUnits(position[0], 6),
                goldAmount: formatUnits(position[1], 18),
                totalDeposited: formatUnits(position[2], 6),
                totalWithdrawn: formatUnits(position[3], 6),
                totalTrades: Number(position[4]),
                lastTradeTime: Number(position[5]),
                portfolioValue: formatUnits(portfolioValue, 6),
                breakdown: {
                    usdcValueUSD: formatUnits(breakdown[1], 6),
                    goldValueUSD: formatUnits(breakdown[3], 6),
                    usdcPercentage: Number(breakdown[5]),
                    goldPercentage: Number(breakdown[6]),
                },
                goldPrice: formatUnits(goldPrice, 8),
            },
        });
    } catch (error) {
        console.error("Portfolio error:", error);
        return c.json({ success: false, error: "Gagal mengambil portfolio" }, 500);
    }
});

/**
 * Get portfolio history
 * GET /api/portfolio/history?address=0x...
 */
app.get("/history", async (c) => {
    try {
        const address = c.req.query("address");
        const days = Number(c.req.query("days")) || 30;

        if (!address) {
            return c.json({ success: false, error: "Address diperlukan" }, 400);
        }

        // Generate mock history data
        const history = generateMockHistory(days);

        return c.json({
            success: true,
            history,
            period: `${days} days`,
        });
    } catch (error) {
        console.error("History error:", error);
        return c.json({ success: false, error: "Gagal mengambil history" }, 500);
    }
});

/**
 * Mock portfolio for development
 */
function getMockPortfolio(address: string) {
    return {
        address,
        usdcAmount: "810.10",
        goldAmount: "0.203",
        totalDeposited: "1200.00",
        totalWithdrawn: "0",
        totalTrades: 12,
        lastTradeTime: Date.now() - 2 * 60 * 60 * 1000,
        portfolioValue: "1247.85",
        breakdown: {
            usdcValueUSD: "810.10",
            goldValueUSD: "437.75",
            usdcPercentage: 65,
            goldPercentage: 35,
        },
        goldPrice: "2155.50",
        change24h: 47.85,
        changePercent: 3.98,
    };
}

/**
 * Generate mock historical data
 */
function generateMockHistory(days: number) {
    const history = [];
    let value = 1000;

    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Random daily change between -2% and +3%
        const change = (Math.random() - 0.4) * 0.03;
        value = value * (1 + change);

        history.push({
            date: date.toISOString().split("T")[0],
            value: Math.round(value * 100) / 100,
            usdcValue: Math.round(value * 0.65 * 100) / 100,
            goldValue: Math.round(value * 0.35 * 100) / 100,
        });
    }

    return history;
}

export { app as portfolioRoutes };
