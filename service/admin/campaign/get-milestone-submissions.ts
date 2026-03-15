import { serviceClient } from "@/service/base/axios_client";

export async function getMilestoneSubmissions(milestoneId: string) {
  const res = await serviceClient.get(
    `/campaign/get/milestones/${milestoneId}/submissions`
  );
  return res.data;
}