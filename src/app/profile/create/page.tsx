"use client";

import ProfileForm from "@/components/ProfileForm";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useEffect, useState } from "react";

export default function CreateProfilePage() {
  const { address } = useAccount();
  const router = useRouter();
  const { profile, isLoading } = useProfile();
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);

  useEffect(() => {
    if (!isLoading && profile?.isActive) {
      router.replace("/");
    } else if (!isLoading) {
      setHasCheckedProfile(true);
    }
  }, [profile?.isActive, isLoading, router]);

  // Don't render anything until we've checked the profile
  if (isLoading || !hasCheckedProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
            Please connect your wallet to create a profile
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
      <ProfileForm />
    </div>
  );
}
