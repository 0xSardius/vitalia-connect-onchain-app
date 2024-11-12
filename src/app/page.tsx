"use client";

import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileCard from "@/components/cards/ProfileCard";
import ListingsGrid from "@/components/cards/ListingsGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { address } = useAccount();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vitalia Connect</h1>
          <div className="flex items-center gap-4">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-8 w-8" />
                <Name />
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="listings" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {address && (
              <Button onClick={() => router.push("/create")}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            )}
          </div>

          {address ? (
            <>
              <TabsContent value="listings">
                <ListingsGrid />
              </TabsContent>

              <TabsContent value="profile">
                <div className="max-w-2xl mx-auto">
                  <ProfileCard
                    address={address}
                    onEdit={() => router.push("/profile/edit")}
                  />
                </div>
              </TabsContent>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">
                Welcome to Vitalia Connect
              </h2>
              <p className="text-muted-foreground mb-8">
                Please connect your wallet to access the platform.
              </p>
            </div>
          )}
        </Tabs>
      </main>
    </div>
  );
}
