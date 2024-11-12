export const CHAIN_ID =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? 8453 : 84532; // Base Mainnet : Base Sepolia

export const VITALIA_PROFILES_ADDRESS = {
  mainnet: "0x...", // Blank until deployment on mainnet
  testnet: "0xaccFC127f32d2dA14f05F5C373Ba2d0aF0152D33", // Base Sepolia Testnet address
} as const;

export const VITALIA_CONNECT_ADDRESS = {
  mainnet: "0x...", // Blank until deployment on mainnet
  testnet: "0x04F94A2fCaAA6Ce147C99F34620fcfbA609d4906", // Base Sepolia Testnet address
} as const;

// Types for your contracts
export type ExpertiseType = "SEEKING" | "OFFERING";
export type ListingStatus = "Open" | "InProgress" | "Resolved" | "Expired";

export interface UserProfile {
  isActive: boolean;
  contactInfo: string;
  onSiteStatus: boolean;
  travelDetails: string;
  lastStatusUpdate: bigint;
  expertiseAreas: string[];
  credentials: string;
  bio: string;
}

export interface Listing {
  id: bigint;
  creator: `0x${string}`;
  title: string;
  description: string;
  category: string;
  isProject: boolean;
  expertiseType: ExpertiseType;
  expertise: string;
  contactMethod: string;
  timestamp: bigint;
  active: boolean;
  status: ListingStatus;
  responder: `0x${string}`;
}
