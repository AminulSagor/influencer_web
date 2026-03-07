import { serviceServer } from "@/service/base/axios_server";
import {
  ActionRequiredItem,
  ActiveJobsResponse,
  LifetimeSummaryData,
} from "@/types/client/dashboard/dashboard-types";
import { ServiceResponse, PaginationMeta } from "@/types/service-response";

export async function getActiveJobsTotal(): Promise<number> {
  const res = await serviceServer.get<
    ServiceResponse<ActiveJobsResponse, PaginationMeta>
  >("/client/dashboard/active-jobs?page=1&limit=1");

  return res.data.meta?.total ?? 0;
}

export async function getLifetimeSummary(): Promise<LifetimeSummaryData> {
  const res = await serviceServer.get<ServiceResponse<LifetimeSummaryData>>(
    "/client/lifetime-summary",
  );

  return res.data.data;
}

export const getActionRequired = async (): Promise<ActionRequiredItem[]> => {
  try {
    const { data } = await serviceServer.get<
      ServiceResponse<ActionRequiredItem[]>
    >("/client/dashboard/action-required");

    return data.data ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
