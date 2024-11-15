"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { contractConfig } from "@/app/config/wagmi";
import { useReadContract } from "wagmi";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/cards/ListingCard";
import ProfileCard from "@/components/cards/ProfileCard";
import ListingActivity from "@/components/ListingActivity";
import { Listing } from "@/app/config/contracts";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction,
} from "@coinbase/onchainkit/transaction";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ListingDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing>();

  const { data: listingData, isLoading } = useReadContract({
    address: contractConfig.connect.address,
    abi: contractConfig.connect.abi,
    functionName: "getListing",
    args: [BigInt(params.id)],
  });

  useEffect(() => {
    if (listingData) {
      setListing(listingData as unknown as Listing);
    }
  }, [listingData]);

  if (isLoading || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ListingCard listing={listing} showFullDetails />

          {listing.status === "Open" && (
            <Transaction
              contracts={[
                {
                  ...contractConfig.connect,
                  functionName: "respondToListing",
                  args: [BigInt(params.id)],
                },
              ]}
              onStatus={(status) => {
                if (status.statusName === "success") {
                  toast({
                    title: "Response Sent",
                    description:
                      "You have successfully responded to this listing.",
                  });
                  router.refresh();
                }
              }}
            >
              <TransactionButton
                text=" Respond to Listing"
                className="w-full"
              ></TransactionButton>
              <TransactionToast>
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
          )}
        </div>

        <div className="space-y-8">
          <ListingActivity listing={listing} />

          <Separator className="my-8" />

          <div className="space-y-8">
            <h3 className="text-lg font-medium">Created By</h3>
            <ProfileCard address={listing.creator} />

            {listing.responder !==
              "0x0000000000000000000000000000000000000000" && (
              <>
                <h3 className="text-lg font-medium">Responded By</h3>
                <ProfileCard address={listing.responder} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
