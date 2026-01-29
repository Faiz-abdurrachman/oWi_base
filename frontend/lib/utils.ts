// ============================================
// oWi AI - Utility Functions
// ============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ============================================
// Classname Utilities
// ============================================

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// ============================================
// Number Formatting
// ============================================

/**
 * Format a number as USD currency
 */
export function formatUSD(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format a number as percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value / 100);
}

/**
 * Format gold amount (usually small numbers)
 */
export function formatGold(value: number): string {
    if (value < 0.0001) return "< 0.0001";
    if (value < 1) return value.toFixed(6);
    return value.toFixed(4);
}

/**
 * Compact number format (1.2K, 1.5M, etc.)
 */
export function formatCompact(value: number): string {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

// ============================================
// Address Formatting
// ============================================

/**
 * Truncate an address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
    if (!address) return "";
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// ============================================
// Time Formatting
// ============================================

/**
 * Format a timestamp as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

/**
 * Format a timestamp as date/time
 */
export function formatDateTime(timestamp: number): string {
    return new Date(timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ============================================
// Calculation Helpers
// ============================================

/**
 * Calculate percentage change between two values
 */
export function calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Calculate slippage amount
 */
export function calculateSlippage(
    amount: number,
    slippageBps: number
): number {
    return amount * (slippageBps / 10000);
}

/**
 * Apply slippage to get minimum output
 */
export function applySlippage(amount: number, slippageBps: number): number {
    return amount - calculateSlippage(amount, slippageBps);
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Validate a numeric input
 */
export function isValidNumber(value: string): boolean {
    if (!value) return false;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Parse a numeric input safely
 */
export function parseNumber(value: string): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
}

// ============================================
// Color Helpers
// ============================================

/**
 * Get color class based on value change
 */
export function getChangeColor(value: number): string {
    if (value > 0) return "text-success-400";
    if (value < 0) return "text-danger-400";
    return "text-slate-400";
}

/**
 * Get background color class based on value change
 */
export function getChangeBgColor(value: number): string {
    if (value > 0) return "bg-success-500/20";
    if (value < 0) return "bg-danger-500/20";
    return "bg-slate-500/20";
}

// ============================================
// Delay Helpers
// ============================================

/**
 * Wait for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================
// Constants
// ============================================

export const USDC_DECIMALS = 6;
export const GOLD_DECIMALS = 18;
export const PRICE_DECIMALS = 8;

export const MIN_DEPOSIT_USD = 10;
export const MAX_SLIPPAGE_BPS = 100; // 1%
export const DEFAULT_SLIPPAGE_BPS = 50; // 0.5%

export const EXPLORER_URL = "https://sepolia.basescan.org";

/**
 * Get transaction explorer URL
 */
export function getTxExplorerUrl(hash: string): string {
    return `${EXPLORER_URL}/tx/${hash}`;
}

/**
 * Get address explorer URL
 */
export function getAddressExplorerUrl(address: string): string {
    return `${EXPLORER_URL}/address/${address}`;
}
