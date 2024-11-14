import { useState } from "react";
import { useListings, ListingFilters } from "@/hooks/useListings";
import ListingCard from "./ListingCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MixerHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

// Define available categories
const CATEGORIES = [
  "Biohacking",
  "Longevity Research",
  "Biotech",
  "Community Building",
  "Governance",
  "Technology",
] as const;

type Category = (typeof CATEGORIES)[number];

interface ListingsGridProps {
  filters?: ListingFilters;
  className?: string;
}

export default function ListingsGrid({
  filters: initialFilters,
  className = "",
}: ListingsGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "expertise">(
    "newest"
  );
  const [currentFilters, setCurrentFilters] = useState<ListingFilters>(
    initialFilters || {}
  );

  const { listings, isLoading, isError, refetch } = useListings(currentFilters);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as Category);
    // Update filters if needed
    setCurrentFilters((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
    setCurrentFilters(initialFilters || {});
  };

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

  // Filter and sort listings
  const filteredListings = listings
    ?.filter((listing) => {
      const matchesSearch = searchTerm
        ? listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          listing.expertise.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? listing.category === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return Number(b.timestamp) - Number(a.timestamp);
        case "oldest":
          return Number(a.timestamp) - Number(b.timestamp);
        case "expertise":
          return a.expertise.localeCompare(b.expertise);
        default:
          return 0;
      }
    });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "newest" | "oldest" | "expertise")
              }
            >
              <DropdownMenuRadioItem value="newest">
                Newest First
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">
                Oldest First
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="expertise">
                Expertise
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {(searchTerm ||
        selectedCategory ||
        Object.keys(currentFilters).length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active Filters:</span>
          {searchTerm && (
            <Badge variant="secondary">Search: {searchTerm}</Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary">Category: {selectedCategory}</Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredListings?.length || 0} listing
        {filteredListings?.length !== 1 ? "s" : ""}
      </div>

      {/* Listings Grid */}
      {filteredListings && filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id.toString()} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No listings found matching your criteria.
        </div>
      )}
    </div>
  );
}
