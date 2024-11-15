import { useReadContract } from "wagmi";
import { contractConfig } from "../app/config/wagmi";
import { Listing, ListingStatus, ExpertiseType } from "../app/config/contracts";

export interface ListingFilters {
  status?: ListingStatus;
  category?: string;
  expertise?: string;
  creatorAddress?: string;
  responderAddress?: string;
}

export function useListings(filters?: ListingFilters) {
  // Always get all listings by default
  const functionName = "getActiveListings";

  const {
    data: listings,
    isError,
    isLoading,
    refetch,
  } = useReadContract({
    ...contractConfig.connect,
    functionName,
  }) as {
    data: RawListing[] | undefined;
    isError: boolean;
    isLoading: boolean;
    refetch: () => void;
  };

  type RawListing = {
    id: bigint;
    creator: `0x${string}`;
    title: string;
    description: string;
    category: string;
    isProject: boolean;
    expertiseType: number;
    expertise: string;
    contactMethod: string;
    timestamp: bigint;
    active: boolean;
    status: number;
    responder: `0x${string}`;
  };

  // Transform the raw contract data into a more usable format
  const formattedListings: Listing[] =
    listings?.map((listing: RawListing) => ({
      ...listing,
      expertiseType:
        listing.expertiseType === 0 ? "SEEKING" : ("OFFERING" as ExpertiseType),
      status: ["Open", "InProgress", "Resolved", "Expired"][
        listing.status
      ] as ListingStatus,
    })) ?? [];

  // Apply filters after formatting
  let filteredListings = formattedListings;

  if (filters) {
    filteredListings = formattedListings.filter((listing) => {
      if (filters.status && listing.status !== filters.status) return false;
      if (filters.creatorAddress && listing.creator !== filters.creatorAddress)
        return false;
      if (filters.expertise && listing.expertise !== filters.expertise)
        return false;
      if (filters.category && listing.category !== filters.category)
        return false;
      return true;
    });
  }

  // Only show active listings by default if no status filter is specified
  if (!filters?.status) {
    filteredListings = filteredListings.filter(
      (listing) => listing.active && listing.status === "Open"
    );
  }

  return {
    listings: filteredListings,
    isError,
    isLoading,
    refetch,
  };
}
