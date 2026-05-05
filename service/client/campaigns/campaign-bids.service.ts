import { serviceClient } from "@/service/base/axios_client";
import {
  CampaignBidsQueryParams,
  CampaignBidsResponse,
  SelectAgencyPayload,
} from "@/types/client/campaigns/campaign-bids.types";

const buildCampaignBidsParams = (params?: CampaignBidsQueryParams) => {
  if (!params) return undefined;

  return Object.entries(params).reduce<Record<string, string | number>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null || value === "") return acc;
      acc[key] = value;
      return acc;
    },
    {},
  );
};

export const campaignBidsService = {
  async getCampaignBids(
    campaignId: string,
    params?: CampaignBidsQueryParams,
  ) {
    const res = await serviceClient.get<CampaignBidsResponse>(
      `/campaign/client/bids/${campaignId}`,
      {
        params: buildCampaignBidsParams(params),
      },
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
