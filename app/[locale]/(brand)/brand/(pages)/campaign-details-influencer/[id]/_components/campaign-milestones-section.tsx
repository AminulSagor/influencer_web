"use client";

import React from "react";
import CampaignMilestonesOverview from "./campaign-milestones-overview";
import MilestoneDetailsPanel from "./milestone-details-panel";
import DangerZoneCard from "./danger-zone-card";
import { CampaignDetails } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/types";


export default function CampaignMilestonesSection({
  campaign,
}: {
  campaign: CampaignDetails;
}) {
  const influencers = campaign.influencerCampaigns ?? [];
  const defaultInfluencerId =
    campaign.selectedInfluencerId ?? influencers?.[0]?.influencer?.id ?? "";

  const [selectedInfluencerId, setSelectedInfluencerId] =
    React.useState(defaultInfluencerId);

  const selectedInfluencerCampaign = React.useMemo(() => {
    return (
      influencers.find((x) => x.influencer.id === selectedInfluencerId) ??
      influencers[0]
    );
  }, [influencers, selectedInfluencerId]);

  const milestones = selectedInfluencerCampaign?.milestones ?? [];
  const [expandedMilestoneId, setExpandedMilestoneId] = React.useState(
    campaign.expandedMilestoneId ?? milestones?.[0]?.id ?? ""
  );

  React.useEffect(() => {
    // when influencer changes, expand first milestone
    setExpandedMilestoneId(milestones?.[0]?.id ?? "");
  }, [selectedInfluencerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const expandedMilestone = milestones.find((m) => m.id === expandedMilestoneId);

  return (
    <div className="space-y-4">
      <CampaignMilestonesOverview
        campaign={campaign}
        selectedInfluencerId={selectedInfluencerId}
        onChangeInfluencer={setSelectedInfluencerId}
        expandedMilestoneId={expandedMilestoneId}
        onSelectMilestone={setExpandedMilestoneId}
      />

      {/*OUTSIDE the milestones card, UNDER it */}
      <MilestoneDetailsPanel milestone={expandedMilestone} />

      <DangerZoneCard />
    </div>
  );
}
