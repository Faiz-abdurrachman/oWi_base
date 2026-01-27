"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { ReactNode, useState } from "react";

// ============================================
// WAGMI CONFIGURATION
// ============================================

/**
 * WalletConnect Project ID
 * Dapatkan dari: https://cloud.walletconnect.com
 */
const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

/**
 * Wagmi config dengan multiple connectors
 */
const wagmiConfig = createConfig({
    chains: [baseSepolia, base],
    connectors: [
        // Coinbase Wallet (primary untuk Base Mini App)
        coinbaseWallet({
            appName: "GoldGuard AI",
            appLogoUrl: "/logo.png",
        }),
        // WalletConnect (fallback)
        ...(walletConnectProjectId
            ? [walletConnect({ projectId: walletConnectProjectId })]
            : []),
        // Injected wallets (MetaMask, dll)
        injected(),
    ],
    transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
    },
    ssr: true,
});

// ============================================
// PROVIDERS COMPONENT
// ============================================

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Root providers untuk aplikasi
 * Menggabungkan Wagmi, React Query, dan OnchainKit
 */
export function Providers({ children }: ProvidersProps) {
    // Query client dengan konfigurasi yang optimal
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60, // 1 menit
                        gcTime: 1000 * 60 * 5, // 5 menit
                        retry: 2,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    chain={baseSepolia}
                    config={{
                        appearance: {
                            mode: "dark",
                            theme: "default",
                        },
                    }}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
