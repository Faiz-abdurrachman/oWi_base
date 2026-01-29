import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

// ============================================
// Fonts
// ============================================

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono",
});

// ============================================
// Metadata
// ============================================

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://owi.ai";

export const metadata: Metadata = {
    title: "oWi AI - Autonomous Gold Trading Bot",
    description:
        "Protect your wealth from inflation with AI-powered gold trading. Deposit USDC, get AI signals, and trade automatically on Base.",
    keywords: [
        "gold trading",
        "AI trading bot",
        "inflation protection",
        "DeFi",
        "Base",
        "crypto",
        "USDC",
        "tokenized gold",
    ],
    authors: [{ name: "oWi Team" }],
    creator: "oWi Team",
    publisher: "oWi AI",

    // Open Graph
    openGraph: {
        type: "website",
        locale: "en_US",
        url: APP_URL,
        title: "oWi AI - Autonomous Gold Trading Bot",
        description:
            "Protect your wealth from inflation with AI-powered gold trading on Base.",
        siteName: "oWi AI",
        images: [
            {
                url: `${APP_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: "oWi AI - Autonomous Gold Trading",
            },
        ],
    },

    // Twitter
    twitter: {
        card: "summary_large_image",
        title: "oWi AI - Autonomous Gold Trading Bot",
        description:
            "Protect your wealth from inflation with AI-powered gold trading on Base.",
        images: [`${APP_URL}/og-image.png`],
    },

    // App
    applicationName: "oWi AI",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "oWi AI",
    },
    formatDetection: {
        telephone: false,
    },

    // Icons
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/icon.png", type: "image/png", sizes: "512x512" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },

    // Manifest
    manifest: "/manifest.json",

    // Other
    other: {
        // Farcaster Mini App Meta Tag
        "fc:frame": JSON.stringify({
            version: "next",
            imageUrl: `${APP_URL}/embed.png`,
            button: {
                title: "Open oWi AI",
                action: {
                    type: "launch_frame",
                    name: "oWi AI",
                    url: APP_URL,
                    splashImageUrl: `${APP_URL}/splash.png`,
                    splashBackgroundColor: "#0F172A",
                },
            },
        }),
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0F172A",
    colorScheme: "dark",
};

// ============================================
// Root Layout
// ============================================

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
            <body className="font-sans">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
