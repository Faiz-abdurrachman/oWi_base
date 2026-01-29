// ============================================
// oWi AI - Zustand Store
// ============================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================
// Types
// ============================================

export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export interface AISignal {
    action: "BUY_GOLD" | "SELL_GOLD" | "HOLD";
    confidence: number;
    reasoning: string;
    suggestedAmount: number;
    goldPrice: number;
    timestamp: number;
    paid: boolean;
}

export interface UserSettings {
    riskTolerance: RiskTolerance;
    slippageBps: number;
    autoTrade: boolean;
    notifications: boolean;
}

export interface Transaction {
    id: string;
    type: "deposit" | "withdraw" | "buy" | "sell";
    amount: string;
    amountOut?: string;
    hash: string;
    status: "pending" | "confirmed" | "failed";
    timestamp: number;
}

// ============================================
// Store State
// ============================================

interface AppState {
    // UI State
    isDepositModalOpen: boolean;
    isWithdrawModalOpen: boolean;
    isTradeModalOpen: boolean;
    isSettingsOpen: boolean;

    // AI Signal
    currentSignal: AISignal | null;
    signalHistory: AISignal[];

    // Transactions
    pendingTx: Transaction | null;
    transactions: Transaction[];

    // User Settings
    settings: UserSettings;

    // Actions - UI
    openDepositModal: () => void;
    closeDepositModal: () => void;
    openWithdrawModal: () => void;
    closeWithdrawModal: () => void;
    openTradeModal: () => void;
    closeTradeModal: () => void;
    openSettings: () => void;
    closeSettings: () => void;

    // Actions - Signal
    setCurrentSignal: (signal: AISignal | null) => void;
    addSignalToHistory: (signal: AISignal) => void;
    clearSignals: () => void;

    // Actions - Transactions
    setPendingTx: (tx: Transaction | null) => void;
    addTransaction: (tx: Transaction) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;

    // Actions - Settings
    updateSettings: (updates: Partial<UserSettings>) => void;
    resetSettings: () => void;
}

// ============================================
// Default Values
// ============================================

const defaultSettings: UserSettings = {
    riskTolerance: "moderate",
    slippageBps: 50, // 0.5%
    autoTrade: false,
    notifications: true,
};

// ============================================
// Store Implementation
// ============================================

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            isDepositModalOpen: false,
            isWithdrawModalOpen: false,
            isTradeModalOpen: false,
            isSettingsOpen: false,
            currentSignal: null,
            signalHistory: [],
            pendingTx: null,
            transactions: [],
            settings: defaultSettings,

            // UI Actions
            openDepositModal: () => set({ isDepositModalOpen: true }),
            closeDepositModal: () => set({ isDepositModalOpen: false }),
            openWithdrawModal: () => set({ isWithdrawModalOpen: true }),
            closeWithdrawModal: () => set({ isWithdrawModalOpen: false }),
            openTradeModal: () => set({ isTradeModalOpen: true }),
            closeTradeModal: () => set({ isTradeModalOpen: false }),
            openSettings: () => set({ isSettingsOpen: true }),
            closeSettings: () => set({ isSettingsOpen: false }),

            // Signal Actions
            setCurrentSignal: (signal) => set({ currentSignal: signal }),
            addSignalToHistory: (signal) =>
                set((state) => ({
                    signalHistory: [signal, ...state.signalHistory].slice(0, 50), // Keep last 50
                })),
            clearSignals: () => set({ currentSignal: null, signalHistory: [] }),

            // Transaction Actions
            setPendingTx: (tx) => set({ pendingTx: tx }),
            addTransaction: (tx) =>
                set((state) => ({
                    transactions: [tx, ...state.transactions].slice(0, 100), // Keep last 100
                    pendingTx: null,
                })),
            updateTransaction: (id, updates) =>
                set((state) => ({
                    transactions: state.transactions.map((tx) =>
                        tx.id === id ? { ...tx, ...updates } : tx
                    ),
                })),

            // Settings Actions
            updateSettings: (updates) =>
                set((state) => ({
                    settings: { ...state.settings, ...updates },
                })),
            resetSettings: () => set({ settings: defaultSettings }),
        }),
        {
            name: "owi-storage",
            partialize: (state) => ({
                signalHistory: state.signalHistory,
                transactions: state.transactions,
                settings: state.settings,
            }),
        }
    )
);

// ============================================
// Selectors
// ============================================

export const selectSettings = (state: AppState) => state.settings;
export const selectCurrentSignal = (state: AppState) => state.currentSignal;
export const selectTransactions = (state: AppState) => state.transactions;
export const selectPendingTx = (state: AppState) => state.pendingTx;
