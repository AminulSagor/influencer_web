import { cache } from "react";
import { ServiceResponse } from "@/types/service-response";
import { serviceServer } from "@/service/base/axios_server";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";

export const getCampaignDetails = cache(
  async (campaignId: string): Promise<ClientCampaignDetails | null> => {
    try {
      const res = await serviceServer.get<
        ServiceResponse<ClientCampaignDetails>
      >(`/campaign/client/details/${campaignId}`);

      return res.data.data;
    } catch (error) {
      console.error("Failed to fetch campaign details:", error);
      return null;
    }
  },
);
