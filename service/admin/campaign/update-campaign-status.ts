import { serviceClient } from "@/service/base/axios_client";
import type { CampaignStatus } from "@/types/admin/campaign/campaign_ui_type";

export async function updateCampaignStatus(
  campaignId: string,
  status: CampaignStatus
) {
  const res = await serviceClient.patch(
    `/campaign/admin/${campaignId}/status`,
    { status }
  );

  return res.data;
}

