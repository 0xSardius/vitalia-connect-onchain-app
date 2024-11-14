import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export function CreateListingButton() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, isLoading } = useProfile();

  const handleClick = () => {
    if (isLoading) return;

    if (!profile?.isActive) {
      toast({
        title: "Profile Required",
        description: "Please create a profile before creating a listing.",
        variant: "destructive",
      });
      router.push("/profile");
      return;
    }

    router.push("/create-listing");
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      <PlusIcon className="mr-2 h-4 w-4" />
      Create Listing
    </Button>
  );
}
