"use client";

import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import InfluencerPromotionSubmissionsSection from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/influencer-promotion-submissions-section";
import PaidAdSubmissionsSection from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/paid-ad-submissions-section";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
};

export default function MilestoneSubmissionsSection({
  campaign,
  milestone,
}: Props) {
  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  if (isInfluencerPromotion) {
    return (
      <InfluencerPromotionSubmissionsSection
        campaign={campaign}
        milestone={milestone}
      />
    );
  }

  return <PaidAdSubmissionsSection campaign={campaign} milestone={milestone} />;
}
