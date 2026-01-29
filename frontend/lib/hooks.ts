// ============================================
// oWi AI - React Hooks for Contract Interaction
// ============================================

"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from "wagmi";
import { parseUnits, formatUnits, Address } from "viem";
import { VAULT_ABI, ERC20_ABI, getContracts, Position, PortfolioBreakdown } from "./contracts";

// ============================================
// Helper: Get Contract Addresses
// ============================================

export function useContracts() {
    const chainId = useChainId();
    return getContracts(chainId);
}

// ============================================
// Read: User Position
// ============================================

export function useUserPosition() {
    const { address } = useAccount();
    const contracts = useContracts();

    const { data, isLoading, error, refetch } = useReadContract({
        address: contracts.vault,
        abi: VAULT_ABI,
        functionName: "getUserPosition",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && contracts.vault !== "0x0000000000000000000000000000000000000000",
            refetchInterval: 10000, // 10 seconds
        },
    });

    const position: Position | null = data ? {
        usdcAmount: data.usdcAmount,
        goldAmount: data.goldAmount,
        totalDeposited: data.totalDeposited,
        totalWithdrawn: data.totalWithdrawn,
        lastTradeTime: data.lastTradeTime,
        tradeCount: data.tradeCount,
    } : null;

    return { position, isLoading, error, refetch };
}

// ============================================
// Read: Portfolio Value
// ============================================

export function usePortfolioValue() {
    const { address } = useAccount();
    const contracts = useContracts();

    const { data, isLoading, error, refetch } = useReadContract({
        address: contracts.vault,
        abi: VAULT_ABI,
        functionName: "getPortfolioValue",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && contracts.vault !== "0x0000000000000000000000000000000000000000",
            refetchInterval: 10000,
        },
    });

    // Convert from 6 decimals to number
    const value = data ? Number(formatUnits(data, 6)) : 0;

    return { value, isLoading, error, refetch };
}

// ============================================
// Read: Portfolio Breakdown
// ============================================

export function usePortfolioBreakdown() {
    const { address } = useAccount();
    const contracts = useContracts();

    const { data, isLoading, error, refetch } = useReadContract({
        address: contracts.vault,
        abi: VAULT_ABI,
        functionName: "getPortfolioBreakdown",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && contracts.vault !== "0x0000000000000000000000000000000000000000",
            refetchInterval: 10000,
        },
    });

    const breakdown: PortfolioBreakdown | null = data ? {
        usdcAmount: data[0],
        goldAmount: data[1],
        goldValueInUsdc: data[2],
        totalValue: data[3],
        usdcPercentage: data[4],
        goldPercentage: data[5],
    } : null;

    return { breakdown, isLoading, error, refetch };
}

// ============================================
// Read: Gold Price
// ============================================

export function useGoldPrice() {
    const contracts = useContracts();

    const { data, isLoading, error, refetch } = useReadContract({
        address: contracts.vault,
        abi: VAULT_ABI,
        functionName: "goldPrice",
        query: {
            enabled: contracts.vault !== "0x0000000000000000000000000000000000000000",
            refetchInterval: 30000, // 30 seconds
        },
    });

    // Convert from 8 decimals to USD
    const price = data ? Number(formatUnits(data, 8)) : 0;

    return { price, isLoading, error, refetch };
}

// ============================================
// Read: Preview Trade
// ============================================

