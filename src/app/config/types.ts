export type ExpertiseType = "SEEKING" | "OFFERING";
export type ListingStatus = "Open" | "InProgress" | "Resolved" | "Expired";

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

export interface VitaliaStats {
  completed: bigint;
  created: bigint;
  responses: bigint;
  lastActive: bigint;
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

// Hook return types
export interface UseProfileReturn {
  profile: VitaliaProfile | undefined;
  stats: VitaliaStats | undefined;
  isError: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export interface UseListingsReturn {
  listings: Listing[];
  isError: boolean;
  isLoading: boolean;
  refetch: () => Promise<void>;
}
