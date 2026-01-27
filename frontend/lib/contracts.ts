// ABI untuk GoldGuardVault contract
export const VAULT_ABI = [
    // Read functions
    {
        name: "usdc",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "address" }],
    },
    {
        name: "gold",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "address" }],
    },
    {
        name: "goldPriceUSD",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "totalDeposits",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "totalTrades",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getUserPosition",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "usdcAmount", type: "uint256" },
            { name: "goldAmount", type: "uint256" },
            { name: "totalDeposited", type: "uint256" },
            { name: "totalWithdrawn", type: "uint256" },
            { name: "totalTrades", type: "uint256" },
            { name: "lastTradeTime", type: "uint256" },
        ],
    },
    {
        name: "getPortfolioValue",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getPortfolioBreakdown",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "usdcAmount", type: "uint256" },
            { name: "usdcValueUSD", type: "uint256" },
            { name: "goldAmount", type: "uint256" },
            { name: "goldValueUSD", type: "uint256" },
            { name: "totalValueUSD", type: "uint256" },
            { name: "usdcPercentage", type: "uint256" },
            { name: "goldPercentage", type: "uint256" },
        ],
    },
    {
        name: "previewBuyGold",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "usdcAmount", type: "uint256" }],
        outputs: [{ name: "goldAmount", type: "uint256" }],
    },
    {
        name: "previewSellGold",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "goldAmount", type: "uint256" }],
        outputs: [{ name: "usdcAmount", type: "uint256" }],
    },
    // Write functions
    {
        name: "deposit",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "amount", type: "uint256" }],
        outputs: [],
    },
    {
        name: "withdraw",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "usdcAmount", type: "uint256" }],
        outputs: [],
    },
    {
        name: "executeTrade",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "buyGold", type: "bool" },
            { name: "amount", type: "uint256" },
            { name: "minAmountOut", type: "uint256" },
        ],
        outputs: [{ name: "amountOut", type: "uint256" }],
    },
    // Events
    {
        name: "Deposited",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
            { name: "timestamp", type: "uint256", indexed: false },
        ],
    },
    {
        name: "Withdrawn",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
            { name: "timestamp", type: "uint256", indexed: false },
        ],
    },
    {
        name: "TradeExecuted",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "buyGold", type: "bool", indexed: false },
            { name: "amountIn", type: "uint256", indexed: false },
            { name: "amountOut", type: "uint256", indexed: false },
            { name: "price", type: "uint256", indexed: false },
            { name: "timestamp", type: "uint256", indexed: false },
        ],
    },
] as const;

// ABI untuk ERC20 tokens (USDC & Gold)
export const ERC20_ABI = [
    {
        name: "name",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "string" }],
    },
    {
        name: "symbol",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "string" }],
    },
    {
        name: "decimals",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
    },
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
    {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
] as const;

// ABI untuk MockUSDC faucet
export const MOCK_TOKEN_ABI = [
    ...ERC20_ABI,
    {
        name: "faucet",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    },
    {
        name: "faucetAmount",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "lastFaucetTime",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;
