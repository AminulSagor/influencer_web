"use client";

import * as React from "react";
import { campaignSubmissionService } from "@/service/client/campaigns/campaign-submission.service";
import {
  CampaignAssignedInfluencer,
  InfluencerPromotionSubmissionListItem,
  SubmissionSummary,
} from "@/types/client/campaigns/campaign-submission.types";
import { buildInfluencerPromotionSubmissionItems } from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-mappers";

type Params = {
  campaignId?: string;
  campaignName?: string;
  milestoneId?: string;
  campaignType?: string;
  assignedInfluencers: CampaignAssignedInfluencer[];
  enabled?: boolean;
};

type Result = {
  items: SubmissionSummary[];
  prefetchedDetailsById: Record<
    string,
    InfluencerPromotionSubmissionListItem["detail"]
  >;
  isLoading: boolean;
  error: string | null;
};

export function useMilestoneSubmissions({
  campaignId,
  campaignName,
  milestoneId,
  campaignType,
  assignedInfluencers,
  enabled = true,
}: Params): Result {
  const [items, setItems] = React.useState<SubmissionSummary[]>([]);
  const [prefetchedDetailsById, setPrefetchedDetailsById] = React.useState<
    Record<string, InfluencerPromotionSubmissionListItem["detail"]>
  >({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!enabled || !campaignId || !milestoneId) {
      setItems([]);
      setPrefetchedDetailsById({});
      setIsLoading(false);
      setError(null);
      return;
    }

    const safeCampaignId = campaignId;
    const safeMilestoneId = milestoneId;

    if (campaignType === "influencer_promotion") {
      const localItems = buildInfluencerPromotionSubmissionItems({
        campaignId: safeCampaignId,
        campaignName: campaignName ?? "",
        milestoneId: safeMilestoneId,
        assignedInfluencers,
      });

      setItems(localItems.map((item) => item.summary));
      setPrefetchedDetailsById(
        localItems.reduce<
          Record<string, InfluencerPromotionSubmissionListItem["detail"]>
        >((acc, item) => {
          acc[item.summary.id] = item.detail;
          return acc;
        }, {}),
      );
      setIsLoading(false);
      setError(null);
      return;
    }

    let ignore = false;

    async function run() {
      try {
        setIsLoading(true);
        setError(null);

        const res =
          await campaignSubmissionService.getAgencyMilestoneSubmissionList(
            safeMilestoneId,
          );

        if (!ignore) {
          setItems(res.data ?? []);
          setPrefetchedDetailsById({});
        }
      } catch {
        if (!ignore) {
          setError("Failed to load submissions.");
          setItems([]);
          setPrefetchedDetailsById({});
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    run();

    return () => {
      ignore = true;
    };
  }, [
    campaignId,
    campaignName,
    milestoneId,
    campaignType,
    assignedInfluencers,
    enabled,
  ]);

  return { items, prefetchedDetailsById, isLoading, error };
}
