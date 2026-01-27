import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan class names dengan clsx dan tailwind-merge
 * @param inputs - Class values yang akan digabung
 * @returns Class string yang sudah di-merge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format alamat wallet menjadi singkat
 * @param address - Alamat lengkap (0x...)
 * @param startChars - Jumlah karakter di awal (default: 6)
 * @param endChars - Jumlah karakter di akhir (default: 4)
 * @returns Alamat singkat (0x1234...5678)
 */
export function shortenAddress(
    address: string,
    startChars: number = 6,
    endChars: number = 4
): string {
    if (!address) return "";
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format angka sebagai currency
 * @param value - Nilai numerik
 * @param currency - Kode currency (default: USD)
 * @param decimals - Jumlah decimal places
 * @returns String terformat ($1,234.56)
 */
export function formatCurrency(
    value: number,
    currency: string = "USD",
    decimals: number = 2
): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format angka dengan thousands separator
 * @param value - Nilai numerik
 * @param decimals - Jumlah decimal places
 * @returns String terformat (1,234.56)
 */
export function formatNumber(value: number, decimals: number = 2): string {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Format persentase
 * @param value - Nilai dalam bentuk desimal (0.1234 = 12.34%)
 * @param decimals - Jumlah decimal places
 * @param includeSign - Tampilkan + untuk nilai positif
 * @returns String terformat (+12.34%)
 */
export function formatPercent(
    value: number,
    decimals: number = 2,
    includeSign: boolean = true
): string {
    const formatted = (value * 100).toFixed(decimals);
    const sign = includeSign && value > 0 ? "+" : "";
    return `${sign}${formatted}%`;
}

/**
 * Format token amount dengan decimals
 * @param amount - Raw amount (bigint atau string)
 * @param decimals - Token decimals
 * @param displayDecimals - Decimal places untuk display
 * @returns String terformat
 */
export function formatTokenAmount(
    amount: bigint | string,
    decimals: number,
    displayDecimals: number = 4
): string {
    const value = typeof amount === "string" ? BigInt(amount) : amount;
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;

    const fractionalStr = fractionalPart.toString().padStart(decimals, "0");
    const displayFractional = fractionalStr.slice(0, displayDecimals);

    return `${integerPart.toLocaleString()}.${displayFractional}`;
}

/**
 * Parse token amount dari user input
 * @param input - User input string
 * @param decimals - Token decimals
 * @returns BigInt amount
 */
export function parseTokenAmount(input: string, decimals: number): bigint {
    if (!input || isNaN(Number(input))) return 0n;

    const [integerPart, fractionalPart = ""] = input.split(".");
    const paddedFractional = fractionalPart.padEnd(decimals, "0").slice(0, decimals);

    return BigInt(integerPart + paddedFractional);
}

/**
 * Format timestamp ke waktu relatif
 * @param timestamp - Unix timestamp (seconds atau milliseconds)
 * @returns String relatif (2 jam yang lalu)
 */
export function formatRelativeTime(timestamp: number): string {
    // Konversi ke milliseconds jika perlu
    const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
    const diff = Date.now() - ms;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    return "Baru saja";
}

/**
 * Copy text ke clipboard
 * @param text - Text yang akan di-copy
 * @returns Promise<boolean> - Berhasil atau tidak
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

/**
 * Delay untuk async operations
 * @param ms - Milliseconds
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cek apakah berjalan di mobile
 */
export function isMobile(): boolean {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}
