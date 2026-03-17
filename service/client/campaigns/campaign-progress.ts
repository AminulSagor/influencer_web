import { ServiceResponse } from "@/types/service-response";
import {
  AgencyCampaignProgressData,
  InfluencerCampaignProgressData,
} from "@/types/client/campaigns/campaign-progress.types";
import { serviceClient } from "@/service/base/axios_client";

export async function getAgencyCampaignProgress(
  campaignId: string,
): Promise<ServiceResponse<AgencyCampaignProgressData>> {
  const { data } = await serviceClient.get<
    ServiceResponse<AgencyCampaignProgressData>
  >(`/campaign/progress/campaign/${campaignId}/agency`);

  return data;
}

export async function getInfluencerCampaignProgress(
  campaignId: string,
  influencerId: string,
): Promise<ServiceResponse<InfluencerCampaignProgressData>> {
  const { data } = await serviceClient.get<
    ServiceResponse<InfluencerCampaignProgressData>
  >(`/campaign/progress/campaign/${campaignId}/influencer/${influencerId}`);

  return data;
}
