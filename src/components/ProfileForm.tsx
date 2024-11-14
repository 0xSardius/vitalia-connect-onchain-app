import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Label } from "@/components/ui/label";
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

  const handleTransactionStatus = (status: LifecycleStatus) => {
    switch (status.statusName) {
      case "success":
        toast({
          title: "Profile Created",
          description: "Your profile has been created successfully.",
        });
        setTimeout(() => router.push("/profile"), 1500);
        break;
      case "error":
        toast({
          variant: "destructive",
          title: "Error",
          description: status.statusData.message || "Failed to create profile",
        });
        break;
    }
  };

  // Validate form data before allowing transaction
  const isFormValid = () => {
    const expertiseArray = formData.expertiseAreas
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (!formData.contactInfo) {
      setError("Contact info is required");
      return false;
    }

    if (expertiseArray.length === 0) {
      setError("At least one area of expertise is required");
      return false;
    }

    if (formData.bio.length > 1000) {
      setError("Bio must be less than 1000 characters");
      return false;
    }

    setError(undefined);
    return true;
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="contactInfo">Contact Info</Label>
              <Input
                id="contactInfo"
                placeholder="telegram:@username or email"
                value={formData.contactInfo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactInfo: e.target.value,
                  }))
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                How should others contact you? (e.g., Telegram username)
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>On-site Status</Label>
                <p className="text-sm text-muted-foreground">
                  Are you currently in Vitalia?
                </p>
              </div>
              <Switch
                checked={formData.onSiteStatus}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, onSiteStatus: checked }))
                }
              />
            </div>

            <div>
              <Label htmlFor="travelDetails">Travel Details</Label>
              <Input
                id="travelDetails"
                placeholder="E.g., Arriving March 1st / Currently here"
                value={formData.travelDetails}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    travelDetails: e.target.value,
                  }))
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                Share your travel plans or current status
              </p>
            </div>

            <div>
              <Label htmlFor="expertiseAreas">Areas of Expertise</Label>
              <Input
                id="expertiseAreas"
                placeholder="Biohacking, Longevity Research, Community Building"
                value={formData.expertiseAreas}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expertiseAreas: e.target.value,
                  }))
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your areas of expertise, separated by commas
              </p>
            </div>

            <div>
              <Label htmlFor="credentials">Credentials</Label>
              <Input
                id="credentials"
                placeholder="E.g., PhD in Biology, Certified Health Coach"
                value={formData.credentials}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    credentials: e.target.value,
                  }))
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                List relevant qualifications or certifications
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="h-32"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
              />
              <p className="text-sm text-muted-foreground mt-1">
                Brief introduction and background ({formData.bio.length}/1000)
              </p>
            </div>
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
                args: [
                  formData.contactInfo,
                  formData.onSiteStatus,
                  formData.travelDetails,
                  formData.expertiseAreas
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s),
                  formData.credentials,
                  formData.bio,
                ],
              },
            ]}
            onStatus={handleTransactionStatus}
          >
            <TransactionButton className="w-full" disabled={!isFormValid()} />
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
