import { apiClient } from "@/api/base/axios_client";


export async function getAssignedAgencies(campaignId: string) {
  return apiClient.get(`/campaign/admin/${campaignId}/assigned-agencies`);
}