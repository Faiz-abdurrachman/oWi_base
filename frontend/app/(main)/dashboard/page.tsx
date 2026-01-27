"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Bot,
    Sparkles,
    Plus,
    Minus,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatPercent, shortenAddress } from "@/lib/utils";

/**
 * Dashboard Page - Halaman utama setelah login
 */
export default function DashboardPage() {
    const { address } = useAccount();
    const [mounted, setMounted] = useState(false);

    // Mock data - nanti diganti dengan data real dari contract
    const portfolioData = {
        totalValue: 1247.85,
        change24h: 47.85,
        changePercent: 0.0398,
        usdcAmount: 810.10,
        goldAmount: 0.203,
        goldValueUSD: 437.75,
        usdcPercent: 65,
        goldPercent: 35,
    };

    const recentTrades = [
        {
            id: 1,
            type: "BUY_GOLD",
            amount: 0.02,
            value: 43.10,
            time: "2 jam lalu",
            profit: 1.20,
        },
        {
            id: 2,
            type: "SELL_GOLD",
            amount: 0.01,
            value: 21.55,
            time: "1 hari lalu",
            profit: 0.85,
        },
        {
            id: 3,
            type: "BUY_GOLD",
            amount: 0.03,
            value: 64.65,
            time: "3 hari lalu",
            profit: 2.30,
        },
    ];

    const latestSignal = {
        action: "BUY_GOLD",
        confidence: 78,
        reasoning: "Harga emas menunjukkan tren naik dengan inflasi yang meningkat...",
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <DashboardSkeleton />;
    }

    const isPositiveChange = portfolioData.changePercent >= 0;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Welcome */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm">Selamat datang kembali,</p>
                    <p className="text-white font-medium">{shortenAddress(address || "")}</p>
                </div>
                <div className="badge-success">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    AI Aktif
                </div>
            </div>

            {/* Portfolio Value Card */}
            <div className="card-gold p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Total Nilai Portfolio</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            {formatCurrency(portfolioData.totalValue)}
                        </h2>
                    </div>
                    <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isPositiveChange ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                            }`}
                    >
                        {isPositiveChange ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                            {formatPercent(portfolioData.changePercent)}
                        </span>
                    </div>
                </div>

                {/* Change Amount */}
                <p className={`text-sm ${isPositiveChange ? "text-success" : "text-danger"}`}>
                    {isPositiveChange ? "+" : ""}
                    {formatCurrency(portfolioData.change24h)} (24 jam terakhir)
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link href="/trading?action=deposit" className="card-hover p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-success" />
                    </div>
                    <div>
                        <p className="font-medium text-white">Deposit</p>
                        <p className="text-sm text-gray-400">Tambah USDC</p>
                    </div>
                </Link>

                <Link href="/trading?action=withdraw" className="card-hover p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
                        <Minus className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                        <p className="font-medium text-white">Withdraw</p>
                        <p className="text-sm text-gray-400">Tarik Dana</p>
                    </div>
                </Link>
            </div>

            {/* Asset Allocation */}
            <div className="card p-6">
                <h3 className="font-semibold text-white mb-4">Alokasi Aset</h3>

                {/* Progress Bar */}
                <div className="h-4 rounded-full bg-dark-700 overflow-hidden mb-4">
                    <div
                        className="h-full bg-gradient-to-r from-base to-gold-500 transition-all duration-500"
                        style={{ width: `${portfolioData.usdcPercent}%` }}
                    />
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-base" />
                        <div>
                            <p className="text-sm text-gray-400">USDC</p>
                            <p className="font-semibold text-white">
                                {formatCurrency(portfolioData.usdcAmount)}
                            </p>
                            <p className="text-xs text-gray-500">{portfolioData.usdcPercent}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gold-500" />
                        <div>
                            <p className="text-sm text-gray-400">Gold (XAU)</p>
                            <p className="font-semibold text-white">
                                {portfolioData.goldAmount.toFixed(4)} XAU
                            </p>
                            <p className="text-xs text-gray-500">
                                {portfolioData.goldPercent}% ({formatCurrency(portfolioData.goldValueUSD)})
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Signal Preview */}
            <div className="card p-6 border-gold-500/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-gold-500" />
                        <h3 className="font-semibold text-white">Sinyal AI Terbaru</h3>
                    </div>
                    <div className="badge-gold">
                        <Sparkles className="w-3 h-3" />
                        {latestSignal.confidence}% Confidence
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-3">
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${latestSignal.action === "BUY_GOLD"
                                ? "bg-success/20"
                                : latestSignal.action === "SELL_GOLD"
                                    ? "bg-danger/20"
                                    : "bg-gray-500/20"
                            }`}
                    >
                        {latestSignal.action === "BUY_GOLD" ? (
                            <ArrowUpRight className="w-5 h-5 text-success" />
                        ) : latestSignal.action === "SELL_GOLD" ? (
                            <ArrowDownRight className="w-5 h-5 text-danger" />
                        ) : (
                            <Wallet className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-white">
                            {latestSignal.action === "BUY_GOLD"
                                ? "Beli Emas"
                                : latestSignal.action === "SELL_GOLD"
                                    ? "Jual Emas"
                                    : "Tahan"}
                        </p>
                        <p className="text-sm text-gray-400 line-clamp-1">
                            {latestSignal.reasoning}
                        </p>
                    </div>
                </div>

                <Link href="/trading" className="btn-primary w-full">
                    Lihat Detail & Eksekusi
                </Link>
            </div>

            {/* Recent Trades */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Transaksi Terbaru</h3>
                    <Link href="/portfolio" className="text-sm text-gold-500 hover:underline">
                        Lihat Semua
                    </Link>
                </div>

                <div className="space-y-3">
                    {recentTrades.map((trade) => (
                        <div
                            key={trade.id}
                            className="flex items-center justify-between py-3 border-b border-dark-700 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${trade.type === "BUY_GOLD" ? "bg-success/20" : "bg-danger/20"
                                        }`}
                                >
                                    {trade.type === "BUY_GOLD" ? (
                                        <ArrowUpRight className="w-4 h-4 text-success" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-danger" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {trade.type === "BUY_GOLD" ? "Beli" : "Jual"} {trade.amount} XAU
                                    </p>
                                    <p className="text-xs text-gray-500">{trade.time}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">
                                    {formatCurrency(trade.value)}
                                </p>
                                <p className="text-xs text-success">+{formatCurrency(trade.profit)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton loading untuk dashboard
 */
function DashboardSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-pulse">
            <div className="h-8 w-48 skeleton rounded" />
            <div className="card p-6">
                <div className="h-4 w-32 skeleton rounded mb-2" />
                <div className="h-10 w-48 skeleton rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 h-20 skeleton" />
                <div className="card p-4 h-20 skeleton" />
            </div>
            <div className="card p-6 h-40 skeleton" />
            <div className="card p-6 h-60 skeleton" />
        </div>
    );
}
