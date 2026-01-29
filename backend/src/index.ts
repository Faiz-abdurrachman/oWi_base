// ============================================
// oWi AI Backend - Main Entry Point
// ============================================

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { healthRoutes } from "./routes/health.js";
import { signalRoutes } from "./routes/signal.js";
import { priceRoutes } from "./routes/price.js";

// ============================================
// Create Hono App
// ============================================

const app = new Hono();

// ============================================
// Middleware
// ============================================

// CORS
app.use(
    "*",
    cors({
        origin: [
            "http://localhost:3000",
            "https://owi.ai",
            process.env.FRONTEND_URL || "",
        ].filter(Boolean),
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-402-Receipt"],
        exposeHeaders: ["X-402-Required"],
    })
);

// Logger
app.use("*", logger());

// ============================================
// Routes
// ============================================

// Health check
app.route("/api", healthRoutes);

// AI Signal routes
app.route("/api", signalRoutes);

// Price routes
app.route("/api", priceRoutes);

// ============================================
// Root route
// ============================================

app.get("/", (c) => {
    return c.json({
        name: "oWi AI Backend",
        version: "1.0.0",
        status: "running",
        endpoints: {
            health: "/api/health",
            signal: "/api/signal",
            price: "/api/price",
        },
    });
});

// ============================================
// 404 Handler
// ============================================

app.notFound((c) => {
    return c.json({ error: "Not Found" }, 404);
});

// ============================================
// Error Handler
// ============================================

app.onError((err, c) => {
    console.error("[Error]", err);
    return c.json(
        {
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development" ? err.message : undefined,
        },
        500
    );
});

// ============================================
// Start Server
// ============================================

const port = parseInt(process.env.PORT || "8787", 10);

console.log(`
╔══════════════════════════════════════════╗
║          oWi AI Backend Server           ║
╠══════════════════════════════════════════╣
║  🚀 Server running on port ${port}          ║
║  📍 http://localhost:${port}                ║
║  🔧 Environment: ${process.env.NODE_ENV || "development"}        ║
╚══════════════════════════════════════════╝
`);

serve({
    fetch: app.fetch,
    port,
});

export default app;
