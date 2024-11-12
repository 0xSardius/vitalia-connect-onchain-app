// app/wagmi.ts
import { type Config, createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

// Contract ABIs
import { VITALIA_PROFILES_ABI } from "./abis/VitaliaProfiles";
import { VITALIA_CONNECT_ABI } from "./abis/VitaliaConnect";

// Environment variables setup
const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? base : baseSepolia;

// Contract addresses based on network
export const VITALIA_PROFILES_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? process.env.NEXT_PUBLIC_PROFILES_ADDRESS_MAINNET
    : process.env.NEXT_PUBLIC_PROFILES_ADDRESS_TESTNET;

export const VITALIA_CONNECT_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? process.env.NEXT_PUBLIC_CONNECT_ADDRESS_MAINNET
    : process.env.NEXT_PUBLIC_CONNECT_ADDRESS_TESTNET;

export function getConfig(): Config {
  return createConfig({
    chains: [NETWORK],
    connectors: [
      coinbaseWallet({
        appName: "Vitalia Connect",
      }),
    ],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}

// Export contract configurations for easy access throughout the app
export const contractConfig = {
  profiles: {
    address: VITALIA_PROFILES_ADDRESS as `0x${string}`,
    abi: VITALIA_PROFILES_ABI,
  },
  connect: {
    address: VITALIA_CONNECT_ADDRESS as `0x${string}`,
    abi: VITALIA_CONNECT_ABI,
  },
} as const;
