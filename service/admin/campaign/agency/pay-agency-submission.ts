import { serviceClient } from "@/service/base/axios_client";

type PayAgencySubmissionPayload = {
  submissionId: string;
  amount: number;
  reason?: string;
};

export async function payAgencySubmission({
  submissionId,
  amount,
  reason,
}: PayAgencySubmissionPayload) {
  const parsedAmount = Number(amount ?? 0);

  const body =
    reason && reason.trim()
      ? {
          amount: parsedAmount,
          reason: reason.trim(),
        }
      : {
          amount: parsedAmount,
        };

  const res = await serviceClient.post(
    `/campaign/admin/submission/${submissionId}/pay`,
    body
  );

  return res.data;
}