import { cache } from "react";
import {
  getCampaignDetails,
  getClientCampaignDetails,
} from "@/service/client/campaigns/campaign-details";

export const getCachedCampaignDetails = cache(async (id: string) => {
  return await getCampaignDetails(id);
});

export const getCachedClientCampaignDetails = cache(async (id: string) => {
  try {
    return await getClientCampaignDetails(id);
  } catch {
    return null;
  }
});
