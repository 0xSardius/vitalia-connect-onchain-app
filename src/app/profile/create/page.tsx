"use client";

import ProfileForm from "@/components/ProfileForm";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useEffect, useRef } from "react";

export default function CreateProfilePage() {
  const { address } = useAccount();
  const router = useRouter();
  const { profile, isLoading } = useProfile();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && profile?.isActive && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/");
    }
  }, [profile?.isActive, isLoading, router]);

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

  // Don't render the form if we have an active profile
  if (profile?.isActive) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
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
