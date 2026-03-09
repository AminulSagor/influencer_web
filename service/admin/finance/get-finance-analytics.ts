import { serviceServer } from "@/service/base/axios_server";
import { FinanceAnalyticsData, FinanceAnalyticsResponse } from "@/types/admin/finance/finance_analytic_type";

export const getFinanceAnalytics = async (): Promise<FinanceAnalyticsData> => {
  const res = await serviceServer.get<FinanceAnalyticsResponse>(
    "/influencer/admin/finance/analytics"
  );

  return res.data.data;
};