"use client";

import { useAccount, useDisconnect } from "wagmi";
import {
    Settings as SettingsIcon,
    User,
    Shield,
    Bell,
    Sliders,
    ExternalLink,
    LogOut,
    ChevronRight,
    Copy,
    Check,
} from "lucide-react";
import { useState } from "react";
import { useAppStore, RiskTolerance } from "@/lib/store";
import { truncateAddress, getAddressExplorerUrl, cn } from "@/lib/utils";

// ============================================
// Settings Page
// ============================================

export default function SettingsPage() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { settings, updateSettings } = useAppStore();
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDisconnect = () => {
        disconnect();
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <section className="card">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center">
                        <User className="w-7 h-7 text-navy-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-slate-400">Connected Wallet</p>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-white font-mono">
                                {address ? truncateAddress(address, 6) : "Not connected"}
                            </p>
                            <button
                                onClick={handleCopyAddress}
                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-success-400" />
                                ) : (
                                    <Copy className="w-4 h-4 text-slate-400" />
                                )}
                            </button>
                        </div>
                    </div>
                    {address && (
                        <a
                            href={getAddressExplorerUrl(address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <ExternalLink className="w-5 h-5 text-slate-400" />
                        </a>
                    )}
                </div>
            </section>

            {/* Risk Tolerance */}
            <section className="card">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-gold-400" />
                    <h3 className="font-semibold text-white">Risk Tolerance</h3>
                </div>

                <div className="space-y-2">
                    <RiskOption
                        value="conservative"
                        label="Conservative"
                        description="Only trade on strong signals (>80% confidence)"
                        selected={settings.riskTolerance === "conservative"}
                        onSelect={() => updateSettings({ riskTolerance: "conservative" })}
                    />
                    <RiskOption
                        value="moderate"
                        label="Moderate"
                        description="Balanced approach (>60% confidence)"
                        selected={settings.riskTolerance === "moderate"}
                        onSelect={() => updateSettings({ riskTolerance: "moderate" })}
                    />
                    <RiskOption
                        value="aggressive"
                        label="Aggressive"
                        description="Active trading (>50% confidence)"
                        selected={settings.riskTolerance === "aggressive"}
                        onSelect={() => updateSettings({ riskTolerance: "aggressive" })}
                    />
                </div>
            </section>

            {/* Slippage */}
            <section className="card">
                <div className="flex items-center gap-3 mb-4">
                    <Sliders className="w-5 h-5 text-gold-400" />
                    <h3 className="font-semibold text-white">Slippage Tolerance</h3>
                </div>

                <div className="flex gap-2">
                    {[25, 50, 100].map((bps) => (
                        <button
                            key={bps}
                            onClick={() => updateSettings({ slippageBps: bps })}
                            className={cn(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                                settings.slippageBps === bps
                                    ? "bg-gold-500 text-navy-500"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            )}
                        >
                            {bps / 100}%
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Maximum price difference allowed when trading
                </p>
            </section>

            {/* Notifications */}
            <section className="card">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gold-400" />
                        <div>
                            <h3 className="font-semibold text-white">Notifications</h3>
                            <p className="text-xs text-slate-400">
                                Get alerts for new AI signals
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() =>
                            updateSettings({ notifications: !settings.notifications })
                        }
                        className={cn(
                            "w-12 h-6 rounded-full transition-colors",
                            settings.notifications ? "bg-gold-500" : "bg-slate-700"
                        )}
                    >
                        <div
                            className={cn(
                                "w-5 h-5 rounded-full bg-white shadow transition-transform",
                                settings.notifications ? "translate-x-6" : "translate-x-0.5"
                            )}
                        />
                    </button>
                </div>
            </section>

            {/* Auto Trade */}
            <section className="card">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SettingsIcon className="w-5 h-5 text-gold-400" />
                        <div>
                            <h3 className="font-semibold text-white">Auto Trade</h3>
                            <p className="text-xs text-slate-400">
                                Automatically execute AI signals
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => updateSettings({ autoTrade: !settings.autoTrade })}
                        className={cn(
                            "w-12 h-6 rounded-full transition-colors",
                            settings.autoTrade ? "bg-gold-500" : "bg-slate-700"
                        )}
                    >
                        <div
                            className={cn(
                                "w-5 h-5 rounded-full bg-white shadow transition-transform",
                                settings.autoTrade ? "translate-x-6" : "translate-x-0.5"
                            )}
                        />
                    </button>
                </div>
            </section>

            {/* Info Links */}
            <section className="card space-y-1">
                <SettingsLink label="Documentation" href="#" />
                <SettingsLink label="Privacy Policy" href="#" />
                <SettingsLink label="Terms of Service" href="#" />
                <SettingsLink label="GitHub" href="https://github.com" external />
            </section>

            {/* Disconnect */}
            <button
                onClick={handleDisconnect}
                className="w-full btn-danger py-3"
            >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
            </button>

            {/* Version */}
            <p className="text-center text-xs text-slate-500">
                oWi AI v1.0.0 • Built for Base Hackathon 2026
            </p>
        </div>
    );
}

// ============================================
// Risk Option Component
// ============================================

function RiskOption({
    value,
    label,
    description,
    selected,
    onSelect,
}: {
    value: RiskTolerance;
    label: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full p-3 rounded-xl text-left transition-all",
                selected
                    ? "bg-gold-500/10 border border-gold-500/30"
                    : "bg-slate-800/50 border border-transparent hover:border-slate-700"
            )}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-white">{label}</p>
                    <p className="text-xs text-slate-400">{description}</p>
                </div>
                <div
                    className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        selected
                            ? "border-gold-500 bg-gold-500"
                            : "border-slate-600"
                    )}
                >
                    {selected && <div className="w-2 h-2 rounded-full bg-navy-500" />}
                </div>
            </div>
        </button>
    );
}

// ============================================
// Settings Link Component
// ============================================

function SettingsLink({
    label,
    href,
    external = false,
}: {
    label: string;
    href: string;
    external?: boolean;
}) {
    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="flex items-center justify-between py-3 hover:bg-slate-800/50 -mx-4 px-4 rounded-lg transition-colors"
        >
            <span className="text-white">{label}</span>
            {external ? (
                <ExternalLink className="w-4 h-4 text-slate-400" />
            ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
        </a>
    );
}
