import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import "dotenv/config";

import { authRoutes } from "./routes/auth.js";
import { signalRoutes } from "./routes/signals.js";
import { portfolioRoutes } from "./routes/portfolio.js";
import { tradeRoutes } from "./routes/trades.js";
import { analyticsRoutes } from "./routes/analytics.js";

// ============================================
// INITIALIZE APP
// ============================================

const app = new Hono();

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS
app.use(
    "/*",
    cors({
        origin: ["http://localhost:3000", "https://goldguard.ai"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-402-Payment"],
        exposeHeaders: ["X-402-Price", "X-402-Address"],
        credentials: true,
    })
);

// Request logging
app.use("*", logger());

// Pretty JSON responses
app.use("*", prettyJSON());

// ============================================
// ROUTES
// ============================================

// Health check
app.get("/", (c) => {
    return c.json({
        success: true,
        message: "oWi AI API Server",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

// Health check endpoint
app.get("/health", (c) => {
    return c.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// Mount route modules
app.route("/auth", authRoutes);
app.route("/api/signals", signalRoutes);
app.route("/api/portfolio", portfolioRoutes);
app.route("/api/trades", tradeRoutes);
app.route("/api/analytics", analyticsRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.notFound((c) => {
    return c.json(
        {
            success: false,
            error: "Not Found",
            message: "Endpoint yang diminta tidak ditemukan",
        },
        404
    );
});

// Global error handler
app.onError((err, c) => {
    console.error("Server Error:", err);
    return c.json(
        {
            success: false,
            error: "Internal Server Error",
            message: err.message || "Terjadi kesalahan pada server",
        },
        500
    );
});

// ============================================
// START SERVER
// ============================================

const port = Number(process.env.PORT) || 3001;

console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🛡️  GoldGuard AI Backend Server                     ║
║                                                       ║
║   Port: ${port}                                         ║
║   Environment: ${process.env.NODE_ENV || "development"}                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
`);

serve({
    fetch: app.fetch,
    port,
});

export default app;
