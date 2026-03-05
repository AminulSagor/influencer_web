import { apiClient } from "@/api/base/axios_client";

export const fetchCampaignAgencyDrafts = async (campaignId: string) => {
  return apiClient.get(
    `/campaign/admin/${campaignId}/assigned-agencies`
  );
};