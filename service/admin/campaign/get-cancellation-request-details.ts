import { serviceClient } from "@/service/base/axios_client";

import type {
  CancellationRequestDetailsResponse,
  CancellationTargetType,
} from "@/types/admin/campaign/cancellation_requests_type";

export const getCancellationRequestDetails = async (
  targetType: CancellationTargetType,
  requestId: string
): Promise<CancellationRequestDetailsResponse> => {
  const res = await serviceClient.get<CancellationRequestDetailsResponse>(
    `/campaign/admin/cancellations/requests/${targetType}/${requestId}`
  );

  return res.data;
};

