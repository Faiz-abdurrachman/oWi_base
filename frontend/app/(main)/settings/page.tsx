"use client";

import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import {
    Shield,
    Bell,
    Sliders,
    LogOut,
    ChevronRight,
    ExternalLink,
    Github,
    Twitter,
} from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import { EXPLORER_URL, CHAIN_NAME, RISK_SETTINGS, type RiskTolerance } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Settings Page - Pengaturan akun dan preferensi
 */
export default function SettingsPage() {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);
    const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>("moderate");
    const [notifications, setNotifications] = useState({
        newSignals: true,
        tradeExecuted: true,
        priceAlerts: false,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <SettingsSkeleton />;
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white">Pengaturan</h1>

            {/* Account Section */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Akun</h2>

                <div className="space-y-4">
                    {/* Wallet Address */}
                    <div className="flex items-center justify-between py-3 border-b border-dark-700">
                        <div>
                            <p className="text-sm text-gray-400">Alamat Wallet</p>
                            <p className="font-mono text-white">
                                {shortenAddress(address || "", 10, 8)}
                            </p>
                        </div>
                        <a
                            href={`${EXPLORER_URL}/address/${address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-ghost btn-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Network */}
                    <div className="flex items-center justify-between py-3 border-b border-dark-700">
                        <div>
                            <p className="text-sm text-gray-400">Jaringan</p>
                            <p className="text-white">{CHAIN_NAME}</p>
                        </div>
                        <div className="badge-base">
                            <div className="w-2 h-2 rounded-full bg-base animate-pulse" />
                            Terhubung
                        </div>
                    </div>

                    {/* Disconnect */}
                    <button
                        onClick={() => disconnect()}
                        className="w-full flex items-center justify-between py-3 text-danger hover:bg-danger/10 rounded-lg px-3 -mx-3 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5" />
                            <span>Putuskan Wallet</span>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Risk Tolerance */}
            <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sliders className="w-5 h-5 text-gold-500" />
                    <h2 className="text-lg font-semibold text-white">Toleransi Risiko</h2>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                    Pilih tingkat risiko yang sesuai dengan preferensi Anda. Ini mempengaruhi
                    kapan AI akan merekomendasikan trading.
                </p>

                <div className="space-y-3">
                    {(Object.keys(RISK_SETTINGS) as RiskTolerance[]).map((key) => {
                        const setting = RISK_SETTINGS[key];
                        const isSelected = riskTolerance === key;

                        return (
                            <button
                                key={key}
                                onClick={() => setRiskTolerance(key)}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all",
                                    isSelected
                                        ? "border-gold-500 bg-gold-500/10"
                                        : "border-dark-600 hover:border-dark-500"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-white">{setting.label}</span>
                                    {isSelected && (
                                        <div className="w-2 h-2 rounded-full bg-gold-500" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-400">{setting.description}</p>
                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                    <span>Min confidence: {setting.minConfidence}%</span>
                                    <span>Max trade: {setting.maxTradePercent}%</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Notifications */}
            <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-gold-500" />
                    <h2 className="text-lg font-semibold text-white">Notifikasi</h2>
                </div>

                <div className="space-y-4">
                    {/* New Signals */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white">Sinyal Baru</p>
                            <p className="text-sm text-gray-400">
                                Notifikasi saat ada sinyal AI baru
                            </p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.newSignals}
                            onChange={(checked) =>
                                setNotifications({ ...notifications, newSignals: checked })
                            }
                        />
                    </div>

                    {/* Trade Executed */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white">Trade Dieksekusi</p>
                            <p className="text-sm text-gray-400">
                                Notifikasi saat trade selesai
                            </p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.tradeExecuted}
                            onChange={(checked) =>
                                setNotifications({ ...notifications, tradeExecuted: checked })
                            }
                        />
                    </div>

                    {/* Price Alerts */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white">Alert Harga</p>
                            <p className="text-sm text-gray-400">
                                Notifikasi perubahan harga signifikan
                            </p>
                        </div>
                        <ToggleSwitch
                            checked={notifications.priceAlerts}
                            onChange={(checked) =>
                                setNotifications({ ...notifications, priceAlerts: checked })
                            }
                        />
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-gold-500" />
                    <h2 className="text-lg font-semibold text-white">Tentang</h2>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Versi</span>
                        <span className="text-white">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Dibangun untuk</span>
                        <span className="text-white">Base Hackathon 2026</span>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary btn-sm flex-1"
                    >
                        <Github className="w-4 h-4" />
                        GitHub
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary btn-sm flex-1"
                    >
                        <Twitter className="w-4 h-4" />
                        Twitter
                    </a>
                </div>
            </div>
        </div>
    );
}

/**
 * Toggle Switch Component
 */
function ToggleSwitch({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className={cn(
                "w-12 h-6 rounded-full p-1 transition-colors",
                checked ? "bg-gold-500" : "bg-dark-600"
            )}
        >
            <div
                className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    checked ? "translate-x-6" : "translate-x-0"
                )}
            />
        </button>
    );
}

function SettingsSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-pulse">
            <div className="h-8 w-32 skeleton rounded" />
            <div className="card p-6 h-48 skeleton" />
            <div className="card p-6 h-64 skeleton" />
            <div className="card p-6 h-48 skeleton" />
        </div>
    );
}
