import { useListings } from "@/hooks/useListings";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";

interface ListingsGridProps {
  filters?: {
    status?: "Open" | "InProgress" | "Resolved";
    creatorAddress?: `0x${string}`;
  };
  className?: string;
}

export default function ListingsGrid({
  filters,
  className = "",
}: ListingsGridProps) {
  const { listings, isLoading, isError, refetch } = useListings(filters);

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[300px] bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Error loading listings. Please try again later.
        <Button onClick={() => refetch()} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No listings found.
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id.toString()} listing={listing} />
        ))}
      </div>
    </div>
  );
}
