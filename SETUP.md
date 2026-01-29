# oWi AI - Complete Setup Guide

Panduan lengkap untuk setup dan menjalankan proyek oWi AI dari awal sampai deployment.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
   - [Step 1: Clone & Install](#step-1-clone--install)
   - [Step 2: Environment Variables](#step-2-environment-variables)
   - [Step 3: Foundry Setup](#step-3-foundry-setup)
   - [Step 4: Smart Contracts](#step-4-smart-contracts)
   - [Step 5: Frontend](#step-5-frontend)
   - [Step 6: Backend](#step-6-backend)
4. [Wallet Setup](#wallet-setup)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Download Link | Cek Versi |
|----------|---------|---------------|-----------|
| **Node.js** | v18+ | https://nodejs.org | `node --version` |
| **npm** | v9+ | Included with Node.js | `npm --version` |
| **Git** | Any | https://git-scm.com | `git --version` |
| **Foundry** | Latest | https://book.getfoundry.sh | `forge --version` |

### Required Accounts & API Keys

| Service | Purpose | Get It Here |
|---------|---------|-------------|
| **Coinbase Developer** | OnchainKit API Key | https://portal.cdp.coinbase.com |
| **Google AI Studio** | Gemini API Key | https://aistudio.google.com/apikey |
| **Alchemy/Infura** | RPC URL (optional) | https://alchemy.com |
| **Wallet** | Private key for deployment | MetaMask / Coinbase Wallet |

### Test ETH (Base Sepolia)

Dapatkan test ETH gratis dari faucet:
- https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- https://docs.base.org/chain/faucets

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-username/owiv2.git
cd owiv2

# 2. Install semua dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Copy environment file
cp .env.example .env
# Edit .env dengan API keys kamu

# 4. Jalankan frontend
cd frontend && npm run dev
# Buka http://localhost:3000

# 5. (Terminal baru) Jalankan backend
cd backend && npm run dev
# API running di http://localhost:8787
```

---

## Detailed Setup

### Step 1: Clone & Install

#### 1.1 Clone Repository

```bash
# Via HTTPS
git clone https://github.com/your-username/owiv2.git

# Atau via SSH
git clone git@github.com:your-username/owiv2.git

# Masuk ke folder
cd owiv2
```

#### 1.2 Project Structure

```
owiv2/
├── contracts/          # Smart contracts (Foundry)
│   ├── src/           # Contract source files
│   │   ├── oWiVault.sol
│   │   ├── MockUSDC.sol
│   │   ├── MockGold.sol
│   │   └── MockChainlinkOracle.sol
│   ├── test/          # Test files
│   ├── script/        # Deployment scripts
│   ├── lib/           # Dependencies (OpenZeppelin)
│   └── foundry.toml   # Foundry config
│
├── frontend/          # Next.js 14 frontend
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities, hooks, store
│   └── public/        # Static assets
│
├── backend/           # Hono.js API server
│   └── src/           # Server code
│       ├── routes/    # API endpoints
│       └── services/  # AI & x402 services
│
├── scripts/           # Build utilities
├── .env.example       # Environment template
├── package.json       # Root package.json
└── README.md          # Documentation
```

#### 1.3 Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Kembali ke root
cd ..
```

---

### Step 2: Environment Variables

#### 2.1 Copy Template

```bash
cp .env.example .env
```

#### 2.2 Edit .env File

Buka file `.env` dan isi semua variables:

```env
# ============================================
# BLOCKCHAIN CONFIGURATION
# ============================================

# Private key untuk deployment (TANPA 0x prefix)
# ⚠️ JANGAN PERNAH COMMIT FILE INI KE GIT!
PRIVATE_KEY=your_private_key_here

# RPC URLs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org

# Etherscan API untuk verifikasi (opsional)
ETHERSCAN_API_KEY=your_etherscan_api_key

# ============================================
# CONTRACT ADDRESSES (isi setelah deploy)
# ============================================

NEXT_PUBLIC_VAULT_ADDRESS=
NEXT_PUBLIC_USDC_ADDRESS=
NEXT_PUBLIC_GOLD_ADDRESS=
NEXT_PUBLIC_ORACLE_ADDRESS=

# ============================================
# API KEYS
# ============================================

# Coinbase Developer Portal
# Get it: https://portal.cdp.coinbase.com
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Google AI Studio - Gemini API
# Get it: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key

# ============================================
# APP CONFIGURATION
# ============================================

# Environment
NODE_ENV=development

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8787

# x402 Payment Address (alamat untuk terima pembayaran)
PAYMENT_ADDRESS=0xYourPaymentAddress

# Skip payment untuk development
SKIP_PAYMENT=true
```

#### 2.3 Cara Mendapatkan API Keys

**Coinbase OnchainKit API Key:**
1. Buka https://portal.cdp.coinbase.com
2. Login dengan akun Coinbase
3. Create New Project → pilih nama
4. Copy API Key

**Gemini API Key:**
1. Buka https://aistudio.google.com/apikey
2. Login dengan akun Google
3. Click "Create API Key"
4. Copy API Key

**Private Key (untuk deployment):**
1. Buka MetaMask
2. Click titik tiga → Account Details
3. Click "Show Private Key"
4. Masukkan password
5. Copy private key (TANPA 0x)

> ⚠️ **PENTING**: Gunakan wallet baru khusus untuk development. JANGAN gunakan wallet utama!

---

### Step 3: Foundry Setup

Foundry adalah framework untuk develop smart contracts di Solidity.

#### 3.1 Install Foundry

**Windows (via PowerShell as Admin):**
```powershell
# Install via scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
scoop install git
scoop bucket add main
scoop install foundry
```

**Atau download manual:**
1. Download dari https://github.com/foundry-rs/foundry/releases
2. Extract ke folder (misal: `C:\foundry`)
3. Tambahkan ke PATH:
   - Buka System Properties → Environment Variables
   - Edit PATH → Add `C:\foundry`

**Linux/MacOS:**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### 3.2 Verifikasi Instalasi

```bash
forge --version
# Output: forge 0.2.0 (xxxxx)

cast --version
# Output: cast 0.2.0 (xxxxx)

anvil --version
# Output: anvil 0.2.0 (xxxxx)
```

#### 3.3 Install Contract Dependencies

```bash
cd contracts

# Install OpenZeppelin contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Install forge-std (testing library)
forge install foundry-rs/forge-std --no-commit

# Kembali ke root
cd ..
```

---

### Step 4: Smart Contracts

#### 4.1 Build Contracts

```bash
cd contracts

# Compile semua contracts
forge build

# Output yang diharapkan:
# [⠒] Compiling...
# [⠒] Compiling 10 files with 0.8.20
# Compiler run successful!
```

#### 4.2 Run Tests

```bash
# Jalankan semua tests
forge test

# Dengan verbose output
forge test -vvv

# Dengan gas report
forge test --gas-report
```

#### 4.3 Deploy to Base Sepolia

**Pastikan:**
- [ ] PRIVATE_KEY sudah diisi di .env
- [ ] Wallet punya test ETH di Base Sepolia (minimal 0.01 ETH)

```bash
# Load environment variables
source .env  # Linux/Mac
# atau di Windows PowerShell:
# $env:PRIVATE_KEY = "your_key"

# Deploy
forge script script/Deploy.s.sol:Deploy \
    --rpc-url https://sepolia.base.org \
    --broadcast \
    --verify \
    -vvvv
```

#### 4.4 Simpan Contract Addresses

Setelah deploy berhasil, output akan menampilkan addresses:

```
== Logs ==
  Deploying contracts...
  USDC deployed at: 0x1234...
  Gold deployed at: 0x5678...
  Oracle deployed at: 0xabcd...
  Vault deployed at: 0xefgh...
```

Copy addresses ke file `.env`:

```env
NEXT_PUBLIC_VAULT_ADDRESS=0xefgh...
NEXT_PUBLIC_USDC_ADDRESS=0x1234...
NEXT_PUBLIC_GOLD_ADDRESS=0x5678...
NEXT_PUBLIC_ORACLE_ADDRESS=0xabcd...
```

Dan update di `frontend/lib/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  84532: { // Base Sepolia
    vault: "0xefgh...",
    usdc: "0x1234...",
    gold: "0x5678...",
    oracle: "0xabcd...",
  },
};
```

---

### Step 5: Frontend

#### 5.1 Install Dependencies (jika belum)

```bash
cd frontend
npm install
```

#### 5.2 Update Configuration

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_GOLD_ADDRESS=0x...
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key
```

#### 5.3 Run Development Server

```bash
npm run dev

# Output:
# ▲ Next.js 14.1.0
# - Local: http://localhost:3000
# ✓ Ready in 2.3s
```

#### 5.4 Buka di Browser

1. Buka http://localhost:3000
2. Kamu akan melihat landing page oWi AI
3. Click "Connect Wallet" untuk connect dengan Coinbase Wallet

---

### Step 6: Backend

#### 6.1 Install Dependencies (jika belum)

```bash
cd backend
npm install
```

#### 6.2 Run Development Server

```bash
npm run dev

# Output:
# ╔══════════════════════════════════════════╗
# ║          oWi AI Backend Server           ║
# ║  🚀 Server running on port 8787          ║
# ║  📍 http://localhost:8787                ║
# ╚══════════════════════════════════════════╝
```

#### 6.3 Test Endpoints

```bash
# Health check
curl http://localhost:8787/api/health

# Get gold price
curl http://localhost:8787/api/price

# Get AI signal preview (free)
curl http://localhost:8787/api/signal/preview
```

---

## Wallet Setup

### Coinbase Wallet (Recommended)

1. Download Coinbase Wallet:
   - Chrome Extension: https://chrome.google.com/webstore/detail/coinbase-wallet-extension
   - Mobile App: App Store / Play Store

2. Create atau Import Wallet

3. Switch ke Base Sepolia Network:
   - Buka Settings → Networks
   - Add Network:
     - Name: Base Sepolia
     - RPC: https://sepolia.base.org
     - Chain ID: 84532
     - Symbol: ETH
     - Explorer: https://sepolia.basescan.org

4. Get Test ETH:
   - Buka https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Connect wallet
   - Claim test ETH

### MetaMask Alternative

1. Install MetaMask Extension
2. Add Base Sepolia Network (same config as above)
3. Import account atau create new

---

## Testing

### Smart Contract Tests

```bash
cd contracts

# Run all tests
forge test

# Run specific test file
forge test --match-path test/oWiVault.t.sol

# Run specific test function
forge test --match-test test_Deposit

# With verbosity
forge test -vvvv

# Gas report
forge test --gas-report

# Coverage report
forge coverage
```

### Frontend Tests

```bash
cd frontend

# Type checking
npm run type-check

# Linting
npm run lint
```

### API Tests

```bash
# Health check
curl http://localhost:8787/api/health

# Price endpoint
curl http://localhost:8787/api/price

# Signal preview
curl http://localhost:8787/api/signal/preview

# Full signal (POST)
curl -X POST http://localhost:8787/api/signal \
  -H "Content-Type: application/json" \
  -d '{
    "userAddress": "0x1234...",
    "portfolioValue": 1000,
    "goldPercentage": 30,
    "riskTolerance": "moderate"
  }'
```

---

## Deployment

### Deploy Contracts to Mainnet

```bash
cd contracts

# Deploy to Base Mainnet (pastikan punya real ETH!)
forge script script/Deploy.s.sol:Deploy \
    --rpc-url https://mainnet.base.org \
    --broadcast \
    --verify
```

### Deploy Frontend to Vercel

1. Push code ke GitHub
2. Buka https://vercel.com
3. Import repository
4. Set environment variables:
   - `NEXT_PUBLIC_VAULT_ADDRESS`
   - `NEXT_PUBLIC_USDC_ADDRESS`
   - `NEXT_PUBLIC_GOLD_ADDRESS`
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
5. Deploy

### Deploy Backend to Cloudflare Workers

```bash
cd backend

# Install wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler deploy
```

---

## Troubleshooting

### Common Issues

#### "forge: command not found"
```bash
# Windows: Tambahkan ke PATH
$env:PATH += ";C:\path\to\foundry"

# Atau install ulang via foundryup
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### "npm install" errors
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### "Contract deployment failed"
- Pastikan ada cukup ETH di wallet
- Check RPC URL benar
- Verifikasi PRIVATE_KEY benar (tanpa 0x)

#### "Wallet not connecting"
- Refresh halaman
- Clear browser cache
- Pastikan network sudah Base Sepolia
- Try different browser

#### "API returning 402 Payment Required"
- Set `SKIP_PAYMENT=true` di .env untuk development
- Atau implement x402 payment flow

### Get Help

- GitHub Issues: [Create Issue](https://github.com/your-username/owiv2/issues)
- Discord: [Join Server](#)
- Documentation: [Docs](#)

---

## Summary Checklist

- [ ] Node.js v18+ installed
- [ ] Foundry installed (`forge --version`)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install` di setiap folder)
- [ ] `.env` file configured
- [ ] API keys obtained (Coinbase, Gemini)
- [ ] Contracts compiled (`forge build`)
- [ ] Tests passing (`forge test`)
- [ ] Contracts deployed (addresses saved)
- [ ] Frontend running (http://localhost:3000)
- [ ] Backend running (http://localhost:8787)
- [ ] Wallet connected
- [ ] Test ETH obtained

---

**Happy Building! 🚀**

Created for oWi AI Hackathon Project
