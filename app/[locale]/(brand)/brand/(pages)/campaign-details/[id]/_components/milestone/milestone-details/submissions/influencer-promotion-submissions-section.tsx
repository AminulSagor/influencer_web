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
};

export default function InfluencerPromotionSubmissionsSection({
  campaign,
  milestone,
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

  React.useEffect(() => {
    setOpenValue("");
  }, [milestone.id]);

  React.useEffect(() => {
    if (!items.length) {
      setOpenValue("");
      return;
    }

    setOpenValue(items[0].id);
  }, [items]);

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

  const submission = items[0];

  if (!submission) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center text-sm text-red-400">
        {t("noSubmissionsFoundForThisMilestoness")}
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
        submission={submission}
        index={0}
        campaign={campaign}
        milestone={milestone}
        isOpen={openValue === submission.id}
        prefetchedDetail={prefetchedDetailsById[submission.id] ?? null}
      />
    </Accordion>
  );
}
