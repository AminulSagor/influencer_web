"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/accordion";
import SubmissionAccordionItem from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/influencer-submission-accordion-item";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import { useMilestoneSubmissions } from "@/hooks/use-milestone-submissions";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
  onPrimarySubmissionIdChange: (id: string | null) => void;
  submissionId?: string | null; // ← Add this
};

export default function InfluencerPromotionSubmissionsSection({
  campaign,
  milestone,
  onPrimarySubmissionIdChange,
  submissionId, // ← Add this
}: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");
  const [openValue, setOpenValue] = React.useState<string>("");

  const assignedInfluencers = campaign.assignedInfluencers ?? [];

  const { items, prefetchedDetailsById, isLoading, error } =
    useMilestoneSubmissions({
      campaignId: campaign.id,
      campaignName: campaign.campaignName,
      milestoneId: milestone.id,
      campaignType: campaign.campaignType,
      assignedInfluencers,
      enabled: Boolean(campaign.id && milestone.id),
    });

  // Find the specific submission that matches the submissionId
  const targetSubmission = React.useMemo(() => {
    if (!submissionId || !items.length) return null;
    return items.find((item) => item.id === submissionId) || null;
  }, [items, submissionId]);

  // If we have a specific submissionId but it's not found in items, use the first one as fallback
  const effectiveSubmission = React.useMemo(() => {
    if (targetSubmission) return targetSubmission;
    if (items.length > 0 && !submissionId) return items[0];
    return null;
  }, [targetSubmission, items, submissionId]);

  React.useEffect(() => {
    setOpenValue("");
    onPrimarySubmissionIdChange(null);
  }, [milestone.id, onPrimarySubmissionIdChange]);

  React.useEffect(() => {
    if (!effectiveSubmission) {
      setOpenValue("");
      onPrimarySubmissionIdChange(null);
      return;
    }

    setOpenValue(effectiveSubmission.id);
    onPrimarySubmissionIdChange(effectiveSubmission.id);
  }, [effectiveSubmission, onPrimarySubmissionIdChange]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center text-sm text-black/60">
        {t("loadingSubmissions")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!effectiveSubmission) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center text-sm text-red-500">
        {t("noSubmissionsFoundForThisMilestonesss")}
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-4"
      value={openValue}
      onValueChange={setOpenValue}
    >
      <SubmissionAccordionItem
        submission={effectiveSubmission}
        index={0}
        campaign={campaign}
        milestone={milestone}
        isOpen={openValue === effectiveSubmission.id}
        prefetchedDetail={prefetchedDetailsById[effectiveSubmission.id] ?? null}
      />
    </Accordion>
  );
}
