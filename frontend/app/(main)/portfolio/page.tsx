"use client";

import { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Filter,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { usePortfolioValue, usePortfolioBreakdown, useUserPosition } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { formatUSD, formatGold, formatRelativeTime, cn, getChangeColor } from "@/lib/utils";

// ============================================
// Portfolio Page
// ============================================

export default function PortfolioPage() {
    const { value: portfolioValue } = usePortfolioValue();
    const { breakdown } = usePortfolioBreakdown();
    const { position } = useUserPosition();
    const { transactions } = useAppStore();

    // Mock data for chart
    const chartData = generateMockChartData();
    const change = 12.5;
    const roi = ((portfolioValue - (position ? Number(position.totalDeposited) / 1e6 : 0)) /
        (position && Number(position.totalDeposited) > 0 ? Number(position.totalDeposited) / 1e6 : 1)) * 100;

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Portfolio Overview */}
            <section className="card">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Total Value</p>
                        <p className="text-2xl font-bold text-white">
                            {formatUSD(portfolioValue)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Total ROI</p>
                        <p className={cn("text-2xl font-bold", getChangeColor(roi))}>
                            {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-slate-800/50">
                        <p className="text-xs text-slate-400 mb-1">Total Deposited</p>
                        <p className="font-semibold text-white">
                            {position ? formatUSD(Number(position.totalDeposited) / 1e6) : "$0.00"}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50">
                        <p className="text-xs text-slate-400 mb-1">Total Withdrawn</p>
                        <p className="font-semibold text-white">
                            {position ? formatUSD(Number(position.totalWithdrawn) / 1e6) : "$0.00"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Performance Chart */}
            <section className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Performance</h3>
                    <TimeframeSelector />
                </div>

                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#94A3B8" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#94A3B8" }}
                                tickFormatter={(value) => `$${value}`}
                                domain={["dataMin - 50", "dataMax + 50"]}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#1E293B",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#94A3B8" }}
                                formatter={(value: number) => [formatUSD(value), "Value"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#FFD700"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Asset Breakdown */}
            <section className="card">
                <h3 className="font-semibold text-white mb-4">Asset Breakdown</h3>

                <div className="flex items-center gap-6">
                    {/* Pie Chart */}
                    <div className="w-32 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        {
                                            name: "USDC",
                                            value: breakdown ? Number(breakdown.usdcPercentage) : 50,
                                        },
                                        {
                                            name: "Gold",
                                            value: breakdown ? Number(breakdown.goldPercentage) : 50,
                                        },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={50}
                                    dataKey="value"
                                >
                                    <Cell fill="#3B82F6" />
                                    <Cell fill="#FFD700" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-sm text-white">USDC</span>
                            </div>
                            <span className="text-sm font-medium text-white">
                                {breakdown ? (Number(breakdown.usdcPercentage) / 100).toFixed(1) : 0}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gold-500" />
                                <span className="text-sm text-white">Gold</span>
                            </div>
                            <span className="text-sm font-medium text-white">
                                {breakdown ? (Number(breakdown.goldPercentage) / 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transaction History */}
            <section className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Transaction History</h3>
                    <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
                        <Filter className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {transactions.length > 0 ? (
                    <div className="space-y-3">
                        {transactions.slice(0, 10).map((tx) => (
                            <TransactionRow key={tx.id} tx={tx} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <p>No transactions yet</p>
                    </div>
                )}
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 gap-4">
                <div className="card">
                    <p className="text-sm text-slate-400 mb-1">Trade Count</p>
                    <p className="text-xl font-bold text-white">
                        {position ? Number(position.tradeCount) : 0}
                    </p>
                </div>
                <div className="card">
                    <p className="text-sm text-slate-400 mb-1">Win Rate</p>
                    <p className="text-xl font-bold text-success-400">68%</p>
                </div>
            </section>
        </div>
    );
}

// ============================================
// Timeframe Selector
// ============================================

function TimeframeSelector() {
    const [selected, setSelected] = useState("1W");
    const options = ["1D", "1W", "1M", "ALL"];

    return (
        <div className="flex gap-1 p-1 rounded-lg bg-slate-800">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium transition-all",
                        selected === option
                            ? "bg-gold-500 text-navy-500"
                            : "text-slate-400 hover:text-white"
                    )}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

// ============================================
// Transaction Row
// ============================================

function TransactionRow({ tx }: { tx: any }) {
    const isPositive = tx.type === "deposit" || tx.type === "sell";

    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isPositive ? "bg-success-500/20" : "bg-danger-500/20"
                    )}
                >
                    {isPositive ? (
                        <ArrowDownRight className="w-4 h-4 text-success-400" />
                    ) : (
                        <ArrowUpRight className="w-4 h-4 text-danger-400" />
                    )}
                </div>
                <div>
                    <p className="font-medium text-white capitalize">{tx.type}</p>
                    <p className="text-xs text-slate-400">
                        {formatRelativeTime(tx.timestamp)}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className={cn("font-medium", isPositive ? "text-success-400" : "text-white")}>
                    {isPositive ? "+" : "-"}{tx.amount}
                </p>
                <p className="text-xs text-slate-400">
                    {tx.status === "confirmed" ? "Confirmed" : "Pending"}
                </p>
            </div>
        </div>
    );
}

// ============================================
// Helper: Generate Mock Chart Data
// ============================================

function generateMockChartData() {
    const data = [];
    const today = new Date();
    let value = 1000;

    for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Random walk with slight upward trend
        value = value * (1 + (Math.random() - 0.45) * 0.03);

        data.push({
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            value: Math.round(value * 100) / 100,
        });
    }

    return data;
}
