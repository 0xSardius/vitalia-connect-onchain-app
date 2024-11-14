import { Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
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
import {
  ClockIcon,
  ChatBubbleIcon,
  ExternalLinkIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListingCardProps {
  listing: Listing;
  onRespond?: (listingId: bigint) => void;
  isResponding?: boolean;
  className?: string;
  showFullDetails?: boolean;
}

export default function ListingCard({
  listing,
  onRespond,
  isResponding,
  className = "",
  showFullDetails = false,
}: ListingCardProps) {
  const router = useRouter();
  const isActive = listing.status === "Open" && listing.active;

  const statusConfig = {
    Open: {
      color: "bg-green-500",
      label: "Open for responses",
    },
    InProgress: {
      color: "bg-yellow-500",
      label: "Currently in progress",
    },
    Resolved: {
      color: "bg-blue-500",
      label: "Successfully completed",
    },
    Expired: {
      color: "bg-gray-500",
      label: "No longer active",
    },
  };

  const handleViewDetails = () => {
    router.push(`/listing/${listing.id}`);
  };

  return (
    <Card className={`${className} hover:shadow-md transition-shadow`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {" "}
            {/* Prevent title overflow */}
            <CardTitle className="mb-2 truncate">{listing.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Tooltip>
                <TooltipTrigger>
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        statusConfig[listing.status].color
                      }`}
                    />
                    <span>{listing.status}</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {statusConfig[listing.status].label}
                </TooltipContent>
              </Tooltip>
              <span>•</span>
              <span>{listing.isProject ? "Project" : "Opportunity"}</span>
            </div>
          </div>
          <Badge
            variant={
              listing.expertiseType === "SEEKING" ? "default" : "secondary"
            }
            className="shrink-0"
          >
            {listing.expertiseType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Creator Info */}
          <Identity address={listing.creator}>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
              <Avatar className="h-6 w-6" />
              <Name className="text-sm" />
              {listing.responder && (
                <Badge variant="outline" className="ml-auto">
                  <PersonIcon className="h-3 w-3 mr-1" />
                  Has Responder
                </Badge>
              )}
            </div>
          </Identity>

          {/* Description */}
          <p className={`text-sm ${!showFullDetails && "line-clamp-3"}`}>
            {listing.description}
          </p>

          {/* Category & Expertise */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{listing.category}</Badge>
            <Badge variant="outline">{listing.expertise}</Badge>
          </div>

          {/* Contact Method - Only show in full details */}
          {showFullDetails && listing.contactMethod && (
            <div className="text-sm text-muted-foreground">
              <strong>Contact Method:</strong> {listing.contactMethod}
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>
                Posted {formatDistanceToNow(Number(listing.timestamp) * 1000)}{" "}
                ago
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {(isActive || !showFullDetails) && (
        <CardFooter className="flex gap-2">
          {isActive && onRespond && (
            <Button
              className="flex-1"
              onClick={() => onRespond(listing.id)}
              disabled={isResponding}
            >
              <ChatBubbleIcon className="h-4 w-4 mr-2" />
              {isResponding ? "Responding..." : "Respond to Listing"}
            </Button>
          )}
          {!showFullDetails && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleViewDetails}
            >
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
