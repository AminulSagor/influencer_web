import { serviceServer } from "@/service/base/axios_server";
import type {
  BrandPendingPaymentQuery,
  BrandPendingPaymentResponse,
} from "@/types/admin/finance/finance_pending_completed_type";

export const getBrandPendingPayments = async (
  params?: BrandPendingPaymentQuery
): Promise<BrandPendingPaymentResponse> => {
  const res = await serviceServer.get<BrandPendingPaymentResponse>(
    "/influencer/admin/finance/brand-payment-pending",
    {
      params,
    }
  );

  return res.data;
};