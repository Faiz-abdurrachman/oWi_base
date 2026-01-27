import { NextResponse } from "next/server";

/**
 * API Route untuk serving farcaster.json manifest
 * GET /.well-known/farcaster.json
 * 
 * Sesuai dokumentasi: https://docs.base.org/mini-apps/quickstart/existing-apps/install
 */
export async function GET() {
    const URL = process.env.NEXT_PUBLIC_APP_URL || "https://goldguard.ai";

    const manifest = {
        accountAssociation: {
            // Generate dari: https://www.base.dev/preview?tab=account
            // Isi setelah registrasi domain di Base Build
            header: "",
            payload: "",
            signature: "",
        },
        miniapp: {
            version: "1",
            name: "GoldGuard AI",
            homeUrl: URL,
            iconUrl: `${URL}/icon.png`,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: "#0f172a",
            webhookUrl: `${URL}/api/webhook`,
            subtitle: "Bot Trading Emas Otomatis",
            description:
                "Bot trading otonom yang melindungi kekayaan Anda dari inflasi dengan memperdagangkan USDC dan tokenized gold menggunakan AI.",
            screenshotUrls: [
                `${URL}/screenshots/dashboard.png`,
                `${URL}/screenshots/trading.png`,
                `${URL}/screenshots/portfolio.png`,
            ],
            primaryCategory: "finance",
            tags: ["trading", "gold", "ai", "defi", "base"],
            heroImageUrl: `${URL}/hero.png`,
            tagline: "Lindungi kekayaan dari inflasi",
            ogTitle: "GoldGuard AI - Trading Emas Otomatis",
            ogDescription:
                "Bot trading AI untuk perlindungan inflasi dengan emas tokenized di Base.",
            ogImageUrl: `${URL}/og-image.png`,
            noindex: false,
        },
    };

    return NextResponse.json(manifest, {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
