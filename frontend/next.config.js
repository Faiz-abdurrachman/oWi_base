/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Optimasi untuk Base Mini App
    experimental: {
        optimizePackageImports: ["lucide-react", "@coinbase/onchainkit"],
    },

    // Security headers
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },

    // Image optimization
    images: {
        domains: ["localhost"],
        formats: ["image/avif", "image/webp"],
    },

    // Environment variables untuk client
    env: {
        NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
        NEXT_PUBLIC_VAULT_ADDRESS: process.env.NEXT_PUBLIC_VAULT_ADDRESS,
        NEXT_PUBLIC_USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS,
        NEXT_PUBLIC_GOLD_ADDRESS: process.env.NEXT_PUBLIC_GOLD_ADDRESS,
    },
};

module.exports = nextConfig;
