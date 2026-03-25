"use client";

import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/accordion";
import PaidAdSubmissionAccordionItem from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/paid-ad-submission-accordion-item";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import { useMilestoneSubmissions } from "@/hooks/use-milestone-submissions";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
};

export default function PaidAdSubmissionsSection({
  campaign,
  milestone,
}: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");

  const assignedInfluencers = campaign.assignedInfluencers ?? [];

  const { items, isLoading, error } = useMilestoneSubmissions({
    campaignId: campaign.id,
    campaignName: campaign.campaignName,
    milestoneId: milestone.id,
    campaignType: campaign.campaignType,
    assignedInfluencers,
    enabled: Boolean(campaign.id && milestone.id),
  });

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

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center text-sm text-red-500">
        {t("noSubmissionsFoundForThisMilestonesss")}
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      className="space-y-4"
      defaultValue={items[0] ? [items[0].id] : []}
    >
      {items.map((submission, index) => (
        <PaidAdSubmissionAccordionItem
          key={submission.id}
          submission={submission}
          index={index}
          campaign={campaign}
          milestone={milestone}
        />
      ))}
    </Accordion>
  );
}
