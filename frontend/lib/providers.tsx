"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";

// ============================================
// Wagmi Configuration for Mini Apps
// ============================================

const config = createConfig({
    chains: [baseSepolia, base],
    connectors: [
        coinbaseWallet({
            appName: "oWi AI",
            // Smart Wallet Only - recommended for Mini Apps
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
// Mini App SDK Integration
// ============================================

export function useMiniApp() {
    const [isReady, setIsReady] = useState(false);
    const [isMiniApp, setIsMiniApp] = useState(false);
    const [context, setContext] = useState<any>(null);

    useEffect(() => {
        const initMiniApp = async () => {
            // Check if running in iframe (Mini App context)
            const inIframe = typeof window !== "undefined" && window !== window.parent;

            if (inIframe) {
                setIsMiniApp(true);

                // Try to get context from parent frame
                try {
                    // Signal ready to parent
                    window.parent.postMessage({ type: "ready" }, "*");

                    // Listen for context
                    const handleMessage = (event: MessageEvent) => {
                        if (event.data?.type === "context") {
                            setContext(event.data.context);
                        }
                    };
                    window.addEventListener("message", handleMessage);

                    console.log("[oWi] Running as Mini App");
                } catch (e) {
                    console.log("[oWi] Mini App context not available");
                }
            } else {
                console.log("[oWi] Running as standalone web app");
            }

            setIsReady(true);
        };

        initMiniApp();
    }, []);

    return { isReady, isMiniApp, context };
}

// ============================================
// Safe Area Hook for Mini Apps
// ============================================

export function useSafeArea() {
    const [safeArea, setSafeArea] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const computedStyle = getComputedStyle(document.documentElement);
            setSafeArea({
                top: parseInt(computedStyle.getPropertyValue("--sat") || "0", 10),
                bottom: parseInt(computedStyle.getPropertyValue("--sab") || "0", 10),
                left: parseInt(computedStyle.getPropertyValue("--sal") || "0", 10),
                right: parseInt(computedStyle.getPropertyValue("--sar") || "0", 10),
            });
        }
    }, []);

    return safeArea;
}

// ============================================
// Providers Component
// ============================================

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    const { isReady } = useMiniApp();

    // Get chain based on environment
    const chain = process.env.NEXT_PUBLIC_CHAIN === "mainnet" ? base : baseSepolia;

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    chain={chain}
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    config={{
                        appearance: {
                            mode: "dark",
                            theme: "base",
                        },
                    }}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default Providers;
