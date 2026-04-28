"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import MilestoneSubmissionsSection from "./submissions/milestone-submissions-section";
import InfluencerPromotionMilestoneContent from "./influencer-promotion-milestone-content";
import PaidAdMilestoneContent from "./paid-ad-milestone-content";
import MilestoneBonusCard from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/bonus/milestone-bonus-card";
import SubmissionReportActions from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/submission-report-actions";
import { useMilestoneStatusStore } from "@/store/use-milestone-status-store";
import { reviewSubmission } from "@/service/client/campaigns/campaign-submission.service";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
  milestoneIndex: number;
  submissionId?: string | null;
  bonusMilestoneId?: string;
};

function getBackendResolvedMilestoneStatus(milestone: CampaignMilestone) {
  const normalizedStatus = String(milestone.status ?? "")
    .trim()
    .toLowerCase();
  const completedStatuses = [
    "accepted",
    "approved",
    "completed",
    "completed_plus_plus",
  ];

  if (
    milestone.isMetrixOverflowed &&
    completedStatuses.includes(normalizedStatus)
  ) {
    return "completed_plus_plus";
  }

  if (normalizedStatus === "completed_plus_plus") {
    return "completed";
  }

  if (normalizedStatus === "accepted" || normalizedStatus === "approved") {
    return "completed";
  }

  return normalizedStatus;
}

export default function MilestoneDetailsCard({
  campaign,
  milestone,
  milestoneIndex,
  submissionId,
  bonusMilestoneId,
}: Props) {
  const router = useRouter();
  const t = useTranslations("brand.CampaignDetailsPage");

  const [selectedSubmissionIds, setSelectedSubmissionIds] = React.useState<
    string[]
  >([]);
  const [primarySubmissionId, setPrimarySubmissionId] = React.useState<
    string | null
  >(submissionId ?? null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isInfluencerPromotion =
    String(campaign.campaignType ?? "").toLowerCase() ===
    "influencer_promotion";

  const safeTitle =
    milestone.contentTitle?.trim() || `${t("milestone")} ${milestoneIndex + 1}`;

  const removeMilestoneOverride = useMilestoneStatusStore(
    (state) => state.removeMilestoneOverride,
  );

  const resolvedMilestoneStatus = getBackendResolvedMilestoneStatus(milestone);
  const shouldShowBonusCard = Boolean(milestone.isMetrixOverflowed);

  React.useEffect(() => {
    setSelectedSubmissionIds([]);
    setPrimarySubmissionId(submissionId ?? null);
  }, [milestone.id, submissionId]);

  const reviewableSubmissionIds = isInfluencerPromotion
    ? primarySubmissionId
      ? [primarySubmissionId]
      : []
    : selectedSubmissionIds;

  const reviewAnchorSubmissionId =
    reviewableSubmissionIds[0] ?? primarySubmissionId ?? null;

  const handleApprove = async (submissionIds: string[]) => {
    const anchorSubmissionId = submissionIds[0] ?? primarySubmissionId;

    if (!anchorSubmissionId) return;

    try {
      setIsSubmitting(true);

      await reviewSubmission(anchorSubmissionId, {
        action: "approve",
        campaignType: String(campaign.campaignType ?? ""),
        milestoneId: milestone.id, // Pass milestoneId for paid_ad
        ...(isInfluencerPromotion ? {} : { submissionIds }),
      });

      router.refresh();
    } catch (error) {
      console.error("Approve submission failed:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async (submissionIds: string[], reason: string) => {
    const anchorSubmissionId = submissionIds[0] ?? primarySubmissionId;

    if (!anchorSubmissionId) return;

    try {
      setIsSubmitting(true);

      await reviewSubmission(anchorSubmissionId, {
        action: "decline",
        reason,
        campaignType: String(campaign.campaignType ?? ""),
        milestoneId: milestone.id, // Pass milestoneId for paid_ad
        ...(isInfluencerPromotion ? {} : { submissionIds }),
      });

      removeMilestoneOverride(milestone.id);
      router.refresh();
    } catch (error) {
      console.error("Decline submission failed:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowActionButtons = React.useMemo(() => {
    const allowedStatuses = ["in_review", "in_progress"];
    return (
      allowedStatuses.includes(resolvedMilestoneStatus) &&
      reviewAnchorSubmissionId
    );
  }, [resolvedMilestoneStatus, reviewAnchorSubmissionId]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="milestone-details"
    >
      <AccordionItem value="milestone-details" className="border-none">
        <div className="rounded-2xl border border-[#CFCFCF] bg-[#FBFBFB] px-4 py-4 sm:px-6 sm:py-5">
          <AccordionTrigger className="px-0 py-0 hover:no-underline">
            <div className="flex items-start gap-3 text-left">
              <Image
                src="/icons/milestone.svg"
                alt="Milestone"
                width={30}
                height={30}
                className="mt-1 h-[26px] w-[26px] shrink-0 sm:h-[30px] sm:w-[30px]"
              />

              <div>
                <p className="text-sm font-medium leading-none text-[#47662D]">
                  {t("milestone")} {milestoneIndex + 1}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-none text-[#2E5B1F]">
                  {safeTitle}
                </h3>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-0 pt-5">
            {isInfluencerPromotion ? (
              <InfluencerPromotionMilestoneContent
                milestone={milestone}
                submissionId={submissionId}
              />
            ) : (
              <PaidAdMilestoneContent milestone={milestone} />
            )}

            <div className="mt-5">
              <MilestoneSubmissionsSection
                campaign={campaign}
                milestone={milestone}
                selectedSubmissionIds={selectedSubmissionIds}
                onSelectedSubmissionIdsChange={setSelectedSubmissionIds}
                onPrimarySubmissionIdChange={setPrimarySubmissionId}
                submissionId={submissionId}
              />
            </div>
          </AccordionContent>

          {shouldShowActionButtons ? (
            <div className="mt-5">
              <SubmissionReportActions
                submissionIds={reviewableSubmissionIds}
                status={resolvedMilestoneStatus}
                onApprove={handleApprove}
                onDecline={handleDecline}
                isSubmitting={isSubmitting}
                approveButtonText={
                  isInfluencerPromotion ? "Approve" : "Approve Selected"
                }
                declineButtonText={
                  isInfluencerPromotion ? "Decline" : "Decline Selected"
                }
                disabled={
                  !isInfluencerPromotion && reviewableSubmissionIds.length === 0
                }
                successMessage="Submission approved successfully!"
                errorMessage="Failed to approve submission. Please try again."
              />
            </div>
          ) : null}

          {shouldShowBonusCard ? (
            <div className="mt-5">
              <MilestoneBonusCard
                milestoneId={bonusMilestoneId ?? milestone.id}
                campaignType={String(campaign.campaignType ?? "")}
              />
            </div>
          ) : null}
        </div>
      </AccordionItem>
    </Accordion>
  );
}
