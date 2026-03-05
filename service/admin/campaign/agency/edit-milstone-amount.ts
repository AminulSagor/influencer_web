import { serviceClient } from "@/service/base/axios_client";

export async function editMilestoneAmount(params: {
  milestoneId: string;
  amount: number;
}) {
  const { milestoneId, amount } = params;

  return serviceClient.patch(`/campaign/milestone/${milestoneId}/amount`, {
    amount,
  });
}