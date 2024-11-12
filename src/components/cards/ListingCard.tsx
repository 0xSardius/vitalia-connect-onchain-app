import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { Listing } from "@/app/config/contracts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  listing: Listing;
  onRespond?: (listingId: bigint) => void;
  isResponding?: boolean;
}

export default function ListingCard({
  listing,
  onRespond,
  isResponding,
}: ListingCardProps) {
  const isActive = listing.status === "Open" && listing.active;
  const statusColors = {
    Open: "bg-green-500",
    InProgress: "bg-yellow-500",
    Resolved: "bg-blue-500",
    Expired: "bg-gray-500",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-2">{listing.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className={`h-2 w-2 rounded-full ${
                  statusColors[listing.status]
                }`}
              />
              <span>{listing.status}</span>
              <span>•</span>
              <span>{listing.isProject ? "Project" : "Opportunity"}</span>
            </div>
          </div>
          <Badge
            variant={
              listing.expertiseType === "SEEKING" ? "default" : "secondary"
            }
          >
            {listing.expertiseType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <Avatar address={listing.creator} className="h-6 w-6" />
            <Name address={listing.creator} className="text-sm" />
          </div>

          {/* Description */}
          <p className="text-sm">{listing.description}</p>

          {/* Category & Expertise */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{listing.category}</Badge>
            <Badge variant="outline">{listing.expertise}</Badge>
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              <span>
                Posted {formatDistanceToNow(Number(listing.timestamp) * 1000)}{" "}
                ago
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      {isActive && onRespond && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => onRespond(listing.id)}
            disabled={isResponding}
          >
            {isResponding ? "Responding..." : "Respond to Listing"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
