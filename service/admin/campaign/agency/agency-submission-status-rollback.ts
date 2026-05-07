import { serviceClient } from "@/service/base/axios_client";

type Payload = {
  submissionId: string;
  status: "in_review" | "approved" | "declined" | "completed";
};

export async function agencySubmissionStatusRollback({
  submissionId,
  status,
}: Payload) {
  const res = await serviceClient.patch(
    `/campaign/admin/agency/submissions/${submissionId}/status-rollback`,
    { status }
  );

  return res.data;
}
