// ============================================
// oWi AI - Contract Configuration
// ============================================

import { Address } from "viem";

// ============================================
// Contract Addresses by Network
// ============================================

export const CONTRACTS = {
    // Base Sepolia (Testnet)
    84532: {
        vault: (process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000") as Address,
        usdc: (process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x0000000000000000000000000000000000000000") as Address,
        gold: (process.env.NEXT_PUBLIC_GOLD_ADDRESS || "0x0000000000000000000000000000000000000000") as Address,
        oracle: (process.env.NEXT_PUBLIC_ORACLE_ADDRESS || "0x0000000000000000000000000000000000000000") as Address,
    },
    // Base Mainnet
    8453: {
        vault: "0x0000000000000000000000000000000000000000" as Address,
        usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as Address, // Real USDC on Base
        gold: "0x0000000000000000000000000000000000000000" as Address,
        oracle: "0x0000000000000000000000000000000000000000" as Address,
    },
} as const;

// ============================================
// Get Contracts for Current Chain
// ============================================

export function getContracts(chainId: number) {
    return CONTRACTS[chainId as keyof typeof CONTRACTS] || CONTRACTS[84532];
}

// ============================================
// oWiVault ABI
// ============================================

export const VAULT_ABI = [
    // Read Functions
    {
        inputs: [{ name: "user", type: "address" }],
        name: "getUserPosition",
        outputs: [
            {
                components: [
                    { name: "usdcAmount", type: "uint256" },
                    { name: "goldAmount", type: "uint256" },
                    { name: "totalDeposited", type: "uint256" },
                    { name: "totalWithdrawn", type: "uint256" },
                    { name: "lastTradeTime", type: "uint256" },
                    { name: "tradeCount", type: "uint256" },
                ],
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "user", type: "address" }],
        name: "getPortfolioValue",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "user", type: "address" }],
        name: "getPortfolioBreakdown",
        outputs: [
            { name: "usdcAmount", type: "uint256" },
            { name: "goldAmount", type: "uint256" },
            { name: "goldValueInUsdc", type: "uint256" },
            { name: "totalValue", type: "uint256" },
            { name: "usdcPercentage", type: "uint256" },
            { name: "goldPercentage", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "usdcAmount", type: "uint256" }],
        name: "previewBuyGold",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ name: "goldAmount", type: "uint256" }],
        name: "previewSellGold",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "goldPrice",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_DEPOSIT",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    // Write Functions
    {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "buyGold", type: "bool" },
            { name: "amount", type: "uint256" },
            { name: "minAmountOut", type: "uint256" },
        ],
        name: "executeTrade",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "emergencyWithdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    // Events
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "user", type: "address" },
            { indexed: false, name: "amount", type: "uint256" },
            { indexed: false, name: "timestamp", type: "uint256" },
        ],
        name: "Deposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "user", type: "address" },
            { indexed: false, name: "amount", type: "uint256" },
            { indexed: false, name: "timestamp", type: "uint256" },
        ],
        name: "Withdrawal",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "user", type: "address" },
            { indexed: false, name: "buyGold", type: "bool" },
            { indexed: false, name: "amountIn", type: "uint256" },
            { indexed: false, name: "amountOut", type: "uint256" },
            { indexed: false, name: "price", type: "uint256" },
            { indexed: false, name: "timestamp", type: "uint256" },
        ],
        name: "TradeExecuted",
        type: "event",
    },
] as const;

// ============================================
// ERC20 ABI (Minimal)
// ============================================

export const ERC20_ABI = [
    {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    // Faucet for testnet tokens
    {
        inputs: [],
        name: "faucet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

// ============================================
// Type Definitions
// ============================================

export interface Position {
    usdcAmount: bigint;
    goldAmount: bigint;
    totalDeposited: bigint;
    totalWithdrawn: bigint;
    lastTradeTime: bigint;
    tradeCount: bigint;
}

export interface PortfolioBreakdown {
    usdcAmount: bigint;
    goldAmount: bigint;
    goldValueInUsdc: bigint;
    totalValue: bigint;
    usdcPercentage: bigint;
    goldPercentage: bigint;
}
