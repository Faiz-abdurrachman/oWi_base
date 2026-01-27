import { baseSepolia, base } from "wagmi/chains";

// ============================================
// CHAIN CONFIGURATION
// ============================================

/**
 * Chain ID yang digunakan (dari environment atau default ke Base Sepolia)
 */
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 84532;

/**
 * Chain yang aktif
 */
export const ACTIVE_CHAIN = CHAIN_ID === 8453 ? base : baseSepolia;

/**
 * Nama chain untuk display
 */
export const CHAIN_NAME = CHAIN_ID === 8453 ? "Base" : "Base Sepolia";

/**
 * Block explorer URL
 */
export const EXPLORER_URL =
    CHAIN_ID === 8453
        ? "https://basescan.org"
        : "https://sepolia.basescan.org";

// ============================================
// CONTRACT ADDRESSES
// ============================================

/**
 * Alamat contract yang sudah di-deploy
 */
export const CONTRACTS = {
    vault: process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000",
    usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x0000000000000000000000000000000000000000",
    gold: process.env.NEXT_PUBLIC_GOLD_ADDRESS || "0x0000000000000000000000000000000000000000",
} as const;

// ============================================
// TOKEN CONFIGURATION
// ============================================

/**
 * Konfigurasi token USDC
 */
export const USDC_CONFIG = {
    address: CONTRACTS.usdc,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    icon: "/tokens/usdc.svg",
} as const;

/**
 * Konfigurasi token Gold
 */
export const GOLD_CONFIG = {
    address: CONTRACTS.gold,
    symbol: "XAU",
    name: "Gold Token",
    decimals: 18,
    icon: "/tokens/gold.svg",
} as const;

// ============================================
// TRADING CONFIGURATION
// ============================================

/**
 * Slippage tolerance default (0.5%)
 */
export const DEFAULT_SLIPPAGE = 0.5;

/**
 * Minimum deposit amount (1 USDC)
 */
export const MIN_DEPOSIT = 1;

/**
 * Minimum trade amount (0.1 USDC)
 */
export const MIN_TRADE = 0.1;

/**
 * Gas buffer multiplier
 */
export const GAS_BUFFER = 1.2;

// ============================================
// API CONFIGURATION
// ============================================

/**
 * Backend API URL
 */
export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
    // Auth
    authNonce: `${API_URL}/auth/nonce`,
    authVerify: `${API_URL}/auth/verify`,
    authRefresh: `${API_URL}/auth/refresh`,

    // Signals
    signals: `${API_URL}/api/signals`,
    signalsHistory: `${API_URL}/api/signals/history`,
    signalsLatest: `${API_URL}/api/signals/latest`,

    // Portfolio
    portfolio: `${API_URL}/api/portfolio`,
    portfolioHistory: `${API_URL}/api/portfolio/history`,

    // Trades
    trades: `${API_URL}/api/trades`,

    // Analytics
    analytics: `${API_URL}/api/analytics/performance`,
} as const;

// ============================================
// AI SIGNAL CONFIGURATION
// ============================================

/**
 * Harga per sinyal AI (dalam USDC)
 */
export const SIGNAL_PRICE = 0.01;

/**
 * Cache duration untuk sinyal (15 menit)
 */
export const SIGNAL_CACHE_DURATION = 15 * 60 * 1000;

/**
 * Confidence thresholds
 */
export const CONFIDENCE_THRESHOLDS = {
    high: 80,    // Sinyal kuat
    medium: 60,  // Sinyal moderat
    low: 40,     // Sinyal lemah
} as const;

// ============================================
// UI CONFIGURATION
// ============================================

/**
 * Refresh intervals (milliseconds)
 */
export const REFRESH_INTERVALS = {
    portfolio: 30000,    // 30 detik
    goldPrice: 60000,    // 1 menit
    trades: 10000,       // 10 detik
} as const;

/**
 * Toast durations (milliseconds)
 */
export const TOAST_DURATION = {
    success: 3000,
    error: 5000,
    info: 4000,
} as const;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATION = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

// ============================================
// RISK SETTINGS
// ============================================

/**
 * Pengaturan risk tolerance
 */
export const RISK_SETTINGS = {
    conservative: {
        label: "Konservatif",
        description: "Hanya trade pada sinyal kuat (>80% confidence)",
        minConfidence: 80,
        maxTradePercent: 20,
    },
    moderate: {
        label: "Moderat",
        description: "Balance antara growth dan stability",
        minConfidence: 60,
        maxTradePercent: 40,
    },
    aggressive: {
        label: "Agresif",
        description: "Trading aktif untuk maximize returns",
        minConfidence: 50,
        maxTradePercent: 60,
    },
} as const;

export type RiskTolerance = keyof typeof RISK_SETTINGS;
