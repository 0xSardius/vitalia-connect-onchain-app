import { useState, useMemo, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

// Default categories from the smart contract
const CATEGORIES = [
  "Biohacking",
  "Longevity Research",
  "Biotech",
  "Community Building",
  "Governance",
  "Technology",
];

export default function CreateListingForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    isProject: true, // true = project, false = opportunity
    expertiseType: "SEEKING", // SEEKING or OFFERING
    expertise: "",
    contactMethod: "",
  });

  const [error, setError] = useState<string>();

  const handleTransactionStatus = (status: LifecycleStatus) => {
    switch (status.statusName) {
      case "success":
        toast({
          title: "Listing Created",
          description: "Your listing has been created successfully.",
        });
        setTimeout(() => router.push("/listings"), 1500);
        break;
      case "error":
        toast({
          variant: "destructive",
          title: "Error",
          description: status.statusData.message || "Failed to create listing",
        });
        break;
    }
  };

  const { isValid, errorMessage } = useMemo(() => {
    if (!formData.title) {
      return { isValid: false, errorMessage: "Title is required" };
    }
    if (!formData.description) {
      return { isValid: false, errorMessage: "Description is required" };
    }
    if (!formData.category) {
      return { isValid: false, errorMessage: "Category is required" };
    }
    if (!formData.expertise) {
      return { isValid: false, errorMessage: "Expertise is required" };
    }
    if (!formData.contactMethod) {
      return { isValid: false, errorMessage: "Contact method is required" };
    }

    return { isValid: true, errorMessage: undefined };
  }, [formData]);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Listing</CardTitle>
        <CardDescription>
          Share your project or opportunity with the Vitalia community
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a clear, descriptive title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project or opportunity..."
                className="h-32"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label>Type</Label>
              <RadioGroup
                value={formData.isProject ? "project" : "opportunity"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    isProject: value === "project",
                  }))
                }
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="project" />
                  <Label htmlFor="project">Project</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="opportunity" id="opportunity" />
                  <Label htmlFor="opportunity">Opportunity</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Expertise Type</Label>
              <RadioGroup
                value={formData.expertiseType}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    expertiseType: value as "SEEKING" | "OFFERING",
                  }))
                }
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SEEKING" id="seeking" />
                  <Label htmlFor="seeking">Seeking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OFFERING" id="offering" />
                  <Label htmlFor="offering">Offering</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expertise">Expertise Required/Offered</Label>
              <Input
                id="expertise"
                placeholder="E.g., Peptide Synthesis, Community Management"
                value={formData.expertise}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expertise: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="contactMethod">Contact Method</Label>
              <Input
                id="contactMethod"
                placeholder="How should people contact you? (e.g., telegram:@username)"
                value={formData.contactMethod}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactMethod: e.target.value,
                  }))
                }
              />
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
                ...contractConfig.connect,
                functionName: "createListing",
                args: [
                  formData.title,
                  formData.description,
                  formData.category,
                  formData.isProject,
                  formData.expertiseType === "SEEKING" ? 0 : 1,
                  formData.expertise,
                  formData.contactMethod,
                ],
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
