import { serviceServer } from "@/service/base/axios_server";
import {
  CompletedPaymentQuery,
  CompletedPaymentResponse,
} from "@/types/admin/finance/finance_pending_completed_type";

export const getCompletedPayments = async (
  params?: CompletedPaymentQuery
): Promise<CompletedPaymentResponse> => {
  const res = await serviceServer.get<CompletedPaymentResponse>(
    "/influencer/admin/finance/payment-completed",
    {
      params,
    }
  );

  return res.data;
};