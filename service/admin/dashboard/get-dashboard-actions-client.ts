import { serviceClient } from "@/service/base/axios_client";
import {
  DashboardActionsResponse,
  DashboardActionTab,
} from "@/types/admin/dashboard/dashboard_actions_type";

type GetDashboardActionsParams = {
  page?: number;
  limit?: number;
  tab?: DashboardActionTab;
};

export const getDashboardActionsClient = async ({
  page = 1,
  limit = 10,
  tab = "all",
}: GetDashboardActionsParams = {}): Promise<DashboardActionsResponse> => {
  const res = await serviceClient.get<DashboardActionsResponse>(
    "/influencer/admin/dashboard/actions",
    {
      params: {
        page,
        limit,
        tab,
      },
    }
  );

  return res.data;
};
