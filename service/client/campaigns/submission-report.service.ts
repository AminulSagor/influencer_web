import { serviceClient } from "@/service/base/axios_client";
import { ServiceResponse } from "@/types/service-response";

export type SubmissionReportItem = {
  id: string;
  content: string;
  authorRole: string;
  actionTaken: string;
  createdAt: string;
};

export type CreateSubmissionReportPayload = {
  report: string;
};

export async function createSubmissionReport(
  submissionId: string,
  payload: CreateSubmissionReportPayload,
) {
  const res = await serviceClient.post<
    ServiceResponse<SubmissionReportItem>
  >(`/campaign/client/submissions/${submissionId}/report`, payload);

  return res.data;
}

export async function getSubmissionReports(submissionId: string) {
  const res = await serviceClient.get<
    ServiceResponse<SubmissionReportItem[]>
  >(`/campaign/submission/${submissionId}/report`);

  return res.data;
}