# 🏆 oWi AI - Autonomous Gold Trading Bot

<div align="center">

![Base](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)
![Foundry](https://img.shields.io/badge/Foundry-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**The first autonomous trading bot on Base that protects users from inflation by intelligently trading between USDC and tokenized gold, powered by AI decision-making and x402 micropayments.**

[Demo](https://owi.ai) • [Documentation](./docs) • [Smart Contracts](./contracts)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Trading** - Gemini AI analyzes markets and generates trading signals
- 💰 **Inflation Protection** - Automatically hedge against currency devaluation with gold
- ⚡ **x402 Micropayments** - Pay only $0.01 per AI signal (no subscriptions!)
- 📱 **Base Mini App** - Native mobile experience in Coinbase Wallet
- 🔒 **Non-Custodial** - You always control your funds
- 📊 **Portfolio Analytics** - Track performance with beautiful charts

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Coinbase Wallet                       │
│                   (Base Mini App)                        │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend          │         │   Backend           │
│   (Next.js 14)      │◄───────►│   (Hono.js)         │
│   + OnchainKit      │         │   + Gemini AI       │
│   + Wagmi/Viem      │         │   + x402            │
└─────────┬───────────┘         └─────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                    Base Blockchain                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  oWiVault    │  │   MockUSDC   │  │   MockGold   │  │
│  │  (Main)      │  │   (ERC20)    │  │   (ERC20)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/owi-ai.git
cd owi-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Smart Contracts

```bash
# Build contracts
npm run forge:build

# Run tests
npm run forge:test

# Deploy to Base Sepolia
npm run forge:deploy
```

### Development

```bash
# Run all services (frontend + backend)
npm run dev

# Or run individually:
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

---

## 📁 Project Structure

```
owi-ai/
├── frontend/              # Next.js 14 Base Mini App
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities and hooks
├── backend/              # Hono.js API server
│   └── src/
│       ├── routes/       # API routes
│       └── services/     # Business logic
├── contracts/            # Foundry smart contracts
│   ├── src/              # Solidity contracts
│   ├── test/             # Foundry tests
│   └── script/           # Deploy scripts
└── scripts/              # Build scripts
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Base (L2), Solidity 0.8.20+, Foundry |
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, Wagmi, OnchainKit |
| **Backend** | Hono.js, TypeScript, Viem |
| **AI** | Google Gemini Flash |
| **Payments** | x402 Protocol |

---

## 📜 Smart Contracts

| Contract | Description | Address (Sepolia) |
|----------|-------------|-------------------|
| `oWiVault` | Main vault for deposits and trading | `0x...` |
| `MockUSDC` | Test USDC token (6 decimals) | `0x...` |
| `MockGold` | Test Gold token (18 decimals) | `0x...` |
| `MockOracle` | Chainlink price feed mock | `0x...` |

---

## 🎮 How It Works

1. **Connect Wallet** - Open in Coinbase Wallet as a Mini App
2. **Deposit USDC** - Fund your trading vault
3. **Get AI Signal** - Pay $0.01 to receive AI trading recommendation
4. **Execute Trade** - One-tap to swap USDC ↔ Gold
5. **Track Performance** - Monitor your portfolio growth

---

## 🔐 Security

- Non-custodial: Users maintain full control of funds
- ReentrancyGuard on all state-changing functions
- Pausable for emergency stops
- Slippage protection on all trades
- Comprehensive test coverage

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 🙏 Acknowledgments

Built for **Base Hackathon 2026** 🚀

- [Base](https://base.org) - L2 blockchain
- [Coinbase](https://coinbase.com) - Wallet & OnchainKit
- [OpenZeppelin](https://openzeppelin.com) - Smart contract libraries
- [Foundry](https://getfoundry.sh) - Development framework

---

<div align="center">

**Made with 💛 by the oWi Team**

</div>
