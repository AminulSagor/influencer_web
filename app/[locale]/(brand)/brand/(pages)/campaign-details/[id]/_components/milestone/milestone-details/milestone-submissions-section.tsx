"use client";

import * as React from "react";
import SubmissionAccordionItem from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submission-accordion-item";
import { Accordion } from "@/components/ui/accordion";
import {
  CampaignDetails,
  CampaignMilestone,
} from "@/types/client/campaigns/campaign-details";
import { useMilestoneSubmissions } from "@/hooks/use-milestone-submissions";
import { CampaignAssignedInfluencer } from "@/types/client/campaigns/campaign-submission.types";

type Props = {
  campaign: CampaignDetails;
  milestone: CampaignMilestone;
  assignedInfluencers: CampaignAssignedInfluencer[];
};

export default function MilestoneSubmissionsSection({
  campaign,
  milestone,
  assignedInfluencers,
}: Props) {
  const [openValues, setOpenValues] = React.useState<string[]>([]);

  React.useEffect(() => {
    setOpenValues([]);
  }, [milestone.id]);

  const { items, prefetchedDetailsById, isLoading, error } =
    useMilestoneSubmissions({
      campaignId: campaign.id,
      campaignName: campaign.campaignName,
      milestoneId: milestone.id,
      campaignType: campaign.campaignType,
      assignedInfluencers,
      enabled: Boolean(campaign.id && milestone.id),
    });

  if (isLoading) {
    return (
      <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 text-sm text-muted-foreground">
        Loading submissions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[20px] border border-red-200 bg-red-50 p-5 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 text-sm text-muted-foreground">
        No submissions found for this milestone.
      </div>
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