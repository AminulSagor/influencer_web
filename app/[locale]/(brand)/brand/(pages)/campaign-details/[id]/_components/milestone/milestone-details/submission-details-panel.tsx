"use client";

import SubmissionAttachmentsGrid from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-attachments-grid";
import SubmissionBonusCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-bonus-card";
import SubmissionDescriptionBlock from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-description-block";
import SubmissionPerformanceMetrics from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-performance-metrics";
import SubmissionPerformanceRing from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-performance-ring";
import SubmissionReportActions from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-report-actions";
import {
  buildSubmissionMetrics,
  getAveragePerformance,
  getSubmissionStatusClasses,
  shouldShowBonus,
} from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-ui.helpers";
import SubmissionDeclineReason from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-decline-reason";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import {
  SubmissionDetail,
  SubmissionSummary,
} from "@/types/client/campaigns/campaign-submission.types";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
  submission: SubmissionSummary;
  detail: SubmissionDetail;
};

export default function SubmissionDetailsPanel({
  campaign,
  milestone,
  submission,
  detail,
}: Props) {
  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  const statusClasses = getSubmissionStatusClasses(detail.status);

  const metrics = buildSubmissionMetrics(
    detail,
    milestone,
    campaign.campaignType,
  );

  const averagePerformance = getAveragePerformance(metrics);
  const showBonus = shouldShowBonus(averagePerformance, detail.status, metrics);

  return (
    <div
      className={`space-y-4 rounded-[18px] border p-4 ${statusClasses.panel}`}
    >
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
      />

      {showBonus ? (
        <SubmissionBonusCard
          influencerName={
            isInfluencerPromotion ? submission.influencerName : undefined
          }
        />
      ) : null}
    </div>
  );
}
