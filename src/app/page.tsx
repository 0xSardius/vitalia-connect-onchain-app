"use client";

import { useAccount } from "wagmi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WalletConnect from "@/components/WalletConnect";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { address } = useAccount();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vitalia Connect</h1>
          <WalletConnect />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {address ? (
          <Tabs defaultValue="listings" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <Button onClick={() => router.push("/create")}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </div>

            <TabsContent value="listings">
              <div className="text-center py-8 text-muted-foreground">
                Listings coming soon...
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <div className="text-center py-8 text-muted-foreground">
                Profile coming soon...
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center max-w-lg space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome to Vitalia Connect
              </h2>
              <p className="text-muted-foreground">
                Connect your wallet to access the platform and start engaging
                with the Vitalia community.
              </p>
            </div>

            <div className="flex items-center justify-center p-8">
              <WalletConnect />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
              <FeatureCard
                title="Create Listings"
                description="Share your projects and opportunities with the community"
              />
              <FeatureCard
                title="Connect with Experts"
                description="Find and collaborate with skilled professionals"
              />
              <FeatureCard
                title="Build Your Profile"
                description="Showcase your expertise and experience"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
