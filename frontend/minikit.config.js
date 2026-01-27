/** @type {import('@anthropic/minikit').MiniKitConfig} */
export default {
    // Mini App Info
    name: 'GoldGuard AI',
    description: 'Bot Trading Otonom untuk Perlindungan Inflasi',
    version: '1.0.0',

    // App Icon (1024x1024 required for Mini App)
    iconUrl: 'https://goldguard.ai/icon.png',

    // App Cover Image (1200x630 for social sharing)
    coverUrl: 'https://goldguard.ai/cover.png',

    // Mini App URL (production)
    appUrl: 'https://goldguard.ai',

    // Splash Screen
    splash: {
        backgroundColor: '#0f172a',
        imageUrl: 'https://goldguard.ai/splash.png',
    },

    // Farcaster Association (will be filled after registration)
    farcasterAssociation: {
        // Generate this from Base Build tool
        // https://base-build.tools/miniapp-association
    },

    // Payment Configuration (x402)
    payments: {
        enabled: true,
        currency: 'USDC',
        network: 'base', // 'base' for mainnet, 'base-sepolia' for testnet
    },

    // Permissions required by the app
    permissions: [
        'wallet', // Access to wallet for transactions
        'notifications', // Push notifications
    ],
};
