"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import SubmissionAttachmentsGrid from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-attachments-grid";
import SubmissionDescriptionBlock from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-description-block";
import SubmissionPerformanceMetrics from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-performance-metrics";
import SubmissionPerformanceRing from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-performance-ring";
import SubmissionReportActions from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-report-actions";
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
import { reviewSubmission } from "@/service/client/campaigns/campaign-submission.service";
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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const syncMilestonePerformance = useMilestoneStatusStore(
    (state) => state.syncMilestonePerformance,
  );
  const removeMilestoneOverride = useMilestoneStatusStore(
    (state) => state.removeMilestoneOverride,
  );

  const metrics = buildSubmissionMetrics(
    detail,
    milestone,
    campaign.campaignType,
  );

  const averagePerformance = getAveragePerformance(metrics);
  const hasTargetMetrics = metrics.some((item) => item.target > 0);

  React.useEffect(() => {
    if (!milestone.id) return;

    syncMilestonePerformance({
      milestoneId: milestone.id,
      averagePerformance,
      hasTargetMetrics,
    });
  }, [
    milestone.id,
    averagePerformance,
    hasTargetMetrics,
    syncMilestonePerformance,
  ]);

  const handleApprove = async (submissionId: string) => {
    try {
      setIsSubmitting(true);

      await reviewSubmission(submissionId, {
        action: "approve",
      });

      syncMilestonePerformance({
        milestoneId: milestone.id,
        averagePerformance,
        hasTargetMetrics,
      });

      router.refresh();
    } catch (error) {
      console.error("Approve submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async (submissionId: string, reason: string) => {
    try {
      setIsSubmitting(true);

      await reviewSubmission(submissionId, {
        action: "decline",
        reason,
      });

      removeMilestoneOverride(milestone.id);

      router.refresh();
    } catch (error) {
      console.error("Decline submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 rounded-[18px] p-4">
      <SubmissionDescriptionBlock description={detail.submissionDescription} />

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

        {detail.status === "declined" && detail.rejectionReason ? (
          <div className="mt-6">
            <SubmissionDeclineReason reason={detail.rejectionReason} />
          </div>
        ) : null}
      </div>

      <SubmissionReportActions
        submissionId={submission.id}
        status={detail.status}
        onApprove={handleApprove}
        onDecline={handleDecline}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}