import { serviceServer } from "@/service/base/axios_server";
import type {
  PendingClearanceQuery,
  PendingClearanceResponse,
} from "@/types/admin/finance/finance_pending_completed_type";

export const getPendingClearance = async (
  params?: PendingClearanceQuery
): Promise<PendingClearanceResponse> => {
  const res = await serviceServer.get<PendingClearanceResponse>(
    "/influencer/admin/finance/pending-clearance",
    {
      params,
    }
  );

  return res.data;
};