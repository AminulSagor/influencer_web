import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
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
  campaign: ClientCampaignDetails,
): RateableEntity[] => {
  if (campaign.campaignType === "influencer_promotion") {
    const map = new Map<string, RateableEntity>();

    for (const influencer of campaign.assignedInfluencers) {
      if (!influencer.influencerId) continue;

      if (!map.has(influencer.influencerId)) {
        map.set(influencer.influencerId, {
          id: influencer.influencerId,
          name: influencer.name?.trim() || "Influencer",
          image: influencer.image ?? null,
          type: "influencer",
        });
      }
    }

    return Array.from(map.values());
  }

  return [];
};
