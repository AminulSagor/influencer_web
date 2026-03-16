import { serviceClient } from "@/service/base/axios_client";

type PayInfluencerSubmissionPayload = {
  submissionId: string;
  amount: number;
  reason: string;
};

export async function payInfluencerSubmission({
  submissionId,
  amount,
  reason,
}: PayInfluencerSubmissionPayload) {
  const res = await serviceClient.patch(
    `/campaign/admin/submissions/${submissionId}/pay-influencer`,
    {
      amount,
      reason,
    }
  );

  return res.data;
}