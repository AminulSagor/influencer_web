import { serviceClient } from "@/service/base/axios_client";

type UpdateInfluencerMilestoneStatusPayload = {
  milestoneId: string;
  assignmentId: string;
  status: "approved" | "declined";
  reason?: string;
};

export async function updateInfluencerMilestoneStatus({
  milestoneId,
  assignmentId,
  status,
  reason,
}: UpdateInfluencerMilestoneStatusPayload) {
  const res = await serviceClient.patch(
    `/campaign/admin/influencer-milestones/${milestoneId}/status`,
    {
      status,
      ...(reason ? { reason } : {}),
    },
    {
      params: {
        assignmentId,
      },
    }
  );

  return res.data;
}