import { apiClient } from "@/api/base/axios_client";

export async function editMilestoneAmount(params: {
  milestoneId: string;
  amount: number;
}) {
  const { milestoneId, amount } = params;

  return apiClient.patch(`/campaign/milestone/${milestoneId}/amount`, {
    amount,
  });
}