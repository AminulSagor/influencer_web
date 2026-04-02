import { serviceServer } from "@/service/base/axios_server";
import type {
  PendingBonusesQuery,
  PendingBonusesResponse,
} from "@/types/admin/finance/finance_bonus_clearance_type";

export const getPendingBonuses = async (
  params?: PendingBonusesQuery
): Promise<PendingBonusesResponse> => {
  const res = await serviceServer.get<PendingBonusesResponse>(
    "/campaign/admin/finance/pending-bonuses",
    { params }
  );

  return res.data;
};

