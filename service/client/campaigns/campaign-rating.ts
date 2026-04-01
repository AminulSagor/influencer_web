import { serviceClient } from "@/service/base/axios_client";
import { ServiceResponse } from "@/types/service-response";

type MessageResponse = {
  message?: string;
};

type RateInfluencerPayload = {
  campaignId: string;
  influencerId: string;
  rating: number;
};

type RateCampaignPayload = {
  campaignId: string;
  rating: number;
};

export const rateInfluencer = async ({
  campaignId,
  influencerId,
  rating,
}: RateInfluencerPayload) => {
  const response = await serviceClient.post<ServiceResponse<MessageResponse>>(
    `/campaign/client/${campaignId}/influencers/${influencerId}/rate`,
    { rating },
  );

  return response.data;
};

export const rateCampaignClient = async ({
  campaignId,
  rating,
}: RateCampaignPayload) => {
  const response = await serviceClient.post<ServiceResponse<MessageResponse>>(
    `/campaign/client/campaign/${campaignId}/rate`,
    { rating },
  );

  return response.data;
};
