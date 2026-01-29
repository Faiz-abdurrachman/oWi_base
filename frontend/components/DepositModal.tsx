"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, AlertCircle, Wallet } from "lucide-react";
import { useDeposit, useTokenBalances, useTokenAllowance, useApproveToken, useContracts } from "@/lib/hooks";
import { formatUSD, isValidNumber, parseNumber, cn, MIN_DEPOSIT_USD } from "@/lib/utils";
import { parseUnits } from "viem";

// ============================================
// Deposit Modal
// ============================================

interface DepositModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "approve" | "deposit" | "success">("input");

    const contracts = useContracts();
    const { usdc: usdcBalance, refetch: refetchBalances } = useTokenBalances();
    const { allowance, refetch: refetchAllowance } = useTokenAllowance(contracts.usdc);
    const { approve, isPending: approving, isSuccess: approveSuccess } = useApproveToken();
    const { deposit, isPending, isConfirming, isSuccess, error, reset } = useDeposit();

    const amountNum = parseNumber(amount);
    const amountWei = amount ? parseUnits(amount, 6) : BigInt(0);
    const needsApproval = amountWei > allowance;

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setAmount("");
            setStep("input");
            reset();
        }
    }, [isOpen, reset]);

    // Handle approval success
    useEffect(() => {
        if (approveSuccess) {
            refetchAllowance();
            setStep("deposit");
        }
    }, [approveSuccess, refetchAllowance]);

    // Handle deposit success
    useEffect(() => {
        if (isSuccess) {
            setStep("success");
            refetchBalances();
        }
    }, [isSuccess, refetchBalances]);

    const handleSubmit = async () => {
        if (!isValidNumber(amount) || amountNum < MIN_DEPOSIT_USD) return;

        if (needsApproval) {
            setStep("approve");
            await approve(contracts.usdc, amount, 6);
        } else {
            setStep("deposit");
            await deposit(amount);
        }
    };

    const handleDeposit = async () => {
        await deposit(amount);
    };

    const handleClose = () => {
        if (!isPending && !isConfirming && !approving) {
            onClose();
        }
    };

    const quickAmounts = [50, 100, 500, 1000];
    const isValid = isValidNumber(amount) && amountNum >= MIN_DEPOSIT_USD && amountNum <= usdcBalance;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative w-full sm:max-w-md bg-slate-850 rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up safe-bottom">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Deposit USDC</h2>
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
                            <span className="text-sm text-slate-400">Available Balance</span>
                            <span className="text-sm font-medium text-white">
                                {formatUSD(usdcBalance)}
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
                                    onClick={() => setAmount(usdcBalance.toString())}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gold-400 hover:text-gold-300 font-medium"
                                >
                                    MAX
                                </button>
                            </div>
                            {amountNum > 0 && amountNum < MIN_DEPOSIT_USD && (
                                <p className="text-sm text-danger-400 mt-2">
                                    Minimum deposit is {formatUSD(MIN_DEPOSIT_USD)}
                                </p>
                            )}
                        </div>

                        {/* Quick Amounts */}
                        <div className="flex gap-2 mb-6">
                            {quickAmounts.map((qa) => (
                                <button
                                    key={qa}
                                    onClick={() => setAmount(qa.toString())}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                                        amount === qa.toString()
                                            ? "bg-gold-500 text-navy-500"
                                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    )}
                                >
                                    ${qa}
                                </button>
                            ))}
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className="w-full btn-primary py-4 text-lg font-semibold"
                        >
                            {needsApproval ? "Approve & Deposit" : "Deposit"}
                        </button>
                    </>
                )}

                {step === "approve" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                            <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Approving USDC
                        </h3>
                        <p className="text-slate-400">
                            Please confirm the approval in your wallet
                        </p>
                    </div>
                )}

                {step === "deposit" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                            {isPending || isConfirming ? (
                                <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
                            ) : (
                                <Wallet className="w-8 h-8 text-gold-400" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {isPending ? "Confirm in Wallet" : isConfirming ? "Processing..." : "Deposit"}
                        </h3>
                        <p className="text-slate-400">
                            {isPending
                                ? "Please confirm the transaction"
                                : isConfirming
                                    ? "Waiting for confirmation..."
                                    : "Ready to deposit"}
                        </p>
                        {!isPending && !isConfirming && (
                            <button
                                onClick={handleDeposit}
                                className="btn-primary mt-4 px-8"
                            >
                                Deposit {formatUSD(amountNum)}
                            </button>
                        )}
                    </div>
                )}

                {step === "success" && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-success-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Deposit Successful!
                        </h3>
                        <p className="text-slate-400 mb-4">
                            {formatUSD(amountNum)} has been added to your vault
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
