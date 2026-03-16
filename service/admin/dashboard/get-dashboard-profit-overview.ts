import { serviceServer } from "@/service/base/axios_server";
import { DashboardProfitOverviewResponse } from "@/types/admin/dashboard/dashboard_profit_overview_type";

export const getDashboardProfitOverview =
  async (): Promise<DashboardProfitOverviewResponse> => {
    const res = await serviceServer.get(
      "/influencer/admin/dashboard/profit-overview?dateRange=lifetime"
    );

    return res.data;
  };