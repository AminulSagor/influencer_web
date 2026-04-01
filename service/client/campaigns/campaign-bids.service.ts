import { serviceClient } from "@/service/base/axios_client";
import {
  CampaignBidsResponse,
  SelectAgencyPayload,
} from "@/types/client/campaigns/campaign-bids.types";

export const campaignBidsService = {
  async getCampaignBids(campaignId: string) {
    const res = await serviceClient.get<CampaignBidsResponse>(
      `/campaign/client/bids/${campaignId}`,
    );
    return res.data;
  },

  async selectAgency(payload: SelectAgencyPayload) {
    const res = await serviceClient.post(
      "/campaign/client/select-agency",
      payload,
    );
    return res.data;
  },
};
