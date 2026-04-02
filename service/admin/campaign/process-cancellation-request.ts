import { serviceClient } from "@/service/base/axios_client";

import type {
  CancellationRequestDetailsResponse,
  ProcessCancellationAction,
  CancellationTargetType,
} from "@/types/admin/campaign/cancellation_requests_type";

type ProcessCancellationResponse = {
  success: boolean;
  message?: string;
};

export const processCancellationRequest = async ({
  targetType,
  targetId,
  action,
}: {
  targetType: CancellationTargetType;
  targetId: string;
  action: ProcessCancellationAction | "reject";
}): Promise<ProcessCancellationResponse> => {
  // Backend validation expects only `approve` or `decline`.
  // Some older UI paths may send `reject`, so we normalize it here.
  const normalizedAction =
    action === "reject" ? ("decline" as ProcessCancellationAction) : action;

  const res = await serviceClient.post<ProcessCancellationResponse>(
    "/campaign/admin/cancellations/process",
    {
      targetType,
      targetId,
      action: normalizedAction,
    }
  );

  return res.data;
};

