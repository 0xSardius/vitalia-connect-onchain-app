"use client";

import CreateListingForm from "@/components/CreateListingForm";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";

export default function CreateListingPage() {
  const { address } = useAccount();
  const router = useRouter();
  const { profile, isLoading } = useProfile();

  // Show loading state while checking profile
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  // Redirect if no profile
  if (!profile?.isActive) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold">Profile Required</h1>
          <p className="text-muted-foreground">
            You need to create a profile before creating listings
          </p>
          <Button onClick={() => router.push("/profile/create")}>
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  // Show connect wallet if not connected
  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold">Connect Wallet</h1>
          <p className="text-muted-foreground">
            Please connect your wallet to create a listing
          </p>
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
          </Wallet>
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
      <CreateListingForm />
    </div>
  );
}
