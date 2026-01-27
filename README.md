# 🛡️ GoldGuard AI

> Bot Trading Otonom untuk Perlindungan Inflasi dengan AI di Base Blockchain

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=flat-square)](https://base.org)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-AI-10B981?style=flat-square)](https://groq.com)
[![x402 Micropayments](https://img.shields.io/badge/x402-Micropayments-FFD700?style=flat-square)](https://x402.org)

## 📋 Tentang GoldGuard AI

GoldGuard AI adalah aplikasi DeFi mobile-first yang berjalan sebagai **Base Mini App** di dalam Coinbase Wallet. Aplikasi ini menggunakan kecerdasan buatan untuk secara otomatis memperdagangkan antara **USDC** (stablecoin) dan **tokenized gold** (XAU) untuk melindungi daya beli pengguna dari inflasi.

### ✨ Fitur Utama

- 🤖 **Fully Autonomous** - AI membuat keputusan trading 24/7
- 💰 **Perlindungan Inflasi** - Otomatis hedge terhadap devaluasi mata uang
- 💎 **Accessible** - Mulai dengan hanya $10
- ⚡ **Pay-Per-Use** - Hanya bayar untuk sinyal AI yang Anda gunakan (via x402)
- 📱 **Mobile-First** - Dibangun sebagai Base Mini App untuk Coinbase Wallet
- 🔒 **Non-Custodial** - Anda selalu mengontrol dana Anda

## 🏗️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Blockchain | Base (Sepolia Testnet) |
| Smart Contracts | Solidity 0.8.20, Hardhat, OpenZeppelin |
| Frontend | Next.js 14, TypeScript, TailwindCSS, Shadcn/ui |
| Web3 | Wagmi 2.x, Viem 2.x, OnchainKit |
| Backend | Hono.js, TypeScript, Prisma |
| Database | PostgreSQL / SQLite |
| AI | Groq (llama-3.3-70b-versatile) |
| Oracle | Chainlink Price Feeds |

## 📁 Struktur Proyek

```
goldguard-ai/
├── frontend/          # Next.js Base Mini App
├── backend/           # Hono.js API server
├── contracts/         # Solidity smart contracts
├── docs/              # Dokumentasi
└── README.md          # File ini
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm atau yarn
- Git
- Wallet dengan Base Sepolia ETH

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/goldguard-ai.git
cd goldguard-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
# Copy environment file
cp .env.example .env

# Edit dengan value Anda
nano .env
```

### 4. Jalankan Development Server

```bash
# Terminal 1: Smart Contracts (opsional)
cd contracts && npx hardhat node

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

### 5. Buka Aplikasi

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📜 Smart Contracts

| Contract | Deskripsi |
|----------|-----------|
| `MockUSDC.sol` | Token ERC-20 mock untuk USDC (6 decimals) |
| `MockGold.sol` | Token ERC-20 mock untuk Gold (18 decimals) |
| `GoldGuardVault.sol` | Vault utama untuk deposit, trading, dan withdraw |

### Deploy ke Base Sepolia

```bash
cd contracts
npx hardhat run scripts/deploy-all.ts --network baseSepolia
```

## 🔐 Environment Variables

```env
# Blockchain
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key

# Frontend
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_GOLD_ADDRESS=0x...
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Backend
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
```

## 📱 Cara Kerja

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

## 🤝 Contributing

Kontribusi selalu diterima! Silakan buat issue atau pull request.

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

---

**Built with ❤️ for Base Hackathon 2026**
