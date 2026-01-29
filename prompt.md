# oWi AI - Complete Development Prompts

> **Purpose:** Step-by-step prompts untuk membangun oWi AI dengan Foundry + Base Mini App  
> **Tech Stack:** Foundry, Next.js 14, Hono.js, OnchainKit, @farcaster/miniapp-sdk  
> **Target:** Base Mini App yang berjalan di Coinbase Wallet & Farcaster

---

## 📋 Table of Contents

1. [Phase 0: Environment Setup](#phase-0-environment-setup)
2. [Phase 1: Smart Contracts (Foundry)](#phase-1-smart-contracts-foundry)
3. [Phase 2: Frontend (Next.js + Base Mini App)](#phase-2-frontend-nextjs--base-mini-app)
4. [Phase 3: Backend (Hono.js)](#phase-3-backend-honojs)
5. [Phase 4: AI Trading Engine](#phase-4-ai-trading-engine)
6. [Phase 5: Base Mini App Integration](#phase-5-base-mini-app-integration)
7. [Phase 6: Deployment](#phase-6-deployment)

---

## Phase 0: Environment Setup

### PROMPT 0.1: Create Project Structure

```
Create the project structure for oWi AI - a Base Mini App for autonomous gold trading.

STRUCTURE:
```
owi/
├── frontend/          # Next.js 14 Base Mini App
├── backend/           # Hono.js API server
├── contracts/         # Foundry smart contracts
├── package.json       # Root workspace config
├── .env.example       # Environment template
├── .gitignore         # Git ignore
└── README.md          # Documentation
```

ROOT FILES:

1. **package.json** - Workspace config:
   - workspaces: ["frontend", "backend"]
   - Scripts: dev, build, test
   - Foundry commands: forge:build, forge:test

2. **.env.example** with:
   - PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, BASESCAN_API_KEY
   - NEXT_PUBLIC_VAULT_ADDRESS, USDC_ADDRESS, GOLD_ADDRESS
   - NEXT_PUBLIC_ONCHAINKIT_API_KEY
   - GEMINI_API_KEY, JWT_SECRET

3. **.gitignore** untuk Node.js + Foundry:
   - node_modules/, .env, .next/
   - contracts/out/, contracts/cache/, contracts/broadcast/

4. **README.md** dengan badge Base Mini App dan Foundry
```

---

## Phase 1: Smart Contracts (Foundry)

### PROMPT 1.1: Initialize Foundry Project

```
Initialize Foundry project di /contracts untuk oWi AI smart contracts.

REQUIREMENTS:

1. Setup Foundry dengan forge init

2. Install OpenZeppelin:
   forge install OpenZeppelin/openzeppelin-contracts --no-commit

3. Buat **foundry.toml**:
   - src = "src"
   - out = "out"
   - libs = ["lib"]
   - solc_version = "0.8.20"
   - optimizer = true, runs = 200
   - via_ir = true (untuk complex functions)
   - Networks: base_sepolia, base mainnet
   - Etherscan verification config

4. Buat **remappings.txt**:
   @openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/
   forge-std/=lib/forge-std/src/

5. Buat **.env.example** untuk Foundry:
   PRIVATE_KEY=
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   BASESCAN_API_KEY=

6. Buat **Makefile** dengan commands:
   - build, test, deploy, verify
   - forge install commands

Folder structure:
/contracts
  /src           # Solidity contracts
  /test          # Foundry tests (.t.sol)
  /script        # Deploy scripts (.s.sol)
  /lib           # Dependencies
```

---

### PROMPT 1.2: Create Token Contracts

```
Buat mock ERC20 tokens untuk testing di Base Sepolia.

CONTRACTS:

1. **src/MockUSDC.sol**
   - ERC20 dengan 6 decimals
   - Name: "Mock USD Coin", Symbol: "USDC"
   - Ownable + Mintable
   - faucet() function: mint 1000 USDC ke caller
   - Initial supply: 1M USDC ke deployer

2. **src/MockGold.sol**
   - ERC20 dengan 18 decimals
   - Name: "Mock Gold Token", Symbol: "XAU"
   - Ownable + Mintable
   - faucet() function: mint 1 XAU ke caller
   - Initial supply: 100 XAU ke deployer

3. **src/MockChainlinkOracle.sol**
   - Mock AggregatorV3Interface
   - setPrice() untuk testing
   - Default: $2150.50 per ounce (8 decimals)

Gunakan OpenZeppelin ERC20, Ownable.
Full NatSpec documentation.
```

---

### PROMPT 1.3: Create oWiVault Contract

```
Buat main vault contract untuk deposit, trade, dan withdraw.

**src/oWiVault.sol**:

STATE:
- IERC20 immutable usdc, gold
- AggregatorV3Interface goldPriceFeed
- mapping(address => Position) positions
- struct Position { usdcAmount, goldAmount, lastTradeTime, totalDeposited }

FUNCTIONS:
1. deposit(uint256 amount) - Deposit USDC
2. withdraw(uint256 amount) - Withdraw USDC (auto-convert gold jika perlu)
3. executeTrade(bool buyGold, uint256 amount, uint256 minOut) - Swap USDC <-> Gold
4. getUserPosition(address) view - Get user position
5. getPortfolioValue(address) view - Total value in USDC
6. getPortfolioBreakdown(address) view - USDC amount, gold amount, gold value
7. previewBuyGold(uint256 usdc) view - Preview gold amount
8. previewSellGold(uint256 gold) view - Preview USDC amount

ADMIN:
- setGoldPrice(uint256) - For testing
- emergencyPause() / unpause()

SECURITY:
- ReentrancyGuard, Ownable, Pausable
- Slippage protection
- Events untuk semua actions

MATH (PENTING):
- USDC: 6 decimals
- Gold: 18 decimals
- Price: 8 decimals (Chainlink format)
- previewBuyGold: goldAmount = (usdcAmount * 1e20) / goldPrice
- previewSellGold: usdcAmount = (goldAmount * goldPrice) / 1e20
```

---

### PROMPT 1.4: Create Foundry Tests

```
Buat comprehensive test suite di **test/oWiVault.t.sol**.

TEST CATEGORIES:

1. Deployment Tests
   - Constructor sets correct values
   - Initial state correct

2. Deposit Tests
   - Deposit updates position
   - Deposit emits event
   - Cannot deposit 0
   - Cannot deposit without approval

3. Trade Tests
   - Buy gold works correctly
   - Sell gold works correctly
   - Slippage protection works
   - Cannot trade more than balance

4. Withdraw Tests
   - Withdraw USDC works
   - Auto-convert gold if needed
   - Cannot withdraw more than balance

5. View Functions Tests
   - getPortfolioValue accurate
   - getPortfolioBreakdown correct
   - previewBuyGold/previewSellGold accurate

6. Admin Tests
   - Only owner can setGoldPrice
   - Emergency pause works

7. Fuzz Tests
   - Fuzz deposit amounts
   - Fuzz trade amounts

SETUP:
- Deploy all contracts in setUp()
- Create test users with ETH and tokens
- Define local events untuk vm.expectEmit

Run: forge test -vvv
Target: All tests pass
```

---

### PROMPT 1.5: Create Deploy Script

```
Buat Foundry deployment script di **script/Deploy.s.sol**.

SCRIPT:

1. Deploy MockUSDC
2. Deploy MockGold  
3. Deploy MockChainlinkOracle
4. Deploy oWiVault dengan addresses
5. Setup initial state (mint tokens, set price)
6. Log semua addresses
7. Save addresses ke JSON file

FEATURES:
- Broadcast transactions
- Verify on Basescan
- Handle different networks (local, testnet, mainnet)
- Clear logging

USAGE:
# Local
forge script script/Deploy.s.sol --fork-url $RPC_URL --broadcast

# Base Sepolia dengan verification
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
```

---

### PROMPT 1.6: Create ABI Export Script

```
Buat **export-abis.js** untuk export ABIs ke frontend.

SCRIPT:
1. Read compiled artifacts dari /out
2. Extract ABIs untuk: MockUSDC, MockGold, oWiVault
3. Generate TypeScript files:
   - exports/abis.ts - Contract ABIs
   - exports/addresses.ts - Deployed addresses per network
   - exports/index.ts - Re-exports

OUTPUT FORMAT:
```typescript
// abis.ts
export const VAULT_ABI = [...] as const;
export const USDC_ABI = [...] as const;

// addresses.ts
export const CONTRACTS = {
  baseSepolia: { vault: '0x...', usdc: '0x...' },
  base: { vault: '0x...', usdc: '0x...' }
} as const;
```

Add to package.json: "export-abis": "node export-abis.js"
```

---

## Phase 2: Frontend (Next.js + Base Mini App)

### PROMPT 2.1: Initialize Next.js Project

```
Initialize Next.js 14 di /frontend untuk Base Mini App.

SETUP:
1. Next.js 14 dengan App Router + TypeScript + TailwindCSS
2. Turbopack enabled

DEPENDENCIES:
{
  "@coinbase/onchainkit": "^0.35.0",
  "@farcaster/miniapp-sdk": "^0.2.0",
  "wagmi": "^2.5.0",
  "viem": "^2.7.0",
  "@tanstack/react-query": "^5.17.0",
  "zustand": "^4.4.0",
  "lucide-react": "latest",
  "recharts": "^2.10.0",
  "clsx": "latest",
  "tailwind-merge": "latest"
}

FOLDER STRUCTURE:
/frontend
  /app
    /(main)
      /dashboard/page.tsx
      /trading/page.tsx
      /portfolio/page.tsx
      /settings/page.tsx
      layout.tsx
    /.well-known/farcaster.json/route.ts  # Mini App manifest
    layout.tsx    # Root layout + metadata
    page.tsx      # Landing page
    globals.css
  /lib
    providers.tsx   # Wagmi + OnchainKit + MiniApp
    contracts.ts    # ABIs
    hooks.ts        # Contract hooks
    constants.ts
    utils.ts
  /public
    manifest.json   # PWA manifest
```

---

### PROMPT 2.2: Setup Providers with MiniKit

```
Buat **lib/providers.tsx** dengan Wagmi, OnchainKit, dan MiniApp SDK.

REQUIREMENTS:

1. Wagmi Config:
   - Chains: baseSepolia, base
   - Connectors: coinbaseWallet (primary), walletConnect, injected
   - SSR: true

2. MiniApp Hooks:
   - useMiniAppReady() - Call sdk.actions.ready()
   - useIsMiniApp() - Detect Mini App context
   - useFarcasterContext() - Get user context

3. Providers Component:
   - WagmiProvider
   - QueryClientProvider
   - OnchainKitProvider

CODE STRUCTURE:
```tsx
"use client";

import { sdk } from "@farcaster/miniapp-sdk";

export function useMiniAppReady() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);
}

export function Providers({ children }) {
  useMiniAppReady();
  return (
    <WagmiProvider>
      <QueryClientProvider>
        <OnchainKitProvider chain={baseSepolia}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```
```

---

### PROMPT 2.3: Create Root Layout with Mini App Metadata

```
Buat **app/layout.tsx** dengan metadata untuk Base Mini App.

METADATA:
1. SEO: title, description, keywords
2. Open Graph + Twitter cards
3. fc:miniapp meta tag (JSON format):
   {
     "version": "next",
     "imageUrl": "https://app.com/embed.png",
     "button": {
       "title": "Open App",
       "action": {
         "type": "launch_miniapp",
         "name": "oWi AI",
         "url": "https://app.com"
       }
     }
   }
4. PWA meta tags (mobile-web-app-capable, etc)
5. Manifest link

VIEWPORT:
- width: device-width
- initialScale: 1
- maximumScale: 1
- userScalable: false
- themeColor: "#0f172a"
```

---

### PROMPT 2.4: Create Farcaster Manifest API Route

```
Buat **app/.well-known/farcaster.json/route.ts** untuk Mini App manifest.

API ROUTE yang return JSON:
{
  "accountAssociation": {
    "header": "",    // Fill dari Base Build tool
    "payload": "",
    "signature": ""
  },
  "miniapp": {
    "version": "1",
    "name": "oWi AI",
    "homeUrl": "https://owi.ai",
    "iconUrl": "https://owi.ai/icon.png",
    "splashImageUrl": "https://owi.ai/splash.png",
    "splashBackgroundColor": "#0f172a",
    "webhookUrl": "https://owi.ai/api/webhook",
    "subtitle": "Bot Trading Emas Otomatis",
    "description": "AI trading bot untuk perlindungan inflasi",
    "screenshotUrls": [...],
    "primaryCategory": "finance",
    "tags": ["trading", "gold", "ai", "defi"]
  }
}

Gunakan dynamic URL dari env: NEXT_PUBLIC_APP_URL
```

---

### PROMPT 2.5: Create Contract Hooks

```
Buat **lib/hooks.ts** dengan React hooks untuk contract interaction.

HOOKS:

1. useVaultContract() - Get contract instance
2. useUserPosition() - Read user position
3. usePortfolioValue() - Read portfolio value
4. useDeposit() - Deposit mutation
5. useWithdraw() - Withdraw mutation
6. useTrade() - Execute trade mutation
7. useTokenBalances() - Get USDC + Gold balances
8. useTokenApproval() - Approve tokens

GUNAKAN:
- wagmi hooks: useReadContract, useWriteContract
- React Query untuk caching
- Proper error handling
- Loading states
```

---

### PROMPT 2.6: Create Dashboard Page

```
Buat **app/(main)/dashboard/page.tsx** - Main dashboard.

COMPONENTS:
1. Portfolio Summary Card
   - Total value in USD
   - 24h change percentage
   - Mini chart

2. Asset Allocation
   - USDC balance + percentage
   - Gold balance + value + percentage
   - Donut chart

3. AI Signal Card
   - Current recommendation (Buy/Sell/Hold)
   - Confidence score
   - Reasoning preview

4. Quick Actions
   - Deposit button
   - Trade button
   - Withdraw button

5. Recent Activity
   - Last 5 transactions
   - Type, amount, time

STYLING:
- Dark theme
- Glassmorphism cards
- Gradient backgrounds
- Smooth animations
```

---

### PROMPT 2.7: Create Trading Page

```
Buat **app/(main)/trading/page.tsx** - Trading interface.

COMPONENTS:
1. Price Display
   - Current gold price
   - 24h change
   - Mini sparkline

2. AI Signal Panel
   - Full recommendation
   - Confidence meter
   - Detailed reasoning
   - Execute Signal button

3. Manual Trade Form
   - Buy/Sell toggle
   - Amount input
   - Slippage setting
   - Preview output
   - Execute button

4. Position Card
   - Current USDC
   - Current Gold
   - Portfolio value

5. Trade History
   - Recent trades list
   - Filter by type

FEATURES:
- Real-time price updates
- Slippage calculation
- Confirmation modal
- Loading states
- Success/error toasts
```

---

### PROMPT 2.8: Create Portfolio Page

```
Buat **app/(main)/portfolio/page.tsx** - Portfolio analytics.

COMPONENTS:
1. Portfolio Overview
   - Total value
   - All-time P&L
   - ROI percentage

2. Performance Chart
   - Line chart dengan recharts
   - 1D, 1W, 1M, ALL tabs
   - Show portfolio value over time

3. Asset Breakdown
   - Pie chart
   - List with icons

4. Transaction History
   - Full table
   - Filter: All, Deposits, Withdrawals, Trades
   - Pagination

5. Statistics
   - Total deposited
   - Total withdrawn
   - Trade count
   - Win rate
```

---

## Phase 3: Backend (Hono.js)

### PROMPT 3.1: Initialize Hono.js Server

```
Initialize Hono.js server di /backend.

SETUP:
{
  "dependencies": {
    "hono": "^4.0.0",
    "@hono/node-server": "^1.8.0",
    "viem": "^2.7.0",
    "@google/generative-ai": "^0.21.0",
    "jose": "^5.2.0",
    "dotenv": "^16.3.0"
  }
}

STRUCTURE:
/backend
  /src
    index.ts           # Server entry
    /routes
      auth.ts          # Wallet auth
      signals.ts       # AI signals
      portfolio.ts     # Portfolio data
      trades.ts        # Trade history
      analytics.ts     # Analytics

SERVER:
- Port: 3001
- CORS enabled
- JSON parsing
- Error handling
- Request logging
```

---

### PROMPT 3.2: Create Auth Routes

```
Buat **src/routes/auth.ts** dengan SIWE (Sign In With Ethereum).

ROUTES:

POST /auth/nonce
- Generate random nonce
- Store temporarily

POST /auth/verify
- Verify signed message
- Create JWT token
- Return token + user info

GET /auth/me
- Verify JWT
- Return user data

IMPLEMENTATION:
- Use viem untuk signature verification
- Use jose untuk JWT
- Nonce expires in 5 minutes
```

---

### PROMPT 3.3: Create AI Signals Route

```
Buat **src/routes/signals.ts** dengan Gemini AI integration.

ROUTES:

GET /signals/current
- Generate AI trading signal
- Return: action, confidence, reasoning

POST /signals/generate
- Force regenerate signal
- Include market data in prompt

GEMINI PROMPT:
```
Kamu adalah AI trading advisor untuk oWi.
Analisis kondisi pasar:
- Harga emas: $X
- Perubahan 24h: Y%
- Inflasi: Z%

Berikan rekomendasi:
- action: "BUY_GOLD" | "SELL_GOLD" | "HOLD"
- confidence: 0-100
- reasoning: penjelasan singkat

Response dalam JSON.
```

CACHING:
- Cache signal selama 5 menit
- Rate limit per user
```

---

## Phase 5: Base Mini App Integration

### PROMPT 5.1: Complete Mini App Setup

```
Finalisasi Base Mini App integration.

CHECKLIST:

1. /.well-known/farcaster.json route ✓
2. fc:miniapp meta tag di layout ✓
3. @farcaster/miniapp-sdk installed ✓
4. sdk.actions.ready() called ✓
5. manifest.json untuk PWA ✓

ADDITIONAL:

1. Buat **minikit.config.js**:
   - App name, icon, version
   - Payment config (x402)
   - Permissions

2. Update icons di /public:
   - icon.png (1024x1024)
   - splash.png
   - og-image.png
   - Screenshots

3. Test di Base Build Preview:
   - https://www.base.dev/preview
   - Verify manifest
   - Test launch button
```

---

### PROMPT 5.2: Generate Account Association

```
MANUAL STEP - Developer harus lakukan:

1. Deploy frontend ke Vercel:
   cd frontend && npx vercel

2. Buka: https://www.base.dev/preview?tab=account

3. Masukkan URL app (contoh: owi.vercel.app)

4. Klik "Verify" dan sign dengan wallet

5. Copy credentials ke route.ts:
   accountAssociation: {
     header: "PASTE_HEADER",
     payload: "PASTE_PAYLOAD",
     signature: "PASTE_SIGNATURE"
   }

6. Redeploy dan verify di Preview tool
```

---

## Phase 6: Deployment

### PROMPT 6.1: Deploy Contracts

```
Deploy smart contracts ke Base Sepolia.

COMMANDS:

# Setup env
cd contracts
cp .env.example .env
# Edit .env dengan PRIVATE_KEY

# Build
forge build

# Test
forge test -vvv

# Deploy
forge script script/Deploy.s.sol \
  --rpc-url base_sepolia \
  --broadcast \
  --verify

# Export ABIs
node export-abis.js

# Update frontend addresses
```

---

### PROMPT 6.2: Deploy Frontend

```
Deploy frontend ke Vercel.

COMMANDS:

cd frontend
npx vercel

# Set environment variables di Vercel:
# - NEXT_PUBLIC_VAULT_ADDRESS
# - NEXT_PUBLIC_USDC_ADDRESS
# - NEXT_PUBLIC_GOLD_ADDRESS
# - NEXT_PUBLIC_ONCHAINKIT_API_KEY
# - NEXT_PUBLIC_APP_URL

# Verify Mini App di:
# https://www.base.dev/preview
```

---

### PROMPT 6.3: Submit to Mini App Registry

```
Submit app ke Base Mini App registry.

STEPS:

1. Verify semua requirements:
   - /.well-known/farcaster.json accessible
   - accountAssociation valid
   - fc:miniapp meta tag present
   - Icons dan screenshots ready

2. Test di Base Build Preview

3. Post ke registry untuk review

4. Monitor approval status
```

---

## Quick Reference

### Foundry Commands
```bash
forge build              # Compile
forge test -vvv          # Test dengan verbosity
forge script Deploy.s.sol --broadcast  # Deploy
forge verify-contract    # Verify on explorer
```

### Development
```bash
# Frontend
cd frontend && npm run dev

# Backend  
cd backend && npm run dev

# Contracts
cd contracts && forge test
```

### Key URLs
- Base Sepolia Faucet: https://www.coinbase.com/faucets/base-sepolia
- Base Build Preview: https://www.base.dev/preview
- OnchainKit Docs: https://onchainkit.xyz
- Foundry Book: https://book.getfoundry.sh

---

**Built for Base Hackathon 2026** 🚀