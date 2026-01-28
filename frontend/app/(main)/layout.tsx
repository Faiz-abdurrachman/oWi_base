"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import {
    LayoutDashboard,
    TrendingUp,
    PieChart,
    Settings,
    Shield,
    LogOut,
    Copy,
    ExternalLink
} from "lucide-react";
import { cn, shortenAddress, copyToClipboard } from "@/lib/utils";
import { EXPLORER_URL, CHAIN_NAME } from "@/lib/constants";
import { useState } from "react";

/**
 * Navigation items untuk bottom nav
 */
const navItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        href: "/trading",
        label: "Trading",
        icon: TrendingUp,
    },
    {
        href: "/portfolio",
        label: "Portfolio",
        icon: PieChart,
    },
    {
        href: "/settings",
        label: "Pengaturan",
        icon: Settings,
    },
];

/**
 * Main App Layout
 * Layout untuk halaman yang membutuhkan wallet connection
 */
export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    // Handle copy address
    const handleCopy = async () => {
        if (address) {
            await copyToClipboard(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Redirect ke landing jika tidak connected
    if (!isConnected) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
                <div className="card p-8 text-center max-w-md">
                    <Shield className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">
                        Wallet Tidak Terhubung
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Silakan hubungkan wallet Anda untuk mengakses aplikasi.
                    </p>
                    <Link href="/" className="btn-primary">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-dark-700 safe-top">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Shield className="w-7 h-7 text-gold-500" />
                        <span className="font-bold text-white text-lg">oWi</span>
                    </Link>

                    {/* Wallet Info */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 transition-colors"
                        >
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="text-sm font-medium text-white">
                                {shortenAddress(address || "")}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 card p-2 z-50 animate-fade-up">
                                    {/* Network Badge */}
                                    <div className="px-3 py-2 mb-2">
                                        <div className="badge-base">
                                            <div className="w-2 h-2 rounded-full bg-base" />
                                            {CHAIN_NAME}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="px-3 py-2 text-sm text-gray-400 font-mono">
                                        {shortenAddress(address || "", 10, 8)}
                                    </div>

                                    <div className="border-t border-dark-600 my-2" />

                                    {/* Copy Address */}
                                    <button
                                        onClick={handleCopy}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                        {copied ? "Tersalin!" : "Salin Alamat"}
                                    </button>

                                    {/* View on Explorer */}
                                    <a
                                        href={`${EXPLORER_URL}/address/${address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Lihat di Explorer
                                    </a>

                                    <div className="border-t border-dark-600 my-2" />

                                    {/* Disconnect */}
                                    <button
                                        onClick={() => {
                                            disconnect();
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Putuskan Koneksi
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="px-4 py-6">{children}</main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-dark-700 safe-bottom">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                                    isActive
                                        ? "text-gold-500 bg-gold-500/10"
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
