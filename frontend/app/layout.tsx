import type { Metadata, Viewport } from "next";
import { Providers } from "@/lib/providers";
import "./globals.css";

/**
 * Metadata untuk SEO dan Base Mini App
 */
export const metadata: Metadata = {
    title: "GoldGuard AI - Perlindungan Inflasi dengan Trading Emas",
    description:
        "Bot trading otonom yang melindungi kekayaan Anda dari inflasi dengan memperdagangkan USDC dan tokenized gold secara otomatis menggunakan AI.",
    keywords: [
        "trading bot",
        "gold",
        "emas",
        "inflasi",
        "AI",
        "DeFi",
        "Base",
        "USDC",
        "cryptocurrency",
        "mini app",
        "coinbase",
    ],
    authors: [{ name: "GoldGuard Team" }],
    creator: "GoldGuard AI",
    publisher: "GoldGuard AI",
    applicationName: "GoldGuard AI",
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },

    // Open Graph untuk social sharing
    openGraph: {
        type: "website",
        locale: "id_ID",
        url: "https://goldguard.ai",
        siteName: "GoldGuard AI",
        title: "GoldGuard AI - Perlindungan Inflasi Otomatis",
        description:
            "Bot trading AI yang melindungi kekayaan Anda dari inflasi dengan trading emas otomatis.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "GoldGuard AI",
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        site: "@goldguardai",
        creator: "@goldguardai",
        title: "GoldGuard AI - Perlindungan Inflasi Otomatis",
        description:
            "Bot trading AI yang melindungi kekayaan Anda dari inflasi dengan trading emas otomatis.",
        images: ["/og-image.png"],
    },

    // Icons
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },

    // Manifest untuk PWA/Mini App
    manifest: "/manifest.json",

    // Robots
    robots: {
        index: true,
        follow: true,
    },

    // Base Mini App / Farcaster meta tags
    other: {
        // fc:miniapp - Format resmi untuk Base Mini App embed
        "fc:miniapp": JSON.stringify({
            version: "next",
            imageUrl: "https://goldguard.ai/embed-image.png",
            button: {
                title: "Buka GoldGuard",
                action: {
                    type: "launch_miniapp",
                    name: "GoldGuard AI",
                    url: "https://goldguard.ai",
                    splashImageUrl: "https://goldguard.ai/splash.png",
                    splashBackgroundColor: "#0f172a",
                },
            },
        }),

        // PWA / Mobile App meta tags
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "apple-mobile-web-app-title": "GoldGuard",
    },
};

/**
 * Viewport configuration untuk mobile
 */
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0f172a",
    colorScheme: "dark",
};

/**
 * Root Layout
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" className="dark">
            <body className="min-h-screen bg-dark-900 text-white antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
