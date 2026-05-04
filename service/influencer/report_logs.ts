import { serviceClient } from "@/service/base/axios_client";
import { ReportLogsResponse } from "@/types/influencer/report_logs";

export type ReportLogStatus = "flagged" | "pending" | "resolved";

const toApiStatus = (status?: ReportLogStatus) => {
  if (!status) return undefined;
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export interface ReportLogsQueryParams {
  page?: number;
  limit?: number;
  status?: ReportLogStatus;
  search?: string;
}

export const getReportLogs = async (
  params: ReportLogsQueryParams = {},
): Promise<ReportLogsResponse> => {
  const response = await serviceClient.get(`/influencer/report-logs`, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      status: toApiStatus(params.status),
      search: params.search?.trim() || undefined,
    },
  });

  return response.data;
};
