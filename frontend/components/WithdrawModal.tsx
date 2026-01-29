"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useWithdraw, usePortfolioBreakdown } from "@/lib/hooks";
import { formatUSD, isValidNumber, parseNumber, cn } from "@/lib/utils";

// ============================================
// Withdraw Modal
// ============================================

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "confirm" | "success">("input");

    const { breakdown, refetch } = usePortfolioBreakdown();
    const { withdraw, isPending, isConfirming, isSuccess, error, reset } = useWithdraw();

    // Available balance (USDC + Gold value)
    const totalValue = breakdown ? Number(breakdown.totalValue) / 1e6 : 0;
    const amountNum = parseNumber(amount);

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setAmount("");
            setStep("input");
            reset();
        }
    }, [isOpen, reset]);

    // Handle success
    useEffect(() => {
        if (isSuccess) {
            setStep("success");
            refetch();
        }
    }, [isSuccess, refetch]);

    const handleSubmit = async () => {
        if (!isValidNumber(amount) || amountNum > totalValue) return;
        setStep("confirm");
        await withdraw(amount);
    };

    const handleClose = () => {
        if (!isPending && !isConfirming) {
            onClose();
        }
    };

    const percentages = [25, 50, 75, 100];
    const isValid = isValidNumber(amount) && amountNum > 0 && amountNum <= totalValue;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative w-full sm:max-w-md bg-slate-850 rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up safe-bottom">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Withdraw</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                {step === "input" && (
                    <>
                        {/* Balance */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-slate-400">Available to Withdraw</span>
                            <span className="text-sm font-medium text-white">
                                {formatUSD(totalValue)}
                            </span>
                        </div>

                        {/* Input */}
                        <div className="mb-4">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="input pl-10 pr-20 text-2xl font-bold h-16"
                                />
                                <button
                                    onClick={() => setAmount(totalValue.toString())}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gold-400 hover:text-gold-300 font-medium"
                                >
                                    MAX
                                </button>
                            </div>
                            {amountNum > totalValue && (
                                <p className="text-sm text-danger-400 mt-2">
                                    Exceeds available balance
                                </p>
                            )}
                        </div>

                        {/* Percentage Buttons */}
                        <div className="flex gap-2 mb-6">
                            {percentages.map((pct) => (
                                <button
                                    key={pct}
                                    onClick={() => setAmount(((totalValue * pct) / 100).toFixed(2))}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                                        "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    )}
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>

                        {/* Info Note */}
                        {breakdown && Number(breakdown.goldAmount) > 0 && (
                            <div className="p-3 rounded-xl bg-slate-800/50 mb-4 text-sm text-slate-300">
                                <p>
                                    💡 If you don't have enough USDC, your gold will be
                                    automatically converted.
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className="w-full btn-primary py-4 text-lg font-semibold"
                        >
                            Withdraw
                        </button>
                    </>
                )}

                {step === "confirm" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {isPending ? "Confirm in Wallet" : "Processing..."}
                        </h3>
                        <p className="text-slate-400">
                            {isPending
                                ? "Please confirm the transaction"
                                : "Waiting for confirmation..."}
                        </p>
                    </div>
                )}

                {step === "success" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-success-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Withdrawal Successful!
                        </h3>
                        <p className="text-slate-400 mb-4">
                            {formatUSD(amountNum)} has been sent to your wallet
                        </p>
                        <button onClick={onClose} className="btn-primary px-8">
                            Done
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-danger-500/10 flex items-center gap-2 text-danger-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error.message || "Transaction failed"}
                    </div>
                )}
            </div>
        </div>
    );
}
