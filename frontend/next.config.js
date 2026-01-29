/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ["lucide-react", "recharts"],
    },

    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },

    // Headers for security and Mini App compatibility
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
            {
                // Allow embedding in Farcaster/Coinbase frames
                source: "/.well-known/(.*)",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "*",
                    },
                ],
            },
        ];
    },

    // Environment variables validation
    env: {
        NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || "84532",
    },
};

module.exports = nextConfig;
