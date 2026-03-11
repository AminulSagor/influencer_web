import { CampaignDetails } from "@/types/client/campaigns/campaign-details";
import { RateableEntity } from "./rating-card.types";

export const MAX_RATING = 5;

export const normalizeRating = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_RATING, value));
};

export const formatRatedText = (value: number) => {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(1);
};

export const getCampaignRateableEntities = (
  campaign: CampaignDetails
): RateableEntity[] => {
  if (campaign.campaignType === "influencer_promotion") {
    const map = new Map<string, RateableEntity>();

    for (const milestone of campaign.milestones) {
      const influencerId = milestone.assignedToInfluencerId;
      if (!influencerId) continue;

      if (!map.has(influencerId)) {
        map.set(influencerId, {
          id: influencerId,
          name: milestone.influencerName?.trim() || "Influencer",
          image: milestone.influencerImage ?? null,
          type: "influencer",
        });
      }
    }

    return Array.from(map.values());
  }

  const selectedAgency = campaign.assignedAgencies.find(
    (item) => item.agencyId === campaign.selectedAgencyId
  );

  if (selectedAgency?.agency) {
    return [
      {
        id: selectedAgency.agency.id,
        name: selectedAgency.agency.agencyName,
        image: selectedAgency.agency.logo,
        type: "client",
      },
    ];
  }

  const firstAgency = campaign.assignedAgencies[0];

  if (firstAgency?.agency) {
    return [
      {
        id: firstAgency.agency.id,
        name: firstAgency.agency.agencyName,
        image: firstAgency.agency.logo,
        type: "client",
      },
    ];
  }

  return [];
};