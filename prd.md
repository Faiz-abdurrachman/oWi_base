# oWi AI - Product Requirements Document (PRD)

> **Version:** 1.0  
> **Last Updated:** January 28, 2026  
> **Status:** Ready for Development  
> **Target:** Base Hackathon Submission

---

## 📋 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Overview](#2-product-overview)
3. [Market Analysis](#3-market-analysis)
4. [User Research](#4-user-research)
5. [Product Strategy](#5-product-strategy)
6. [Feature Specifications](#6-feature-specifications)
7. [Technical Requirements](#7-technical-requirements)
8. [User Experience](#8-user-experience)
9. [Success Metrics](#9-success-metrics)
10. [Roadmap](#10-roadmap)
11. [Risks & Mitigation](#11-risks--mitigation)
12. [Go-to-Market](#12-go-to-market)

---

## 1. Executive Summary

### 1.1 Product Vision

**oWi AI** is the first autonomous trading bot on Base that protects users from inflation by intelligently trading between USDC and tokenized gold, powered by AI decision-making and x402 micropayments.

### 1.2 Mission Statement

Democratize inflation hedging by making professional-grade gold trading accessible to everyone through AI automation and blockchain technology.

### 1.3 Key Value Propositions

- **🤖 Fully Autonomous:** AI makes trading decisions 24/7
- **💰 Inflation Protection:** Automatically hedge against currency devaluation
- **💎 Accessible:** Start with as little as $10
- **⚡ Pay-Per-Use:** Only pay for AI signals you actually use (via x402)
- **📱 Mobile-First:** Built as Base Mini App for Coinbase Wallet
- **🔒 Non-Custodial:** You always control your funds

### 1.4 Target Launch

- **MVP:** 7 days from start
- **Hackathon Demo:** 10 days from start
- **Beta Launch:** 30 days post-hackathon

---

## 2. Product Overview

### 2.1 What is oWi AI?

oWi AI is a mobile-first DeFi application that runs as a Base Mini App inside Coinbase Wallet. It uses artificial intelligence to automatically trade between USDC (stablecoin) and tokenized gold (XAU) to protect users' purchasing power from inflation.

### 2.2 How It Works

```
┌─────────────────────────────────────────────────────────┐
│  USER DEPOSITS USDC                                     │
│         ↓                                               │
│  AI MONITORS MARKET                                     │
│    - Gold prices (Chainlink)                           │
│    - Inflation data                                     │
│    - Market sentiment                                   │
│         ↓                                               │
│  AI GENERATES SIGNAL                                    │
│    - Buy Gold / Sell Gold / Hold                       │
│    - Confidence score                                   │
│    - Reasoning                                          │
│         ↓                                               │
│  USER PAYS 0.01 USDC (x402)                            │
│         ↓                                               │
│  TRADE EXECUTES ON BASE                                 │
│         ↓                                               │
│  PORTFOLIO REBALANCES                                   │
│         ↓                                               │
│  USER WEALTH PROTECTED                                  │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Core Innovation

**x402 Micropayments for AI Signals**

Unlike traditional trading bots with monthly subscriptions, oWi uses x402 protocol to charge users only when they:
- Request an AI trading signal
- Execute a trade based on AI recommendation

This aligns incentives: users only pay when they get value.

### 2.4 Why Base Network?

- **Low Fees:** Trades cost cents, not dollars
- **Fast Confirmations:** Sub-second finality
- **Coinbase Integration:** Direct distribution to millions via Coinbase Wallet
- **Mini Apps:** Native mobile experience
- **Ecosystem:** Access to DeFi protocols, oracles, and tools

---

## 3. Market Analysis

### 3.1 Market Opportunity

**Total Addressable Market (TAM):**
- Global inflation-affected population: 3B+ people
- Crypto users seeking yield: 500M+
- Potential TAM: $50B+

**Serviceable Addressable Market (SAM):**
- Base network users: 10M+
- Coinbase Wallet users: 5M+
- Potential SAM: $5B+

**Serviceable Obtainable Market (SOM):**
- Target Year 1: 10,000 users
- Average deposit: $500
- Potential SOM: $5M TVL

### 3.2 Competitive Analysis

| Competitor | Strength | Weakness | oWi Advantage |
|------------|----------|----------|---------------------|
| **Traditional Gold ETFs** | Regulated, trusted | High fees (0.5-2%), complex access | Lower fees, instant access |
| **Crypto Trading Bots** | Automated | No inflation focus, monthly fees | Inflation-focused, pay-per-use |
| **DeFi Yield Protocols** | High APY | High risk, no gold hedge | Lower risk, real asset backing |
| **Robo-Advisors** | Professional | Web2, slow, high minimums | Web3, instant, low minimums |

### 3.3 Market Trends

**Supporting Trends:**
- ✅ Rising inflation concerns globally
- ✅ Institutional adoption of tokenized gold (PAXG, XAUT)
- ✅ AI agent proliferation in crypto
- ✅ Mobile-first crypto adoption
- ✅ Micropayment infrastructure maturing

**Risks:**
- ⚠️ Regulatory uncertainty around algorithmic trading
- ⚠️ Gold price volatility
- ⚠️ User education required

---

## 4. User Research

### 4.1 Primary Persona: "Inflation-Aware Sarah"

**Demographics:**
- Age: 28-45
- Occupation: Professional (tech, finance, entrepreneur)
- Income: $50k-$150k annually
- Location: Urban, developed markets
- Crypto Experience: Beginner to intermediate

**Psychographics:**
- Concerned about inflation eroding savings
- Interested in passive income
- Values automation and convenience
- Tech-savvy, uses mobile apps daily
- Wants to preserve wealth, not gamble

**Pain Points:**
- 😰 "My savings lose value every year"
- 🤯 "Trading is too complex and time-consuming"
- 💸 "High fees eat into my returns"
- ❓ "I don't know when to buy or sell gold"
- 🔒 "I don't trust centralized platforms with my money"

**Goals:**
- Protect purchasing power from inflation
- Automate investment decisions
- Minimize time spent managing finances
- Maintain control over assets

**Jobs to Be Done:**
- "When inflation rises, I want to automatically move into gold so that my wealth is protected"
- "When gold becomes overvalued, I want to lock in gains without manual trading"

### 4.2 Secondary Persona: "Crypto-Native Alex"

**Demographics:**
- Age: 22-35
- Occupation: Crypto trader, DeFi power user
- Income: Variable (crypto gains)
- Location: Global, digital nomad
- Crypto Experience: Advanced

**Pain Points:**
- 🎯 "Existing bots don't focus on inflation hedging"
- 💰 "Monthly subscription bots waste money when markets are flat"
- 🤖 "I want AI agents to manage specific strategies"

**Goals:**
- Optimize portfolio with AI strategies
- Pay only for value received
- Experiment with new DeFi primitives

### 4.3 User Needs Analysis

**Critical Needs (Must Have):**
1. Easy onboarding (< 2 minutes)
2. Clear value proposition
3. Non-custodial security
4. Mobile accessibility
5. Transparent pricing

**Important Needs (Should Have):**
1. Performance tracking
2. Educational content
3. Customization options
4. Social proof
5. Responsive support

**Nice to Have:**
1. Social features
2. Advanced analytics
3. Multi-asset support
4. API access

---

## 5. Product Strategy

### 5.1 Product Positioning

**Positioning Statement:**

"For crypto users concerned about inflation, oWi AI is an autonomous trading bot that protects wealth by intelligently hedging into gold. Unlike traditional trading bots with subscription fees, oWi uses AI and micropayments to provide affordable, personalized inflation protection."

### 5.2 Differentiation Strategy

**Key Differentiators:**

1. **AI-First Approach**
   - Not just rules-based trading
   - LLM analyzes market narratives
   - Explainable decision-making

2. **x402 Micropayments**
   - Industry-first pay-per-signal model
   - No monthly subscriptions
   - Aligned incentives

3. **Base Mini App**
   - Native mobile experience
   - Coinbase Wallet distribution
   - One-tap access

4. **Inflation-Focused**
   - Purpose-built for wealth preservation
   - Not speculative trading
   - Educational approach

### 5.3 Revenue Model

**Primary Revenue Streams:**

1. **x402 Micropayments**
   - $0.01 per AI signal
   - Expected: 10 signals/user/month
   - Revenue: $0.10/user/month

2. **Transaction Fees (Future)**
   - 0.1% on trade volume
   - Applied to large traders (>$10k)

3. **Premium Features (Future)**
   - Advanced analytics: $5/month
   - Custom AI prompts: $10/month
   - Priority signals: $15/month

**Revenue Projections (Year 1):**

| Month | Users | Signals/User | Revenue |
|-------|-------|--------------|---------|
| 1     | 100   | 5            | $50     |
| 3     | 500   | 8            | $400    |
| 6     | 2,000 | 10           | $2,000  |
| 12    | 10,000| 10           | $10,000 |

### 5.4 Growth Strategy

**Acquisition Channels:**

1. **Hackathon Launch**
   - Win prizes → press coverage
   - Demo video → social shares
   - GitHub → developer interest

2. **Coinbase Wallet Discovery**
   - Base Mini Apps featured section
   - In-app promotions
   - Wallet notifications

3. **Content Marketing**
   - Twitter/X education threads
   - YouTube explainers
   - Blog posts on inflation

4. **Community Building**
   - Discord for users
   - Telegram for updates
   - Farcaster for Web3 natives

5. **Partnerships**
   - Gold token providers (PAXG)
   - DeFi protocols on Base
   - Influencer collaborations

---

## 6. Feature Specifications

### 6.1 MVP Features (P0 - Must Have)

#### 6.1.1 Wallet Connection

**Description:** Users connect their wallet via MiniKit SDK

**User Story:**
> "As a user, I want to connect my Coinbase Wallet with one tap so that I can start using the app immediately."

**Acceptance Criteria:**
- [ ] One-tap wallet connection via MiniKit
- [ ] Support for Coinbase Wallet (primary)
- [ ] Support for other wallets (WalletConnect fallback)
- [ ] Clear error messages if connection fails
- [ ] Auto-reconnect on app reload
- [ ] Disconnect option in settings

**Technical Requirements:**
- Use `@coinbase/onchainkit` SDK
- Implement proper session management
- Handle network switching (Base Sepolia → Base Mainnet)
- Store connection state in localStorage

**UI/UX:**
- Prominent "Connect Wallet" button on landing
- Loading state during connection
- Success confirmation
- Display connected address (truncated)

---

#### 6.1.2 Deposit USDC

**Description:** Users deposit USDC into the trading vault

**User Story:**
> "As a user, I want to deposit USDC so that the AI can start trading on my behalf."

**Acceptance Criteria:**
- [ ] Input field for deposit amount
- [ ] Show current USDC balance in wallet
- [ ] Validate sufficient balance
- [ ] Approve USDC spending (if needed)
- [ ] Execute deposit transaction
- [ ] Update vault balance immediately
- [ ] Show transaction confirmation

**Technical Requirements:**
- ERC-20 approve() if needed
- Call `oWiVault.deposit(amount)`
- Handle gas estimation
- Transaction confirmation UI
- Error handling for reverted txs

**UI/UX:**
- Simple, clear deposit form
- "Max" button to deposit all
- Real-time balance updates
- Transaction pending state
- Success animation

**Edge Cases:**
- Insufficient balance → show error
- Insufficient gas → suggest getting ETH
- Transaction rejected → allow retry
- Network error → auto-retry

---

#### 6.1.3 AI Trading Signals

**Description:** AI generates buy/sell/hold signals based on market analysis

**User Story:**
> "As a user, I want to receive AI-generated trading signals so that I know when to trade without analyzing markets myself."

**Acceptance Criteria:**
- [ ] AI analyzes market every 15 minutes
- [ ] Generate signal: BUY_GOLD, SELL_GOLD, or HOLD
- [ ] Include confidence score (0-100)
- [ ] Provide reasoning (2-3 sentences)
- [ ] Suggest trade amount
- [ ] Store signal history

**Technical Requirements:**

**Input Data:**
```typescript
{
  goldPrice: number;        // From Chainlink
  priceChange24h: number;   // Calculated
  userPortfolio: {
    totalValue: number;
    usdcAmount: number;
    goldAmount: number;
    usdcPercentage: number;
    goldPercentage: number;
  };
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  inflationRate: number;    // From external API
}
```

**Output Format:**
```typescript
{
  action: 'BUY_GOLD' | 'SELL_GOLD' | 'HOLD';
  confidence: number;       // 0-100
  reasoning: string;
  suggestedAmount: number;  // In USDC
  executionPrice: number;   // Expected XAU/USD
  timestamp: number;
}
```

**AI Prompt Template:**
```
You are an expert gold trading AI focused on protecting users from inflation.

CURRENT MARKET DATA:
- Gold Price: ${goldPrice} USD/oz
- 24h Change: ${priceChange24h}%
- Inflation Rate: ${inflationRate}%

USER PORTFOLIO:
- Total Value: ${totalValue} USDC
- Current: ${usdcPercentage}% USDC, ${goldPercentage}% Gold
- Risk Tolerance: ${riskTolerance}

STRATEGY:
- Conservative: Only buy gold when inflation > 3% and gold trending up
- Moderate: Maintain 50/50 balance, rebalance when drift > 10%
- Aggressive: Active trading on 5%+ price movements

Based on this data, should the user BUY_GOLD, SELL_GOLD, or HOLD?

Respond ONLY with valid JSON:
{
  "action": "BUY_GOLD" | "SELL_GOLD" | "HOLD",
  "confidence": 0-100,
  "reasoning": "Brief explanation in 2-3 sentences",
  "suggestedAmount": number
}
```

**LLM Configuration:**
- Model: Google Gemini Flash
- Temperature: 0.3 (low for consistency)
- Max tokens: 200
- Timeout: 10 seconds

---

#### 6.1.4 x402 Payment Gate

**Description:** Users pay 0.01 USDC to access AI signals

**User Story:**
> "As a user, I want to pay a small fee only when I request a trading signal so that I'm not wasting money on subscriptions."

**Acceptance Criteria:**
- [ ] Request signal → show payment required
- [ ] Auto-prompt wallet for 0.01 USDC payment
- [ ] Verify payment on-chain
- [ ] Return signal after payment confirmed
- [ ] Cache signal to prevent double-payment
- [ ] Show payment history

**Payment Flow:**
```
1. User clicks "Get AI Signal"
2. Frontend calls POST /api/signals
3. Backend returns 402 Payment Required
4. Frontend shows payment modal
5. User approves 0.01 USDC payment via x402
6. Payment sent to x402 facilitator
7. Backend verifies payment
8. Backend returns AI signal
9. Frontend displays signal
10. User can execute trade (free)
```

**Technical Requirements:**

**x402 Integration:**
```typescript
// Backend middleware
import { x402Middleware } from '@x402/hono';

app.post('/api/signals',
  x402Middleware({
    price: 0.01, // USDC
    currency: 'USDC',
    network: 'base-sepolia',
    facilitator: process.env.X402_FACILITATOR_ADDRESS
  }),
  async (c) => {
    // Generate AI signal
    const signal = await generateAISignal();
    return c.json(signal);
  }
);
```

**Frontend:**
```typescript
// Request signal with payment
const signal = await fetch('/api/signals', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

if (signal.status === 402) {
  // Handle payment
  const payment = await signal.json();
  await executePayment(payment);
  // Retry request
  const paidSignal = await fetch('/api/signals', {...});
}
```

**Error Handling:**
- Payment rejected → show retry option
- Insufficient balance → suggest deposit
- Network error → auto-retry
- Payment timeout → refund automatically

---

#### 6.1.5 Execute Trade

**Description:** Execute swap between USDC and gold tokens

**User Story:**
> "As a user, I want to execute the AI-recommended trade with one tap so that I can act on signals quickly."

**Acceptance Criteria:**
- [ ] Display trade preview (before execution)
- [ ] Show expected amounts and slippage
- [ ] Calculate gas fees
- [ ] Execute swap via smart contract
- [ ] Show transaction progress
- [ ] Update portfolio on confirmation
- [ ] Log trade in history

**Trade Flow:**
```
1. User views AI signal (BUY_GOLD)
2. User clicks "Execute Trade"
3. Show trade preview:
   - Swap: 100 USDC → ~0.045 XAU
   - Expected price: 2,222 USD/XAU
   - Max slippage: 0.5%
   - Gas fee: ~$0.02
4. User confirms
5. Call oWiVault.executeTrade()
6. Show pending state
7. Transaction confirms
8. Update UI with new balances
9. Show success message
```

**Technical Requirements:**

**Smart Contract Function:**
```solidity
function executeTrade(
    bool buyGold,
    uint256 amount,
    uint256 minAmountOut
) external {
    require(userDeposits[msg.sender] >= amount, "Insufficient balance");
    
    if (buyGold) {
        // Swap USDC → Gold via Uniswap
        uint256 goldReceived = _swapUSDCForGold(amount, minAmountOut);
        positions[msg.sender].goldAmount += goldReceived;
    } else {
        // Swap Gold → USDC
        uint256 usdcReceived = _swapGoldForUSDC(amount, minAmountOut);
        positions[msg.sender].usdcAmount += usdcReceived;
    }
    
    emit TradeExecuted(msg.sender, buyGold, amount, block.timestamp);
}
```

**Frontend:**
```typescript
// Execute trade
const { writeContract } = useWriteContract();

const executeTrade = async (signal: AISignal) => {
  const minAmountOut = calculateMinAmountOut(
    signal.suggestedAmount,
    0.5 // 0.5% slippage
  );
  
  await writeContract({
    address: VAULT_ADDRESS,
    abi: VaultABI,
    functionName: 'executeTrade',
    args: [
      signal.action === 'BUY_GOLD',
      parseUnits(signal.suggestedAmount.toString(), 6),
      minAmountOut
    ]
  });
};
```

**Slippage Protection:**
- Default: 0.5% max slippage
- User can adjust in settings
- Calculate `minAmountOut` based on Chainlink price
- Revert if slippage exceeded

**Error Handling:**
- Insufficient liquidity → suggest lower amount
- Price impact too high → warn user
- Transaction reverted → show reason
- Gas estimation failed → use fallback

---

#### 6.1.6 Portfolio Dashboard

**Description:** Display user's portfolio value, composition, and performance

**User Story:**
> "As a user, I want to see my portfolio at a glance so that I can track my wealth and performance."

**Acceptance Criteria:**
- [ ] Show total portfolio value in USD
- [ ] Display asset breakdown (% USDC vs % Gold)
- [ ] Show 24h change
- [ ] Display all-time ROI
- [ ] List recent trades
- [ ] Refresh data automatically

**Dashboard Layout:**
```
┌─────────────────────────────────────┐
│  Portfolio Value                    │
│  $1,247.85                          │
│  +$47.85 (+3.98%) ↑                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Asset Allocation                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  █████████████░░░░░░░░░░░░░░░░░░   │
│  USDC 65%  |  Gold 35%              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Recent Trades                      │
│  ────────────────────────────────   │
│  Buy 0.02 XAU   2h ago   +$12.30   │
│  Sell 0.01 XAU  1d ago   +$5.20    │
│  Buy 0.03 XAU   3d ago   +$18.50   │
└─────────────────────────────────────┘
```

**Data Sources:**
- On-chain: User deposits, positions, trades
- Chainlink: Current gold price
- Calculated: Portfolio value, ROI, changes

**Real-time Updates:**
- Poll every 30 seconds for price updates
- Listen for trade events via WebSocket
- Optimistic updates on user actions

---

#### 6.1.7 Withdraw Funds

**Description:** Users can withdraw their funds anytime

**User Story:**
> "As a user, I want to withdraw my funds whenever I need them so that I maintain full control over my money."

**Acceptance Criteria:**
- [ ] Input withdrawal amount
- [ ] Show available balance
- [ ] Validate sufficient balance
- [ ] Execute withdrawal transaction
- [ ] Transfer USDC back to wallet
- [ ] Update vault balance
- [ ] Show confirmation

**Withdrawal Flow:**
```
1. User clicks "Withdraw"
2. Show withdrawal form
3. User enters amount (or clicks "Max")
4. Preview:
   - Withdrawing: 500 USDC
   - Gas fee: ~$0.02
   - You'll receive: 499.98 USDC
5. User confirms
6. Call vault.withdraw(amount)
7. Transaction processes
8. USDC transferred to wallet
9. Update UI
10. Show success message
```

**Technical Requirements:**

**Smart Contract:**
```solidity
function withdraw(uint256 amount) external {
    require(userDeposits[msg.sender] >= amount, "Insufficient balance");
    
    // If user has gold position, must convert first
    if (positions[msg.sender].goldAmount > 0) {
        _convertGoldToUSDC(msg.sender);
    }
    
    userDeposits[msg.sender] -= amount;
    USDC.transfer(msg.sender, amount);
    
    emit Withdrawal(msg.sender, amount, block.timestamp);
}
```

**Edge Cases:**
- User has gold position → auto-convert to USDC first
- Partial withdrawal → update position proportionally
- Full withdrawal → close position completely
- Insufficient gas → suggest getting ETH

---

### 6.2 P1 Features (Should Have)

#### 6.2.1 Performance Analytics

**Description:** Detailed analytics on portfolio performance

**Features:**
- Historical value chart (7d, 30d, 90d, 1y)
- ROI vs holding USDC comparison
- ROI vs holding Gold comparison
- Win rate (% profitable trades)
- Best/worst trades
- Export data to CSV

**UI Components:**
- Line chart (Recharts)
- Performance metrics cards
- Trade history table with filters
- Download button

---

#### 6.2.2 Risk Settings

**Description:** Customize AI trading behavior

**Options:**
- **Conservative:** Only trade on strong signals (confidence > 80%)
- **Moderate:** Balance growth and stability (confidence > 60%)
- **Aggressive:** Active trading (confidence > 50%)

**Additional Settings:**
- Max trade size (% of portfolio)
- Auto-rebalance frequency
- Stop-loss threshold
- Take-profit threshold

---

#### 6.2.3 Notifications

**Description:** Alert users of important events

**Notification Types:**
1. **New Signal Available** - "AI detected opportunity: Buy Gold (85% confidence)"
2. **Trade Executed** - "Trade successful: Bought 0.05 XAU for 110 USDC"
3. **Portfolio Milestone** - "Congrats! Your portfolio is up 10%"
4. **Price Alert** - "Gold price dropped 5% in 24h"

**Delivery Methods:**
- In-app notifications (primary)
- Browser push (if enabled)
- Farcaster DMs (optional integration)
- Email (optional, for critical alerts)

---

#### 6.2.4 Educational Content

**Description:** Help users understand inflation and gold trading

**Content Types:**
1. **Tooltips** - Explain key terms (inflation, slippage, etc.)
2. **Onboarding Tutorial** - 3-step walkthrough on first use
3. **Blog/Docs** - Articles on strategy, risks, how it works
4. **FAQ** - Common questions answered

**Topics:**
- Why gold protects against inflation
- How AI makes decisions
- Understanding x402 micropayments
- Risk management basics

---

### 6.3 P2 Features (Nice to Have)

#### 6.3.1 Social Trading

- Follow other users' strategies
- Leaderboard of top performers
- Copy trading (replicate others' trades)
- Share your performance

#### 6.3.2 Custom AI Prompts

- Advanced users can modify AI strategy
- Upload custom data sources
- Fine-tune risk parameters
- Backtest strategies

#### 6.3.3 Multi-Asset Support

- Add silver, platinum tokens
- Add crypto assets (ETH, BTC)
- Create custom portfolios
- Cross-asset optimization

#### 6.3.4 API Access

- RESTful API for programmatic access
- WebSocket for real-time data
- Webhooks for trade notifications
- Rate limits based on tier

---

## 7. Technical Requirements

### 7.1 System Architecture

**Architecture Type:** Microservices (Frontend, Backend API, Smart Contracts)

**Core Components:**

```
┌──────────────────────────────────────────────────────┐
│                   USER DEVICES                       │
│  (Coinbase Wallet Mobile App - iOS/Android)         │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────────────┐
│             FRONTEND (Next.js)                       │
│  - Base Mini App                                     │
│  - React Components                                  │
│  - Wagmi/Viem (Blockchain)                          │
│  - OnchainKit (UI)                                  │
│                                                      │
│  Hosted on: Vercel Edge Network                     │
└──────────────────┬───────────────────────────────────┘
                   │
                   │ REST API / WebSocket
                   ▼
┌──────────────────────────────────────────────────────┐
│            BACKEND API (Hono.js)                     │
│  - x402 Payment Middleware                          │
│  - AI Signal Generation                             │
│  - User Management                                   │
│  - Analytics Engine                                  │
│  - Caching Layer (Redis)                            │
│                                                      │
│  Hosted on: Railway / Render                        │
└──────┬─────────────────────┬─────────────────────────┘
       │                     │
       │                     │ RPC Calls
       │                     ▼
       │          ┌──────────────────────────┐
       │          │   BASE BLOCKCHAIN        │
       │          │                          │
       │          │  - oWiVault.sol          │
       │          │  - AIOracle.sol          │
       │          │  - X402Payment.sol       │
       │          │                          │
       │          │  - Chainlink Price Feed  │
       │          │  - USDC Token            │
       │          │  - Gold Token (PAXG)     │
       │          └──────────────────────────┘
       │
       │ LLM API Calls
       ▼
┌────────────────────────┐
│    AI SERVICES         │
│  - Gemini API           │
│  - Gemini API (backup) │
│  - LangChain           │
└────────────────────────┘
```

### 7.2 Tech Stack Details

#### Frontend
```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript 5.3+
Styling: TailwindCSS 3.4
UI Library: Shadcn/ui
Blockchain: 
  - Wagmi 2.x (React hooks)
  - Viem 2.x (Low-level)
  - OnchainKit (Base UI components)
State Management:
  - Zustand (Global state)
  - TanStack Query (Server state)
Charts: Recharts
Forms: React Hook Form + Zod
Testing: Vitest + Testing Library
```

#### Backend
```yaml
Framework: Hono.js (ultra-fast)
Language: TypeScript 5.3+
Database: PostgreSQL 16
ORM: Prisma 5.x
Cache: Redis 7.x
Validation: Zod
AI/LLM:
  - Google Generative AI SDK (primary)
  - Google Gemini (backup)
  - LangChain (orchestration)
Blockchain:
  - Viem (smart contract calls)
  - CDP SDK (wallet management)
Payment: x402 Protocol
Testing: Vitest
```

#### Smart Contracts
```yaml
Language: Solidity 0.8.20+
Framework: Foundry
Testing: Foundry (forge test)
Libraries:
  - OpenZeppelin Contracts 5.0
  - Chainlink Price Feeds
  - Uniswap V3 Core
Standards:
  - ERC-20 (tokens)
  - ERC-4626 (vault)
Network: Base (Mainnet & Sepolia)
```

### 7.3 Smart Contract Specifications

#### Contract 1: oWiVault.sol

**Purpose:** Main vault for user deposits and trading logic

**Functions:**
```solidity
// User functions
function deposit(uint256 amount) external
function withdraw(uint256 amount) external
function executeTrade(bool buyGold, uint256 amount, uint256 minOut) external

// View functions
function getUserBalance(address user) external view returns (uint256)
function getUserPosition(address user) external view returns (Position)
function getPortfolioValue(address user) external view returns (uint256)

// Admin functions
function setAIOracle(address oracle) external onlyOwner
function pause() external onlyOwner
function unpause() external onlyOwner
```

**State Variables:**
```solidity
IERC20 public USDC;
IERC20 public GOLD;
IUniswapV3Router public router;
AggregatorV3Interface public goldPriceFeed;

mapping(address => uint256) public userDeposits;
mapping(address => Position) public positions;

struct Position {
    uint256 usdcAmount;
    uint256 goldAmount;
    uint256 lastTradeTime;
    uint256 totalDeposited;
}
```

**Events:**
```solidity
event Deposit(address indexed user, uint256 amount, uint256 timestamp);
event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
event TradeExecuted(address indexed user, bool buyGold, uint256 amountIn, uint256 amountOut, uint256 timestamp);
event EmergencyWithdrawal(address indexed user, uint256 amount);
```

**Security Features:**
- ReentrancyGuard on all state-changing functions
- Pausable for emergency stops
- Access control for admin functions
- Slippage protection on swaps
- Maximum trade size limits

---

#### Contract 2: AIOracle.sol

**Purpose:** Store and retrieve AI trading signals on-chain

**Functions:**
```solidity
function submitSignal(TradeSignal memory signal) external onlyAuthorized
function getLatestSignal(address user) external view returns (TradeSignal)
function getSignalHistory(address user, uint256 count) external view returns (TradeSignal[])
```

**Structs:**
```solidity
struct TradeSignal {
    address user;
    Action action; // BUY_GOLD, SELL_GOLD, HOLD
    uint256 confidence; // 0-100
    string reasoning;
    uint256 suggestedAmount;
    uint256 goldPrice;
    uint256 timestamp;
    bool executed;
}

enum Action {
    HOLD,
    BUY_GOLD,
    SELL_GOLD
}
```

---

#### Contract 3: X402Payment.sol

**Purpose:** Handle micropayments for AI signals

**Functions:**
```solidity
function payForSignal() external payable
function verifyPayment(address user) external view returns (bool, uint256)
function withdrawFees() external onlyOwner
```

**State:**
```solidity
uint256 public constant SIGNAL_PRICE = 0.01e6; // 0.01 USDC
mapping(address => uint256) public paymentTimestamps;
mapping(address => uint256) public paymentCounts;
```

---

### 7.4 API Specifications

#### Base URL
```
Production: https://api.owi.ai
Staging: https://api-staging.owi.ai
Local: http://localhost:3001
```

#### Authentication

**Method:** JWT (JSON Web Tokens)

**Flow:**
```
1. POST /auth/nonce
   → Returns: { nonce: "random-string" }

2. User signs nonce with wallet

3. POST /auth/verify
   Body: { address, signature }
   → Returns: { token: "jwt-token", expiresIn: 86400 }

4. Use token in headers:
   Authorization: Bearer {token}
```

#### Endpoints

**Authentication**
```
POST /auth/nonce
POST /auth/verify
POST /auth/refresh
```

**Trading Signals (Protected by x402)**
```
POST /api/signals
  Headers: Authorization: Bearer {token}
  Response 402: { paymentRequired: true, amount: 0.01, ... }
  Response 200: { action, confidence, reasoning, ... }

GET /api/signals/history
  Query: ?limit=10&offset=0
  Response: { signals: [...], total: 50 }
```

**Portfolio**
```
GET /api/portfolio
  Response: {
    totalValue: 1247.85,
    assets: { usdc: 810.10, gold: 437.75 },
    positions: { usdcPercent: 65, goldPercent: 35 },
    change24h: { value: 47.85, percent: 3.98 }
  }

GET /api/portfolio/history
  Query: ?period=7d
  Response: { data: [...], period: "7d" }
```

**Trades**
```
GET /api/trades
  Query: ?limit=10&status=completed
  Response: { trades: [...], total: 25 }

GET /api/trades/:id
  Response: { trade details }
```

**Analytics**
```
GET /api/analytics/performance
  Response: {
    roi: 12.5,
    winRate: 68,
    totalTrades: 42,
    bestTrade: {...},
    worstTrade: {...}
  }
```

#### Error Responses

**Standard Error Format:**
```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient USDC balance for this trade",
    "details": {
      "required": 100,
      "available": 50
    }
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `402` - Payment Required (x402)
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

### 7.5 Database Schema

**Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP,
  settings JSONB DEFAULT '{}',
  total_deposits DECIMAL(18,6) DEFAULT 0,
  total_withdrawals DECIMAL(18,6) DEFAULT 0
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
```

**Portfolios Table**
```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  usdc_amount DECIMAL(18,6) DEFAULT 0,
  gold_amount DECIMAL(18,8) DEFAULT 0,
  total_value DECIMAL(18,6),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id)
);
```

**Trades Table**
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(10) NOT NULL, -- BUY_GOLD, SELL_GOLD
  amount_in DECIMAL(18,6) NOT NULL,
  amount_out DECIMAL(18,8) NOT NULL,
  price DECIMAL(18,2) NOT NULL,
  tx_hash VARCHAR(66) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  executed_at TIMESTAMP DEFAULT NOW(),
  
  CHECK (action IN ('BUY_GOLD', 'SELL_GOLD')),
  CHECK (status IN ('pending', 'completed', 'failed'))
);

CREATE INDEX idx_trades_user ON trades(user_id);
CREATE INDEX idx_trades_status ON trades(status);
```

**AI Signals Table**
```sql
CREATE TABLE ai_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(10) NOT NULL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  reasoning TEXT NOT NULL,
  suggested_amount DECIMAL(18,6),
  gold_price DECIMAL(18,2),
  paid BOOLEAN DEFAULT FALSE,
  executed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CHECK (action IN ('HOLD', 'BUY_GOLD', 'SELL_GOLD'))
);

CREATE INDEX idx_signals_user ON ai_signals(user_id);
CREATE INDEX idx_signals_created ON ai_signals(created_at DESC);
```

**Payments Table**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(18,6) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDC',
  purpose VARCHAR(50), -- 'AI_SIGNAL', 'PREMIUM_FEATURE'
  tx_hash VARCHAR(66),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  
  CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
```

---

### 7.6 Performance Requirements

**Response Times:**
- Page load (initial): < 2 seconds
- Page load (cached): < 500ms
- API response (cached): < 100ms
- API response (uncached): < 1 second
- Trade execution: < 5 seconds

**Throughput:**
- Support 10,000 concurrent users
- Handle 100 trades per second
- Process 1,000 AI signals per minute

**Availability:**
- Uptime: 99.9% (8.76 hours downtime/year)
- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 5 minutes

**Scalability:**
- Horizontal scaling for backend API
- Database read replicas for analytics
- CDN for static assets
- Redis caching for hot data

---

### 7.7 Security Requirements

**Authentication & Authorization:**
- Wallet signature verification for login
- JWT tokens with 24h expiration
- Rate limiting: 100 requests/minute per user
- API key rotation every 90 days

**Smart Contract Security:**
- Audited by reputable firm (post-hackathon)
- Formal verification of critical functions
- Multi-sig for admin functions
- Timelock for parameter changes
- Emergency pause mechanism

**Data Security:**
- All data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- No storage of private keys
- User data anonymization for analytics
- GDPR compliance

**Infrastructure Security:**
- DDoS protection (Cloudflare)
- WAF (Web Application Firewall)
- Regular security audits
- Dependency scanning (Snyk)
- Container image scanning

---

### 7.8 Testing Requirements

**Unit Tests:**
- Frontend: 80%+ coverage
- Backend: 85%+ coverage
- Smart Contracts: 100% coverage

**Integration Tests:**
- End-to-end user flows
- API endpoint testing
- Blockchain integration testing

**Security Tests:**
- Penetration testing
- Smart contract fuzzing
- Vulnerability scanning

**Performance Tests:**
- Load testing (1000+ concurrent users)
- Stress testing (peak traffic)
- Endurance testing (24h continuous)

---

## 8. User Experience

### 8.1 User Flows

#### Flow 1: First-Time User Onboarding

```
1. User opens Coinbase Wallet
2. Discovers oWi in Base Apps section
3. Taps to open app
4. Sees landing page:
   - Value proposition
   - "How It Works" (3 steps)
   - "Connect Wallet" CTA
5. Taps "Connect Wallet"
6. MiniKit auto-connects (one-tap)
7. Welcomed with personalized message
8. Optional: Quick tutorial (3 screens)
9. Arrives at dashboard (empty state)
10. Sees "Make First Deposit" prompt
11. Taps → Deposit flow begins

TOTAL TIME: ~2 minutes
```

#### Flow 2: Make a Deposit

```
1. User on dashboard
2. Taps "Deposit" button
3. Deposit modal opens:
   - Input field (with "Max" button)
   - Current balance shown
   - Estimated gas fee
   - "Deposit" CTA
4. User enters amount (e.g., 100 USDC)
5. Taps "Deposit"
6. Wallet prompts for approval (if first time)
7. User approves
8. Transaction submitted
9. Loading state: "Processing..."
10. Confirmation: "Deposit successful! ✓"
11. Dashboard updates with new balance
12. AI starts monitoring immediately

TOTAL TIME: ~30 seconds (after first approval)
```

#### Flow 3: Get AI Signal & Trade

```
1. User on dashboard
2. AI status shows: "New signal available"
3. Taps "View Signal"
4. Signal preview (blurred):
   - "AI recommends: BUY GOLD"
   - "Confidence: 85%"
   - "Unlock for 0.01 USDC"
5. Taps "Unlock Signal"
6. x402 payment modal:
   - "Pay 0.01 USDC to view full analysis"
   - "Pay Now" button
7. User confirms payment
8. Signal unlocked:
   - Action: BUY GOLD
   - Confidence: 85%
   - Reasoning: "Gold trending up due to inflation concerns..."
   - Suggested amount: 50 USDC
   - "Execute Trade" CTA
9. User taps "Execute Trade"
10. Trade preview:
    - Swap: 50 USDC → 0.023 XAU
    - Price: 2,174 USD/XAU
    - Slippage: 0.5% max
    - Gas: ~$0.02
    - "Confirm Trade" button
11. User confirms
12. Transaction processing
13. Success: "Trade executed! You bought 0.023 XAU"
14. Portfolio updates automatically

TOTAL TIME: ~1 minute
```

#### Flow 4: Monitor Portfolio

```
1. User opens app (daily check-in)
2. Dashboard shows:
   - Total value: $1,247.85 (+3.98% ↑)
   - Allocation: 65% USDC | 35% Gold
   - Recent trades (3 latest)
3. User taps "View Details"
4. Portfolio page shows:
   - Value chart (7d default)
   - Performance metrics
   - Full trade history
5. User changes chart to 30d
6. Sees longer-term trend
7. Taps "Export Data"
8. Downloads CSV of all trades
9. Satisfied with performance
10. Closes app

TOTAL TIME: ~2 minutes
```

#### Flow 5: Withdraw Funds

```
1. User on dashboard
2. Taps "Withdraw"
3. Withdrawal modal:
   - Available balance: 1,247.85 USDC
   - Input field (with "Max" button)
   - Note: "Gold will be auto-converted to USDC"
   - "Withdraw" CTA
4. User enters amount: 500 USDC
5. Preview:
   - Converting 0.08 XAU → USDC
   - Total withdrawal: 500 USDC
   - Gas fee: ~$0.02
   - "Confirm Withdrawal"
6. User confirms
7. Transaction processing
8. Success: "500 USDC sent to your wallet"
9. Dashboard updates
10. User sees reduced portfolio value

TOTAL TIME: ~30 seconds
```

### 8.2 UI/UX Principles

**Design Philosophy:**
- **Mobile-First:** Optimized for thumb-reachable zones
- **Clarity over Cleverness:** Simple, clear language
- **Trust through Transparency:** Show all fees, explain all actions
- **Delight in Details:** Smooth animations, satisfying feedback
- **Accessible:** WCAG 2.1 AA compliant

**Visual Design:**
- **Color Palette:**
  - Primary: Gold (#FFD700) - represents gold, wealth
  - Secondary: Deep Blue (#0A2540) - trust, stability
  - Accent: Green (#10B981) - success, growth
  - Danger: Red (#EF4444) - alerts, losses
  - Background: Dark (#0F172A) - modern, crypto-native
  
- **Typography:**
  - Headings: Inter (bold, clear)
  - Body: Inter (regular)
  - Numbers: Mono font (clear, professional)
  
- **Spacing:**
  - Use 8px grid system
  - Generous padding on mobile
  - Clear visual hierarchy

**Interaction Design:**
- **Loading States:** Skeleton screens, not spinners
- **Success States:** Celebratory animations (confetti, checkmarks)
- **Error States:** Helpful messages with solutions
- **Empty States:** Onboarding prompts, not blank screens

**Accessibility:**
- Minimum touch target: 44x44px
- Contrast ratio: 4.5:1 minimum
- Screen reader support
- Keyboard navigation
- Reduced motion option

---

### 8.3 Mobile Optimization

**Base Mini App Requirements:**

1. **Manifest Configuration:**
```json
{
  "name": "oWi AI",
  "short_name": "oWi",
  "description": "Autonomous inflation hedging with AI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#FFD700",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **MiniKit Integration:**
```typescript
import { MiniKit } from '@coinbase/minikit';

// Initialize MiniKit
MiniKit.init({
  appId: process.env.NEXT_PUBLIC_APP_ID,
  name: 'oWi AI',
  description: 'Autonomous inflation hedging',
});

// Use MiniKit hooks
const { isReady, user } = useMiniKit();
```

3. **Performance:**
- Lazy load components
- Optimize images (WebP, next/image)
- Minimize JavaScript bundle
- Use code splitting
- Service worker for offline

4. **Responsive Breakpoints:**
```css
/* Mobile (default) */
@media (min-width: 320px) { }

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

---

## 9. Success Metrics

### 9.1 North Star Metric

**Total Value Protected (TVP)**
- Definition: Total USD value of user deposits actively being managed
- Target Year 1: $5M TVP
- Why: Directly measures product impact on user wealth

### 9.2 Product Metrics (AARRR Framework)

**Acquisition:**
- Website visitors → 10,000/month by Month 3
- App installs → 1,000/month by Month 3
- Cost per acquisition → < $10

**Activation:**
- Wallet connected → 60% of visitors
- First deposit made → 40% of connected users
- First trade executed → 80% of depositors
- Time to first value → < 5 minutes

**Retention:**
- D7 retention → 50%
- D30 retention → 30%
- Monthly active users → 5,000 by Month 6

**Revenue:**
- Avg revenue per user (ARPU) → $1/month
- x402 payment conversion → 70%
- Monthly recurring revenue (MRR) → $5,000 by Month 6

**Referral:**
- Viral coefficient → 0.5
- Referral rate → 20% of users

### 9.3 Technical Metrics

**Performance:**
- Page load time → < 2s (p95)
- API response time → < 500ms (p95)
- Transaction success rate → > 98%

**Reliability:**
- API uptime → 99.9%
- Smart contract uptime → 100%
- Error rate → < 1%

**Security:**
- Zero critical vulnerabilities
- Zero funds lost to hacks
- 100% successful audits

### 9.4 AI Quality Metrics

**Signal Quality:**
- Signal accuracy → > 65% profitable
- Average ROI per trade → > 2%
- User trust score → > 4.5/5

**AI Performance:**
- Response time → < 5 seconds
- Hallucination rate → < 1%
- Reasoning quality score → > 4/5

---

## 10. Roadmap

### 10.1 Hackathon Phase (Days 1-10)

**Week 1: Foundation**
- Day 1: Smart contracts + testnet deployment
- Day 2: Frontend setup + wallet connection
- Day 3: AI engine + backend API
- Day 4: x402 integration
- Day 5: End-to-end testing
- Day 6: UI polish + demo prep
- Day 7: Documentation + video

**Week 2: Polish & Launch**
- Day 8: Bug fixes + final testing
- Day 9: Deploy to production
- Day 10: Submit to hackathon

### 10.2 Post-Hackathon (Months 1-3)

**Month 1: Beta Launch**
- Incorporate hackathon feedback
- Security audit (smart contracts)
- Launch beta on Base mainnet
- Onboard first 100 users
- Gather user feedback

**Month 2: Iterate & Grow**
- Add performance analytics (P1 feature)
- Implement notifications
- Improve AI prompts based on data
- Grow to 500 users
- Start community building

**Month 3: Scale**
- Add risk settings
- Launch educational content
- Partnership with PAXG
- Marketing campaign
- Grow to 2,000 users

### 10.3 Long-Term Vision (6-12 Months)

**Phase 1: Expand Features**
- Social trading
- Custom AI prompts
- API access
- Mobile app (native)

**Phase 2: Multi-Asset**
- Add silver, platinum tokens
- Add crypto assets (BTC, ETH)
- Portfolio optimization across assets

**Phase 3: Ecosystem**
- oWi DAO
- Governance token
- Community-driven strategies
- B2B offering for institutions

---

## 11. Risks & Mitigation

### 11.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Smart contract bug | Critical | Low | Extensive testing, audit, formal verification |
| AI hallucinations | High | Medium | Multiple prompts, validation, human oversight |
| Chainlink oracle failure | High | Low | Fallback oracles, circuit breakers |
| x402 payment issues | Medium | Medium | Graceful degradation, free tier fallback |
| Scalability limits | Medium | Medium | Horizontal scaling, caching, CDN |

### 11.2 Market Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | Critical | Medium | Strong marketing, clear value prop, referrals |
| Gold price crash | High | Low | Diversification features, stop-loss |
| Regulatory crackdown | High | Low | Legal counsel, compliance, geographic limits |
| Competitor launches similar product | Medium | Medium | Move fast, build moat (data, AI, community) |

### 11.3 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Team burnout | Medium | Medium | Realistic goals, breaks, hiring |
| Key dependency failure | High | Low | Diversify providers, have backups |
| Loss of API access (Gemini) | High | Low | Multi-LLM support, own hosting option |

---

## 12. Go-to-Market Strategy

### 12.1 Pre-Launch (Hackathon Phase)

**Goals:**
- Build anticipation
- Gather early feedback
- Create social proof

**Tactics:**
- Twitter/X threads on building process
- Demo videos showing features
- Engage with Base, Coinbase communities
- Reach out to crypto influencers

### 12.2 Launch (Post-Hackathon)

**Goals:**
- Drive initial user signups
- Generate press coverage
- Build community

**Tactics:**

1. **Press Release:**
   - Send to crypto media (CoinDesk, The Block, Decrypt)
   - Angle: "First AI trading bot using x402 micropayments"

2. **Social Media Blitz:**
   - Twitter: Daily tips on inflation hedging
   - Farcaster: Build in public updates
   - YouTube: Educational videos

3. **Community Building:**
   - Launch Discord server
   - Weekly AMAs
   - User showcase (success stories)

4. **Partnerships:**
   - PAXG (gold token provider)
   - Base ecosystem projects
   - DeFi protocols on Base

5. **Content Marketing:**
   - Blog: "How oWi Protects You From Inflation"
   - Case studies: User success stories
   - Guides: "Crypto Beginner's Guide to Gold Trading"

### 12.3 Growth (Months 1-6)

**Goals:**
- Reach 10,000 users
- $5M TVL
- Establish market leadership

**Tactics:**

1. **Referral Program:**
   - Give $5 USDC for each referral
   - Referrer gets $5 when friend deposits

2. **Paid Advertising:**
   - Twitter ads targeting crypto users
   - Google ads for "inflation protection"
   - Coinbase Wallet promotions

3. **Influencer Partnerships:**
   - Sponsor crypto YouTubers
   - Twitter influencers in DeFi space
   - Financial independence communities

4. **PR Campaign:**
   - Mainstream finance media
   - Podcasts (Bankless, Unchained)
   - Conference speaking (ETHDenver, Token2049)

5. **Product-Led Growth:**
   - Viral features (social sharing)
   - Embedded widgets for other sites
   - API for developers

---

## 13. Appendices

### 13.1 Glossary

- **Base:** Ethereum Layer 2 network by Coinbase
- **Mini App:** Lightweight app running in Coinbase Wallet
- **x402:** HTTP status code protocol for micropayments
- **USDC:** USD-backed stablecoin
- **XAU/PAXG:** Tokenized gold (1 token = 1 troy ounce)
- **Chainlink:** Decentralized oracle network
- **LLM:** Large Language Model (AI)
- **TVL:** Total Value Locked (in smart contracts)

### 13.2 References

- Base Documentation: https://docs.base.org
- MiniKit SDK: https://docs.cdp.coinbase.com/minikit
- x402 Protocol: https://x402.org
- Chainlink Price Feeds: https://docs.chain.link
- Gemini API: https://ai.google.dev/docs
- Wagmi Docs: https://wagmi.sh
- OnchainKit: https://onchainkit.xyz

### 13.3 Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Jan 28, 2026 | Initial PRD | oWi Team |

---

## 14. Sign-Off

**Product Owner:** [Your Name]  
**Technical Lead:** [Developer Name]  
**Status:** ✅ Approved for Development  
**Next Review:** Post-Hackathon (Day 11)

---

**END OF PRD**

This PRD is a living document and will be updated based on:
- User feedback
- Technical discoveries
- Market changes
- Hackathon learnings

Last Updated: January 28, 2026