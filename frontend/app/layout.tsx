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
// App Configuration
// ============================================

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://owi.ai";
const APP_NAME = "oWi AI";
const APP_DESCRIPTION =
    "Protect your wealth from inflation with AI-powered gold trading on Base.";

// ============================================
// Metadata for SEO & Mini Apps
// ============================================

export const metadata: Metadata = {
    title: `${APP_NAME} - Autonomous Gold Trading Bot`,
    description: APP_DESCRIPTION,
    keywords: [
        "gold trading",
        "AI trading bot",
        "inflation protection",
        "DeFi",
        "Base",
        "crypto",
        "USDC",
        "tokenized gold",
        "mini app",
    ],
    authors: [{ name: "oWi Team" }],
    creator: "oWi Team",
    publisher: APP_NAME,

    // Open Graph for social sharing
    openGraph: {
        type: "website",
        locale: "en_US",
        url: APP_URL,
        title: `${APP_NAME} - Autonomous Gold Trading Bot`,
        description: APP_DESCRIPTION,
        siteName: APP_NAME,
        images: [
            {
                url: `${APP_URL}/og-image.png`,
                width: 1200,
                height: 630,
                alt: `${APP_NAME} - Autonomous Gold Trading`,
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: `${APP_NAME} - Autonomous Gold Trading Bot`,
        description: APP_DESCRIPTION,
        images: [`${APP_URL}/og-image.png`],
    },

    // PWA Configuration
    applicationName: APP_NAME,
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: APP_NAME,
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

    // PWA Manifest
    manifest: "/manifest.json",

    // ============================================
    // Farcaster Frame Meta Tags (REQUIRED for Mini Apps)
    // ============================================
    other: {
        // Frame embed configuration
        "fc:frame": JSON.stringify({
            version: "next",
            imageUrl: `${APP_URL}/embed.png`,
            button: {
                title: "Open oWi AI",
                action: {
                    type: "launch_frame",
                    name: APP_NAME,
                    url: APP_URL,
                    splashImageUrl: `${APP_URL}/splash.png`,
                    splashBackgroundColor: "#0F172A",
                },
            },
        }),
        // Additional frame metadata
        "fc:frame:image": `${APP_URL}/embed.png`,
        "fc:frame:button:1": "Open oWi AI",
        "fc:frame:button:1:action": "link",
        "fc:frame:button:1:target": APP_URL,
    },
};

// ============================================
// Viewport Configuration
// ============================================

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0F172A",
    colorScheme: "dark",
    // Safe area insets for Mini Apps
    viewportFit: "cover",
};

// ============================================
// Root Layout Component
// ============================================

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
            <head>
                {/* Safe Area CSS Variables for Mini Apps */}
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
              :root {
                --sat: env(safe-area-inset-top);
                --sar: env(safe-area-inset-right);
                --sab: env(safe-area-inset-bottom);
                --sal: env(safe-area-inset-left);
              }
            `,
                    }}
                />
            </head>
            <body className="font-sans antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
