"use client";

import { useAccount } from "wagmi";
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Plus,
    Minus,
    RefreshCw,
} from "lucide-react";
import { usePortfolioValue, usePortfolioBreakdown, useGoldPrice, useUserPosition } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { formatUSD, formatGold, formatPercent, cn, getChangeColor } from "@/lib/utils";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";

// ============================================
// Dashboard Page
// ============================================

export default function DashboardPage() {
    const { address } = useAccount();
    const { value: portfolioValue, isLoading: valueLoading } = usePortfolioValue();
    const { breakdown, isLoading: breakdownLoading } = usePortfolioBreakdown();
    const { price: goldPrice, isLoading: priceLoading } = useGoldPrice();
    const { position, isLoading: positionLoading } = useUserPosition();

    const {
        openDepositModal,
        openWithdrawModal,
        isDepositModalOpen,
        isWithdrawModalOpen
    } = useAppStore();

    const isLoading = valueLoading || breakdownLoading || priceLoading;

    // Mock 24h change for demo
    const change24h = 3.45;

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Portfolio Value Card */}
            <section className="card bg-gradient-to-br from-slate-750 to-slate-850">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Portfolio Value</p>
                        {isLoading ? (
                            <div className="h-9 w-32 skeleton rounded" />
                        ) : (
                            <h1 className="text-3xl font-bold text-white">
                                {formatUSD(portfolioValue)}
                            </h1>
                        )}
                    </div>
                    <div
                        className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                            change24h >= 0
                                ? "bg-success-500/20 text-success-400"
                                : "bg-danger-500/20 text-danger-400"
                        )}
                    >
                        {change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={openDepositModal}
                        className="flex-1 btn-primary py-3"
                    >
                        <Plus className="w-4 h-4" />
                        Deposit
                    </button>
                    <button
                        onClick={openWithdrawModal}
                        className="flex-1 btn-secondary py-3"
                    >
                        <Minus className="w-4 h-4" />
                        Withdraw
                    </button>
                </div>
            </section>

            {/* Asset Allocation */}
            <section className="card">
                <h2 className="text-lg font-semibold text-white mb-4">
                    Asset Allocation
                </h2>

                {breakdownLoading ? (
                    <div className="space-y-3">
                        <div className="h-6 skeleton rounded w-full" />
                        <div className="h-16 skeleton rounded" />
                    </div>
                ) : breakdown ? (
                    <>
                        {/* Progress Bar */}
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                style={{
                                    width: `${Number(breakdown.usdcPercentage) / 100}%`,
                                }}
                            />
                        </div>

                        {/* Asset List */}
                        <div className="space-y-3">
                            <AssetRow
                                name="USDC"
                                symbol="USDC"
                                amount={formatUSD(Number(breakdown.usdcAmount) / 1e6)}
                                percentage={Number(breakdown.usdcPercentage) / 100}
                                color="bg-blue-500"
                            />
                            <AssetRow
                                name="Gold"
                                symbol="XAU"
                                amount={formatGold(Number(breakdown.goldAmount) / 1e18)}
                                value={formatUSD(Number(breakdown.goldValueInUsdc) / 1e6)}
                                percentage={Number(breakdown.goldPercentage) / 100}
                                color="bg-gold-500"
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        <p>No assets yet. Deposit USDC to get started!</p>
                    </div>
                )}
            </section>

            {/* Gold Price */}
            <section className="card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Gold Price (XAU/USD)</p>
                        {priceLoading ? (
                            <div className="h-7 w-24 skeleton rounded" />
                        ) : (
                            <p className="text-xl font-bold text-white">
                                {formatUSD(goldPrice)}
                            </p>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-gold-400" />
                    </div>
                </div>
            </section>

            {/* AI Signal Preview */}
            <section className="card-hover border-gold-500/30">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">AI Trading Signal</h3>
                        <p className="text-xs text-slate-400">Powered by Gemini AI</p>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 mb-3">
                    <p className="text-sm text-slate-300">
                        Get personalized AI trading signals based on market analysis.
                        Pay only $0.01 per signal.
                    </p>
                </div>

                <a href="/trading" className="btn-primary w-full">
                    View Signals
                    <ArrowUpRight className="w-4 h-4" />
                </a>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 gap-4">
                <div className="card">
                    <p className="text-sm text-slate-400 mb-1">Total Deposited</p>
                    <p className="text-lg font-semibold text-white">
                        {position ? formatUSD(Number(position.totalDeposited) / 1e6) : "$0.00"}
                    </p>
                </div>
                <div className="card">
                    <p className="text-sm text-slate-400 mb-1">Total Trades</p>
                    <p className="text-lg font-semibold text-white">
                        {position ? Number(position.tradeCount) : 0}
                    </p>
                </div>
            </section>

            {/* Modals */}
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={useAppStore.getState().closeDepositModal}
            />
            <WithdrawModal
                isOpen={isWithdrawModalOpen}
                onClose={useAppStore.getState().closeWithdrawModal}
            />
        </div>
    );
}

// ============================================
// Asset Row Component
// ============================================

function AssetRow({
    name,
    symbol,
    amount,
    value,
    percentage,
    color,
}: {
    name: string;
    symbol: string;
    amount: string;
    value?: string;
    percentage: number;
    color: string;
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", color)} />
                <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-xs text-slate-400">{symbol}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-medium text-white">{amount}</p>
                {value && <p className="text-xs text-slate-400">{value}</p>}
                <p className="text-xs text-slate-500">{percentage.toFixed(1)}%</p>
            </div>
        </div>
    );
}
