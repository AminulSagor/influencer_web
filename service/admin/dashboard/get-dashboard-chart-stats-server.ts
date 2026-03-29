import { serviceServer } from "@/service/base/axios_server";
import {
  DashboardChartDateRange,
  DashboardChartStatsResponse,
  DashboardChartUserType,
} from "@/types/admin/dashboard/dashboard_charts_stats_type";

type GetDashboardChartStatsParams = {
  userType?: DashboardChartUserType;
  dateRange?: DashboardChartDateRange;
};

export const getDashboardChartStatsServer = async ({
  userType = "agency",
  dateRange = "today",
}: GetDashboardChartStatsParams = {}): Promise<DashboardChartStatsResponse> => {
  const params = new URLSearchParams();

  params.set("userType", userType);
  params.set("dateRange", dateRange);

  const res = await serviceServer.get(
    `/influencer/admin/dashboard/chart-stats?${params.toString()}`
  );

  return res.data;
};