"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    TrendingUp,
    PieChart,
    Settings,
    Wallet,
} from "lucide-react";
import { cn, truncateAddress } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

// ============================================
// Main App Layout
// ============================================

export default function MainLayout({ children }: { children: ReactNode }) {
    const { address, isConnected, isConnecting } = useAccount();
    const router = useRouter();

    // Redirect to home if not connected
    useEffect(() => {
        if (!isConnecting && !isConnected) {
            router.push("/");
        }
    }, [isConnected, isConnecting, router]);

    if (isConnecting) {
        return (
            <div className="min-h-screen bg-slate-850 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Connecting wallet...</p>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-dark flex flex-col">
            {/* Header */}
            <Header address={address} />

            {/* Main Content */}
            <main className="flex-1 pb-20">{children}</main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}

// ============================================
// Header Component
// ============================================

function Header({ address }: { address?: `0x${string}` }) {
    const openSettings = useAppStore((s) => s.openSettings);

    return (
        <header className="sticky top-0 z-40 glass-dark safe-top">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
                            <span className="text-navy-500 font-bold text-sm">oW</span>
                        </div>
                        <span className="font-bold text-white">oWi AI</span>
                    </div>

                    {/* Wallet */}
                    <button
                        onClick={openSettings}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        <Wallet className="w-4 h-4 text-gold-400" />
                        <span className="text-sm font-medium text-white">
                            {address ? truncateAddress(address) : "Connect"}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}

// ============================================
// Bottom Navigation
// ============================================

function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/trading", icon: TrendingUp, label: "Trading" },
        { href: "/portfolio", icon: PieChart, label: "Portfolio" },
        { href: "/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-slate-700/50 safe-bottom">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-around py-2">
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
                                        ? "text-gold-400"
                                        : "text-slate-400 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive && "glow-gold")} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
