"use client";

import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import SubmissionAccordionItem from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-accordion-item";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import { useMilestoneSubmissions } from "@/hooks/use-milestone-submissions";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
};

export default function MilestoneSubmissionsSection({
  campaign,
  milestone,
}: Props) {
  const [openValues, setOpenValues] = React.useState<string[]>([]);
  const [openInfluencerValue, setOpenInfluencerValue] = React.useState<
    string | undefined
  >(undefined);

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

  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  React.useEffect(() => {
    setOpenValues([]);
    setOpenInfluencerValue(undefined);
  }, [milestone.id]);

  React.useEffect(() => {
    if (!isInfluencerPromotion) return;
    if (!items.length) return;

    setOpenInfluencerValue((prev) => {
      if (prev && items.some((item) => item.id === prev)) {
        return prev;
      }
      return items[0].id;
    });
  }, [isInfluencerPromotion, items]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-black/60">
        Loading submissions...
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
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-black/50">
        No submissions found for this milestone.
      </div>
    );
  }

  if (isInfluencerPromotion) {
    const submission = items[0];

    if (!submission) {
      return (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-black/50">
          No submissions found for this milestone.
        </div>
      );
    }

    return (
      <Accordion
        type="single"
        collapsible
        className="space-y-4"
        value={openInfluencerValue}
        onValueChange={setOpenInfluencerValue}
      >
        <SubmissionAccordionItem
          key={submission.id}
          submission={submission}
          index={0}
          campaign={campaign}
          milestone={milestone}
          isOpen={openInfluencerValue === submission.id}
          prefetchedDetail={prefetchedDetailsById[submission.id] ?? null}
        />
      </Accordion>
    );
  }

  return (
    <Accordion
      type="multiple"
      className="space-y-4"
      value={openValues}
      onValueChange={setOpenValues}
    >
      {items.map((submission, index) => (
        <SubmissionAccordionItem
          key={submission.id}
          submission={submission}
          index={index}
          campaign={campaign}
          milestone={milestone}
          isOpen={openValues.includes(submission.id)}
          prefetchedDetail={prefetchedDetailsById[submission.id] ?? null}
        />
      ))}
    </Accordion>
  );
}
