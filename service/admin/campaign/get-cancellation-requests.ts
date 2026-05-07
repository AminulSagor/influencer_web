import { serviceServer } from "@/service/base/axios_server";

import type {
  CancellationRequestsResponse,
} from "@/types/admin/campaign/cancellation_requests_type";

type CancellationRequestsQuery = {
  page?: number;
  limit?: number;
};

export const getCancellationRequests = async (
  params?: CancellationRequestsQuery
): Promise<CancellationRequestsResponse> => {
  const res = await serviceServer.get<CancellationRequestsResponse>(
    "/campaign/admin/cancellations/requests",
    { params }
  );

  return res.data;
};

