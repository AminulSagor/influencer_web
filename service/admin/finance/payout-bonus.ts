import { serviceClient } from "@/service/base/axios_client";
import type { ServiceResponse } from "@/types/service-response";

import type {
  PayoutBonusParams,
  PayoutBonusTargetType,
} from "@/types/admin/finance/finance_bonus_clearance_type";

type PayoutBonusResponseData = {
  message?: string;
};

export const payoutBonus = async (
  params: PayoutBonusParams
): Promise<ServiceResponse<PayoutBonusResponseData>> => {
  const { campaignId, targetType, targetId, amount } = params;

  const normalizedTargetType: PayoutBonusTargetType = targetType;
  const endpoint = `/campaign/admin/finance/bonuses/campaign/${campaignId}/target/${normalizedTargetType}/${targetId}/pay`;

  const res = await serviceClient.post<ServiceResponse<PayoutBonusResponseData>>(
    endpoint,
    { amount }
  );

  return res.data;
};

