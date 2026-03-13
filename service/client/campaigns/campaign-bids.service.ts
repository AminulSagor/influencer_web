import { serviceClient } from "@/service/base/axios_client";
import { ServiceResponse } from "@/types/service-response";
import {
  CampaignBidsResponse,
  SelectAgencyPayload,
} from "@/types/client/campaigns/campaign-bids.types";

export const campaignBidsService = {
  async getCampaignBids(campaignId: string) {
    const res = await serviceClient.get<ServiceResponse<CampaignBidsResponse>>(
      `/campaign/client/bids/${campaignId}`,
    );
    return res.data;
  },

  async selectAgency(payload: SelectAgencyPayload) {
    const res = await serviceClient.post<ServiceResponse<unknown>>(
      "/campaign/client/select-agency",
      payload,
    );
    return res.data;
  },
};
