"use client";

import { useState } from "react";
import {
    Sparkles,
    TrendingUp,
    TrendingDown,
    Minus,
    Lock,
    Unlock,
    ArrowRightLeft,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { useGoldPrice, usePortfolioBreakdown, useTrade, usePreviewBuyGold, usePreviewSellGold } from "@/lib/hooks";
import { useAppStore, AISignal } from "@/lib/store";
import { formatUSD, formatGold, formatNumber, cn, isValidNumber } from "@/lib/utils";

// ============================================
// Trading Page
// ============================================

export default function TradingPage() {
    const { price: goldPrice, isLoading: priceLoading } = useGoldPrice();
    const { breakdown } = usePortfolioBreakdown();

    // Mock price change
    const priceChange24h = 1.25;

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Gold Price Header */}
            <section className="card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Gold Price</p>
                        {priceLoading ? (
                            <div className="h-8 w-32 skeleton rounded" />
                        ) : (
                            <h1 className="text-2xl font-bold text-white">
                                {formatUSD(goldPrice)}
                            </h1>
                        )}
                        <div
                            className={cn(
                                "flex items-center gap-1 text-sm mt-1",
                                priceChange24h >= 0 ? "text-success-400" : "text-danger-400"
                            )}
                        >
                            {priceChange24h >= 0 ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : (
                                <TrendingDown className="w-4 h-4" />
                            )}
                            {priceChange24h >= 0 ? "+" : ""}{priceChange24h.toFixed(2)}% (24h)
                        </div>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-gold-400" />
                    </div>
                </div>
            </section>

            {/* AI Signal Card */}
            <AISignalCard goldPrice={goldPrice} />

            {/* Manual Trade Form */}
            <TradeForm
                goldPrice={goldPrice}
                usdcBalance={breakdown ? Number(breakdown.usdcAmount) / 1e6 : 0}
                goldBalance={breakdown ? Number(breakdown.goldAmount) / 1e18 : 0}
            />

            {/* Current Position */}
            <section className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Your Position</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-slate-800/50">
                        <p className="text-xs text-slate-400 mb-1">USDC Balance</p>
                        <p className="text-lg font-semibold text-white">
                            {breakdown ? formatUSD(Number(breakdown.usdcAmount) / 1e6) : "$0.00"}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50">
                        <p className="text-xs text-slate-400 mb-1">Gold Balance</p>
                        <p className="text-lg font-semibold text-white">
                            {breakdown ? formatGold(Number(breakdown.goldAmount) / 1e18) : "0"}
                            <span className="text-sm text-slate-400 ml-1">XAU</span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ============================================
// AI Signal Card
// ============================================

function AISignalCard({ goldPrice }: { goldPrice: number }) {
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [signal, setSignal] = useState<AISignal | null>(null);
    const { currentSignal, setCurrentSignal } = useAppStore();

    const handleUnlock = async () => {
        setIsUnlocking(true);

        // Simulate API call and x402 payment
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock signal
        const mockSignal: AISignal = {
            action: "BUY_GOLD",
            confidence: 78,
            reasoning: "Gold prices are showing upward momentum due to increased inflation concerns. The current dip presents a good entry point with a favorable risk-reward ratio.",
            suggestedAmount: 100,
            goldPrice: goldPrice,
            timestamp: Date.now(),
            paid: true,
        };

        setSignal(mockSignal);
        setCurrentSignal(mockSignal);
        setIsUnlocking(false);
    };

    if (signal) {
        return (
            <section className="card border-gold-500/30">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-gold-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-white">AI Signal</h3>
                        <p className="text-xs text-slate-400">Just now</p>
                    </div>
                    <div
                        className={cn(
                            "px-3 py-1 rounded-full text-sm font-semibold",
                            signal.action === "BUY_GOLD"
                                ? "bg-success-500/20 text-success-400"
                                : signal.action === "SELL_GOLD"
                                    ? "bg-danger-500/20 text-danger-400"
                                    : "bg-slate-500/20 text-slate-400"
                        )}
                    >
                        {signal.action.replace("_", " ")}
                    </div>
                </div>

                {/* Confidence */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Confidence</span>
                        <span className="text-sm font-semibold text-white">
                            {signal.confidence}%
                        </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full",
                                signal.confidence >= 70
                                    ? "bg-success-500"
                                    : signal.confidence >= 50
                                        ? "bg-warning-500"
                                        : "bg-danger-500"
                            )}
                            style={{ width: `${signal.confidence}%` }}
                        />
                    </div>
                </div>

                {/* Reasoning */}
                <div className="p-3 rounded-xl bg-slate-800/50 mb-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {signal.reasoning}
                    </p>
                </div>

                {/* Suggested Amount */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gold-500/10 mb-4">
                    <span className="text-sm text-slate-300">Suggested Amount</span>
                    <span className="font-semibold text-gold-400">
                        {formatUSD(signal.suggestedAmount)}
                    </span>
                </div>

                <button
                    className={cn(
                        "w-full btn py-3 font-semibold",
                        signal.action === "BUY_GOLD"
                            ? "bg-success-500 text-white hover:bg-success-600"
                            : signal.action === "SELL_GOLD"
                                ? "bg-danger-500 text-white hover:bg-danger-600"
                                : "btn-secondary"
                    )}
                >
                    Execute Signal
                </button>
            </section>
        );
    }

    return (
        <section className="card border-slate-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">AI Trading Signal</h3>
                    <p className="text-xs text-slate-400">Unlock for $0.01</p>
                </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 mb-4 blur-sm select-none">
                <p className="text-slate-400">
                    Buy Gold with 85% confidence based on current market conditions...
                </p>
            </div>

            <button
                onClick={handleUnlock}
                disabled={isUnlocking}
                className="w-full btn-primary py-3"
            >
                {isUnlocking ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Unlock className="w-4 h-4" />
                        Unlock Signal ($0.01)
                    </>
                )}
            </button>
        </section>
    );
}

