import { serviceClient } from "@/service/base/axios_client";

type ReviewAgencySubmissionPayload = {
  submissionId: string;
  action: "approve" | "decline";
  reason?: string;
};

export async function reviewAgencySubmission({
  submissionId,
  action,
  reason,
}: ReviewAgencySubmissionPayload) {
  const body =
    action === "decline"
      ? {
          action,
          reason: reason?.trim() || "",
        }
      : {
          action,
        };

  const res = await serviceClient.post(
    `/campaign/admin/submission/${submissionId}/review`,
    body
  );

  return res.data;
}