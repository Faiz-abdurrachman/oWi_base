"use client";

import { useState, useEffect } from "react";
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
} from "lucide-react";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";

type TimeRange = "7d" | "30d" | "90d" | "1y";

/**
 * Portfolio Page - Lihat analytics dan history
 */
export default function PortfolioPage() {
    const [mounted, setMounted] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>("30d");

    // Mock data
    const performanceData = {
        totalReturn: 127.85,
        totalReturnPercent: 0.1128,
        vsHoldingUSDC: 78.50,
        vsHoldingGold: 45.20,
        winRate: 68,
        totalTrades: 42,
        bestTrade: { amount: 23.50, date: "15 Jan 2026" },
        worstTrade: { amount: -8.20, date: "10 Jan 2026" },
    };

    const tradeHistory = [
        {
            id: 1,
            type: "BUY_GOLD",
            amountIn: 100,
            amountOut: 0.0464,
            price: 2155.50,
            timestamp: Date.now() - 2 * 60 * 60 * 1000,
            status: "completed",
            profit: 3.20,
        },
        {
            id: 2,
            type: "SELL_GOLD",
            amountIn: 0.02,
            amountOut: 43.11,
            price: 2155.50,
            timestamp: Date.now() - 24 * 60 * 60 * 1000,
            status: "completed",
            profit: 1.85,
        },
        {
            id: 3,
            type: "BUY_GOLD",
            amountIn: 150,
            amountOut: 0.0697,
            price: 2151.00,
            timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
            status: "completed",
            profit: 5.40,
        },
        {
            id: 4,
            type: "SELL_GOLD",
            amountIn: 0.05,
            amountOut: 107.25,
            price: 2145.00,
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
            status: "completed",
            profit: -2.30,
        },
        {
            id: 5,
            type: "BUY_GOLD",
            amountIn: 200,
            amountOut: 0.0936,
            price: 2137.00,
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
            status: "completed",
            profit: 8.75,
        },
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <PortfolioSkeleton />;
    }

    const isPositiveReturn = performanceData.totalReturnPercent >= 0;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Portfolio</h1>
                <div className="flex gap-1 p-1 bg-dark-800 rounded-lg">
                    {(["7d", "30d", "90d", "1y"] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                timeRange === range
                                    ? "bg-dark-700 text-white"
                                    : "text-gray-400 hover:text-white"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Performance Summary */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Performa</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Total Return */}
                    <div className="card bg-dark-700 p-4">
                        <p className="text-sm text-gray-400 mb-1">Total Return</p>
                        <p
                            className={cn(
                                "text-2xl font-bold",
                                isPositiveReturn ? "text-success" : "text-danger"
                            )}
                        >
                            {isPositiveReturn ? "+" : ""}
                            {formatCurrency(performanceData.totalReturn)}
                        </p>
                        <p
                            className={cn(
                                "text-sm",
                                isPositiveReturn ? "text-success" : "text-danger"
                            )}
                        >
                            {isPositiveReturn ? "+" : ""}
                            {(performanceData.totalReturnPercent * 100).toFixed(2)}%
                        </p>
                    </div>

                    {/* Win Rate */}
                    <div className="card bg-dark-700 p-4">
                        <p className="text-sm text-gray-400 mb-1">Win Rate</p>
                        <p className="text-2xl font-bold text-white">
                            {performanceData.winRate}%
                        </p>
                        <p className="text-sm text-gray-400">
                            {performanceData.totalTrades} trades
                        </p>
                    </div>
                </div>

                {/* Comparison */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">vs Holding USDC</span>
                        <span className="text-success font-medium">
                            +{formatCurrency(performanceData.vsHoldingUSDC)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">vs Holding Gold</span>
                        <span className="text-success font-medium">
                            +{formatCurrency(performanceData.vsHoldingGold)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-sm text-gray-400">Trade Terbaik</span>
                    </div>
                    <p className="text-xl font-bold text-success">
                        +{formatCurrency(performanceData.bestTrade.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{performanceData.bestTrade.date}</p>
                </div>

                <div className="card p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-danger" />
                        <span className="text-sm text-gray-400">Trade Terburuk</span>
                    </div>
                    <p className="text-xl font-bold text-danger">
                        {formatCurrency(performanceData.worstTrade.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{performanceData.worstTrade.date}</p>
                </div>
            </div>

            {/* Trade History */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Riwayat Transaksi</h2>
                    <button className="btn-ghost btn-sm">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <div className="space-y-1">
                    {tradeHistory.map((trade) => (
                        <div
                            key={trade.id}
                            className="flex items-center justify-between py-4 border-b border-dark-700 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center",
                                        trade.type === "BUY_GOLD" ? "bg-success/20" : "bg-danger/20"
                                    )}
                                >
                                    {trade.type === "BUY_GOLD" ? (
                                        <ArrowUpRight className="w-5 h-5 text-success" />
                                    ) : (
                                        <ArrowDownRight className="w-5 h-5 text-danger" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">
                                        {trade.type === "BUY_GOLD" ? "Beli" : "Jual"} Gold
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {trade.type === "BUY_GOLD"
                                            ? `${formatCurrency(trade.amountIn)} → ${trade.amountOut.toFixed(4)} XAU`
                                            : `${trade.amountIn.toFixed(4)} XAU → ${formatCurrency(trade.amountOut)}`}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p
                                    className={cn(
                                        "font-medium",
                                        trade.profit >= 0 ? "text-success" : "text-danger"
                                    )}
                                >
                                    {trade.profit >= 0 ? "+" : ""}
                                    {formatCurrency(trade.profit)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatRelativeTime(trade.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <button className="btn-secondary w-full mt-4">
                    Muat Lebih Banyak
                </button>
            </div>
        </div>
    );
}

function PortfolioSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-pulse">
            <div className="flex justify-between">
                <div className="h-8 w-32 skeleton rounded" />
                <div className="h-8 w-40 skeleton rounded" />
            </div>
            <div className="card p-6 h-48 skeleton" />
            <div className="grid grid-cols-2 gap-4">
                <div className="card p-4 h-24 skeleton" />
                <div className="card p-4 h-24 skeleton" />
            </div>
            <div className="card p-6 h-80 skeleton" />
        </div>
    );
}
