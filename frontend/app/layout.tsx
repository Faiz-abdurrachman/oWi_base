import type { Metadata, Viewport } from "next";
import { Providers } from "@/lib/providers";
import "./globals.css";

/**
 * Metadata untuk SEO dan Base Mini App
 */
export const metadata: Metadata = {
    title: "oWi AI - Perlindungan Inflasi dengan Trading Emas",
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
    authors: [{ name: "oWi Team" }],
    creator: "oWi AI",
    publisher: "oWi AI",
    applicationName: "oWi AI",
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
        url: "https://owi.ai",
        siteName: "oWi AI",
        title: "oWi AI - Perlindungan Inflasi Otomatis",
        description:
            "Bot trading AI yang melindungi kekayaan Anda dari inflasi dengan trading emas otomatis.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "oWi AI",
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        site: "@owi_ai",
        creator: "@owi_ai",
        title: "oWi AI - Perlindungan Inflasi Otomatis",
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
            imageUrl: "https://owi.ai/embed-image.png",
            button: {
                title: "Buka oWi",
                action: {
                    type: "launch_miniapp",
                    name: "oWi AI",
                    url: "https://owi.ai",
                    splashImageUrl: "https://owi.ai/splash.png",
                    splashBackgroundColor: "#0f172a",
                },
            },
        }),

        // PWA / Mobile App meta tags
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "apple-mobile-web-app-title": "oWi",
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
