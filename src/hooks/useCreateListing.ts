import { useWriteContract, useTransaction } from "wagmi";
import { contractConfig } from "../app/config/wagmi";

export interface CreateListingParams {
  title: string;
  description: string;
  category: string;
  isProject: boolean;
  expertiseType: "SEEKING" | "OFFERING";
  expertise: string;
  contactMethod: string;
}

export function useCreateListing() {
  const {
    writeContract: createListing,
    data: tx,
    isPending: isWriteLoading,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isTxLoading,
    isSuccess,
    error: txError,
  } = useTransaction({
    hash: tx,
  });

  const handleCreate = async (params: CreateListingParams) => {
    const args = [
      params.title,
      params.description,
      params.category,
      params.isProject,
      params.expertiseType === "SEEKING" ? 0 : 1,
      params.expertise,
      params.contactMethod,
    ] as const;

    // Pass the config when calling writeContract
    createListing({
      address: contractConfig.connect.address,
      abi: contractConfig.connect.abi,
      functionName: "createListing",
      args,
    });
  };

  return {
    createListing: handleCreate,
    isLoading: isWriteLoading || isTxLoading,
    isSuccess,
    error: writeError || txError,
  };
}
