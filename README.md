VitaliaConnect Frontend
🌟 Overview
VitaliaConnect is a decentralized platform built for the Vitalia community that enables seamless connections between expertise seekers and providers. Built on Base, it leverages blockchain technology to create a transparent and efficient marketplace for knowledge exchange.
🎯 Key Features

- Profile Management: Create and manage your expert profile with credentials, expertise areas, and on-site status
- Listing Creation: Post projects and opportunities for collaboration
- Expert Discovery: Find and connect with experts in various fields like biohacking, longevity research, and biotech
- Real-time Status: Track listing status (Open, In Progress, Resolved) with blockchain confirmation
- Reputation System: Build credibility through completed interactions and expertise validation

🔧 Tech Stack

Frontend Framework: Next.js
Smart Contract Integration: wagmi
Wallet Integration: OnchainKit by Coinbase
Styling: Tailwind CSS + shadcn/ui
State Management: TanStack Query (React Query)
Blockchain: Base (Mainnet/Sepolia)

🚀 Getting Started

# VitaliaConnect Frontend

A Next.js web application for connecting Vitalia community members through projects and opportunities.

## Prerequisites

- Node.js v18+
- pnpm
- Coinbase Wallet or MetaMask
- Base (Mainnet/Sepolia) network access

## Getting Started

1. Clone and install dependencies:

```bash
git clone https://github.com/your-username/vitalia-connect-frontend.git
cd vitalia-connect-frontend
pnpm install
```

2. Set up environment variables in `.env.local`:

```env
# Network (mainnet/testnet)
NEXT_PUBLIC_NETWORK=testnet

# Coinbase Developer Platform Keys
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_CDP_PROJECT_ID=your_project_id

# Contract Addresses
NEXT_PUBLIC_PROFILES_ADDRESS_TESTNET=0xaccFC127f32d2dA14f05F5C373Ba2d0aF0152D33
NEXT_PUBLIC_CONNECT_ADDRESS_TESTNET=0x04F94A2fCaAA6Ce147C99F34620fcfbA609d4906
```

3. Start development server:

```bash
pnpm dev
```

4. Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Web3 providers
│   └── config/            # Contract configs
├── components/
│   ├── cards/
│   │   ├── ListingCard.tsx
│   │   ├── ProfileCard.tsx
│   │   └── ListingsGrid.tsx
│   └── ui/               # shadcn/ui components
├── hooks/
│   ├── useProfile.ts     # Profile data hook
│   ├── useListings.ts    # Listings hook
│   └── useCreateListing.ts
└── lib/
    └── utils.ts          # Utility functions
```

## Key Features

- Wallet connection (Coinbase Wallet/MetaMask)
- Profile creation and management
- Project/opportunity listings
- Listing responses and completion tracking
- Expertise filtering
- On-chain verification

## Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run linter
```

## Dependencies

- Next.js 14
- OnchainKit (Coinbase)
- wagmi/viem
- TailwindCSS
- shadcn/ui

## Environment Variables

| Variable                             | Description                            | Required |
| ------------------------------------ | -------------------------------------- | -------- |
| NEXT_PUBLIC_NETWORK                  | Network (mainnet/testnet)              | Yes      |
| NEXT_PUBLIC_ONCHAINKIT_API_KEY       | Coinbase OnchainKit API Key            | Yes      |
| NEXT_PUBLIC_CDP_PROJECT_ID           | Coinbase Developer Platform Project ID | Yes      |
| NEXT_PUBLIC_PROFILES_ADDRESS_TESTNET | VitaliaProfiles contract address       | Yes      |
| NEXT_PUBLIC_CONNECT_ADDRESS_TESTNET  | VitaliaConnect contract address        | Yes      |

## License

MIT
