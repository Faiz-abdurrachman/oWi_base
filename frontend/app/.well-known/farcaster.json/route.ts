import { NextResponse } from "next/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://owi.ai";

export async function GET() {
    const manifest = {
        // Account Association - Fill these after deploying to production
        // Generate at: https://www.base.dev/preview?tab=account
        accountAssociation: {
            header: "",
            payload: "",
            signature: "",
        },

        // Mini App Configuration
        frame: {
            version: "1",
            name: "oWi AI",
            homeUrl: APP_URL,
            iconUrl: `${APP_URL}/icon.png`,
            splashImageUrl: `${APP_URL}/splash.png`,
            splashBackgroundColor: "#0F172A",
            webhookUrl: `${APP_URL}/api/webhook`,

            // App Info
            subtitle: "Autonomous Gold Trading Bot",
            description:
                "Protect your wealth from inflation with AI-powered gold trading. Deposit USDC, get AI trading signals, and automatically trade between USDC and tokenized gold on Base.",

            // Screenshots for Mini App Store
            screenshotUrls: [
                `${APP_URL}/screenshots/dashboard.png`,
                `${APP_URL}/screenshots/trading.png`,
                `${APP_URL}/screenshots/portfolio.png`,
            ],

            // Categorization
            primaryCategory: "finance",
            tags: ["trading", "gold", "ai", "defi", "inflation", "investing"],
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
