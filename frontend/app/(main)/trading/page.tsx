"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
    Bot,
    Sparkles,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Lock,
    CheckCircle2,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { SIGNAL_PRICE, CONFIDENCE_THRESHOLDS } from "@/lib/constants";

type TradeAction = "BUY_GOLD" | "SELL_GOLD" | "HOLD";
type TabType = "signal" | "deposit" | "withdraw";

/**
 * Trading Page - Lihat sinyal AI dan eksekusi trade
 */
export default function TradingPage() {
    const { address } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>("signal");
    const [isLoading, setIsLoading] = useState(false);
    const [signalUnlocked, setSignalUnlocked] = useState(false);

    // Form states
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [tradeAmount, setTradeAmount] = useState("");

    // Mock data
    const userBalance = {
        usdc: 1500.00,
        usdcInVault: 810.10,
        gold: 0.203,
        goldValue: 437.75,
    };

    const aiSignal = {
        action: "BUY_GOLD" as TradeAction,
        confidence: 78,
        reasoning:
            "Berdasarkan analisis data inflasi terbaru dan tren harga emas, disarankan untuk meningkatkan posisi emas. Inflasi bulanan mencapai 3.2% dan harga emas menunjukkan momentum bullish.",
        suggestedAmount: 100,
        goldPrice: 2155.50,
        timestamp: Date.now(),
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <TradingSkeleton />;
    }

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= CONFIDENCE_THRESHOLDS.high) return "text-success";
        if (confidence >= CONFIDENCE_THRESHOLDS.medium) return "text-gold-500";
        return "text-danger";
    };

    const handleUnlockSignal = async () => {
        setIsLoading(true);
        // Simulate payment
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSignalUnlocked(true);
        setIsLoading(false);
    };

    const handleExecuteTrade = async () => {
        setIsLoading(true);
        // Simulate trade execution
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        alert("Trade berhasil dieksekusi!");
    };

    const handleDeposit = async () => {
        if (!depositAmount || parseFloat(depositAmount) <= 0) return;
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        setDepositAmount("");
        alert("Deposit berhasil!");
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
        setWithdrawAmount("");
        alert("Withdraw berhasil!");
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-dark-800 rounded-xl">
                {[
                    { id: "signal", label: "Sinyal AI", icon: Bot },
                    { id: "deposit", label: "Deposit", icon: ArrowUpRight },
                    { id: "withdraw", label: "Withdraw", icon: ArrowDownRight },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all",
                            activeTab === tab.id
                                ? "bg-dark-700 text-white"
                                : "text-gray-400 hover:text-white"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* AI Signal Tab */}
            {activeTab === "signal" && (
                <div className="space-y-6">
                    {/* Signal Card */}
                    <div className="card p-6 border-gold-500/30">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Bot className="w-6 h-6 text-gold-500" />
                                <h2 className="text-xl font-bold text-white">Sinyal Trading AI</h2>
                            </div>
                            {signalUnlocked && (
                                <div className="badge-success">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Terbuka
                                </div>
                            )}
                        </div>

                        {!signalUnlocked ? (
                            /* Locked State */
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Sinyal Tersedia
                                </h3>
                                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                                    Buka kunci sinyal AI terbaru untuk melihat rekomendasi trading
                                    yang dipersonalisasi untuk portfolio Anda.
                                </p>

                                {/* Preview */}
                                <div className="card bg-dark-700 p-4 mb-6 blur-sm select-none">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-success/20" />
                                        <div className="h-4 w-24 bg-dark-600 rounded" />
                                    </div>
                                    <div className="h-3 w-full bg-dark-600 rounded mb-2" />
                                    <div className="h-3 w-3/4 bg-dark-600 rounded" />
                                </div>

                                <button
                                    onClick={handleUnlockSignal}
                                    disabled={isLoading}
                                    className="btn-primary btn-lg"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Buka Sinyal - {SIGNAL_PRICE} USDC
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            /* Unlocked State */
                            <div className="space-y-6">
                                {/* Action Badge */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center",
                                            aiSignal.action === "BUY_GOLD"
                                                ? "bg-success/20"
                                                : aiSignal.action === "SELL_GOLD"
                                                    ? "bg-danger/20"
                                                    : "bg-gray-500/20"
                                        )}
                                    >
                                        {aiSignal.action === "BUY_GOLD" ? (
                                            <TrendingUp className="w-7 h-7 text-success" />
                                        ) : aiSignal.action === "SELL_GOLD" ? (
                                            <TrendingDown className="w-7 h-7 text-danger" />
                                        ) : (
                                            <Wallet className="w-7 h-7 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            {aiSignal.action === "BUY_GOLD"
                                                ? "Beli Emas"
                                                : aiSignal.action === "SELL_GOLD"
                                                    ? "Jual Emas"
                                                    : "Tahan Posisi"}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className={cn(
                                                    "text-sm font-medium",
                                                    getConfidenceColor(aiSignal.confidence)
                                                )}
                                            >
                                                {aiSignal.confidence}% Confidence
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-sm text-gray-400">
                                                Harga: ${aiSignal.goldPrice.toLocaleString()}/oz
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reasoning */}
                                <div className="card bg-dark-700 p-4">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                                        Analisis AI:
                                    </h4>
                                    <p className="text-white">{aiSignal.reasoning}</p>
                                </div>

                                {/* Trade Form */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="label">Jumlah Trade (USDC)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={tradeAmount || aiSignal.suggestedAmount}
                                                onChange={(e) => setTradeAmount(e.target.value)}
                                                className="input pr-20"
                                                placeholder="0.00"
                                            />
                                            <button
                                                onClick={() => setTradeAmount(userBalance.usdcInVault.toString())}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gold-500 hover:text-gold-400"
                                            >
                                                MAX
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Tersedia: {formatCurrency(userBalance.usdcInVault)} USDC
                                        </p>
                                    </div>

                                    {/* Preview */}
                                    <div className="card bg-dark-700 p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Anda akan terima:</span>
                                            <span className="text-white font-medium">
                                                ~{((parseFloat(tradeAmount) || aiSignal.suggestedAmount) / aiSignal.goldPrice).toFixed(4)} XAU
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Harga eksekusi:</span>
                                            <span className="text-white">${aiSignal.goldPrice.toLocaleString()}/oz</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Slippage maks:</span>
                                            <span className="text-white">0.5%</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleExecuteTrade}
                                        disabled={isLoading}
                                        className="btn-primary btn-lg w-full"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Eksekusi Trade
                                                <ArrowUpRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Deposit Tab */}
            {activeTab === "deposit" && (
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Deposit USDC</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="label">Jumlah Deposit</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="input pr-20"
                                    placeholder="0.00"
                                />
                                <button
                                    onClick={() => setDepositAmount(userBalance.usdc.toString())}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gold-500 hover:text-gold-400"
                                >
                                    MAX
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Balance wallet: {formatCurrency(userBalance.usdc)} USDC
                            </p>
                        </div>

                        {/* Info */}
                        <div className="card bg-dark-700 p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-400">
                                <p>Dana yang Anda deposit akan dikelola oleh smart contract oWi.</p>
                                <p className="mt-1">Anda dapat menarik kapan saja.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleDeposit}
                            disabled={isLoading || !depositAmount}
                            className="btn-primary btn-lg w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ArrowUpRight className="w-5 h-5" />
                                    Deposit USDC
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Withdraw Tab */}
            {activeTab === "withdraw" && (
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Withdraw Dana</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="label">Jumlah Withdraw</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="input pr-20"
                                    placeholder="0.00"
                                />
                                <button
                                    onClick={() =>
                                        setWithdrawAmount(
                                            (userBalance.usdcInVault + userBalance.goldValue).toString()
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gold-500 hover:text-gold-400"
                                >
                                    MAX
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Tersedia: {formatCurrency(userBalance.usdcInVault + userBalance.goldValue)} USDC
                            </p>
                        </div>

                        {/* Info */}
                        <div className="card bg-dark-700 p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-400">
                                <p>Jika Anda memiliki posisi Gold, akan otomatis dikonversi ke USDC.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={isLoading || !withdrawAmount}
                            className="btn-primary btn-lg w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ArrowDownRight className="w-5 h-5" />
                                    Withdraw USDC
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function TradingSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-pulse">
            <div className="h-12 skeleton rounded-xl" />
            <div className="card p-6 h-80 skeleton" />
        </div>
    );
}