// ============================================
// Trade Form
// ============================================

function TradeForm({
    goldPrice,
    usdcBalance,
    goldBalance,
}: {
    goldPrice: number;
    usdcBalance: number;
    goldBalance: number;
}) {
    const [isBuying, setIsBuying] = useState(true);
    const [amount, setAmount] = useState("");
    const { trade, isPending, isConfirming, isSuccess, error, reset } = useTrade();

    const { goldAmount: previewGold } = usePreviewBuyGold(isBuying ? amount : "0");
    const { usdcAmount: previewUsdc } = usePreviewSellGold(!isBuying ? amount : "0");

    const maxAmount = isBuying ? usdcBalance : goldBalance;
    const outputAmount = isBuying ? previewGold : previewUsdc;
    const outputLabel = isBuying ? "XAU" : "USDC";
    const inputLabel = isBuying ? "USDC" : "XAU";

    const handleTrade = async () => {
        if (!isValidNumber(amount)) return;
        await trade(isBuying, amount);
    };

    const handleMax = () => {
        setAmount(maxAmount.toString());
    };

    const isValid = isValidNumber(amount) && parseFloat(amount) <= maxAmount;

    return (
        <section className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Manual Trade</h3>

            {/* Buy/Sell Toggle */}
            <div className="flex p-1 rounded-xl bg-slate-800 mb-4">
                <button
                    onClick={() => {
                        setIsBuying(true);
                        setAmount("");
                        reset();
                    }}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
                        isBuying
                            ? "bg-success-500 text-white"
                            : "text-slate-400 hover:text-white"
                    )}
                >
                    Buy Gold
                </button>
                <button
                    onClick={() => {
                        setIsBuying(false);
                        setAmount("");
                        reset();
                    }}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
                        !isBuying
                            ? "bg-danger-500 text-white"
                            : "text-slate-400 hover:text-white"
                    )}
                >
                    Sell Gold
                </button>
            </div>

            {/* Input */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-slate-400">
                        {isBuying ? "You Pay" : "You Sell"}
                    </label>
                    <button
                        onClick={handleMax}
                        className="text-xs text-gold-400 hover:text-gold-300"
                    >
                        Max: {isBuying ? formatNumber(maxAmount) : formatGold(maxAmount)}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="input pr-16 text-lg font-semibold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        {inputLabel}
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center my-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* Output Preview */}
            <div className="mb-4">
                <label className="text-sm text-slate-400 mb-2 block">
                    You Receive (estimated)
                </label>
                <div className="p-4 rounded-xl bg-slate-800/50">
                    <span className="text-lg font-semibold text-white">
                        {isBuying ? formatGold(outputAmount) : formatNumber(outputAmount)}
                    </span>
                    <span className="text-slate-400 ml-2">{outputLabel}</span>
                </div>
            </div>

            {/* Trade Button */}
            <button
                onClick={handleTrade}
                disabled={!isValid || isPending || isConfirming}
                className={cn(
                    "w-full btn py-3 font-semibold",
                    isBuying
                        ? "bg-success-500 text-white hover:bg-success-600 disabled:bg-success-500/50"
                        : "bg-danger-500 text-white hover:bg-danger-600 disabled:bg-danger-500/50"
                )}
            >
                {isPending || isConfirming ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isPending ? "Confirm in wallet..." : "Processing..."}
                    </>
                ) : isSuccess ? (
                    <>
                        <CheckCircle className="w-4 h-4" />
                        Trade Successful!
                    </>
                ) : (
                    <>
                        {isBuying ? "Buy Gold" : "Sell Gold"}
                    </>
                )}
            </button>

            {/* Error */}
            {error && (
                <div className="mt-3 p-3 rounded-xl bg-danger-500/10 flex items-center gap-2 text-danger-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error.message || "Transaction failed"}
                </div>
            )}
        </section>
    );
}
