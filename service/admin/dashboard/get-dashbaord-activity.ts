import { serviceServer } from "@/service/base/axios_server";
import { DashboardActivityResponse } from "@/types/admin/dashboard/dashboard_activity_type";

export const getDashboardActivity =
  async (): Promise<DashboardActivityResponse> => {
    const res = await serviceServer.get("/influencer/admin/dashboard/activity");
    return res.data;
  };