export function usePreviewBuyGold(usdcAmount: string) {
    const contracts = useContracts();
    const amount = usdcAmount ? parseUnits(usdcAmount, 6) : BigInt(0);

    const { data, isLoading, error } = useReadContract({
        address: contracts.vault,
        abi: VAULT_ABI,
        functionName: "previewBuyGold",
        args: [amount],
        query: {
            enabled: amount > 0 && contracts.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    const goldAmount = data ? Number(formatUnits(data, 18)) : 0;

    return { goldAmount, isLoading, error };
}

export function usePreviewSellGold(goldAmount: string) {
    const contracts = useContracts();
    const amount = goldAmount ? parseUnits(goldAmount, 18) : BigInt(0);

    const { data, isLoading, error } = useReadContract({
        address: contracts.vault,
        abi: VAULT_ABI,
        functionName: "previewSellGold",
        args: [amount],
        query: {
            enabled: amount > 0 && contracts.vault !== "0x0000000000000000000000000000000000000000",
        },
    });

    const usdcAmount = data ? Number(formatUnits(data, 6)) : 0;

    return { usdcAmount, isLoading, error };
}

// ============================================
// Read: Token Balances
// ============================================

export function useTokenBalances() {
    const { address } = useAccount();
    const contracts = useContracts();

    const { data: usdcBalance, isLoading: usdcLoading, refetch: refetchUsdc } = useReadContract({
        address: contracts.usdc,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && contracts.usdc !== "0x0000000000000000000000000000000000000000",
            refetchInterval: 10000,
        },
    });

    const { data: goldBalance, isLoading: goldLoading, refetch: refetchGold } = useReadContract({
        address: contracts.gold,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && contracts.gold !== "0x0000000000000000000000000000000000000000",
            refetchInterval: 10000,
        },
    });

    return {
        usdc: usdcBalance ? Number(formatUnits(usdcBalance, 6)) : 0,
        gold: goldBalance ? Number(formatUnits(goldBalance, 18)) : 0,
        isLoading: usdcLoading || goldLoading,
        refetch: () => {
            refetchUsdc();
            refetchGold();
        },
    };
}

// ============================================
// Read: Token Allowance
// ============================================

export function useTokenAllowance(tokenAddress: Address) {
    const { address } = useAccount();
    const contracts = useContracts();

    const { data, isLoading, refetch } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: address ? [address, contracts.vault] : undefined,
        query: {
            enabled: !!address && tokenAddress !== "0x0000000000000000000000000000000000000000",
        },
    });

    return { allowance: data || BigInt(0), isLoading, refetch };
}

// ============================================
// Write: Approve Token
// ============================================

export function useApproveToken() {
    const contracts = useContracts();
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = async (tokenAddress: Address, amount: string, decimals: number = 6) => {
        const parsedAmount = parseUnits(amount, decimals);

        writeContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [contracts.vault, parsedAmount],
        });
    };

    return {
        approve,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

// ============================================
// Write: Deposit
// ============================================

export function useDeposit() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const contracts = useContracts();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const deposit = async (amount: string) => {
        const parsedAmount = parseUnits(amount, 6);

        writeContract({
            address: contracts.vault,
            abi: VAULT_ABI,
            functionName: "deposit",
            args: [parsedAmount],
        });
    };

    return {
        deposit,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
        reset,
    };
}

// ============================================
// Write: Withdraw
// ============================================

export function useWithdraw() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const contracts = useContracts();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const withdraw = async (amount: string) => {
        const parsedAmount = parseUnits(amount, 6);

        writeContract({
            address: contracts.vault,
            abi: VAULT_ABI,
            functionName: "withdraw",
            args: [parsedAmount],
        });
    };

    return {
        withdraw,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
        reset,
    };
}

// ============================================
// Write: Execute Trade
// ============================================

export function useTrade() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const contracts = useContracts();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const trade = async (
        buyGold: boolean,
        amount: string,
        slippageBps: number = 50 // 0.5% default
    ) => {
        const decimals = buyGold ? 6 : 18; // USDC or Gold
        const parsedAmount = parseUnits(amount, decimals);

        // Calculate minAmountOut with slippage
        // For simplicity, we'll use 0 here and rely on contract's slippage check
        const minAmountOut = BigInt(0);

        writeContract({
            address: contracts.vault,
            abi: VAULT_ABI,
            functionName: "executeTrade",
            args: [buyGold, parsedAmount, minAmountOut],
        });
    };

    return {
        trade,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
        reset,
    };
}

// ============================================
// Write: Faucet (Testnet Only)
// ============================================

export function useFaucet() {
    const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
    const contracts = useContracts();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const claimUsdc = async () => {
        writeContract({
            address: contracts.usdc,
            abi: ERC20_ABI,
            functionName: "faucet",
        });
    };

    const claimGold = async () => {
        writeContract({
            address: contracts.gold,
            abi: ERC20_ABI,
            functionName: "faucet",
        });
    };

    return {
        claimUsdc,
        claimGold,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        error,
        reset,
    };
}
