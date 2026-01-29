import { NextResponse } from "next/server";

/**
 * Farcaster/Base Mini App Manifest
 * 
 * This manifest is required for Base Mini Apps.
 * Generate accountAssociation at: https://www.base.dev/preview
 * 
 * @see https://docs.base.org/building-with-base/guides/build-with-minikit
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://owi.ai";

export async function GET() {
    const manifest = {
        // ============================================
        // Account Association (REQUIRED for production)
        // Generate at: https://www.base.dev/preview?tab=account
        // ============================================
        accountAssociation: {
            // Header: Base64 encoded JSON with fid (Farcaster ID) and type
            header: process.env.FARCASTER_HEADER || "",
            // Payload: Base64 encoded JSON with domain
            payload: process.env.FARCASTER_PAYLOAD || "",
            // Signature: Hex encoded signature
            signature: process.env.FARCASTER_SIGNATURE || "",
        },

        // ============================================
        // Frame/Mini App Configuration
        // ============================================
        frame: {
            // Manifest version (required)
            version: "1",

            // App name displayed in the Mini App store
            name: "oWi AI",

            // Subtitle shown under the name
            subtitle: "AI-Powered Gold Trading Bot",

            // Full description for the Mini App store
            description:
                "Protect your wealth from inflation with AI-powered gold trading. " +
                "Deposit USDC, receive AI trading signals, and automatically trade " +
                "between USDC and tokenized gold on Base. Features x402 micropayments " +
                "for pay-per-signal access.",

            // Home URL where your Mini App is hosted
            homeUrl: APP_URL,

            // App icon (1024x1024 recommended, PNG or SVG)
            iconUrl: `${APP_URL}/icon.png`,

            // Splash screen shown while loading (200x200 recommended)
            splashImageUrl: `${APP_URL}/splash.png`,

            // Background color for splash screen (hex format)
            splashBackgroundColor: "#0F172A",

            // Webhook URL for notifications (optional)
            webhookUrl: `${APP_URL}/api/webhook`,

            // Screenshots for Mini App store (max 5)
            // Recommended: 1284x2778 pixels (iPhone 14 Pro Max)
            screenshotUrls: [
                `${APP_URL}/screenshots/1-dashboard.png`,
                `${APP_URL}/screenshots/2-trading.png`,
                `${APP_URL}/screenshots/3-portfolio.png`,
            ],

            // Primary category
            primaryCategory: "finance",

            // Secondary categories (optional)
            // categories: ["defi", "trading"],

            // Searchable tags
            tags: [
                "gold",
                "trading",
                "ai",
                "defi",
                "inflation",
                "USDC",
                "investing",
                "bot",
            ],

            // Hero image for Mini App store (optional, 1200x630)
            // heroImageUrl: `${APP_URL}/hero.png`,

            // Tagline for search results
            tagline: "AI Gold Trading for Inflation Protection",

            // Open Graph image for sharing
            ogTitle: "oWi AI - Autonomous Gold Trading",
            ogDescription: "Protect your wealth with AI-powered gold trading on Base",
            ogImageUrl: `${APP_URL}/og-image.png`,
        },
    };

    return NextResponse.json(manifest, {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
    });
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
