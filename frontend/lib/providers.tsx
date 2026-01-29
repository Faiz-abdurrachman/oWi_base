"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

// ============================================
// Wagmi Configuration
// ============================================

const config = createConfig({
    chains: [baseSepolia, base],
    connectors: [
        coinbaseWallet({
            appName: "oWi AI",
            preference: "smartWalletOnly",
        }),
        injected(),
    ],
    ssr: true,
    transports: {
        [baseSepolia.id]: http(),
        [base.id]: http(),
    },
});

// ============================================
// Query Client
// ============================================

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
        },
    },
});

// ============================================
// Mini App SDK Hook
// ============================================

export function useMiniAppReady() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Signal that the app is ready for Mini App context
        setIsReady(true);
        console.log("[oWi] App ready");
    }, []);

    return isReady;
}

// ============================================
// Check if running in Mini App
// ============================================

export function useIsMiniApp() {
    const [isMiniApp, setIsMiniApp] = useState(false);

    useEffect(() => {
        // Check if we're in an iframe (Mini App context)
        const inIframe = typeof window !== "undefined" && window !== window.parent;
        setIsMiniApp(inIframe);
    }, []);

    return isMiniApp;
}

// ============================================
// Providers Component
// ============================================

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    // Initialize Mini App SDK
    useMiniAppReady();

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default Providers;
