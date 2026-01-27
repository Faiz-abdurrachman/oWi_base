import { Hono } from "hono";

const app = new Hono();

interface Trade {
    id: string;
    address: string;
    type: "BUY_GOLD" | "SELL_GOLD";
    amountIn: number;
    amountOut: number;
    price: number;
    txHash: string;
    status: "pending" | "completed" | "failed";
    timestamp: number;
    profit?: number;
}

// Mock trades storage
const tradesStore: Trade[] = [];

/**
 * Get user trades
 * GET /api/trades?address=0x...
 */
app.get("/", async (c) => {
    try {
        const address = c.req.query("address");
        const limit = Number(c.req.query("limit")) || 20;
        const offset = Number(c.req.query("offset")) || 0;

        if (!address) {
            return c.json({ success: false, error: "Address diperlukan" }, 400);
        }

        // Get mock trades for now
        const userTrades = getMockTrades(address);
        const paginatedTrades = userTrades.slice(offset, offset + limit);

        return c.json({
            success: true,
            trades: paginatedTrades,
            total: userTrades.length,
            limit,
            offset,
        });
    } catch (error) {
        console.error("Trades error:", error);
        return c.json({ success: false, error: "Gagal mengambil trades" }, 500);
    }
});

/**
 * Record new trade
 * POST /api/trades
 */
app.post("/", async (c) => {
    try {
        const body = await c.req.json();
        const { address, type, amountIn, amountOut, price, txHash } = body;

        if (!address || !type || !amountIn || !txHash) {
            return c.json({ success: false, error: "Data tidak lengkap" }, 400);
        }

        const trade: Trade = {
            id: `trade_${Date.now()}`,
            address,
            type,
            amountIn,
            amountOut,
            price,
            txHash,
            status: "pending",
            timestamp: Date.now(),
        };

        tradesStore.push(trade);

        // In production, we would:
        // 1. Verify the transaction on-chain
        // 2. Update status when confirmed

        return c.json({
            success: true,
            trade,
        });
    } catch (error) {
        console.error("Record trade error:", error);
        return c.json({ success: false, error: "Gagal menyimpan trade" }, 500);
    }
});

/**
 * Get trade by ID
 * GET /api/trades/:id
 */
app.get("/:id", async (c) => {
    try {
        const id = c.req.param("id");
        const trade = tradesStore.find((t) => t.id === id);

        if (!trade) {
            return c.json({ success: false, error: "Trade tidak ditemukan" }, 404);
        }

        return c.json({
            success: true,
            trade,
        });
    } catch (error) {
        console.error("Get trade error:", error);
        return c.json({ success: false, error: "Gagal mengambil trade" }, 500);
    }
});

/**
 * Get mock trades for development
 */
function getMockTrades(address: string): Trade[] {
    return [
        {
            id: "trade_001",
            address,
            type: "BUY_GOLD",
            amountIn: 100,
            amountOut: 0.0464,
            price: 2155.50,
            txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            status: "completed",
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
            profit: 3.20,
        },
        {
            id: "trade_002",
            address,
            type: "SELL_GOLD",
            amountIn: 0.02,
            amountOut: 43.11,
            price: 2155.50,
            txHash: "0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef",
            status: "completed",
            timestamp: Date.now() - 24 * 60 * 60 * 1000,
            profit: 1.85,
        },
        {
            id: "trade_003",
            address,
            type: "BUY_GOLD",
            amountIn: 150,
            amountOut: 0.0697,
            price: 2151.00,
            txHash: "0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef",
            status: "completed",
            timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
            profit: 5.40,
        },
        {
            id: "trade_004",
            address,
            type: "SELL_GOLD",
            amountIn: 0.05,
            amountOut: 107.25,
            price: 2145.00,
            txHash: "0x4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef",
            status: "completed",
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
            profit: -2.30,
        },
        {
            id: "trade_005",
            address,
            type: "BUY_GOLD",
            amountIn: 200,
            amountOut: 0.0936,
            price: 2137.00,
            txHash: "0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcdef",
            status: "completed",
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
            profit: 8.75,
        },
    ];
}

export { app as tradeRoutes };
