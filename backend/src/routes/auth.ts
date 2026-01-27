import { Hono } from "hono";
import { createPublicClient, http, verifyMessage } from "viem";
import { baseSepolia } from "viem/chains";
import * as jose from "jose";

const app = new Hono();

// Store nonces temporarily (in production, use Redis)
const nonceStore = new Map<string, { nonce: string; expires: number }>();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "goldguard-secret-key-change-in-production"
);

/**
 * Generate nonce untuk wallet signature
 * POST /auth/nonce
 */
app.post("/nonce", async (c) => {
    try {
        const body = await c.req.json();
        const { address } = body;

        if (!address) {
            return c.json({ success: false, error: "Address diperlukan" }, 400);
        }

        // Generate random nonce
        const nonce = `Masuk ke GoldGuard AI\n\nNonce: ${crypto.randomUUID()}\nTimestamp: ${Date.now()}`;

        // Store nonce dengan expiry 5 menit
        nonceStore.set(address.toLowerCase(), {
            nonce,
            expires: Date.now() + 5 * 60 * 1000,
        });

        return c.json({
            success: true,
            nonce,
        });
    } catch (error) {
        console.error("Nonce error:", error);
        return c.json({ success: false, error: "Gagal generate nonce" }, 500);
    }
});

/**
 * Verify signature dan issue JWT
 * POST /auth/verify
 */
app.post("/verify", async (c) => {
    try {
        const body = await c.req.json();
        const { address, signature } = body;

        if (!address || !signature) {
            return c.json(
                { success: false, error: "Address dan signature diperlukan" },
                400
            );
        }

        // Get stored nonce
        const storedData = nonceStore.get(address.toLowerCase());
        if (!storedData) {
            return c.json({ success: false, error: "Nonce tidak ditemukan" }, 400);
        }

        // Check expiry
        if (Date.now() > storedData.expires) {
            nonceStore.delete(address.toLowerCase());
            return c.json({ success: false, error: "Nonce sudah expired" }, 400);
        }

        // Verify signature
        const isValid = await verifyMessage({
            address: address as `0x${string}`,
            message: storedData.nonce,
            signature: signature as `0x${string}`,
        });

        if (!isValid) {
            return c.json({ success: false, error: "Signature tidak valid" }, 401);
        }

        // Delete used nonce
        nonceStore.delete(address.toLowerCase());

        // Create JWT token
        const token = await new jose.SignJWT({ address: address.toLowerCase() })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        return c.json({
            success: true,
            token,
            address: address.toLowerCase(),
            expiresIn: 24 * 60 * 60, // 24 hours in seconds
        });
    } catch (error) {
        console.error("Verify error:", error);
        return c.json({ success: false, error: "Gagal verifikasi" }, 500);
    }
});

/**
 * Refresh token
 * POST /auth/refresh
 */
app.post("/refresh", async (c) => {
    try {
        const authHeader = c.req.header("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Token tidak ditemukan" }, 401);
        }

        const token = authHeader.substring(7);

        // Verify existing token (allow expired)
        const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
            clockTolerance: 24 * 60 * 60, // Allow 24h expired for refresh
        });

        // Create new token
        const newToken = await new jose.SignJWT({ address: payload.address })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(JWT_SECRET);

        return c.json({
            success: true,
            token: newToken,
            address: payload.address,
            expiresIn: 24 * 60 * 60,
        });
    } catch (error) {
        console.error("Refresh error:", error);
        return c.json({ success: false, error: "Token tidak valid" }, 401);
    }
});

/**
 * Middleware untuk verify JWT
 */
export async function verifyAuth(
    c: any,
    next: () => Promise<void>
): Promise<Response | void> {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
    }

    try {
        const token = authHeader.substring(7);
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        c.set("address", payload.address);
        await next();
    } catch {
        return c.json({ success: false, error: "Token tidak valid" }, 401);
    }
}

export { app as authRoutes };
