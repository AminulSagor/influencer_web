import { serviceClient } from "@/service/base/axios_client";


export async function getAssignedAgencies(campaignId: string) {
  return serviceClient.get(`/campaign/admin/${campaignId}/assigned-agencies`);
}