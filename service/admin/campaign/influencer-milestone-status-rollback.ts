import { serviceClient } from "@/service/base/axios_client";

export type InfluencerMilestoneRollbackStatus = "completed" | "in_review" | "approved" | "declined";

type Payload = {
  milestoneId: string;
  status: InfluencerMilestoneRollbackStatus;
};

export async function influencerMilestoneStatusRollback({
  milestoneId,
  status,
}: Payload) {
  const res = await serviceClient.patch(
    `/campaign/admin/influencer-milestones/${milestoneId}/status-rollback`,
    { status }
  );

  return res.data;
}
