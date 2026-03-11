import { cache } from "react";
import { getCampaignDetails } from "@/service/client/campaigns/campaign-details";

export const getCachedCampaignDetails = cache(async (id: string) => {
  return await getCampaignDetails(id);
});