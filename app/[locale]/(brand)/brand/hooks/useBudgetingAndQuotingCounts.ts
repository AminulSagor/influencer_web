"use client";

import { useMemo } from "react";
import { useMyCampaignsByStatus } from "@/app/[locale]/(brand)/brand/hooks/useMyCampaignsByStatus";

export function useBudgetingAndQuotingCounts(enabled: boolean) {
  const allResult = useMyCampaignsByStatus(enabled ? "quoting" : "");
  const budgetPendingResult = useMyCampaignsByStatus(
    enabled ? "budget_pending" : "",
  );
  const quotationReceivedResult = useMyCampaignsByStatus(
    enabled ? "quotation_received" : "",
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