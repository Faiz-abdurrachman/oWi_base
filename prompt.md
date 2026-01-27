# GoldGuard AI - Cursor AI Prompts Guide

> **Purpose:** Step-by-step prompts for developing GoldGuard AI using Cursor AI  
> **Instructions:** Copy-paste these prompts one at a time, in order  
> **Duration:** ~12-15 hours total development time  

---

## 📋 Table of Contents

1. [How to Use This Guide](#how-to-use-this-guide)
2. [Phase 0: Environment Setup](#phase-0-environment-setup)
3. [Phase 1: Smart Contracts](#phase-1-smart-contracts)
4. [Phase 2: Frontend Foundation](#phase-2-frontend-foundation)
5. [Phase 3: Backend API](#phase-3-backend-api)
6. [Phase 4: AI Trading Engine](#phase-4-ai-trading-engine)
7. [Phase 5: Integration](#phase-5-integration)
8. [Phase 6: Polish & Deploy](#phase-6-polish--deploy)
9. [Troubleshooting Prompts](#troubleshooting-prompts)

---

## How to Use This Guide

### Before You Start

**Prerequisites:**
- ✅ Cursor AI installed
- ✅ Node.js v18+ installed
- ✅ Git initialized in project folder
- ✅ Groq API key ready
- ✅ Base Sepolia testnet ETH in wallet

### How to Execute Prompts

1. **Open Cursor AI** → Navigate to your project folder
2. **Use Cmd+L (Mac) or Ctrl+L (Windows)** to open chat
3. **Copy-paste ONE prompt at a time**
4. **Wait for Cursor to finish** generating code
5. **Review the code** before accepting
6. **Test** that it works
7. **Commit to Git** before moving to next prompt
8. **Repeat** for next prompt

### Cursor AI Keyboard Shortcuts

- `Cmd/Ctrl + L` → Open chat (for prompts)
- `Cmd/Ctrl + K` → Inline edit (for quick fixes)
- `Cmd/Ctrl + I` → Generate code in file
- `Tab` → Accept suggestion
- `Esc` → Reject suggestion

### Tips for Success

- ✅ **Read Cursor's response carefully** before accepting
- ✅ **Test each step** before moving forward
- ✅ **Commit frequently** (`git add . && git commit -m "message"`)
- ✅ **Don't skip steps** - they build on each other
- ✅ **Ask Cursor to explain** if you don't understand something
- ✅ **Take breaks** - don't rush!

---

## Phase 0: Environment Setup

### PROMPT 0.1: Verify Environment

**When to use:** Before starting any development

```
Please verify my development environment is ready for building GoldGuard AI. Check and report on:

1. Node.js version (need v18+)
2. npm or yarn availability
3. Git installation and status
4. Current directory structure

If anything is missing or outdated, please:
- List what needs to be installed/updated
- Provide installation commands for my OS
- Suggest best practices for setup

After verification, create a checklist of environment requirements and mark what's ready vs. what needs attention.
```

**Expected Output:**
- Environment status report
- Installation commands if needed
- Checklist of requirements

**What to do after:**
- Install any missing dependencies
- Confirm everything is ready
- Move to next prompt

---

### PROMPT 0.2: Create Project Structure

**When to use:** After environment is verified

```
Create the initial project structure for GoldGuard AI with separate folders for different components.

Create this folder structure:
```
goldguard-ai/
├── frontend/          # Next.js Base Mini App
├── backend/           # Hono.js API server
├── contracts/         # Solidity smart contracts
├── docs/              # Documentation
├── .github/           # GitHub workflows
└── README.md          # Project overview
```

In the ROOT directory, create:

1. **README.md** with:
   - Project title and tagline
   - Brief description (2-3 sentences)
   - Tech stack overview
   - Folder structure explanation
   - Setup instructions (placeholder for now)
   - License (MIT)

2. **.gitignore** for Node.js projects that includes:
   - node_modules/
   - .env and .env.local
   - Build outputs
   - OS files
   - IDE configs

3. **package.json** (in root) for workspace management:
   - Name: goldguard-ai
   - Workspaces: ["frontend", "backend", "contracts"]
   - Scripts for running all parts

Please create all these files and folders now.
```

**Expected Output:**
- Folder structure created
- Basic README.md
- .gitignore file
- Root package.json

**What to do after:**
```bash
# Initialize git
git init
git add .
git commit -m "Initial project structure"

# Optional: Create GitHub repo and push
```

---

## Phase 1: Smart Contracts

### PROMPT 1.1: Initialize Hardhat Project

**When to use:** Starting smart contract development

```
Initialize a Hardhat project in the /contracts directory for GoldGuard AI smart contracts.

REQUIREMENTS:

1. Navigate to /contracts directory
2. Initialize Hardhat with TypeScript template
3. Install essential dependencies:
   - hardhat
   - @nomicfoundation/hardhat-toolbox
   - @openzeppelin/contracts (v5.0+)
   - @chainlink/contracts
   - dotenv

4. Create hardhat.config.ts with:
   - Solidity version: 0.8.20
   - Networks: 
     - hardhat (local)
     - baseSepolia (testnet)
   - Etherscan config for Base
   - Gas reporter settings
   - Typechain settings

5. Create .env.example with placeholders:
   - PRIVATE_KEY
   - BASE_SEPOLIA_RPC_URL
   - BASESCAN_API_KEY

6. Create folder structure:
   ```
   /contracts
     /contracts       # Solidity files
     /scripts         # Deployment scripts
     /test           # Test files
     /deploy         # Deploy configs
   ```

7. Add a basic test file to verify setup

Please generate all files and configurations now. Make sure the setup is production-ready with proper TypeScript support.
```

**Expected Output:**
- Hardhat project initialized
- All dependencies installed
- Config files ready
- Folder structure created

**What to do after:**
```bash
cd contracts
npm install
npx hardhat compile  # Should work without errors
git add .
git commit -m "Initialize Hardhat project"
```

---

### PROMPT 1.2: Create Mock Tokens

**When to use:** After Hardhat is setup

```
Create mock ERC20 tokens for USDC and Gold (PAXG) that we'll use for testing on Base Sepolia.

REQUIREMENTS:

Create two contracts in /contracts/contracts/:

1. **MockUSDC.sol**
   - ERC20 token
   - 6 decimals (like real USDC)
   - Mintable (for testing)
   - Name: "Mock USD Coin"
   - Symbol: "USDC"
   - Initial supply: 1,000,000 USDC to deployer

2. **MockGold.sol**
   - ERC20 token
   - 18 decimals (like PAXG)
   - Mintable (for testing)
   - Name: "Mock Gold Token"
   - Symbol: "XAU"
   - Initial supply: 100 XAU to deployer

FEATURES NEEDED:
- Both should extend OpenZeppelin's ERC20
- Add mint() function for testing (only owner)
- Add faucet() function that gives 1000 tokens to caller
- Proper events and error handling
- Full NatSpec documentation

Also create:
3. **deploy/01-deploy-tokens.ts** - Deployment script
4. **test/Tokens.test.ts** - Comprehensive tests

Make sure contracts follow best practices and are gas-optimized.
```

**Expected Output:**
- MockUSDC.sol contract
- MockGold.sol contract
- Deployment script
- Test file

**What to do after:**
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Should see all tests passing ✓

git add .
git commit -m "Add mock token contracts"
```

---

### PROMPT 1.3: Create GoldGuardVault Contract

**When to use:** After mock tokens are ready

```
Create the main GoldGuardVault smart contract - the core of GoldGuard AI.

CONTEXT:
This vault allows users to:
- Deposit USDC
- Hold positions in both USDC and Gold tokens
- Execute trades between USDC ↔ Gold
- Withdraw funds anytime

REQUIREMENTS:

Create **contracts/contracts/GoldGuardVault.sol** with:

ARCHITECTURE:
- Inherit: ReentrancyGuard, Ownable, Pausable from OpenZeppelin
- Implement: Non-custodial vault pattern

STATE VARIABLES:
```solidity
IERC20 public immutable USDC;
IERC20 public immutable GOLD;
IUniswapV3Router public immutable swapRouter; // Mock for now
AggregatorV3Interface public goldPriceFeed; // Chainlink oracle

mapping(address => uint256) public userDeposits;
mapping(address => Position) public positions;
uint256 public totalDeposits;
uint256 public constant MAX_SLIPPAGE = 50; // 0.5% in basis points

struct Position {
    uint256 usdcAmount;
    uint256 goldAmount;
    uint256 lastTradeTimestamp;
    uint256 totalDeposited;
}
```

CORE FUNCTIONS:
1. `deposit(uint256 amount)` - Deposit USDC
2. `withdraw(uint256 amount)` - Withdraw USDC (auto-convert gold if needed)
3. `executeTrade(bool buyGold, uint256 amount, uint256 minAmountOut)` - Execute swap
4. `getUserPosition(address user)` - View user's position
5. `getPortfolioValue(address user)` - Calculate total value in USD
6. `setGoldPriceFeed(address feed)` - Admin: set oracle (onlyOwner)

SWAP LOGIC:
For MVP, implement a simple swap using mock pricing:
- For buy gold: goldAmount = usdcAmount / goldPrice
- For sell gold: usdcAmount = goldAmount * goldPrice
- Apply slippage tolerance
- Later we'll integrate real Uniswap V3

SECURITY:
- ReentrancyGuard on all state-changing functions
- Require statements for validation
- Emit events for all important actions
- Circuit breaker (Pausable)
- Slippage protection

EVENTS:
- Deposited(address user, uint256 amount, timestamp)
- Withdrawn(address user, uint256 amount, timestamp)
- TradeExecuted(address user, bool buyGold, uint256 amountIn, uint256 amountOut, timestamp)
- EmergencyPause(timestamp)

Also create:
- **deploy/02-deploy-vault.ts** - Deployment script
- **test/GoldGuardVault.test.ts** - Comprehensive tests covering:
  - Deposits and withdrawals
  - Trading (buy/sell gold)
  - Edge cases (insufficient balance, slippage, etc.)
  - Access control
  - Emergency pause

Include full NatSpec documentation and inline comments explaining the logic.
```

**Expected Output:**
- GoldGuardVault.sol contract (~200-300 lines)
- Deployment script
- Comprehensive test suite

**What to do after:**
```bash
# Compile
npx hardhat compile

# Run tests
npx hardhat test test/GoldGuardVault.test.ts

# Check test coverage
npx hardhat coverage

# Should see >90% coverage ✓

git add .
git commit -m "Add GoldGuardVault contract with tests"
```

---

### PROMPT 1.4: Deploy Contracts to Base Sepolia

**When to use:** After all contracts are tested locally

```
Deploy all smart contracts to Base Sepolia testnet and verify them on BaseScan.

SETUP REQUIRED:

1. Update hardhat.config.ts:
   - Add Base Sepolia network config:
     - RPC URL: https://sepolia.base.org
     - ChainId: 84532
     - Accounts: from PRIVATE_KEY env var
   - Add Basescan config for verification

2. Create comprehensive deployment script **scripts/deploy-all.ts**:
   - Deploy MockUSDC
   - Deploy MockGold
   - Deploy GoldGuardVault with token addresses
   - Save deployment addresses to JSON file
   - Verify contracts on Basescan
   - Mint initial tokens for testing
   - Log all addresses clearly

3. Create **.env.example** with:
   ```
   PRIVATE_KEY=your_private_key_here
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   BASESCAN_API_KEY=your_basescan_api_key
   ```

4. After deployment, create **deployed-addresses.json** to store:
   - Contract addresses
   - Deployment transaction hashes
   - Block numbers
   - Deployer address
   - Timestamp

VERIFICATION:
Include automatic verification using Hardhat-verify plugin

LOGGING:
Add clear console logs showing:
- "Deploying to Base Sepolia..."
- Contract addresses
- Verification links
- Next steps for users

Make the deployment script idempotent and handle errors gracefully.
```

**Expected Output:**
- Updated hardhat.config.ts
- Deploy script
- .env.example template

**What to do after:**
```bash
# Copy .env.example to .env and fill in your values
cp .env.example .env
nano .env  # Add your PRIVATE_KEY

# Make sure you have Base Sepolia ETH (from faucet)

# Deploy contracts
npx hardhat run scripts/deploy-all.ts --network baseSepolia

# Save the output addresses!

git add .
git commit -m "Deploy contracts to Base Sepolia"
```

**IMPORTANT:** Save your deployed contract addresses! You'll need them for frontend integration.

---

### PROMPT 1.5: Create Contract ABIs Export

**When to use:** After successful deployment

```
Generate TypeScript files with contract ABIs and addresses for frontend use.

TASK:

1. Create **contracts/exports/** folder

2. Generate **contracts/exports/abis.ts** containing:
   - Exported ABIs for all contracts (MockUSDC, MockGold, GoldGuardVault)
   - Properly typed TypeScript

3. Generate **contracts/exports/addresses.ts** containing:
   - Contract addresses for each network (hardhat, baseSepolia)
   - Type-safe address maps

4. Create **contracts/exports/index.ts** that exports everything

5. Add NPM script to package.json:
   - "export-contracts": Script to regenerate ABIs after compilation

Example structure:
```typescript
// abis.ts
export const VAULT_ABI = [...] as const;
export const USDC_ABI = [...] as const;
export const GOLD_ABI = [...] as const;

// addresses.ts
export const CONTRACTS = {
  baseSepolia: {
    vault: '0x...',
    usdc: '0x...',
    gold: '0x...'
  },
  base: {
    vault: '0x...',
    usdc: '0x...',
    gold: '0x...'
  }
} as const;
```

Make sure all exports are type-safe and easy to import in frontend.
```

**Expected Output:**
- /exports folder with ABIs and addresses
- Type-safe TypeScript exports
- NPM script for regeneration

**What to do after:**
```bash
# Test the export
npm run export-contracts

# Verify files were created
ls contracts/exports/

git add .
git commit -m "Add contract ABI exports for frontend"
```

---

## Phase 2: Frontend Foundation

### PROMPT 2.1: Initialize Next.js Project

**When to use:** After smart contracts are deployed

```
Initialize a production-ready Next.js 14 project in the /frontend directory for the GoldGuard AI Base Mini App.

REQUIREMENTS:

1. Create Next.js 14 project with:
   - App Router (NOT pages router)
   - TypeScript (strict mode)
   - TailwindCSS
   - ESLint + Prettier
   - Turbopack for fast dev

2. Install ESSENTIAL packages:
   ```json
   {
     "@coinbase/onchainkit": "latest",
     "wagmi": "^2.x",
     "viem": "^2.x",
     "@tanstack/react-query": "^5.x",
     "zustand": "^4.x",
     "react-hook-form": "^7.x",
     "zod": "^3.x",
     "recharts": "^2.x",
     "lucide-react": "latest",
     "clsx": "latest",
     "tailwind-merge": "latest"
   }
   ```

3. Install Shadcn/ui:
   - Run shadcn-ui init
   - Setup with default config
   - Use dark theme as default
   - Install these components initially:
     - button, card, input, label
     - dialog, dropdown-menu, tabs
     - toast, skeleton, separator

4. Create folder structure:
   ```
   /frontend
     /app
       /(main)              # Main app routes
         /dashboard
         /trading
         /portfolio
         /settings
         layout.tsx
         page.tsx
       /layout.tsx          # Root layout
       /page.tsx            # Landing page
       /globals.css
     /components
       /ui                  # Shadcn components
       /layout              # Header, nav, footer
       /trading             # Trading components
       /portfolio           # Portfolio components
       /shared              # Shared components
     /lib
       /utils.ts
       /providers.tsx       # React Context providers
       /constants.ts        # Constants (contract addresses, etc.)
     /hooks                 # Custom React hooks
     /types                 # TypeScript types
     /config                # Configuration files
     /public                # Static assets
   ```

5. Configure TypeScript (tsconfig.json):
   - Strict mode enabled
   - Path aliases: @/* → everything in src
   - Target: ES2020+

6. Configure Tailwind (tailwind.config.ts):
   - Custom theme for crypto/finance UI:
     - Primary color: Gold (#FFD700)
     - Secondary: Deep blue (#0A2540)
     - Background: Dark (#0F172A)
   - Add custom animations for delight
   - Mobile-first responsive design

7. Create next.config.js:
   - Optimize for production
   - Enable image optimization
   - Configure for Base Mini Apps:
     - PWA settings
     - Standalone mode
   - Security headers

8. Add scripts to package.json:
   - "dev": Next dev with turbopack
   - "build": Production build
   - "start": Start production server
   - "lint": ESLint check
   - "type-check": TypeScript check

9. Create .env.example:
   ```
   NEXT_PUBLIC_CHAIN_ID=84532
   NEXT_PUBLIC_VAULT_ADDRESS=
   NEXT_PUBLIC_USDC_ADDRESS=
   NEXT_PUBLIC_GOLD_ADDRESS=
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
   ```

Generate all files, install all dependencies, and ensure the project can run with `npm run dev`.
```

**Expected Output:**
- Next.js project fully initialized
- All dependencies installed
- Folder structure created
- Shadcn/ui setup complete
- Config files ready

**What to do after:**
```bash
cd frontend

# Install dependencies
npm install

# Initialize Shadcn/ui (if Cursor didn't already)
npx shadcn-ui@latest init

# Start dev server
npm run dev

# Open http://localhost:3000
# Should see Next.js default page ✓

git add .
git commit -m "Initialize Next.js frontend with Base Mini App setup"
```

---

### PROMPT 2.2: Setup Wagmi & OnchainKit Providers

**When to use:** After Next.js project runs successfully

```
Setup Web3 providers (Wagmi, OnchainKit) for blockchain interaction in the GoldGuard AI app.

REQUIREMENTS:

1. Create **lib/config/wagmi.ts**:
   - Configure Wagmi with:
     - Base Sepolia as default network
     - Support for Coinbase Wallet (primary)
     - Support for WalletConnect
     - Support for MetaMask (fallback)
   - Add Base Sepolia to chains
   - Configure transports (HTTP)
   - Setup proper TypeScript types

2. Create **lib/providers.tsx**:
   - WagmiProvider wrapper
   - QueryClientProvider (for TanStack Query)
   - OnchainKitProvider wrapper
   - Combine all providers in single component
   - Add proper error boundaries

3. Update **app/layout.tsx**:
   - Wrap app with Providers
   - Add Web3 font optimization
   - Add metadata for Base Mini App:
     - Title: "GoldGuard AI"
     - Description: "Autonomous inflation hedging with AI"
     - Icons and theme colors
   - Add viewport config for mobile

4. Create **lib/constants.ts**:
   - Import contract addresses from /contracts/exports
   - Export contract ABIs
   - Define supported chains
   - Define app constants (slippage, gas limits, etc.)

5. Create **hooks/useIsMounted.ts**:
   - Hook to prevent hydration errors
   - Returns true only after component mounts
   - Essential for Web3 components

Example structure:
```typescript
// providers.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={base}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

Make sure everything is type-safe and follows Next.js 14 best practices.
```

**Expected Output:**
- Wagmi configuration
- Provider components
- Updated root layout
- Constants file
- Custom hooks

**What to do after:**
```bash
# No errors in terminal ✓
# npm run dev should still work
# No hydration errors in browser console ✓

git add .
git commit -m "Setup Web3 providers (Wagmi, OnchainKit)"
```

---

### PROMPT 2.3: Create Base Mini App Landing Page

**When to use:** After providers are setup

```
Create a beautiful, professional landing page for GoldGuard AI that serves as the entry point.

CONTEXT:
This is the first thing users see when they open the app. It should:
- Clearly explain the value proposition
- Show how it works (3 simple steps)
- Have a prominent "Connect Wallet" CTA
- Look professional and trustworthy
- Be mobile-first (this is a Mini App)

REQUIREMENTS:

Create **app/page.tsx** with these sections:

1. **Hero Section**
   - Headline: "Protect Your Wealth. Trade Smart. Beat Inflation."
   - Subheadline: "AI-powered gold trading that hedges your USD against inflation automatically"
   - Connect Wallet button (large, prominent)
   - Stats counter (animated):
     - Total Value Protected: $X
     - Active Users: X
     - Trades Executed: X

2. **How It Works** (3 Steps)
   - Step 1: Connect & Deposit
     - Icon: Wallet
     - Text: "Connect your wallet and deposit USDC in seconds"
   - Step 2: AI Analyzes
     - Icon: Brain/Robot
     - Text: "Our AI monitors gold prices and inflation 24/7"
   - Step 3: Automated Trading
     - Icon: TrendingUp
     - Text: "Automatically trade into gold when inflation threatens your wealth"

3. **Key Features** (4 Cards)
   - 🤖 Fully Autonomous (Set and forget)
   - 💰 Pay Per Signal (No subscriptions)
   - 📱 Mobile First (Built for Coinbase Wallet)
   - 🔒 Non-Custodial (You control your funds)

4. **Social Proof**
   - "Trusted by X users"
   - "Built on Base"
   - "Powered by Chainlink"

5. **Final CTA**
   - "Start Protecting Your Wealth"
   - Connect Wallet button

DESIGN REQUIREMENTS:
- Use Shadcn/ui components (Card, Button)
- Mobile-first responsive (looks great on phone)
- Dark theme with gold accents
- Smooth animations (fade-in, slide-up)
- Use Lucide icons
- Professional typography
- High contrast for readability

TECHNICAL REQUIREMENTS:
- Use Next.js 14 App Router features
- Import ConnectWallet from OnchainKit
- Proper semantic HTML
- Accessibility (ARIA labels)
- SEO optimized (meta tags)

Make it look like a professional product, not a hackathon project.
```

**Expected Output:**
- Beautiful landing page
- All sections implemented
- Responsive design
- Working Connect Wallet button

**What to do after:**
```bash
# View in browser
# npm run dev → http://localhost:3000

# Test on mobile:
# - Open Chrome DevTools
# - Toggle device toolbar
# - View on iPhone 12 Pro size
# - Should look perfect ✓

git add .
git commit -m "Create landing page with hero and features"
```

---

### PROMPT 2.4: Create Dashboard Layout & Navigation

**When to use:** After landing page is complete

```
Create the main app layout and navigation for the authenticated (wallet-connected) section of GoldGuard AI.

REQUIREMENTS:

1. Create **app/(main)/layout.tsx**:
   - Bottom navigation bar (mobile-first)
   - Tabs: Dashboard, Trading, Portfolio, Settings
   - Show connected address (truncated)
   - Disconnect button
   - Active tab highlighting
   - Smooth transitions

2. Create **components/layout/BottomNav.tsx**:
   - Fixed bottom navigation
   - Icons for each tab (Lucide icons)
   - Active state styling
   - Tap/click feedback
   - Safe area handling (for notched phones)

3. Create **components/layout/Header.tsx**:
   - App logo/title
   - Connected wallet indicator
   - Network badge (Base Sepolia)
   - Notification bell (placeholder for now)

4. Create **app/(main)/dashboard/page.tsx** (empty state for now):
   - Title: "Dashboard"
   - Placeholder text: "Your portfolio will appear here"
   - Mock card showing where portfolio value will go
   - "Make First Deposit" CTA

5. Create placeholder pages:
   - **app/(main)/trading/page.tsx** → "Trading" title
   - **app/(main)/portfolio/page.tsx** → "Portfolio" title
   - **app/(main)/settings/page.tsx** → "Settings" title

DESIGN:
- Mobile-first (optimized for 375px width)
- Bottom nav should be thumb-reachable
- Use iOS/Android design patterns
- Dark theme with gold accents
- Icons from lucide-react
- Smooth page transitions

NAVIGATION ICONS:
- Dashboard: LayoutDashboard
- Trading: TrendingUp
- Portfolio: PieChart
- Settings: Settings

Make sure navigation is intuitive and follows mobile app conventions (like Instagram, Twitter).
```

**Expected Output:**
- App layout with bottom navigation
- Header component
- All placeholder pages created
- Navigation working

**What to do after:**
```bash
# Test navigation
# Click each tab
# Should see route change ✓
# Active tab should highlight ✓

git add .
git commit -m "Add app layout and bottom navigation"
```

---

### PROMPT 2.5: Create Wallet Connection Flow

**When to use:** After layout is ready

```
Implement the complete wallet connection flow using OnchainKit and Wagmi.

REQUIREMENTS:

1. Update **app/page.tsx** landing page:
   - Add OnchainKit ConnectWallet component
   - Style it to match our design
   - Add loading states
   - Handle connection errors

2. Create **components/shared/ConnectButton.tsx**:
   - Reusable wallet connect component
   - Shows "Connect Wallet" when disconnected
   - Shows address (truncated) when connected
   - Dropdown with:
     - Copy address
     - View on BaseScan
     - Disconnect
   - Use OnchainKit components

3. Create **hooks/useAuth.ts**:
   - Hook that returns:
     - isConnected: boolean
     - address: string
     - chainId: number
     - disconnect: function
   - Wraps Wagmi hooks

4. Add route protection:
   - Create **middleware.ts** in root:
     - Redirect to landing if not connected
     - Protect /dashboard, /trading, /portfolio, /settings
     - Allow public access to landing page

5. Update **app/(main)/layout.tsx**:
   - Check wallet connection
   - Show "Connect Wallet" if not connected
   - Show app layout if connected
   - Handle network switching

6. Create **components/shared/NetworkSwitcher.tsx**:
   - Detect if user is on wrong network
   - Show warning banner
   - "Switch to Base Sepolia" button
   - Use Wagmi's switchNetwork

ONCHAINKIT COMPONENTS TO USE:
- ConnectWallet
- Identity (for showing avatar/name)
- Address (for formatting addresses)

ERROR HANDLING:
- Connection rejected → show friendly message
- Wrong network → show switch prompt
- No wallet → show install Coinbase Wallet link

Make the UX smooth - no confusing Web3 jargon, just clear actions.
```

**Expected Output:**
- Working wallet connection
- Address display
- Network switching
- Route protection
- Disconnect functionality

**What to do after:**
```bash
# Test full flow:
# 1. Land on homepage
# 2. Click "Connect Wallet"
# 3. Connect wallet
# 4. Should redirect to /dashboard ✓
# 5. Click disconnect
# 6. Should redirect to landing ✓

git add .
git commit -m "Implement wallet connection and route protection"
```

---

## Phase 3: Backend API

### PROMPT 3.1: Initialize Hono.js Backend

**When to use:** After frontend foundation is ready

```
Initialize a production-ready Hono.js backend API server in the /backend directory.

REQUIREMENTS:

1. Create Hono.js project with TypeScript:
   - Framework: Hono (ultra-fast)
   - Runtime: Node.js (Bun compatible)
   - TypeScript with strict mode

2. Install dependencies:
   ```json
   {
     "hono": "latest",
     "@hono/zod-validator": "latest",
     "zod": "^3.x",
     "prisma": "latest",
     "@prisma/client": "latest",
     "viem": "^2.x",
     "dotenv": "latest",
     "groq-sdk": "latest",
     "ioredis": "latest"
   }
   ```

3. Create folder structure:
   ```
   /backend
     /src
       /routes           # API routes
         /auth.ts
         /signals.ts
         /portfolio.ts
         /trades.ts
       /middleware       # Custom middleware
         /auth.ts
         /cors.ts
         /error.ts
       /services         # Business logic
         /ai.service.ts
         /blockchain.service.ts
       /lib              # Utilities
         /db.ts          # Prisma client
         /redis.ts       # Redis client
         /logger.ts      # Logging
       /types            # TypeScript types
       /index.ts         # App entry
     /prisma
       schema.prisma     # Database schema
     .env.example
     tsconfig.json
     package.json
   ```

4. Create **src/index.ts**:
   - Initialize Hono app
   - Add CORS middleware
   - Add error handling
   - Setup routes
   - Start server on port 3001
   - Health check endpoint

5. Create **src/middleware/cors.ts**:
   - Allow frontend origin (localhost:3000)
   - Allow credentials
   - Proper headers

6. Create **src/middleware/error.ts**:
   - Global error handler
   - Proper error responses
   - Log errors

7. Create **.env.example**:
   ```
   DATABASE_URL=
   REDIS_URL=
   GROQ_API_KEY=
   BASE_SEPOLIA_RPC_URL=
   VAULT_ADDRESS=
   USDC_ADDRESS=
   GOLD_ADDRESS=
   JWT_SECRET=
   ```

8. Add scripts to package.json:
   - "dev": Run with tsx watch
   - "build": Compile TypeScript
   - "start": Run production build
   - "prisma:generate": Generate Prisma client
   - "prisma:migrate": Run migrations

Setup the basic server that can respond to requests.
```

**Expected Output:**
- Hono.js project initialized
- Dependencies installed
- Folder structure created
- Basic server running

**What to do after:**
```bash
cd backend
npm install

# Start dev server
npm run dev

# Test health check
curl http://localhost:3001/health

# Should see: {"status":"ok"} ✓

git add .
git commit -m "Initialize Hono.js backend API"
```

---

### PROMPT 3.2: Setup Prisma Database

**When to use:** After Hono server runs

```
Setup Prisma ORM with PostgreSQL database schema for GoldGuard AI.

REQUIREMENTS:

1. Initialize Prisma in /backend:
   - Run prisma init
   - Configure for PostgreSQL

2. Create **prisma/schema.prisma** with these models:

**User Model:**
```prisma
model User {
  id              String    @id @default(cuid())
  walletAddress   String    @unique
  createdAt       DateTime  @default(now())
  lastActiveAt    DateTime  @updatedAt
  settings        Json      @default("{}")
  
  portfolios      Portfolio[]
  trades          Trade[]
  signals         AISignal[]
  payments        Payment[]
  
  @@index([walletAddress])
}
```

**Portfolio Model:**
```prisma
model Portfolio {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  
  usdcAmount      Decimal   @default(0) @db.Decimal(18,6)
  goldAmount      Decimal   @default(0) @db.Decimal(18,8)
  totalValue      Decimal   @default(0) @db.Decimal(18,6)
  
  updatedAt       DateTime  @updatedAt
}
```

**Trade Model:**
```prisma
model Trade {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  
  action          String    // BUY_GOLD, SELL_GOLD
  amountIn        Decimal   @db.Decimal(18,6)
  amountOut       Decimal   @db.Decimal(18,8)
  price           Decimal   @db.Decimal(18,2)
  txHash          String
  status          String    @default("pending") // pending, completed, failed
  
  executedAt      DateTime  @default(now())
  
  @@index([userId])
  @@index([status])
}
```

**AISignal Model:**
```prisma
model AISignal {
  id                String    @id @default(cuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  
  action            String    // HOLD, BUY_GOLD, SELL_GOLD
  confidence        Int       // 0-100
  reasoning         String    @db.Text
  suggestedAmount   Decimal   @db.Decimal(18,6)
  goldPrice         Decimal   @db.Decimal(18,2)
  
  paid              Boolean   @default(false)
  executed          Boolean   @default(false)
  
  createdAt         DateTime  @default(now())
  
  @@index([userId])
  @@index([createdAt(sort: Desc)])
}
```

**Payment Model:**
```prisma
model Payment {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  
  amount          Decimal   @db.Decimal(18,6)
  currency        String    @default("USDC")
  purpose         String    // AI_SIGNAL, PREMIUM_FEATURE
  txHash          String?
  status          String    @default("pending") // pending, completed, failed, refunded
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([status])
}
```

3. Create **src/lib/db.ts**:
   - Initialize Prisma Client
   - Export singleton instance
   - Handle connection errors
   - Add logging in dev mode

4. Setup database:
   - For hackathon, use local SQLite (easier) OR
   - Use Neon/Supabase free tier PostgreSQL

5. Create initial migration:
   - Run prisma migrate dev --name init

6. Generate Prisma Client:
   - Run prisma generate

Include proper TypeScript types and error handling.
```

**Expected Output:**
- Prisma schema created
- Database migrated
- Prisma Client generated
- Database connection working

**What to do after:**
```bash
# If using PostgreSQL (Neon/Supabase):
# 1. Create free database
# 2. Add DATABASE_URL to .env

# If using SQLite (easier for hackathon):
# DATABASE_URL="file:./dev.db"

# Run migration
npx prisma migrate dev --name init

# Generate client
npx prisma generate

# View database (optional)
npx prisma studio

git add .
git commit -m "Setup Prisma database with schema"
```

---

### PROMPT 3.3: Create Authentication Routes

**When to use:** After database is ready

```
Implement wallet-based authentication using message signing and JWT tokens.

REQUIREMENTS:

Create authentication system that:
1. User requests a nonce
2. User signs nonce with wallet
3. Backend verifies signature
4. Backend returns JWT token
5. Token used for subsequent requests

IMPLEMENTATION:

1. Create **src/routes/auth.ts**:

**POST /auth/nonce** - Get nonce for signing
```typescript
- Generate random nonce (32 chars)
- Store in Redis with 5 min expiry
- Return nonce to user
```

**POST /auth/verify** - Verify signature and return JWT
```typescript
Input: { address, signature, nonce }
- Verify signature using viem
- Check if nonce exists and not expired
- Create/update user in database
- Generate JWT token (24h expiry)
- Return: { token, user, expiresIn }
```

**POST /auth/refresh** - Refresh expired token
```typescript
Input: { refreshToken }
- Verify refresh token
- Generate new JWT
- Return new token
```

2. Create **src/middleware/auth.ts**:
   - Verify JWT from Authorization header
   - Extract user from token
   - Attach user to context
   - Return 401 if invalid

3. Create **src/lib/jwt.ts**:
   - signJWT(payload) - Sign JWT
   - verifyJWT(token) - Verify JWT
   - Use HS256 algorithm
   - Include user address in payload

4. Create **src/lib/redis.ts**:
   - Setup Redis client
   - Methods for storing/getting nonces
   - Auto-expiry support

SECURITY:
- Nonces expire after 5 minutes
- JWT tokens expire after 24 hours
- Signature verification using viem
- Rate limiting on auth endpoints

ERROR HANDLING:
- Invalid signature → 401 Unauthorized
- Expired nonce → 400 Bad Request
- Missing token → 401 Unauthorized

Add comprehensive Zod validation for all inputs.
```

**Expected Output:**
- Auth routes implemented
- JWT middleware working
- Redis integration
- Signature verification

**What to do after:**
```bash
# Test authentication flow
# 1. POST /auth/nonce
curl -X POST http://localhost:3001/auth/nonce \
  -H "Content-Type: application/json"

# Should return: {"nonce":"..."} ✓

# 2. Sign nonce with wallet (use frontend)
# 3. POST /auth/verify with signature
# Should return: {"token":"...", "user":{...}} ✓

git add .
git commit -m "Add wallet authentication with JWT"
```

---

## Phase 4: AI Trading Engine

### PROMPT 4.1: Setup Groq AI Client

**When to use:** After backend auth is ready

```
Setup Groq AI client for generating trading signals.

REQUIREMENTS:

1. Create **src/lib/groq.ts**:
   - Initialize Groq client
   - Model: llama-3.3-70b-versatile
   - Temperature: 0.3 (consistent outputs)
   - Max tokens: 500
   - Timeout: 15 seconds
   - Error handling

2. Create **src/services/ai.service.ts** with:

**generateTradingSignal() function:**
```typescript
interface TradingSignalInput {
  goldPrice: number;
  priceChange24h: number;
  userPortfolio: {
    totalValue: number;
    usdcAmount: number;
    goldAmount: number;
    usdcPercentage: number;
    goldPercentage: number;
  };
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  inflationRate?: number;
}

interface TradingSignalOutput {
  action: 'BUY_GOLD' | 'SELL_GOLD' | 'HOLD';
  confidence: number; // 0-100
  reasoning: string;
  suggestedAmount: number;
}
```

**AI PROMPT TEMPLATE:**
Create a carefully crafted prompt that:
- Explains the user's goal (inflation protection)
- Provides current market data
- Shows user's portfolio state
- Defines trading strategy based on risk tolerance
- Requests JSON response with specific format

**STRATEGIES BY RISK LEVEL:**
- Conservative: Only trade on strong signals (>80% confidence), favor gold in high inflation
- Moderate: Maintain 50/50 balance, rebalance when drift >10%
- Aggressive: Active trading on 5%+ price movements

3. Create **src/lib/chainlink.ts**:
   - Function to fetch gold price from Chainlink oracle
   - Calculate 24h price change
   - Validate data freshness (<5 min old)
   - Fallback to backup oracle if needed
   - Use viem for contract reads

4. Add caching:
   - Cache AI responses for 15 minutes
   - Cache gold prices for 5 minutes
   - Use Redis for caching
   - Reduce API costs

GROQ API CONFIGURATION:
- Use streaming: false (get full response)
- Add retry logic (3 attempts)
- Log all AI requests for debugging
- Handle rate limits gracefully

ERROR HANDLING:
- Groq API error → return cached signal or safe HOLD
- Invalid AI response → retry with simpler prompt
- Parse errors → validate with Zod schema

Make sure AI responses are reliable, fast, and cost-effective.
```

**Expected Output:**
- Groq client initialized
- AI service with signal generation
- Chainlink price fetching
- Caching layer

**What to do after:**
```bash
# Add GROQ_API_KEY to .env
# Get it from: https://console.groq.com

# Test AI signal generation
# Create test endpoint or test file

git add .
git commit -m "Add Groq AI service for trading signals"
```

---

### PROMPT 4.2: Create Trading Signals API

**When to use:** After AI service is ready

```
Create API endpoints for generating and retrieving AI trading signals.

REQUIREMENTS:

1. Create **src/routes/signals.ts**:

**POST /api/signals** - Generate new AI signal (protected by x402)
```typescript
Authentication: Required (JWT)
x402 Payment: Required (0.01 USDC)

Flow:
1. Check if payment made (via x402 middleware)
2. Get user's portfolio from database
3. Fetch current gold price from Chainlink
4. Call AI service to generate signal
5. Save signal to database
6. Return signal to user

Response:
{
  action: 'BUY_GOLD' | 'SELL_GOLD' | 'HOLD',
  confidence: 85,
  reasoning: 'Gold price increasing due to inflation concerns...',
  suggestedAmount: 100,
  goldPrice: 2150.50,
  timestamp: 1234567890
}
```

**GET /api/signals/history** - Get user's signal history
```typescript
Authentication: Required (JWT)
Payment: Free

Query params:
- limit: number (default: 10, max: 100)
- offset: number (default: 0)

Response:
{
  signals: [...],
  total: 42,
  hasMore: true
}
```

**GET /api/signals/latest** - Get latest signal (if already paid)
```typescript
Authentication: Required (JWT)
Payment: Free (if signal generated in last 15 min)

Returns cached signal or 402 Payment Required
```

2. Add validation:
   - Validate all inputs with Zod
   - Check user has sufficient portfolio value
   - Rate limit: 10 signals per hour per user

3. Add analytics tracking:
   - Log every signal generation
   - Track signal performance (was it profitable?)
   - Store for future AI improvements

4. Error responses:
   - No portfolio → "Please deposit funds first"
   - Payment required → 402 status with payment details
   - AI error → "Signal generation failed, try again"
   - Rate limit → "Too many requests, wait X minutes"

Make the API robust with proper error handling and clear messages.
```

**Expected Output:**
- Signal generation endpoint
- Signal history endpoint
- Validation and error handling
- Rate limiting

**What to do after:**
```bash
# Test signal generation
# (Will need x402 integration first for full flow)

# For now, test without payment:
curl -X POST http://localhost:3001/api/signals \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json"

git add .
git commit -m "Add trading signals API endpoints"
```

---

### PROMPT 4.3: Integrate x402 Payment Middleware

**When to use:** After signals API is created

```
Integrate x402 protocol for micropayments on AI signal requests.

CONTEXT:
x402 is like HTTP 402 Payment Required, but for crypto. When user requests a paid endpoint, they get a 402 response with payment details. After paying, they can retry the request.

REQUIREMENTS:

1. Install x402 package:
   ```bash
   npm install @x402/hono  # Or relevant package
   ```

2. Create **src/middleware/x402.ts**:
   - x402 payment middleware
   - Price: 0.01 USDC
   - Payment facilitator address (for verification)
   - Payment verification logic

3. Add to signals route:
   ```typescript
   app.post('/api/signals',
     authMiddleware,
     x402Middleware({
       price: 0.01,
       currency: 'USDC',
       network: 'base-sepolia',
       facilitatorAddress: process.env.X402_FACILITATOR
     }),
     async (c) => {
       // Generate AI signal
     }
   );
   ```

4. Payment verification:
   - Check payment transaction on-chain
   - Verify amount and recipient
   - Cache payment for 15 minutes
   - Allow free retry within cache window

5. Create **src/services/payment.service.ts**:
   ```typescript
   verifyPayment(txHash: string, userAddress: string)
   - Fetch transaction from Base Sepolia
   - Verify it's a USDC transfer
   - Verify amount is 0.01 USDC
   - Verify recipient is x402 facilitator
   - Return: boolean
   ```

6. Error handling:
   - Payment pending → "Please wait for confirmation"
   - Insufficient payment → "Amount too low"
   - Wrong recipient → "Invalid payment"
   - Payment expired → "Please pay again"

7. Database logging:
   - Save all payments to Payment model
   - Track payment status
   - Link to generated signal

For MVP, if x402 SDK is complex, implement a simpler version:
- User pays 0.01 USDC to specific address
- Backend verifies transaction
- Backend allows request if payment found

Make sure payment verification is secure and reliable.
```

**Expected Output:**
- x402 middleware integrated
- Payment verification working
- Error handling for payment issues
- Database logging

**What to do after:**
```bash
# Test payment flow:
# 1. POST /api/signals without payment
#    → Should get 402 with payment details
# 2. Make payment via frontend
# 3. POST /api/signals with payment proof
#    → Should get signal ✓

git add .
git commit -m "Integrate x402 micropayments for AI signals"
```

---

## Phase 5: Integration

### PROMPT 5.1: Create Portfolio Management System

**When to use:** After AI and payment systems are ready

```
Build the portfolio management system that tracks user deposits, positions, and values.

REQUIREMENTS:

1. Create **src/routes/portfolio.ts**:

**GET /api/portfolio** - Get user's current portfolio
```typescript
Authentication: Required

Response:
{
  totalValue: 1247.85,  // USD
  assets: {
    usdc: 810.10,
    gold: 437.75
  },
  positions: {
    usdcAmount: 810.10,
    goldAmount: 0.203,     // XAU tokens
    usdcPercent: 65,
    goldPercent: 35
  },
  change24h: {
    value: 47.85,
    percent: 3.98
  },
  lastUpdated: timestamp
}
```

**GET /api/portfolio/history** - Historical portfolio values
```typescript
Query: ?period=7d (7d, 30d, 90d, 1y, all)

Response:
{
  period: '7d',
  data: [
    { timestamp: ..., value: 1200 },
    { timestamp: ..., value: 1215 },
    ...
  ],
  startValue: 1150,
  endValue: 1247.85,
  change: 97.85,
  changePercent: 8.5
}
```

2. Create **src/services/blockchain.service.ts**:
   - Fetch user's vault balance from smart contract
   - Fetch user's position (USDC vs Gold amounts)
   - Calculate total value using Chainlink price
   - Cache results for 30 seconds

3. Create **src/services/portfolio.service.ts**:
   - `getUserPortfolio(address)` - Get current portfolio
   - `getHistoricalValue(address, period)` - Get historical data
   - `updatePortfolio(address)` - Sync with blockchain
   - `calculateROI(address)` - Calculate return on investment

4. Add background job (optional for MVP):
   - Periodically update portfolio values in DB
   - Store snapshots for historical data
   - Run every 5 minutes
   - Use node-cron or similar

5. Portfolio value calculation:
   ```typescript
   totalValue = usdcAmount + (goldAmount * goldPriceUSD)
   
   usdcPercent = (usdcAmount / totalValue) * 100
   goldPercent = (goldAmount * goldPriceUSD / totalValue) * 100
   
   change24h = currentValue - value24hAgo
   changePercent = (change24h / value24hAgo) * 100
   ```

6. Error handling:
   - RPC error → use cached data
   - No position → return empty portfolio
   - Stale price → use last known good price

Make it efficient with proper caching to avoid excessive RPC calls.
```

**Expected Output:**
- Portfolio endpoints
- Blockchain service for contract reads
- Value calculation logic
- Historical data tracking

**What to do after:**
```bash
# Test portfolio endpoint
curl http://localhost:3001/api/portfolio \
  -H "Authorization: Bearer YOUR_JWT"

# Should return portfolio data ✓

git add .
git commit -m "Add portfolio management system"
```

---

### PROMPT 5.2: Create Trade Execution System

**When to use:** After portfolio system is ready

```
Build the trade execution system that monitors on-chain trades and updates the database.

REQUIREMENTS:

1. Create **src/routes/trades.ts**:

**POST /api/trades** - Record a trade (called by frontend after on-chain execution)
```typescript
Authentication: Required

Input:
{
  txHash: '0x...',
  action: 'BUY_GOLD' | 'SELL_GOLD',
  amountIn: 100,
  expectedAmountOut: 0.046
}

Flow:
1. Verify transaction on-chain
2. Check if trade succeeded
3. Extract actual amounts from event logs
4. Save to database
5. Update user's portfolio
6. Return trade details
```

**GET /api/trades** - Get user's trade history
```typescript
Authentication: Required

Query params:
- limit: number (default: 20)
- offset: number
- status: 'pending' | 'completed' | 'failed' (optional)

Response:
{
  trades: [
    {
      id: '...',
      action: 'BUY_GOLD',
      amountIn: 100,
      amountOut: 0.046,
      price: 2173.91,
      profit: 5.20,
      status: 'completed',
      txHash: '0x...',
      executedAt: timestamp
    },
    ...
  ],
  total: 42
}
```

**GET /api/trades/:id** - Get single trade details
```typescript
Response:
{
  trade: {...},
  signal: {...},  // Associated AI signal if exists
  portfolio: {...}  // Portfolio state after this trade
}
```

2. Create **src/services/trade.service.ts**:
   - `verifyTrade(txHash)` - Verify transaction on-chain using viem
   - `extractTradeData(receipt)` - Parse event logs for amounts
   - `calculateProfit(trade)` - Calculate profit/loss
   - `updateAfterTrade(userId, trade)` - Update portfolio

3. Transaction verification:
   ```typescript
   - Fetch transaction receipt using viem
   - Check if transaction succeeded (status === 1)
   - Parse TradeExecuted event from vault contract
   - Extract: user, buyGold, amountIn, amountOut
   - Verify user matches authenticated user
   ```

4. Event parsing:
   ```typescript
   const logs = receipt.logs.filter(log => 
     log.address === VAULT_ADDRESS &&
     log.topics[0] === TRADE_EXECUTED_TOPIC
   );
   
   const event = decodeEventLog({
     abi: VAULT_ABI,
     data: logs[0].data,
     topics: logs[0].topics
   });
   ```

5. Add analytics:
   - Track total trades per user
   - Calculate win rate
   - Track average profit per trade
   - Store for portfolio analytics

Make transaction verification robust and accurate.
```

**Expected Output:**
- Trade recording endpoint
- Trade history endpoint
- Transaction verification
- Event log parsing

**What to do after:**
```bash
# Test trade recording
# (Need to execute actual on-chain trade first)

git add .
git commit -m "Add trade execution and recording system"
```

---

### PROMPT 5.3: Connect Frontend to Backend

**When to use:** After backend endpoints are complete

```
Connect the frontend to backend API and implement all data fetching.

REQUIREMENTS:

1. Create **frontend/lib/api/client.ts**:
   - Axios or fetch wrapper
   - Base URL from env
   - Add JWT token to headers
   - Handle 401 (redirect to login)
   - Handle 402 (trigger payment)
   - Error handling

2. Create **frontend/lib/api/endpoints.ts**:
   ```typescript
   // Auth
   export const auth = {
     getNonce: () => api.post('/auth/nonce'),
     verify: (data) => api.post('/auth/verify', data),
     refresh: (token) => api.post('/auth/refresh', { token })
   };
   
   // Signals
   export const signals = {
     generate: () => api.post('/api/signals'),
     getHistory: (limit) => api.get(`/api/signals/history?limit=${limit}`),
     getLatest: () => api.get('/api/signals/latest')
   };
   
   // Portfolio
   export const portfolio = {
     get: () => api.get('/api/portfolio'),
     getHistory: (period) => api.get(`/api/portfolio/history?period=${period}`)
   };
   
   // Trades
   export const trades = {
     record: (data) => api.post('/api/trades', data),
     getHistory: (limit) => api.get(`/api/trades?limit=${limit}`),
     getById: (id) => api.get(`/api/trades/${id}`)
   };
   ```

3. Create React Query hooks in **frontend/hooks/api/**:
   
   **usePortfolio.ts:**
   ```typescript
   export function usePortfolio() {
     return useQuery({
       queryKey: ['portfolio'],
       queryFn: () => portfolio.get(),
       refetchInterval: 30000, // Refresh every 30s
       staleTime: 20000
     });
   }
   ```
   
   **useSignals.ts:**
   ```typescript
   export function useGenerateSignal() {
     return useMutation({
       mutationFn: () => signals.generate(),
       onSuccess: (data) => {
         // Handle payment if 402
         // Show signal if successful
       }
     });
   }
   ```

4. Implement authentication flow:
   - Sign nonce with wallet (use Wagmi's signMessage)
   - Send signature to backend
   - Store JWT in localStorage
   - Add token to all API requests
   - Refresh token on expiry

5. Handle x402 payments:
   - Detect 402 response
   - Extract payment details
   - Show payment modal
   - Execute USDC transfer
   - Retry request after payment

6. Error handling:
   - Network errors → retry with exponential backoff
   - 401 → refresh token or re-authenticate
   - 402 → trigger payment flow
   - 500 → show error toast
   - Rate limit → show "please wait" message

Add proper loading states and error messages throughout.
```

**Expected Output:**
- API client configured
- React Query hooks for all endpoints
- Authentication flow working
- Payment handling implemented
- Error handling comprehensive

**What to do after:**
```bash
# Test full flow:
# 1. Connect wallet → authenticate
# 2. View portfolio → data loads
# 3. Generate signal → payment prompt
# 4. Execute trade → record in DB
# All working ✓

git add .
git commit -m "Connect frontend to backend API"
```

---

### PROMPT 5.4: Build Dashboard with Real Data

**When to use:** After API integration is working

```
Build the complete dashboard page with real data from backend and blockchain.

REQUIREMENTS:

Update **frontend/app/(main)/dashboard/page.tsx** to show:

1. **Portfolio Value Card** (Top)
   - Large number: Total value in USD
   - 24h change (green if up, red if down)
   - Small sparkline chart showing 7d trend
   - Use data from usePortfolio() hook

2. **Asset Allocation Card**
   - Donut/Pie chart or horizontal bar
   - Show % USDC vs % Gold
   - Exact amounts below
   - Visual color coding (blue for USDC, gold for Gold)

3. **AI Status Card**
   - Current AI recommendation: BUY, SELL, or HOLD
   - Last signal time
   - "Get New Signal" button (with payment)
   - Show confidence score

4. **Quick Actions**
   - Deposit button
   - Withdraw button
   - View Trades button
   - Settings button

5. **Recent Trades** (Bottom)
   - List of 5 most recent trades
   - Show: action, amount, profit/loss, time
   - "View All" link to /portfolio

COMPONENTS TO CREATE:

**components/dashboard/PortfolioValueCard.tsx:**
- Fetch data with usePortfolio()
- Show loading skeleton
- Display value with currency formatting
- Show change with color coding

**components/dashboard/AssetAllocationChart.tsx:**
- Use Recharts PieChart or BarChart
- Custom colors (gold and blue)
- Responsive sizing
- Show percentages

**components/dashboard/AIStatusCard.tsx:**
- Fetch latest signal
- Show recommendation clearly
- "Unlock Signal" button (x402 payment)
- After payment, show full reasoning

**components/dashboard/RecentTradesList.tsx:**
- Fetch with useTrades()
- Map through trades
- Show as list items
- Format amounts and timestamps

EMPTY STATES:
- No deposits yet → "Make your first deposit"
- No trades yet → "Your trades will appear here"
- No signals yet → "Get your first AI signal"

LOADING STATES:
- Skeleton components while fetching
- Smooth transitions
- No layout shift

REAL-TIME UPDATES:
- Use React Query's refetchInterval
- Update portfolio every 30 seconds
- Update gold price every 60 seconds
- Optimistic updates on user actions

Make it look professional and polished with smooth animations.
```

**Expected Output:**
- Complete dashboard with real data
- All components implemented
- Charts working
- Empty and loading states
- Real-time updates

**What to do after:**
```bash
# View dashboard
# All data should load from API ✓
# Charts should render ✓
# Actions should work ✓

git add .
git commit -m "Build complete dashboard with real data"
```

---

### PROMPT 5.5: Build Trading Page

**When to use:** After dashboard is complete

```
Build the trading page where users can view AI signals and execute trades.

REQUIREMENTS:

Create **frontend/app/(main)/trading/page.tsx** with:

1. **Gold Price Chart** (Top)
   - Line chart showing gold price over time
   - Timeframe selector: 1H, 24H, 7D, 30D
   - Current price (large, prominent)
   - 24h change percentage
   - Use Recharts LineChart

2. **AI Signal Card** (Center)
   - If no signal: "Get AI Signal" button (with payment prompt)
   - If signal exists:
     - Action badge: BUY / SELL / HOLD (color-coded)
     - Confidence meter (visual bar 0-100%)
     - Reasoning (AI explanation)
     - Suggested amount
     - Timestamp
   - "Execute Trade" button (if BUY/SELL)

3. **Trade Execution Modal**
   - Triggered by "Execute Trade"
   - Show trade preview:
     - Swap: X USDC → Y XAU (or reverse)
     - Expected price
     - Slippage tolerance (adjustable)
     - Gas fee estimate
   - "Confirm Trade" button
   - Execute via smart contract
   - Show transaction status
   - Success confirmation

4. **Signal History** (Bottom)
   - Tabs: "My Signals" | "All Signals"
   - List past signals with outcomes
   - Show if executed and profit/loss
   - Filter by action (BUY/SELL/HOLD)

COMPONENTS TO CREATE:

**components/trading/GoldPriceChart.tsx:**
- Fetch historical prices
- Recharts LineChart
- Timeframe selector
- Responsive design
- Show current price and change

**components/trading/SignalCard.tsx:**
- Display AI signal
- Payment gate for new signals
- Execute trade button
- Loading states

**components/trading/TradeModal.tsx:**
- Trade preview calculations
- Slippage settings
- Gas estimation
- Execute via Wagmi useWriteContract
- Transaction progress tracking

**components/trading/SignalHistory.tsx:**
- Fetch signal history
- Filter and sort
- Show outcomes
- Link to trades

BLOCKCHAIN INTERACTION:
- Use Wagmi's useWriteContract for trades
- Use useWaitForTransactionReceipt for confirmation
- Simulate transaction before execution
- Handle errors gracefully

CALCULATIONS:
```typescript
// Buy Gold
const goldAmount = usdcAmount / goldPrice;
const goldAmountWithSlippage = goldAmount * (1 - slippage);

// Sell Gold
const usdcAmount = goldAmount * goldPrice;
const usdcAmountWithSlippage = usdcAmount * (1 - slippage);
```

UX CONSIDERATIONS:
- Show all fees upfront
- Confirm before executing
- Show clear success/error messages
- Update portfolio immediately (optimistic)
- Link to BaseScan for transaction

Make trading feel safe, transparent, and professional.
```

**Expected Output:**
- Trading page with price chart
- AI signal display and generation
- Trade execution flow
- Signal history
- All blockchain interactions working

**What to do after:**
```bash
# Test full trading flow:
# 1. Generate signal (pay 0.01 USDC)
# 2. View signal and reasoning
# 3. Execute trade
# 4. Confirm on-chain
# 5. See portfolio update
# All working ✓

git add .
git commit -m "Build trading page with signal generation and execution"
```

---

## Phase 6: Polish & Deploy

### PROMPT 6.1: Add Portfolio Analytics Page

**When to use:** After trading page works

```
Build the portfolio analytics page with comprehensive performance metrics.

REQUIREMENTS:

Create **frontend/app/(main)/portfolio/page.tsx** with:

1. **Performance Overview** (Top)
   - Total ROI (% and USD)
   - vs. Holding USDC (comparison)
   - vs. Holding Gold (comparison)
   - Win rate (% of profitable trades)

2. **Value Chart** (Main)
   - Line chart showing portfolio value over time
   - Period selector: 7D, 30D, 90D, ALL
   - Toggle: Show USDC value, Gold value, Total
   - Mark trade points on chart
   - Use Recharts AreaChart or LineChart

3. **Best & Worst Trades**
   - Two cards side-by-side
   - Best trade: Highest profit
   - Worst trade: Biggest loss
   - Show details: date, action, amounts, profit/loss

4. **Trade History Table**
   - Sortable columns: Date, Action, Amount, Price, Profit/Loss
   - Filter by: Action, Date range, Profit/Loss
   - Pagination (20 per page)
   - Export to CSV button

5. **Asset Breakdown**
   - Current holdings
   - Average buy price (for gold)
   - Unrealized P&L
   - Realized P&L

COMPONENTS TO CREATE:

**components/portfolio/PerformanceMetrics.tsx:**
- Fetch analytics from API
- Display key metrics
- Color coding (green/red)
- Comparison charts (mini)

**components/portfolio/ValueChart.tsx:**
- Historical value data
- Multiple data series
- Period selection
- Trade markers
- Tooltips on hover

**components/portfolio/TradeTable.tsx:**
- Data table with all trades
- Sorting and filtering
- Pagination
- Export functionality
- Mobile responsive

**components/portfolio/BestWorstTrades.tsx:**
- Fetch and sort trades
- Show top and bottom
- Clear visual distinction

CALCULATIONS:
```typescript
// ROI
const roi = ((currentValue - totalDeposited) / totalDeposited) * 100;

// vs USDC
const usdcValue = totalDeposited; // Would have if just held USDC
const vsUSDC = currentValue - usdcValue;

// Win Rate
const profitableTrades = trades.filter(t => t.profit > 0).length;
const winRate = (profitableTrades / totalTrades) * 100;
```

EXPORT FUNCTIONALITY:
- Generate CSV from trade data
- Include all fields
- Proper date formatting
- Trigger download

Make it informative and professional - like a real trading dashboard.
```

**Expected Output:**
- Portfolio analytics page
- Performance metrics
- Historical charts
- Trade table with export
- Best/worst trades

**What to do after:**
```bash
# View portfolio page
# All analytics should display ✓
# Export CSV should work ✓
# Charts should be interactive ✓

git add .
git commit -m "Add portfolio analytics page"
```

---

### PROMPT 6.2: Create Settings Page

**When to use:** After portfolio page is done

```
Build the settings page for user preferences and app configuration.

REQUIREMENTS:

Create **frontend/app/(main)/settings/page.tsx** with:

1. **Risk Tolerance Settings**
   - Radio buttons: Conservative / Moderate / Aggressive
   - Description for each level
   - Save to backend
   - Show current selection

2. **Notification Preferences**
   - Toggle: New signal available
   - Toggle: Trade executed
   - Toggle: Portfolio milestones
   - Toggle: Price alerts
   - Save preferences

3. **Trading Preferences**
   - Slippage tolerance (slider 0.1% - 5%)
   - Max trade size (% of portfolio)
   - Auto-execute trades (toggle)

4. **Account Information**
   - Connected wallet (with identicon)
   - Member since date
   - Total deposits
   - Total withdrawals
   - Network (Base Sepolia)

5. **Actions**
   - Export all data (JSON)
   - Clear trade history (dangerous)
   - Disconnect wallet
   - Delete account (very dangerous)

6. **About Section**
   - App version
   - Links to:
     - Documentation
     - GitHub
     - Twitter
     - Discord
   - Privacy policy
   - Terms of service

COMPONENTS TO CREATE:

**components/settings/RiskToleranceSelector.tsx:**
- Radio group
- Visual icons for each level
- Save on change
- Show current selection

**components/settings/NotificationToggles.tsx:**
- Toggle switches
- Save preferences to backend
- Show enabled/disabled state

**components/settings/TradingPreferences.tsx:**
- Slippage slider
- Trade size input
- Auto-execute toggle
- Validation and limits

**components/settings/AccountInfo.tsx:**
- Display wallet info
- Show statistics
- Network badge
- Identicon from OnchainKit

**components/settings/DangerZone.tsx:**
- Destructive actions
- Confirmation dialogs
- Clear warnings
- Red color coding

FUNCTIONALITY:
- Save settings to backend
- Update immediately
- Show success toasts
- Confirm destructive actions
- Disconnect wallet properly

Make it clean, organized, and safe (with confirmations for dangerous actions).
```

**Expected Output:**
- Settings page complete
- All preferences configurable
- Settings persist to backend
- Dangerous actions protected
- Account info displayed

**What to do after:**
```bash
# Test settings:
# 1. Change risk tolerance → saves ✓
# 2. Toggle notifications → saves ✓
# 3. Disconnect wallet → redirects ✓

git add .
git commit -m "Add settings page with preferences"
```

---

### PROMPT 6.3: Add Deposit & Withdraw Flows

**When to use:** After all pages are built

```
Implement the complete deposit and withdrawal flows with proper UX.

REQUIREMENTS:

1. Create **components/shared/DepositModal.tsx**:
   - Triggered from dashboard "Deposit" button
   - Input field for USDC amount
   - Show current wallet balance
   - "Max" button to deposit all
   - Validation (sufficient balance, minimum amount)
   - Two transactions:
     1. Approve USDC (if needed)
     2. Deposit to vault
   - Show transaction progress
   - Success confirmation
   - Link to BaseScan

2. Create **components/shared/WithdrawModal.tsx**:
   - Input field for amount
   - Show available vault balance
   - "Max" button to withdraw all
   - Preview what you'll receive
   - Note if gold will be converted
   - Execute withdrawal
   - Transaction progress
   - Success confirmation

3. DEPOSIT FLOW:
   ```
   1. User clicks "Deposit"
   2. Modal opens
   3. User enters amount
   4. Check USDC approval:
      - If not approved → approve first
      - If approved → skip to deposit
   5. Execute deposit transaction
   6. Wait for confirmation
   7. Update portfolio (optimistic)
   8. Show success message
   9. Close modal
   ```

4. WITHDRAW FLOW:
   ```
   1. User clicks "Withdraw"
   2. Modal opens
   3. User enters amount
   4. Show preview:
      - Converting 0.05 XAU → USDC
      - Total withdrawal: X USDC
      - Gas fee: ~$Y
   5. Execute withdrawal
   6. Wait for confirmation
   7. Update portfolio
   8. Show success
   9. Close modal
   ```

5. ERROR HANDLING:
   - Insufficient balance → "Not enough USDC"
   - Insufficient gas → "Need ETH for gas"
   - Transaction rejected → "Transaction cancelled"
   - Network error → "Please try again"
   - Show all errors clearly

6. LOADING STATES:
   - Checking approval...
   - Approving USDC...
   - Depositing...
   - Withdrawing...
   - Converting gold...
   - Confirming transaction...

Use Wagmi hooks:
- useReadContract (check approval)
- useWriteContract (approve, deposit, withdraw)
- useWaitForTransactionReceipt (confirmation)
- useBalance (check USDC balance)

Add animations for smooth UX (modal entrance, success checkmark, etc).
```

**Expected Output:**
- Deposit modal with full flow
- Withdraw modal with conversion
- Transaction tracking
- Error handling
- Success states

**What to do after:**
```bash
# Test deposit flow:
# 1. Click deposit
# 2. Enter amount
# 3. Approve (if needed)
# 4. Confirm deposit
# 5. Wait for confirmation
# 6. Portfolio updates ✓

# Test withdraw flow:
# 1. Click withdraw
# 2. Enter amount
# 3. Confirm withdrawal
# 4. Wait for confirmation
# 5. USDC back in wallet ✓

git add .
git commit -m "Add deposit and withdraw flows"
```

---

### PROMPT 6.4: Polish UI/UX

**When to use:** After all features work

```
Polish the entire app UI/UX to make it look and feel professional.

REQUIREMENTS:

1. **Animations**
   - Add Framer Motion for:
     - Page transitions
     - Modal enter/exit
     - Button hover states
     - Success checkmarks
     - Loading spinners
   - Keep animations subtle (not overwhelming)
   - 60fps performance

2. **Loading States**
   - Replace all loading spinners with:
     - Skeleton loaders (for cards)
     - Progress bars (for transactions)
     - Shimmer effects (for lists)
   - Use Shadcn Skeleton component

3. **Empty States**
   - Add illustrations or icons
   - Clear call-to-action
   - Helpful messaging
   - Examples:
     - No deposits: "Make your first deposit to start"
     - No trades: "Your trades will appear here"
     - No signals: "Get your first AI signal"

4. **Error States**
   - Friendly error messages (no tech jargon)
   - Suggested solutions
   - Retry buttons
   - Support links
   - Use toast notifications from Shadcn

5. **Success States**
   - Celebratory animations (confetti for first deposit)
   - Success checkmarks
   - Clear next steps
   - Share buttons (optional)

6. **Micro-interactions**
   - Button press animations
   - Hover states on cards
   - Active tab indicators
   - Input focus effects
   - Smooth scrolling

7. **Typography**
   - Consistent heading sizes
   - Readable font sizes (min 16px)
   - Proper line height
   - Color contrast for accessibility

8. **Colors**
   - Consistent color palette
   - Semantic colors (red for danger, green for success)
   - Dark theme optimized
   - Gold accents for brand

9. **Mobile Optimization**
   - All buttons thumb-reachable
   - No horizontal scroll
   - Proper spacing (44px min touch targets)
   - Bottom nav safe area

10. **Performance**
    - Lazy load images
    - Code splitting
    - Optimize bundle size
    - Remove unused code
    - Add meta tags for SEO

Go through every page and make it pixel-perfect.
```

**Expected Output:**
- Smooth animations throughout
- Professional loading states
- Helpful empty states
- Clear error messages
- Delightful micro-interactions
- Mobile-optimized
- Fast performance

**What to do after:**
```bash
# Review every page:
# - Landing ✓
# - Dashboard ✓
# - Trading ✓
# - Portfolio ✓
# - Settings ✓

# Test on mobile device
# Test all interactions
# Check loading states
# Verify error handling

git add .
git commit -m "Polish UI/UX with animations and states"
```

---

### PROMPT 6.5: Prepare for Deployment

**When to use:** After UI polish is complete

```
Prepare the entire application for production deployment.

REQUIREMENTS:

1. **Environment Configuration**
   
   Frontend (.env.production):
   ```
   NEXT_PUBLIC_CHAIN_ID=8453  # Base Mainnet
   NEXT_PUBLIC_VAULT_ADDRESS=0x...
   NEXT_PUBLIC_USDC_ADDRESS=0x...
   NEXT_PUBLIC_GOLD_ADDRESS=0x...
   NEXT_PUBLIC_API_URL=https://api.goldguard.ai
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
   ```
   
   Backend (.env.production):
   ```
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   GROQ_API_KEY=...
   BASE_RPC_URL=https://mainnet.base.org
   JWT_SECRET=...
   X402_FACILITATOR=...
   VAULT_ADDRESS=...
   ```

2. **Frontend Deployment (Vercel)**
   
   Create **vercel.json**:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "env": {
       "NEXT_PUBLIC_CHAIN_ID": "@chain_id",
       "NEXT_PUBLIC_API_URL": "@api_url"
     }
   }
   ```
   
   Steps:
   - Connect GitHub repo to Vercel
   - Set environment variables
   - Configure custom domain (optional)
   - Enable Web Analytics
   - Setup preview deployments

3. **Backend Deployment (Railway/Render)**
   
   Create **Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["npm", "start"]
   ```
   
   Create **railway.json** or **render.yaml**:
   - Set environment variables
   - Configure auto-deploy
   - Setup database
   - Add Redis instance

4. **Database Setup (Neon/Supabase)**
   - Create production database
   - Run migrations: `npx prisma migrate deploy`
   - Setup connection pooling
   - Enable backups

5. **Smart Contracts (Base Mainnet)**
   - Audit contracts (if possible)
   - Deploy to Base Mainnet
   - Verify on BaseScan
   - Transfer ownership to multi-sig (if team)
   - Fund with initial liquidity

6. **Monitoring & Analytics**
   - Setup Sentry for error tracking
   - Add PostHog for analytics
   - Configure logging (Winston)
   - Setup uptime monitoring
   - Add performance monitoring

7. **Documentation**
   
   Update **README.md**:
   - Clear description
   - Setup instructions
   - Environment variables guide
   - Deployment guide
   - Contributing guide
   - License

   Create **DEPLOYMENT.md**:
   - Step-by-step deployment guide
   - Environment setup
   - Database migration steps
   - Troubleshooting section

8. **Security Checklist**
   - [ ] All secrets in environment variables
   - [ ] Rate limiting enabled
   - [ ] CORS configured properly
   - [ ] Input validation everywhere
   - [ ] SQL injection prevention
   - [ ] XSS protection
   - [ ] CSRF tokens (if needed)
   - [ ] HTTPS enforced
   - [ ] Security headers set

9. **Performance Optimization**
   - Run Lighthouse audit (score >90)
   - Optimize images (WebP, lazy load)
   - Enable caching
   - Minify CSS/JS
   - Enable compression (gzip)
   - Setup CDN for static assets

10. **Final Testing**
    - End-to-end tests
    - Load testing
    - Security testing
    - Cross-browser testing
    - Mobile testing

Create deployment checklists and documentation.
```

**Expected Output:**
- Production environment configured
- Deployment scripts ready
- Documentation complete
- Monitoring setup
- Security checklist completed

**What to do after:**
```bash
# Deploy Frontend
cd frontend
vercel --prod

# Deploy Backend
cd backend
railway up  # or render deploy

# Deploy Contracts (if not done)
cd contracts
npx hardhat run scripts/deploy-all.ts --network base

# Test production:
# 1. Open app URL
# 2. Connect wallet
# 3. Test all flows
# 4. Check monitoring dashboards

git add .
git commit -m "Prepare for production deployment"
git tag v1.0.0
git push origin main --tags
```

---

### PROMPT 6.6: Create Demo & Documentation

**When to use:** After deployment to production

```
Create comprehensive demo materials and documentation for hackathon submission.

REQUIREMENTS:

1. **Demo Video** (2-3 minutes)
   
   Create script for recording:
   ```
   [0:00-0:15] Hook
   - Show inflation chart
   - "Your money is losing value"
   
   [0:15-0:45] Problem
   - Traditional solutions are complex
   - Active trading is time-consuming
   - High fees eat returns
   
   [0:45-1:30] Solution Demo
   - Open app on phone
   - Connect wallet (one tap)
   - Deposit USDC
   - Get AI signal (pay 0.01 USDC)
   - Execute trade
   - Show portfolio update
   
   [1:30-2:00] Innovation Highlights
   - First x402 trading bot
   - AI-powered decisions
   - Base Mini App distribution
   - Chainlink price feeds
   
   [2:00-2:30] Results
   - Show portfolio performance
   - Compare to holding USD
   - Show trades executed
   
   [2:30-3:00] Call to Action
   - Available now on Base
   - Try it in Coinbase Wallet
   - Link in description
   ```
   
   Tools: Loom, OBS, or ScreenStudio
   
   Tips:
   - Use demo account with fake data
   - Clear, concise narration
   - Show actual product, not slides
   - Mobile screen recording
   - Add captions

2. **README.md** (Comprehensive)
   
   Sections:
   - Logo and tagline
   - Badges (build status, license)
   - One-line description
   - Features list (with emojis)
   - How it works (diagram)
   - Tech stack
   - Architecture diagram
   - Demo video embed
   - Screenshots
   - Getting started (quick)
   - Full documentation link
   - Contributing guide
   - Team
   - License
   - Acknowledgments
   
   Make it visually appealing with:
   - Headers and sections
   - Screenshots
   - Code blocks
   - Tables
   - Emojis for readability

3. **ARCHITECTURE.md**
   
   Include:
   - System architecture diagram
   - Data flow diagrams
   - Smart contract architecture
   - API endpoint documentation
   - Database schema
   - Tech stack details
   - Design decisions
   - Trade-offs made

4. **API_DOCS.md**
   
   Document all endpoints:
   - Base URL
   - Authentication
   - Rate limits
   - Endpoints (with examples)
   - Error codes
   - Webhooks (if any)
   - SDKs (future)

5. **PITCH_DECK.md** (For presentation)
   
   Slides:
   1. Title + Team
   2. The Problem
   3. The Solution
   4. How It Works
   5. Innovation (x402, AI, Base)
   6. Demo
   7. Tech Stack
   8. Market Opportunity
   9. Traction (even if test data)
   10. Next Steps
   11. Ask (if applicable)
   
   Format as Markdown that can be:
   - Converted to slides (Marp)
   - Presented as-is
   - Turned into PDF

6. **Screenshots**
   
   Take high-quality screenshots:
   - Landing page
   - Dashboard
   - Trading view
   - Portfolio analytics
   - Settings
   - Mobile views
   - Transaction flows
   
   Use mockups (shots.so, cleanshot)

7. **Social Media Assets**
   
   Create:
   - Twitter thread (10 tweets)
   - LinkedIn post
   - Product Hunt description
   - Farcaster cast
   - Discord announcement
   
   Include:
   - Value proposition
   - Key features
   - Demo link
   - Call to action
   - Relevant hashtags

8. **Hackathon Submission**
   
   Prepare:
   - Project description (200 words)
   - Tech stack list
   - GitHub repo link
   - Demo video link
   - Live demo link
   - Team information
   - Challenges faced
   - Future plans
   - Any special instructions for judges

Make everything clear, professional, and impressive.
```

**Expected Output:**
- Demo video (2-3 min)
- Complete README
- Architecture docs
- API documentation
- Pitch deck
- Screenshots
- Social media posts ready
- Hackathon submission complete

**What to do after:**
```bash
# Review all documentation
# Record demo video
# Take screenshots
# Prepare pitch deck
# Submit to hackathon 🎉

git add .
git commit -m "Add demo materials and documentation"
```

---

## Troubleshooting Prompts

### When You Get Stuck

**General Debugging Prompt:**
```
I'm encountering an issue with [specific feature/component]. Here's the error:

[Paste error message]

Here's the relevant code:

[Paste code]

Please help me:
1. Understand what's causing this error
2. Fix the issue
3. Explain why it happened
4. Suggest best practices to prevent similar issues

Additional context: [Any other relevant info]
```

---

**Smart Contract Error:**
```
My smart contract transaction is reverting with this error:

[Error message]

Contract code:
[Paste function]

How I'm calling it:
[Paste interaction code]

Please:
1. Identify why it's reverting
2. Show me the fix
3. Add better error messages
4. Suggest testing approach
```

---

**Frontend Build Error:**
```
My Next.js build is failing with:

[Error message]

I've tried:
- [What you tried]

Please help me:
1. Fix the build error
2. Optimize the build
3. Ensure production readiness
```

---

**API Integration Issue:**
```
My frontend can't connect to my backend API. Here's the setup:

Frontend URL: http://localhost:3000
Backend URL: http://localhost:3001
Error: [Error message]

Relevant code:
[API client code]

Please help me:
1. Fix the connection issue
2. Setup proper CORS
3. Add error handling
```

---

**Performance Issue:**
```
[Page/Component] is loading slowly. Here's what I've observed:

- Load time: Xs
- What's slow: [Data fetching/Rendering/etc]

Current implementation:
[Code]

Please help me:
1. Identify bottlenecks
2. Optimize performance
3. Add proper caching
4. Improve user experience
```

---

## Final Checklist

Before submitting, verify:

### Frontend
- [ ] All pages render without errors
- [ ] Wallet connection works
- [ ] All API calls succeed
- [ ] Loading states everywhere
- [ ] Error handling comprehensive
- [ ] Mobile responsive
- [ ] Dark theme looks good
- [ ] Animations smooth
- [ ] No console errors
- [ ] Build succeeds
- [ ] Deployed to Vercel

### Backend
- [ ] All endpoints working
- [ ] Authentication works
- [ ] Database connected
- [ ] x402 payments work
- [ ] AI signals generate
- [ ] Rate limiting active
- [ ] Error handling complete
- [ ] Logging enabled
- [ ] Tests passing
- [ ] Deployed to Railway/Render

### Smart Contracts
- [ ] All contracts deployed
- [ ] Verified on BaseScan
- [ ] Test transactions work
- [ ] Events emitting correctly
- [ ] No security warnings
- [ ] Gas optimized
- [ ] Ownership transferred (if needed)

### Documentation
- [ ] README complete
- [ ] API docs written
- [ ] Architecture documented
- [ ] Demo video recorded
- [ ] Screenshots taken
- [ ] Pitch deck ready

### Hackathon Submission
- [ ] Project submitted
- [ ] Demo video uploaded
- [ ] GitHub repo public
- [ ] Live demo accessible
- [ ] Team info submitted

---

**YOU DID IT! 🎉**

You've built a complete, production-ready AI trading bot on Base!

**Next Steps:**
1. Practice your pitch
2. Prepare for questions
3. Deploy to Base Mainnet (if ready)
4. Share with community
5. Keep building!

**Good luck at the hackathon! 🚀**

---

**END OF CURSOR PROMPTS GUIDE**

Remember: These prompts are guidelines. Feel free to adapt them based on:
- Your specific needs
- Cursor's responses
- Issues you encounter
- Features you want to add
- Time constraints

The key is to go **step by step**, **test frequently**, and **commit often**.

You got this! 💪