"use client";

import * as React from "react";
import SubmissionAttachmentsGrid from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-attachments-grid";
import SubmissionDescriptionBlock from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-description-block";
import SubmissionPerformanceMetrics from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-performance-metrics";
import SubmissionPerformanceRing from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-performance-ring";
import {
  buildSubmissionMetrics,
  getAveragePerformance,
} from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-ui.helpers";
import SubmissionDeclineReason from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-decline-reason";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import {
  SubmissionDetail,
  SubmissionSummary,
} from "@/types/client/campaigns/campaign-submission.types";
import { useMilestoneStatusStore } from "@/store/use-milestone-status-store";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
  submission: SubmissionSummary;
  detail: SubmissionDetail;
};

export default function InfluencerSubmissionDetailsPanel({
  campaign,
  milestone,
  submission,
  detail,
}: Props) {
  const syncMilestonePerformance = useMilestoneStatusStore(
    (state) => state.syncMilestonePerformance,
  );

  const metrics = buildSubmissionMetrics(
    detail,
    milestone,
    campaign.campaignType,
  );

  const averagePerformance = getAveragePerformance(metrics);
  const hasTargetMetrics = metrics.some((item) => item.target > 0);

  const normalizedSubmissionStatus = String(
    submission.status ?? detail.status ?? "",
  )
    .trim()
    .toLowerCase();
  const declineReason =
    submission.rejectionReason?.trim() || detail.rejectionReason?.trim() || "";
  const showDeclineReason =
    ["declined", "decline", "rejected"].includes(normalizedSubmissionStatus) &&
    Boolean(declineReason);

  React.useEffect(() => {
    if (!milestone.id) return;

    syncMilestonePerformance({
      milestoneId: milestone.id,
      averagePerformance,
      hasTargetMetrics,
      fallbackStatus: milestone.status,
    });
  }, [
    milestone.id,
    milestone.status,
    averagePerformance,
    hasTargetMetrics,
    syncMilestonePerformance,
  ]);

  return (
    <div className="space-y-4 rounded-[18px] p-4">
      <div
        className={`grid grid-cols-1 gap-4 ${
          showDeclineReason ? "xl:grid-cols-2" : ""
        }`}
      >
        <SubmissionDescriptionBlock description={detail.submissionDescription} />
        {showDeclineReason ? (
          <SubmissionDeclineReason reason={declineReason} />
        ) : null}
      </div>

      <div className="rounded-[14px] border border-[#D9D9D9] p-4 md:p-5">
        <SubmissionAttachmentsGrid
          links={detail.submissionLiveLinks}
          attachments={detail.submissionAttachments}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-center">
          <SubmissionPerformanceMetrics metrics={metrics} />

          <div className="flex items-center justify-center xl:justify-end">
            <SubmissionPerformanceRing value={averagePerformance} />
          </div>
        </div>
      </div>
    </div>
  );
}
