import { serviceClient } from "@/service/base/axios_client";
import { ReportLogsResponse } from "@/types/influencer/report_logs";

export const getReportLogs = async (): Promise<ReportLogsResponse> => {
    const response = await serviceClient.get(`/influencer/report-logs`);
    return response.data;
};
