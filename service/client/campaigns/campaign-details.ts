import { ServiceResponse } from "@/types/service-response";
import { serviceClient } from "@/service/base/axios_client";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";

export const getCampaignDetails = async (
  campaignId: string,
): Promise<ClientCampaignDetails | null> => {
  try {
    const res = await serviceClient.get<ServiceResponse<ClientCampaignDetails>>(
      `/campaign/client/details/${campaignId}`,
    );

    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch campaign details:", error);
    return null;
  }
};
