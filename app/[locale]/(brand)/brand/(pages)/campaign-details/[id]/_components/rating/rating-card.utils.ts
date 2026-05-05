import type {
  CampaignAgencyProfile,
  CampaignAssignedAgency,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import type { RateableEntity } from "./rating-card.types";

export const MAX_RATING = 5;

export const normalizeRating = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX_RATING, value));
};

export const formatRatedText = (value: number) => {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(1);
};

const toText = (value: unknown) => String(value ?? "").trim();

const normalizeStatus = (status?: string | null) =>
  toText(status).toLowerCase().replace(/[\s-]+/g, "_");

export const isCampaignCompletedForRating = (
  campaign: ClientCampaignDetails,
) => {
  const status = normalizeStatus(campaign.status);
  return status === "completed" || status === "complete";
};

const pickAgencyProfile = (
  campaign: ClientCampaignDetails,
): CampaignAgencyProfile | null => {
  const selectedAgencyId = toText(campaign.selectedAgencyId);

  const selectedAssignedAgency = campaign.assignedAgencies?.find(
    (item: CampaignAssignedAgency) => {
      const agency = item.agency ?? item;
      const agencyId = toText(
        agency.agencyId ?? agency.id ?? item.agencyId ?? item.id,
      );
      return agencyId && agencyId === selectedAgencyId;
    },
  );

  if (selectedAssignedAgency) {
    return selectedAssignedAgency.agency ?? selectedAssignedAgency;
  }

  return campaign.selectedAgency ?? campaign.agency ?? null;
};

const getAgencyRateableEntity = (
  campaign: ClientCampaignDetails,
): RateableEntity => {
  const agency = pickAgencyProfile(campaign);

  return {
    id:
      toText(campaign.selectedAgencyId) ||
      toText(agency?.agencyId) ||
      toText(agency?.id) ||
      toText(campaign.agencyOfferId) ||
      campaign.id,
    name: toText(agency?.agencyName) || toText(agency?.name) || "Agency",
    image:
      toText(agency?.logo) ||
      toText(agency?.image) ||
      toText(agency?.profileImg) ||
      null,
    type: "agency",
  };
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

  if (campaign.campaignType === "paid_ad") {
    return [getAgencyRateableEntity(campaign)];
  }

  return [];
};
