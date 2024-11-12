"use client";

import { useRouter } from "next/navigation";
import { useCreateListing } from "@/hooks/useCreateListing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function CreatePage() {
  const router = useRouter();
  const { createListing, isLoading } = useCreateListing();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Biohacking",
    isProject: true,
    expertiseType: "SEEKING" as const,
    expertise: "",
    contactMethod: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createListing(formData);
      router.push("/");
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* Add form fields for other listing properties */}

            <div className="pt-4 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Listing"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
