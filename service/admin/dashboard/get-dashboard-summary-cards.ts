
import { serviceServer } from "@/service/base/axios_server";
import { DashboardSummaryCardsResponse } from "@/types/admin/dashboard/dashboard_type";

export const getDashboardSummaryCards =
  async (): Promise<DashboardSummaryCardsResponse> => {
    const res = await serviceServer.get(
      "/influencer/admin/dashboard/summary-cards"
    );
    return res.data;
  };