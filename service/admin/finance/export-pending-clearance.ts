import { serviceClient } from "@/service/base/axios_client";
import type {
  AmountSortType,
  PendingPaymentType,
} from "@/types/admin/finance/finance_pending_completed_type";

type ExportPendingClearanceQuery = {
  search?: string;
  tab?: "agencypayout" | "influencerpayout";
  paymentType?: PendingPaymentType;
  amountSort?: AmountSortType;
  dateFrom?: string;
  dateTo?: string;
};

type ExportBrandPendingQuery = {
  search?: string;
  amountSort?: AmountSortType;
  dateFrom?: string;
  dateTo?: string;
};

type ExportResponseItem = Record<string, string | number | null>;

type ExportResponse = {
  success: boolean;
  message: string;
  data: ExportResponseItem[];
};

export const exportPendingClearance = async (
  params?: ExportPendingClearanceQuery
): Promise<ExportResponse> => {
  const res = await serviceClient.get<ExportResponse>(
    "/influencer/admin/finance/export/pending-clearance",
    {
      params,
    }
  );

  return res.data;
};

export const exportBrandPendingPayments = async (
  params?: ExportBrandPendingQuery
): Promise<ExportResponse> => {
  const res = await serviceClient.get<ExportResponse>(
    "/influencer/admin/finance/export/brand-payment-pending",
    {
      params,
    }
  );

  return res.data;
};