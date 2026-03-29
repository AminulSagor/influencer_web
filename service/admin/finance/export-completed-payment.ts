import { serviceClient } from "@/service/base/axios_client";
import type {
  AmountSortType,
  CompletedPaymentType,
} from "@/types/admin/finance/finance_pending_completed_type";

type ExportCompletedPayload = {
  search?: string;
  tab: "agencypayout" | "influencerpayout" | "brandpayment";
  paymentType?: CompletedPaymentType;
  amountSort?: AmountSortType;
  dateFrom?: string;
  dateTo?: string;
  exportIds: string[];
};

type ExportCompletedResponse = {
  success: boolean;
  message: string;
  data: Record<string, string | number | null>[];
};

export const exportCompletedPayments = async (
  payload: ExportCompletedPayload
): Promise<ExportCompletedResponse> => {
  const res = await serviceClient.post<ExportCompletedResponse>(
    "/influencer/admin/finance/export/payment-completed",
    payload
  );

  return res.data;
};