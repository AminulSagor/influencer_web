import { serviceServer } from "@/service/base/axios_server";

import type {
  PartiallyCompletedQuery,
  PartiallyCompletedResponse,
} from "@/types/admin/finance/finance_partially_completed_type";

export const getPartiallyCompleted = async (
  params?: PartiallyCompletedQuery
): Promise<PartiallyCompletedResponse> => {
  const res = await serviceServer.get<PartiallyCompletedResponse>(
    "/influencer/admin/admin/finance/partially-completed",
    { params }
  );

  return res.data;
};

