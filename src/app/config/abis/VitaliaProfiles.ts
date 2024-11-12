// config/abis/VitaliaProfiles.ts
export const VITALIA_PROFILES_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "oldExpertise",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "newExpertise",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ExpertiseUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "onSiteStatus",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "string[]",
        name: "expertiseAreas",
        type: "string[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ProfileCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_contactInfo",
        type: "string",
      },
      {
        internalType: "bool",
        name: "_onSiteStatus",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_travelDetails",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_expertiseAreas",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_credentials",
        type: "string",
      },
      {
        internalType: "string",
        name: "_bio",
        type: "string",
      },
    ],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getProfile",
    outputs: [
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "string",
        name: "contactInfo",
        type: "string",
      },
      {
        internalType: "bool",
        name: "onSiteStatus",
        type: "bool",
      },
      {
        internalType: "string",
        name: "travelDetails",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "lastStatusUpdate",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "expertiseAreas",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "credentials",
        type: "string",
      },
      {
        internalType: "string",
        name: "bio",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserStats",
    outputs: [
      {
        internalType: "uint40",
        name: "completed",
        type: "uint40",
      },
      {
        internalType: "uint40",
        name: "created",
        type: "uint40",
      },
      {
        internalType: "uint40",
        name: "responses",
        type: "uint40",
      },
      {
        internalType: "uint256",
        name: "lastActive",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_contactInfo",
        type: "string",
      },
      {
        internalType: "bool",
        name: "_onSiteStatus",
        type: "bool",
      },
      {
        internalType: "string",
        name: "_travelDetails",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_expertiseAreas",
        type: "string[]",
      },
      {
        internalType: "string",
        name: "_credentials",
        type: "string",
      },
      {
        internalType: "string",
        name: "_bio",
        type: "string",
      },
    ],
    name: "updateProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Typescript types for the profile
export interface VitaliaProfile {
  isActive: boolean;
  contactInfo: string;
  onSiteStatus: boolean;
  travelDetails: string;
  lastStatusUpdate: bigint;
  expertiseAreas: string[];
  credentials: string;
  bio: string;
}

export interface UserStats {
  completed: number;
  created: number;
  responses: number;
  lastActive: bigint;
}
