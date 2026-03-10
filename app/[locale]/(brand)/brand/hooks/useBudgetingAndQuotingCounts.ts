"use client";

import { useMemo } from "react";
import { useMyCampaignsByStatus } from "@/app/[locale]/(brand)/brand/hooks/useMyCampaignsByStatus";

export function useBudgetingAndQuotingCounts(enabled: boolean) {
  const page = 1;
  const limit = 1;

  const allResult = useMyCampaignsByStatus(
    enabled ? "quoting" : "",
    page,
    limit,
  );

  const budgetPendingResult = useMyCampaignsByStatus(
    enabled ? "budget_pending" : "",
    page,
    limit,
  );

  const quotationReceivedResult = useMyCampaignsByStatus(
    enabled ? "quotation_received" : "",
    page,
    limit,
  );

  return useMemo(
    () => ({
      all: allResult.meta.total || allResult.data.length,
      budgetPending:
        budgetPendingResult.meta.total || budgetPendingResult.data.length,
      quotationReceived:
        quotationReceivedResult.meta.total ||
        quotationReceivedResult.data.length,
      loading:
        allResult.loading ||
        budgetPendingResult.loading ||
        quotationReceivedResult.loading,
    }),
    [
      allResult.data.length,
      allResult.loading,
      allResult.meta.total,
      budgetPendingResult.data.length,
      budgetPendingResult.loading,
      budgetPendingResult.meta.total,
      quotationReceivedResult.data.length,
      quotationReceivedResult.loading,
      quotationReceivedResult.meta.total,
    ],
  );
}