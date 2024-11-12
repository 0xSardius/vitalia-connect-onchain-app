// hooks/useProfile.ts
import { useAccount, useReadContract } from "wagmi";
import { contractConfig } from "../app/config/wagmi";
import { UserProfile } from "../app/config/contracts";

export function useProfile(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const {
    data: profile,
    isError,
    isLoading,
    refetch,
  } = useReadContract({
    ...contractConfig.profiles,
    functionName: "getProfile",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });

  const { data: stats, isLoading: isLoadingStats } = useReadContract({
    ...contractConfig.profiles,
    functionName: "getUserStats",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });

  // Transform the raw contract data into a more usable format
  const formattedProfile: UserProfile | undefined = profile
    ? {
        isActive: profile[0],
        contactInfo: profile[1],
        onSiteStatus: profile[2],
        travelDetails: profile[3],
        lastStatusUpdate: profile[4],
        expertiseAreas: Array.from(profile[5]), // Create a new mutable array
        credentials: profile[6],
        bio: profile[7],
      }
    : undefined;

  const formattedStats = stats
    ? {
        completed: Number(stats[0]),
        created: Number(stats[1]),
        responses: Number(stats[2]),
        lastActive: Number(stats[3]),
      }
    : undefined;

  return {
    profile: formattedProfile,
    stats: formattedStats,
    isError,
    isLoading: isLoading || isLoadingStats,
    refetch,
  };
}
