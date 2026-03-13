"use client";

import * as React from "react";
import { campaignSubmissionService } from "@/service/client/campaigns/campaign-submission.service";
import { SubmissionDetail } from "@/types/client/campaigns/campaign-submission.types";
import { mapClientSubmissionDetailToSubmissionDetail } from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-mappers";

type Params = {
  submissionId: string;
  enabled: boolean;
  campaignType: string;
  prefetchedDetail?: SubmissionDetail | null;
};

export function useSubmissionDetails({
  submissionId,
  enabled,
  campaignType,
  prefetchedDetail,
}: Params) {
  const [item, setItem] = React.useState<SubmissionDetail | null>(
    prefetchedDetail ?? null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setItem(prefetchedDetail ?? null);
    setError(null);
    setIsLoading(false);
  }, [prefetchedDetail, submissionId]);

  React.useEffect(() => {
    if (!submissionId || !enabled) return;

    if (campaignType === "influencer_promotion") {
      return;
    }

    let ignore = false;

    async function run() {
      try {
        setIsLoading(true);
        setError(null);

        const res =
          await campaignSubmissionService.getClientSubmissionDetails(
            submissionId,
          );

        if (!ignore) {
          setItem(mapClientSubmissionDetailToSubmissionDetail(res.data));
        }
      } catch {
        if (!ignore) {
          setError("Failed to load submission details.");
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
  }, [submissionId, enabled, campaignType]);

  return { item, isLoading, error };
}
