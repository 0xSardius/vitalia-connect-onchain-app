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
  let functionName:
    | "getActiveListings"
    | "getListingsByStatus"
    | "getListingsByExpertise"
    | "getCategories";
  let args: (ListingStatus | string | `0x${string}`)[] = [];

  // Determine which contract function to call based on filters
  if (filters?.status) {
    functionName = "getListingsByStatus";
    args = [filters.status];
  } else if (filters?.expertise) {
    functionName = "getListingsByExpertise";
    args = [filters.expertise];
  } else if (filters?.creatorAddress) {
    functionName = "getCategories";
    args = [filters.creatorAddress];
  } else {
    functionName = "getActiveListings";
  }

  const {
    data: listings,
    isError,
    isLoading,
    refetch,
  } = useReadContract({
    ...contractConfig.connect,
    functionName,
    args: args.length ? [args[0]] : undefined,
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

  return {
    listings: formattedListings,
    isError,
    isLoading,
    refetch,
  };
}
