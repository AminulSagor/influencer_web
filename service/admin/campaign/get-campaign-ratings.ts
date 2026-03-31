import { serviceClient } from "@/service/base/axios_client";

export type CampaignRatingsResponse = {
  success: boolean;
  data?: {
    campaignId: string;
    campaignName: string;
    overallCampaignRating: number;
    influencerRatings: {
      influencerId: string;
      influencerName: string;
      influencerImage: string | null;
      isRated: boolean;
      rating: number;
      ratedAt?: string;
    }[];
  };
};

export async function getCampaignRatings(campaignId: string) {
  const res = await serviceClient.get<CampaignRatingsResponse>(
    `/campaign/get/ratings/${campaignId}`
  );

  return res.data;
}

