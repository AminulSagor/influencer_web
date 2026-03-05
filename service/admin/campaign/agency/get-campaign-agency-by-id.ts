import { serviceClient } from "@/service/base/axios_client";


export type AdminCampaignDetailsResponse = {
  success: boolean;
  message?: string;
  data: any;
};

export async function getAdminCampaignById(id: string) {
  if (!id) throw new Error("Campaign id is required");

  const res = await serviceClient.get<AdminCampaignDetailsResponse>(`/campaign/admin/${id}`);
  return res.data;
}