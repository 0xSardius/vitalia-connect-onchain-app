import { Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Listing } from "@/app/config/contracts";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircledIcon,
  ClockIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";

interface ListingActivityProps {
  listing: Listing;
  className?: string;
}

export default function ListingActivity({
  listing,
  className = "",
}: ListingActivityProps) {
  const timelineEvents = [
    {
      type: "created",
      timestamp: Number(listing.timestamp),
      address: listing.creator,
      icon: ClockIcon,
      label: "Created listing",
    },
    ...(listing.responder !== "0x0000000000000000000000000000000000000000"
      ? [
          {
            type: "responded",
            timestamp: Number(listing.timestamp) + 100, // We should store this in the contract
            address: listing.responder,
            icon: ChatBubbleIcon,
            label: "Responded to listing",
          },
        ]
      : []),
    ...(listing.status === "Resolved"
      ? [
          {
            type: "resolved",
            timestamp: Number(listing.timestamp) + 200, // We should store this in the contract
            address: listing.creator,
            icon: CheckCircledIcon,
            label: "Marked as resolved",
          },
        ]
      : []),
  ].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Listing Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge
              variant={listing.status === "Resolved" ? "default" : "secondary"}
              className="rounded-full"
            >
              {listing.status}
            </Badge>
            {listing.responder !==
              "0x0000000000000000000000000000000000000000" && (
              <Badge variant="outline" className="rounded-full">
                Has Responder
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="mt-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    <event.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <Identity address={event.address}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5" />
                      <Name className="font-medium" />
                      <span className="text-sm text-muted-foreground">
                        {event.label}
                      </span>
                    </div>
                  </Identity>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(event.timestamp * 1000)} ago
                  </p>
                </div>
              </div>
            ))}
          </div>

          {listing.status === "Open" && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="text-muted-foreground">
                This listing is open for responses. Be the first to respond!
              </p>
            </div>
          )}

          {listing.status === "InProgress" && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="text-muted-foreground">
                This listing is currently being worked on. The creator can mark
                it as resolved when complete.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
