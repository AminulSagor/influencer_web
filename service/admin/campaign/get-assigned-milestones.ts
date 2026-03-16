import { serviceClient } from "@/service/base/axios_client";

export const getAssignedMilestones = async (campaignId: string) => {
  const res = await serviceClient.get(
    `/campaign/admin/get/${campaignId}/assigned-milestones`
  );
  return res.data;
};