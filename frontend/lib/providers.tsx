"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { ReactNode, useState, useEffect } from "react";

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
 * OnchainKit API Key (opsional, untuk enhanced features)
 * Dapatkan dari: https://portal.cdp.coinbase.com
 */
const onchainKitApiKey = process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "";

/**
 * Wagmi config dengan multiple connectors
 * Prioritas: Coinbase Wallet > WalletConnect > Injected
 */
const wagmiConfig = createConfig({
    chains: [baseSepolia, base],
    connectors: [
        // Coinbase Wallet (PRIMARY untuk Base Mini App)
        coinbaseWallet({
            appName: "oWi AI",
            appLogoUrl: "https://owi.ai/logo.png",
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
// MINI APP HOOKS
// ============================================

/**
 * Hook untuk initialize Mini App SDK
 * Memanggil sdk.actions.ready() untuk menampilkan app
 */
export function useMiniAppReady() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initMiniApp = async () => {
            try {
                // Dynamic import untuk avoid SSR issues
                const { sdk } = await import("@farcaster/miniapp-sdk");

                // Signal bahwa app siap ditampilkan
                await sdk.actions.ready();

                setIsReady(true);
            } catch (error) {
                // Not running in Farcaster context, silently ignore
                console.log("Not in Mini App context");
                setIsReady(true);
            }
        };

        initMiniApp();
    }, []);

    return isReady;
}

/**
 * Hook untuk detect apakah app berjalan di dalam Mini App context
 */
export function useIsMiniApp(): boolean {
    const [isMiniApp, setIsMiniApp] = useState(false);

    useEffect(() => {
        const checkMiniApp = async () => {
            try {
                const { sdk } = await import("@farcaster/miniapp-sdk");
                // Check if context is available
                const context = await sdk.context;
                setIsMiniApp(!!context);
            } catch {
                setIsMiniApp(false);
            }
        };

        checkMiniApp();
    }, []);

    return isMiniApp;
}

/**
 * Hook untuk mendapatkan Farcaster user context
 */
export function useFarcasterContext() {
    const [context, setContext] = useState<{
        user?: { fid: number; username?: string };
        location?: { type: string };
    } | null>(null);

    useEffect(() => {
        const getContext = async () => {
            try {
                const { sdk } = await import("@farcaster/miniapp-sdk");
                const ctx = await sdk.context;
                if (ctx) {
                    setContext({
                        user: ctx.user,
                        location: ctx.location,
                    });
                }
            } catch {
                setContext(null);
            }
        };

        getContext();
    }, []);

    return context;
}

// ============================================
// PROVIDERS COMPONENT
// ============================================

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Root providers untuk aplikasi
 * Menggabungkan Wagmi, React Query, dan OnchainKit dengan MiniKit enabled
 */
export function Providers({ children }: ProvidersProps) {
    // Initialize Mini App SDK
    useMiniAppReady();

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
                    apiKey={onchainKitApiKey}
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
