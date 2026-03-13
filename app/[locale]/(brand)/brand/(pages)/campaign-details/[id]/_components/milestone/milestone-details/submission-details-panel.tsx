"use client";

import SubmissionAttachmentsGrid from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-attachments-grid";
import SubmissionBonusCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-bonus-card";
import SubmissionDescriptionBlock from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-description-block";
import SubmissionPerformanceMetrics from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-performance-metrics";
import SubmissionPerformanceRing from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-performance-ring";
import SubmissionReportActions from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-report-actions";
import {
  buildSubmissionMetrics,
  formatSubmissionStatusLabel,
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

  const statusLabel = formatSubmissionStatusLabel(detail.status);
  const statusClasses = getSubmissionStatusClasses(detail.status);

  const metrics = buildSubmissionMetrics(
    detail,
    milestone,
    campaign.campaignType,
  );

  const averagePerformance = getAveragePerformance(metrics);
  const showBonus = shouldShowBonus(averagePerformance, detail.status);

  return (
    <div
      className={`space-y-4 rounded-[18px] border p-4 ${statusClasses.panel}`}
    >
      <SubmissionDescriptionBlock
        description={detail.submissionDescription}
        statusLabel={statusLabel}
      />

      <div className="rounded-[14px] border border-[#D9D9D9] p-4 md:p-5">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-8">
            <SubmissionAttachmentsGrid
              links={detail.submissionLiveLinks}
              attachments={detail.submissionAttachments}
            />

            <SubmissionPerformanceMetrics metrics={metrics} />
          </div>

          <div className="flex items-center justify-center xl:items-start xl:justify-end">
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
