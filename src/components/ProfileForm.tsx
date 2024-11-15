import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction,
  type LifecycleStatus,
} from "@coinbase/onchainkit/transaction";
import { contractConfig } from "@/app/config/wagmi";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useToast } from "@/hooks/use-toast";

export default function ProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contactInfo: "",
    onSiteStatus: false,
    travelDetails: "",
    expertiseAreas: "",
    credentials: "",
    bio: "",
  });

  const [error, setError] = useState<string>();

  // Use useMemo for validation state instead of a callback
  const { isValid, validationError } = useMemo(() => {
    const expertiseArray = formData.expertiseAreas
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (!formData.contactInfo) {
      return { isValid: false, validationError: "Contact info is required" };
    }

    if (expertiseArray.length === 0) {
      return {
        isValid: false,
        validationError: "At least one area of expertise is required",
      };
    }

    if (formData.bio.length > 1000) {
      return {
        isValid: false,
        validationError: "Bio must be less than 1000 characters",
      };
    }

    return { isValid: true, validationError: undefined };
  }, [formData.contactInfo, formData.expertiseAreas, formData.bio]);

  // Update error state when validation changes
  useEffect(() => {
    setError(validationError);
  }, [validationError]);

  const handleTransactionStatus = useCallback(
    (status: LifecycleStatus) => {
      switch (status.statusName) {
        case "success":
          toast({
            title: "Profile Created",
            description: "Your profile has been created successfully.",
          });
          // Navigate without trying to catch errors since router.push() returns void
          router.push("/profile");
          break;
        case "error":
          toast({
            variant: "destructive",
            title: "Error",
            description:
              status.statusData.message || "Failed to create profile",
          });
          break;
      }
    },
    [router, toast]
  );

  // Memoize the contract arguments
  const contractArgs = useMemo(() => {
    return [
      formData.contactInfo,
      formData.onSiteStatus,
      formData.travelDetails,
      formData.expertiseAreas
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      formData.credentials,
      formData.bio,
    ] as const;
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
        <CardDescription>
          Set up your Vitalia Connect profile to start engaging with the
          community
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-2">
            <label htmlFor="contactInfo">Contact Information</label>
            <input
              id="contactInfo"
              name="contactInfo"
              className="w-full p-2 border rounded"
              placeholder="Enter your contact details"
              value={formData.contactInfo}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="onSiteStatus"
              type="checkbox"
              name="onSiteStatus"
              checked={formData.onSiteStatus}
              onChange={handleInputChange}
            />
            <label htmlFor="onSiteStatus">Available for on-site work</label>
          </div>

          <div className="grid gap-2">
            <label htmlFor="travelDetails">Travel Details</label>
            <input
              id="travelDetails"
              name="travelDetails"
              className="w-full p-2 border rounded"
              placeholder="Enter your travel preferences"
              value={formData.travelDetails}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="expertiseAreas">Areas of Expertise</label>
            <input
              id="expertiseAreas"
              name="expertiseAreas"
              className="w-full p-2 border rounded"
              placeholder="Enter expertise areas, separated by commas"
              value={formData.expertiseAreas}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="credentials">Credentials</label>
            <input
              id="credentials"
              name="credentials"
              className="w-full p-2 border rounded"
              placeholder="Enter your credentials"
              value={formData.credentials}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className="w-full p-2 border rounded min-h-[100px]"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Transaction
            contracts={[
              {
                ...contractConfig.profiles,
                functionName: "createProfile",
                args: contractArgs,
              },
            ]}
            onStatus={handleTransactionStatus}
          >
            <TransactionButton className="w-full" disabled={!isValid} />
            <TransactionToast>
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        </div>
      </CardContent>
    </Card>
  );
}
