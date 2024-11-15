import { useAccount, useReadContract } from "wagmi";
import { VitaliaProfile, VitaliaStats, UseProfileReturn } from "@/app/config";
import { contractConfig } from "@/app/config/wagmi";
import { useCallback } from "react";

export function useProfile(address?: `0x${string}`): UseProfileReturn {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const {
    data: rawProfile,
    isError: isProfileError,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useReadContract({
    ...contractConfig.profiles,
    functionName: "getProfile",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 30_000, // Data considered fresh for 30 seconds
      gcTime: 5 * 60 * 1000, // Cache for 5 minutes (formerly cacheTime)
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  });

  const {
    data: rawStats,
    isError: isStatsError,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useReadContract({
    ...contractConfig.profiles,
    functionName: "getUserStats",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  });

  // Type guard for profile data
  const isValidProfileData = (
    data: unknown
  ): data is [
    boolean,
    string,
    boolean,
    string,
    bigint,
    string[],
    string,
    string
  ] => {
    if (!Array.isArray(data)) return false;
    if (data.length !== 8) return false;

    const [
      isActive,
      contactInfo,
      onSiteStatus,
      travelDetails,
      lastStatusUpdate,
      expertiseAreas,
      credentials,
      bio,
    ] = data;

    return (
      typeof isActive === "boolean" &&
      typeof contactInfo === "string" &&
      typeof onSiteStatus === "boolean" &&
      typeof travelDetails === "string" &&
      typeof lastStatusUpdate === "bigint" &&
      Array.isArray(expertiseAreas) &&
      typeof credentials === "string" &&
      typeof bio === "string"
    );
  };

  // Type guard for stats data
  const isValidStatsData = (
    data: unknown
  ): data is [bigint, bigint, bigint, bigint] => {
    if (!Array.isArray(data)) return false;
    if (data.length !== 4) return false;
    return data.every(
      (item) => typeof item === "bigint" || typeof item === "number"
    );
  };

  const formatProfile = useCallback(
    (data: unknown): VitaliaProfile | undefined => {
      if (!isValidProfileData(data)) {
        return undefined;
      }

      try {
        const [
          isActive,
          contactInfo,
          onSiteStatus,
          travelDetails,
          lastStatusUpdate,
          expertiseAreas,
          credentials,
          bio,
        ] = data;

        return {
          isActive,
          contactInfo,
          onSiteStatus,
          travelDetails,
          lastStatusUpdate,
          expertiseAreas: [...expertiseAreas],
          credentials,
          bio,
        };
      } catch {
        return undefined;
      }
    },
    []
  );

  const formatStats = useCallback((data: unknown): VitaliaStats | undefined => {
    if (!isValidStatsData(data)) {
      return undefined;
    }

    try {
      const [completed, created, responses, lastActive] = data;
      return {
        completed:
          typeof completed === "number" ? BigInt(completed) : completed,
        created: typeof created === "number" ? BigInt(created) : created,
        responses:
          typeof responses === "number" ? BigInt(responses) : responses,
        lastActive:
          typeof lastActive === "number" ? BigInt(lastActive) : lastActive,
      };
    } catch {
      return undefined;
    }
  }, []);

  const formattedProfile = rawProfile ? formatProfile(rawProfile) : undefined;
  const formattedStats = rawStats ? formatStats(rawStats) : undefined;

  const refetch = useCallback(async () => {
    try {
      await Promise.all([refetchProfile(), refetchStats()]);
    } catch (error) {
      console.error("Error refetching profile data:", error);
      throw error;
    }
  }, [refetchProfile, refetchStats]);

  return {
    profile: formattedProfile,
    stats: formattedStats,
    isError: isProfileError || isStatsError,
    isLoading: isProfileLoading || isStatsLoading,
    refetch,
  };
}
