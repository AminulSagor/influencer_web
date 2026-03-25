import { serviceClient } from "@/service/base/axios_client";

type UpdateMilestoneStatusPayload = {
  milestoneId: string;
  status: "approved" | "in_review" | "todo" | "declined";
};

export async function updateMilestoneStatus({
  milestoneId,
  status,
}: UpdateMilestoneStatusPayload) {
  const res = await serviceClient.patch(
    `/campaign/admin/milestones/${milestoneId}/status`,
    {
      status,
    }
  );

  return res.data;
}
