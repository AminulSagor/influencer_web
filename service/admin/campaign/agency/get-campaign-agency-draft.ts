import { serviceClient } from "@/service/base/axios_client";

export const fetchCampaignAgencyDrafts = async (campaignId: string) => {
  return serviceClient.get(
    `/campaign/admin/${campaignId}/assigned-agencies`
  );
};