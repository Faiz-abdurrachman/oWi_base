# oWi AI - Complete Setup Guide

> Guide lengkap untuk setup project oWi dari awal hingga production.

---

## Prerequisites

Pastikan sudah terinstall:

| Tool | Link |
|------|------|
| Node.js v18+ | [nodejs.org](https://nodejs.org) |
| pnpm | `npm install -g pnpm` |
| Foundry | `curl -L https://foundry.paradigm.xyz | bash && foundryup` |
| Git | [git-scm.com](https://git-scm.com) |

---

## Human Touch Required: API Keys & Credentials

### 1. WalletConnect Project ID
**Untuk:** Wallet connection di frontend

1. Buka [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Signup/Login dengan email atau GitHub
3. Klik **"Create Project"**
4. Isi nama: `oWi AI`
5. Copy Project ID → simpan untuk `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

### 2. OnchainKit API Key (Coinbase Developer Platform)
**Untuk:** Enhanced wallet features, ENS resolution

1. Buka [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com)
2. Login dengan akun Coinbase
3. Klik **"Create API Key"**
4. Copy API Key → simpan untuk `NEXT_PUBLIC_ONCHAINKIT_API_KEY`

### 3. Gemini API Key
**Untuk:** AI trading signals

1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik **"Create API Key"**
4. Pilih project atau buat baru
5. Copy API Key → simpan untuk `GEMINI_API_KEY`

### 4. BaseScan API Key
**Untuk:** Contract verification di Base Sepolia

1. Buka [basescan.org/register](https://basescan.org/register)
2. Buat akun dan login
3. Pergi ke **"API Keys"** di profile
4. Klik **"Add"** untuk buat API key baru
5. Copy API Key → simpan untuk `BASESCAN_API_KEY`

### 5. Private Key untuk Deployment
**Untuk:** Deploy contracts ke Base Sepolia

> ⚠️ **PENTING:** Gunakan wallet BARU khusus development, BUKAN wallet utama!

1. Buat wallet baru di MetaMask/Coinbase Wallet
2. Export private key (Settings → Security → Export Private Key)
3. Simpan untuk `PRIVATE_KEY`
4. Get testnet ETH: [base.org/faucet](https://base.org/faucet) (perlu 0.001 ETH mainnet)

---

## Step-by-Step Setup

### Step 1: Clone & Navigate

```bash
git clone https://github.com/yourusername/owi.git
cd owi
```

### Step 2: Create Environment Files

**Root .env:**

```bash
cp .env.example .env
```

Edit `.env` dengan values Anda:

```env
# Blockchain
PRIVATE_KEY=0x_your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key

# Frontend
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=https://owi.ai

# Backend
PORT=3001
JWT_SECRET=generate_random_string_minimum_32_characters
GEMINI_API_KEY=your_gemini_api_key
```

**Contracts .env:**

```bash
cd contracts
cp .env.example .env
```

Edit `contracts/.env`:

```env
PRIVATE_KEY=0x_your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

### Step 3: Install Dependencies

```bash
# Install all workspace packages (from root)
pnpm install

# Install Foundry dependencies
cd contracts
forge install
cd ..
```

### Step 4: Run Tests

```bash
pnpm forge:test
```

> Semua 21 tests harus PASS ✅

### Step 5: Deploy Contracts ke Base Sepolia

```bash
pnpm forge:deploy
```

Setelah deploy, copy contract addresses dan update `.env`:

```env
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_GOLD_ADDRESS=0x...
NEXT_PUBLIC_ORACLE_ADDRESS=0x...
```

### Step 6: Update Frontend Contract Addresses

Edit `frontend/lib/contracts.ts` dengan addresses baru:

```typescript
export const CONTRACTS = {
  VAULT: "0x...", // dari deploy output
  USDC: "0x...",
  GOLD: "0x...",
  ORACLE: "0x...",
};
```

---

## Run Locally

**Single Command (Recommended):**

```bash
# From root - runs frontend + backend with labeled logs
pnpm dev
```

**Run Separately:**

```bash
# Frontend only
pnpm dev:frontend

# Backend only
pnpm dev:backend
```

**Using pnpm filter:**

```bash
# Frontend
pnpm --filter owi-frontend dev

# Backend
pnpm --filter owi-backend dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Farcaster Account Association

**Untuk:** Mendaftarkan Mini App di Farcaster

### Generate Credentials

1. Install Farcaster CLI:
   ```bash
   pnpm add -g @farcaster/auth-cli
   ```

2. Generate association:
   ```bash
   farcaster-auth generate --domain owi.ai
   ```

3. Copy output dan update `frontend/app/.well-known/farcaster.json/route.ts`:
   ```typescript
   accountAssociation: {
       header: "generated_header",
       payload: "generated_payload", 
       signature: "generated_signature",
   },
   ```

---

## Deploy ke Production

### Frontend → Vercel

1. Push ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repository
4. Set environment variables (sama seperti `.env`)
5. Deploy

### Backend → Railway/Render

1. Buka [railway.app](https://railway.app) atau [render.com](https://render.com)
2. Connect GitHub repo
3. Set environment variables
4. Deploy

---

## Submit ke Mini App Registry

1. Buka [base.org/miniapps](https://base.org/miniapps)
2. Klik **"Submit Mini App"**
3. Isi form:
   - **App Name:** oWi AI
   - **App URL:** https://owi.ai
   - **Description:** Bot trading AI untuk perlindungan inflasi dengan emas tokenized
   - **Category:** Finance
4. Submit dan tunggu review

---

## Checklist Final

| Task | Status |
|------|--------|
| API Keys configured | ⬜ |
| Dependencies installed (`pnpm install`) | ⬜ |
| Tests passing (`pnpm forge:test`) | ⬜ |
| Contracts deployed (`pnpm forge:deploy`) | ⬜ |
| Contract addresses updated | ⬜ |
| Farcaster credentials generated | ⬜ |
| Frontend deployed | ⬜ |
| Backend deployed | ⬜ |
| Mini App submitted | ⬜ |

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Cannot find module" errors | Run `pnpm install` di root |
| Forge test fails | Pastikan `forge install` sudah dijalankan di `/contracts` |
| Contract deployment fails | Cek saldo testnet ETH di wallet deployment |
| WalletConnect tidak connect | Verifikasi `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` benar |

---

**Built with ❤️ for Base Hackathon 2026**
