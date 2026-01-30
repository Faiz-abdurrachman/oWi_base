# oWi AI

> Bot Trading Otonom untuk Perlindungan Inflasi dengan AI di Base Blockchain

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat-square)](https://base.org)
[![Base Mini App](https://img.shields.io/badge/Base-Mini%20App-00D395?style=flat-square)](https://docs.base.org/mini-apps)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-Gemini-10B981?style=flat-square)](https://ai.google.dev)
[![x402 Micropayments](https://img.shields.io/badge/x402-Micropayments-FFD700?style=flat-square)](https://x402.org)

## Tentang oWi AI

oWi AI adalah aplikasi DeFi mobile-first yang berjalan sebagai **Base Mini App** di dalam Coinbase Wallet dan Farcaster clients. Aplikasi ini menggunakan kecerdasan buatan untuk secara otomatis memperdagangkan antara **USDC** (stablecoin) dan **tokenized gold** (XAU) untuk melindungi daya beli pengguna dari inflasi.

### Fitur Utama

- **Fully Autonomous** - AI membuat keputusan trading 24/7
- **Perlindungan Inflasi** - Otomatis hedge terhadap devaluasi mata uang
- **Accessible** - Mulai dengan hanya $10
- **Pay-Per-Use** - Hanya bayar untuk sinyal AI yang Anda gunakan (via x402)
- **Base Mini App** - Berjalan native di Coinbase Wallet & Farcaster
- **Non-Custodial** - Anda selalu mengontrol dana Anda

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Blockchain | Base (Sepolia Testnet) |
| Smart Contracts | Solidity 0.8.20, **Foundry**, OpenZeppelin |
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Web3 | Wagmi 2.x, Viem 2.x, OnchainKit |
| Mini App SDK | @farcaster/miniapp-sdk |
| Backend | Hono.js, TypeScript |
| AI | Google Gemini Flash |
| Oracle | Chainlink Price Feeds |

## Struktur Proyek

```
owi/
├── package.json          # Root workspace (pnpm)
├── pnpm-workspace.yaml   # pnpm workspace config
├── pnpm-lock.yaml        # Lock file
├── frontend/             # Next.js Base Mini App
│   ├── app/              # App router pages
│   ├── lib/              # Providers, hooks, contracts
│   └── public/           # Static assets & manifest
├── backend/              # Hono.js API server
│   └── src/routes/       # API endpoints
├── contracts/            # Foundry smart contracts (NOT a workspace)
│   ├── src/              # Contract source files
│   ├── test/             # Foundry tests
│   └── script/           # Deploy scripts
└── README.md
```

## Documentation

| File | Description |
|------|-------------|
| [setup.md](setup.md) | **Complete setup guide** - Start here for new computer setup |
| [PROMPTS.md](PROMPTS.md) | Step-by-step development prompts (Foundry-based) |
| [prd.md](prd.md) | Product Requirements Document |

## Quick Start

### Prerequisites

- Node.js v18+
- pnpm (`npm install -g pnpm`)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (untuk contracts)
- Git
- Wallet dengan Base Sepolia ETH

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/owi.git
cd owi
```

### 2. Install Dependencies

```bash
# Install all workspace packages
pnpm install

# Install Foundry dependencies
cd contracts && forge install && cd ..
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env dengan API keys Anda
```

### 4. Jalankan Development Server

```bash
# Run frontend + backend simultaneously (from root)
pnpm dev
```

Atau run secara terpisah:

```bash
# Frontend only
pnpm dev:frontend

# Backend only
pnpm dev:backend
```

### 5. Test Smart Contracts

```bash
pnpm forge:test
```

### 6. Buka Aplikasi

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Smart Contracts

| Contract | Deskripsi |
|----------|-----------|
| `MockUSDC.sol` | Token ERC-20 mock untuk USDC (6 decimals) |
| `MockGold.sol` | Token ERC-20 mock untuk Gold (18 decimals) |
| `MockChainlinkOracle.sol` | Mock Chainlink price feed |
| `oWiVault.sol` | Vault utama untuk deposit, trading, dan withdraw |

### Deploy ke Base Sepolia

```bash
# Create .env dengan PRIVATE_KEY
cd contracts
source .env

# Deploy dengan Foundry
pnpm forge:deploy
```

## Base Mini App

Aplikasi ini dibangun sebagai **Base Mini App** yang dapat berjalan di:
- Coinbase Wallet
- Warpcast (Farcaster)
- Base App

### Mini App Features
- `@farcaster/miniapp-sdk` integration
- `fc:miniapp` embed metadata
- `/.well-known/farcaster.json` manifest
- Coinbase Smart Wallet connector

## Environment Variables

```env
# Blockchain (Foundry)
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key

# Frontend
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Backend
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

## Cara Kerja

```
┌─────────────────────────────────────────────────────┐
│  USER DEPOSITS USDC                                 │
│         ↓                                           │
│  AI MONITORS MARKET                                 │
│    - Harga Gold (Chainlink)                         │
│    - Data inflasi                                   │
│    - Sentimen pasar                                 │
│         ↓                                           │
│  AI GENERATES SIGNAL                                │
│    - Buy Gold / Sell Gold / Hold                    │
│    - Confidence score                               │
│    - Reasoning                                      │
│         ↓                                           │
│  USER PAYS 0.01 USDC (x402)                         │
│         ↓                                           │
│  TRADE EXECUTES ON BASE                             │
│         ↓                                           │
│  PORTFOLIO REBALANCES                               │
│         ↓                                           │
│  USER WEALTH PROTECTED                              │
└─────────────────────────────────────────────────────┘
```

## Contributing

Kontribusi selalu diterima! Silakan buat issue atau pull request.

## License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

---

**Built with ❤️ for Base Hackathon 2026**
