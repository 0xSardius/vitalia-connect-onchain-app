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
import { ClockIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction,
} from "@coinbase/onchainkit/transaction";
import { contractConfig } from "@/app/config/wagmi";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";

interface ListingCardProps {
  listing: Listing;
  className?: string;
  showFullDetails?: boolean;
}

export default function ListingCard({
  listing,
  className = "",
  showFullDetails = false,
}: ListingCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { address } = useAccount();
  const isActive = listing.status === "Open" && listing.active;
  const canResolve =
    listing.status === "InProgress" && listing.creator === address;

  const getStatusColor = () => {
    switch (listing.status) {
      case "Open":
        return "bg-green-500";
      case "InProgress":
        return "bg-yellow-500";
      case "Resolved":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewDetails = () => {
    router.push(`/listing/${listing.id}`);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="mb-2 truncate">{listing.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${getStatusColor()}`} />
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
          <Identity address={listing.creator}>
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
              <Avatar className="h-6 w-6" />
              <Name className="text-sm" />
            </div>
          </Identity>

          <p className={`text-sm ${!showFullDetails && "line-clamp-3"}`}>
            {listing.description}
          </p>

          <Badge variant="outline">{listing.category}</Badge>

          {showFullDetails && listing.contactMethod && (
            <div className="text-sm text-muted-foreground">
              <strong>Contact:</strong> {listing.contactMethod}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            <span>
              Posted {formatDistanceToNow(Number(listing.timestamp) * 1000)} ago
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {isActive && showFullDetails && (
          <Transaction
            contracts={[
              {
                ...contractConfig.connect,
                functionName: "respondToListing",
                args: [BigInt(listing.id.toString())],
              },
            ]}
            onStatus={(status) => {
              if (status.statusName === "success") {
                toast({
                  title: "Response Sent",
                  description: "Successfully responded to listing.",
                });
                router.refresh();
              }
            }}
          >
            <TransactionButton text="Respond to Listing" className="w-full" />
            <TransactionToast>
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        )}

        {canResolve && showFullDetails && (
          <Transaction
            contracts={[
              {
                ...contractConfig.connect,
                functionName: "markResolved",
                args: [BigInt(listing.id.toString())],
              },
            ]}
            onStatus={(status) => {
              if (status.statusName === "success") {
                toast({
                  title: "Listing Resolved",
                  description: "The listing has been marked as resolved.",
                });
                router.refresh();
              }
            }}
          >
            <TransactionButton text="Mark as Resolved" className="w-full" />
            <TransactionToast>
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
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
    </Card>
  );
}
