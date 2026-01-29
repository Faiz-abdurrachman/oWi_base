"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ChevronRight, Shield, Zap, TrendingUp, Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// Landing Page
// ============================================

export default function LandingPage() {
    const { isConnected } = useAccount();
    const { connectors, connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    const handleConnect = () => {
        // Prefer Coinbase Wallet
        const coinbaseConnector = connectors.find(
            (c) => c.id === "coinbaseWalletSDK"
        );
        if (coinbaseConnector) {
            connect({ connector: coinbaseConnector });
        } else if (connectors[0]) {
            connect({ connector: connectors[0] });
        }
    };

    return (
        <main className="min-h-screen bg-gradient-dark">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative container mx-auto px-4 pt-16 pb-20">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                                <span className="text-navy-500 font-bold text-xl">oW</span>
                            </div>
                            <span className="font-bold text-xl text-white">oWi AI</span>
                        </div>

                        {isConnected ? (
                            <Link
                                href="/dashboard"
                                className="btn-primary text-sm"
                            >
                                Open App
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        ) : null}
                    </div>

                    {/* Hero Content */}
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 mb-6">
                            <Coins className="w-4 h-4 text-gold-400" />
                            <span className="text-sm text-gold-400">
                                AI-Powered Gold Trading on Base
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                            Protect Your Wealth from{" "}
                            <span className="text-gradient-gold">Inflation</span>
                        </h1>

                        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                            oWi AI automatically trades between USDC and tokenized gold to
                            hedge against inflation. Just deposit and let AI handle the rest.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isConnected ? (
                                <Link
                                    href="/dashboard"
                                    className="btn-primary text-lg px-8 py-4"
                                >
                                    Go to Dashboard
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <button
                                    onClick={handleConnect}
                                    disabled={isPending}
                                    className={cn(
                                        "btn-primary text-lg px-8 py-4",
                                        isPending && "opacity-50 cursor-wait"
                                    )}
                                >
                                    {isPending ? "Connecting..." : "Connect Wallet"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-slate-850/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white text-center mb-12">
                        How It Works
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {/* Step 1 */}
                        <div className="card text-center">
                            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-gold-400">1</span>
                            </div>
                            <h3 className="font-semibold text-white mb-2">Deposit USDC</h3>
                            <p className="text-sm text-slate-400">
                                Start with as little as $10. Your funds stay in a secure,
                                non-custodial vault.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="card text-center">
                            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-gold-400">2</span>
                            </div>
                            <h3 className="font-semibold text-white mb-2">Get AI Signals</h3>
                            <p className="text-sm text-slate-400">
                                Pay just $0.01 per signal. AI analyzes markets and recommends
                                when to buy or sell gold.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="card text-center">
                            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-gold-400">3</span>
                            </div>
                            <h3 className="font-semibold text-white mb-2">Trade & Grow</h3>
                            <p className="text-sm text-slate-400">
                                Execute trades with one tap. Watch your portfolio stay protected
                                from inflation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-white text-center mb-12">
                        Why Choose oWi AI?
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Non-Custodial"
                            description="You always control your funds. Withdraw anytime."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Pay Per Use"
                            description="No subscriptions. Only pay $0.01 when you use AI."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="w-6 h-6" />}
                            title="AI-Powered"
                            description="Advanced AI analyzes markets 24/7 for you."
                        />
                        <FeatureCard
                            icon={<Coins className="w-6 h-6" />}
                            title="Gold Hedge"
                            description="Tokenized gold protects against inflation."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-transparent to-gold-500/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Start Protecting Your Wealth Today
                    </h2>
                    <p className="text-slate-400 mb-8">
                        Join thousands of users who trust oWi AI for inflation protection.
                    </p>

                    {!isConnected && (
                        <button
                            onClick={handleConnect}
                            disabled={isPending}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            {isPending ? "Connecting..." : "Connect Wallet to Start"}
                        </button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                                <span className="text-navy-500 font-bold text-sm">oW</span>
                            </div>
                            <span className="text-sm text-slate-400">
                                © 2026 oWi AI. Built for Base Hackathon.
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <a href="#" className="hover:text-white transition-colors">
                                Docs
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                GitHub
                            </a>
                            <a href="#" className="hover:text-white transition-colors">
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}

// ============================================
// Feature Card Component
// ============================================

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="card-hover p-6">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400 mb-4">
                {icon}
            </div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    );
}
