// config/abis/VitaliaConnect.ts

// Type definitions for the Listing struct and enums
export enum ExpertiseType {
  SEEKING = 0,
  OFFERING = 1,
}

export enum ListingStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Expired = 3,
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

export const VITALIA_CONNECT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_profilesContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_title",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_category",
        type: "string",
      },
      {
        internalType: "bool",
        name: "_isProject",
        type: "bool",
      },
      {
        internalType: "enum VitaliaConnect.ExpertiseType",
        name: "_expertiseType",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "_expertise",
        type: "string",
      },
      {
        internalType: "string",
        name: "_contactMethod",
        type: "string",
      },
    ],
    name: "createListing",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveListings",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isProject",
            type: "bool",
          },
          {
            internalType: "enum VitaliaConnect.ExpertiseType",
            name: "expertiseType",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "expertise",
            type: "string",
          },
          {
            internalType: "string",
            name: "contactMethod",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "enum VitaliaConnect.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "responder",
            type: "address",
          },
        ],
        internalType: "struct VitaliaConnect.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "respondToListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "markResolved",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum VitaliaConnect.Status",
        name: "_status",
        type: "uint8",
      },
    ],
    name: "getListingsByStatus",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isProject",
            type: "bool",
          },
          {
            internalType: "enum VitaliaConnect.ExpertiseType",
            name: "expertiseType",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "expertise",
            type: "string",
          },
          {
            internalType: "string",
            name: "contactMethod",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "enum VitaliaConnect.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "responder",
            type: "address",
          },
        ],
        internalType: "struct VitaliaConnect.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCategories",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "expertise",
        type: "string",
      },
    ],
    name: "getListingsByExpertise",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isProject",
            type: "bool",
          },
          {
            internalType: "enum VitaliaConnect.ExpertiseType",
            name: "expertiseType",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "expertise",
            type: "string",
          },
          {
            internalType: "string",
            name: "contactMethod",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "enum VitaliaConnect.Status",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "responder",
            type: "address",
          },
        ],
        internalType: "struct VitaliaConnect.Listing[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
