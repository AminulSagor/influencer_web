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

export type ReportTargetType = "agency" | "influencer";

export async function createSubmissionReport(
  milestoneId: string,
  targetType: ReportTargetType,
  payload: CreateSubmissionReportPayload,
) {
  const res = await serviceClient.post<ServiceResponse<SubmissionReportItem>>(
    `/campaign/client/milestones/${targetType}/${milestoneId}/report`,
    payload,
  );

  return res.data;
}

export async function getSubmissionReport(reportId: string) {
  const res = await serviceClient.get<ServiceResponse<SubmissionReportItem>>(
    `/campaign/milestone/report/${reportId}`,
  );

  return res.data;
}