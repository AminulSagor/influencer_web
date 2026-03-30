"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getAgencyCampaignProgress,
  getInfluencerCampaignProgress,
} from "@/service/client/campaigns/campaign-progress";

type UseCampaignOverallProgressParams = {
  campaignId?: string;
  campaignType?: string;
  influencerIds?: string[];
};

type UseCampaignOverallProgressReturn = {
  progressPercentage: number | null;
  isLoading: boolean;
  error: string | null;
};

export function useCampaignOverallProgress({
  campaignId,
  campaignType,
  influencerIds = [],
}: UseCampaignOverallProgressParams): UseCampaignOverallProgressReturn {
  const [progressPercentage, setProgressPercentage] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedInfluencerIds = useMemo(
    () => Array.from(new Set(influencerIds.filter(Boolean))),
    [influencerIds],
  );

  useEffect(() => {
    let ignore = false;

    async function loadProgress() {
      if (!campaignId) {
        setProgressPercentage(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (campaignType === "influencer_promotion") {
          if (!normalizedInfluencerIds.length) {
            if (!ignore) {
              setProgressPercentage(0);
            }
            return;
          }

          const responses = await Promise.all(
            normalizedInfluencerIds.map((influencerId) =>
              getInfluencerCampaignProgress(campaignId, influencerId),
            ),
          );

          const percentages = responses
            .map((response) => Number(response.data?.progressPercentage ?? 0))
            .filter((value) => !Number.isNaN(value));

          const overallProgress = percentages.length
            ? Math.min(...percentages)
            : 0;

          if (!ignore) {
            setProgressPercentage(overallProgress);
          }

          return;
        }

        const response = await getAgencyCampaignProgress(campaignId);

        if (!ignore) {
          setProgressPercentage(Number(response.data?.progressPercentage ?? 0));
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Failed to load progress",
          );
          setProgressPercentage(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadProgress();

    return () => {
      ignore = true;
    };
  }, [campaignId, campaignType, normalizedInfluencerIds]);

  return {
    progressPercentage,
    isLoading,
    error,
  };
}
