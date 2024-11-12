import { useListings, ListingFilters } from "@/hooks/useListings";
import ListingCard from "./ListingCard";
import { useWriteContract } from "wagmi";
import { contractConfig } from "@/app/config/wagmi";
import { Skeleton } from "@/components/ui/skeleton";
// import { type Listing } from "../app/config/contracts";

interface ListingsGridProps {
  filters?: ListingFilters;
}

export default function ListingsGrid({ filters }: ListingsGridProps) {
  const { listings, isLoading, isError, refetch } = useListings(filters);
  const { writeContract, isPending: isResponding } = useWriteContract();

  const handleRespond = async (listingId: bigint) => {
    try {
      const config = {
        address: contractConfig.connect.address,
        abi: contractConfig.connect.abi,
        functionName: "respondToListing",
        args: [listingId] as const, // Make sure args are readonly tuple
      } as const; // Make the entire config readonly

      await writeContract(config);
      refetch();
    } catch (error) {
      console.error("Error responding to listing:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Error loading listings. Please try again later.
      </div>
    );
  }

  if (!listings?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No listings found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id.toString()}
          listing={listing}
          onRespond={handleRespond}
          isResponding={isResponding}
        />
      ))}
    </div>
  );
}
