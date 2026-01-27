"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
    Shield,
    TrendingUp,
    Wallet,
    Bot,
    Zap,
    Smartphone,
    Lock,
    ChevronRight,
    Sparkles,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

/**
 * Landing Page - Halaman utama GoldGuard AI
 * Menampilkan value proposition, cara kerja, dan CTA connect wallet
 */
export default function LandingPage() {
    const { isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle connect wallet
    const handleConnect = () => {
        const coinbaseConnector = connectors.find(
            (c) => c.id === "coinbaseWalletSDK"
        );
        if (coinbaseConnector) {
            connect({ connector: coinbaseConnector });
        } else if (connectors[0]) {
            connect({ connector: connectors[0] });
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-dark-900 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8 animate-fade-up">
                        <Sparkles className="w-4 h-4 text-gold-500" />
                        <span className="text-sm text-gold-500 font-medium">
                            Dibangun di Base • Didukung AI
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up animate-delay-100">
                        <span className="text-white">Lindungi Kekayaan.</span>
                        <br />
                        <span className="text-gradient">Trading Cerdas.</span>
                        <br />
                        <span className="text-white">Kalahkan Inflasi.</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-up animate-delay-200">
                        Bot trading AI yang secara otomatis melindungi USD Anda dari inflasi
                        dengan memperdagangkan emas tokenized. Set sekali, lindungi selamanya.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up animate-delay-300">
                        {isConnected ? (
                            <Link
                                href="/dashboard"
                                className="btn-primary btn-lg group"
                            >
                                Buka Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <button
                                onClick={handleConnect}
                                className="btn-primary btn-lg group"
                            >
                                <Wallet className="w-5 h-5" />
                                Hubungkan Wallet
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                        <a
                            href="#how-it-works"
                            className="btn-secondary btn-lg"
                        >
                            Pelajari Lebih Lanjut
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up animate-delay-400">
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-white">$500K+</div>
                            <div className="text-sm text-gray-500">Nilai Dilindungi</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-white">1,200+</div>
                            <div className="text-sm text-gray-500">Pengguna Aktif</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-white">5,000+</div>
                            <div className="text-sm text-gray-500">Trade Dieksekusi</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-4 bg-dark-800/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Cara Kerja
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Tiga langkah sederhana untuk mulai melindungi kekayaan Anda dari inflasi
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="card-hover p-8 text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Wallet className="w-8 h-8 text-gold-500" />
                            </div>
                            <div className="text-gold-500 font-bold mb-2">Langkah 1</div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                Hubungkan & Deposit
                            </h3>
                            <p className="text-gray-400">
                                Hubungkan wallet Anda dan deposit USDC dalam hitungan detik. Mulai dari $10 saja.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="card-hover p-8 text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Bot className="w-8 h-8 text-gold-500" />
                            </div>
                            <div className="text-gold-500 font-bold mb-2">Langkah 2</div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                AI Menganalisis
                            </h3>
                            <p className="text-gray-400">
                                AI kami memantau harga emas dan data inflasi 24/7 untuk menghasilkan sinyal trading.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="card-hover p-8 text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-8 h-8 text-gold-500" />
                            </div>
                            <div className="text-gold-500 font-bold mb-2">Langkah 3</div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                Trading Otomatis
                            </h3>
                            <p className="text-gray-400">
                                Otomatis trading ke emas saat inflasi mengancam kekayaan Anda. Duduk santai dan lihat portfolio berkembang.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Fitur Utama
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Dibangun dengan teknologi terdepan untuk melindungi kekayaan Anda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="card p-6">
                            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                                <Bot className="w-6 h-6 text-gold-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Sepenuhnya Otonom
                            </h3>
                            <p className="text-gray-400 text-sm">
                                AI membuat keputusan trading 24/7. Anda cukup set dan lupakan.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card p-6">
                            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-gold-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Bayar Per Sinyal
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Tidak ada biaya langganan. Hanya bayar 0.01 USDC per sinyal AI.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card p-6">
                            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                                <Smartphone className="w-6 h-6 text-gold-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Mobile First
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Dibangun sebagai Base Mini App untuk Coinbase Wallet.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="card p-6">
                            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-4">
                                <Lock className="w-6 h-6 text-gold-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Non-Custodial
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Anda selalu mengontrol dana Anda. Tarik kapan saja.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-16 px-4 bg-dark-800/50">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Shield className="w-6 h-6" />
                            <span>Dibangun di Base</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Sparkles className="w-6 h-6" />
                            <span>Didukung Chainlink</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Bot className="w-6 h-6" />
                            <span>AI by Groq</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Mulai Lindungi Kekayaan Anda Hari Ini
                    </h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                        Bergabung dengan ribuan pengguna yang sudah melindungi kekayaan mereka
                        dari inflasi dengan GoldGuard AI.
                    </p>

                    {isConnected ? (
                        <Link href="/dashboard" className="btn-primary btn-lg">
                            Buka Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    ) : (
                        <button onClick={handleConnect} className="btn-primary btn-lg">
                            <Wallet className="w-5 h-5" />
                            Mulai Sekarang - Gratis
                        </button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-dark-700">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-gold-500" />
                        <span className="font-bold text-white">GoldGuard AI</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2026 GoldGuard AI. Dibangun untuk Base Hackathon.
                    </p>
                </div>
            </footer>
        </main>
    );
}
