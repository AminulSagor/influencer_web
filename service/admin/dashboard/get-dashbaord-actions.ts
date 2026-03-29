
import { serviceServer } from "@/service/base/axios_server";
import {
  DashboardActionsResponse,
  DashboardActionTab,
} from "@/types/admin/dashboard/dashboard_actions_type";

type GetDashboardActionsParams = {
  page?: number;
  limit?: number;
  tab?: DashboardActionTab;
};

export const getDashboardActions = async ({
  page = 1,
  limit = 10,
  tab = "all",
}: GetDashboardActionsParams = {}): Promise<DashboardActionsResponse> => {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));
  params.set("tab", tab);

  const res = await serviceServer.get(
    `/influencer/admin/dashboard/actions?${params.toString()}`
  );

  return res.data;
};