"use client";

import * as React from "react";
import { campaignBidsService } from "@/service/client/campaigns/campaign-bids.service";
import {
  CampaignBid,
  CampaignBidsPagination,
  CampaignBidsQueryParams,
} from "@/types/client/campaigns/campaign-bids.types";
import { mapRawCampaignBidToCampaignBid } from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/agency-quotations/_components/agency-bids.mapper";

type Params = CampaignBidsQueryParams & {
  campaignId?: string;
  baseBudget?: string | number | null;
  enabled?: boolean;
};

type Result = {
  items: CampaignBid[];
  pagination: CampaignBidsPagination;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const DEFAULT_PAGINATION: CampaignBidsPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function useCampaignBids({
  campaignId,
  baseBudget,
  enabled = true,
  search,
  minFee,
  maxFee,
  startDate,
  endDate,
  sortBy,
  sortOrder,
  page,
  limit,
}: Params): Result {
  const [items, setItems] = React.useState<CampaignBid[]>([]);
  const [pagination, setPagination] =
    React.useState<CampaignBidsPagination>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback(async () => {
    if (!enabled || !campaignId) {
      setItems([]);
      setPagination(DEFAULT_PAGINATION);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await campaignBidsService.getCampaignBids(campaignId, {
        search,
        minFee,
        maxFee,
        startDate,
        endDate,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      const rawItems = Array.isArray(res.data) ? res.data : [];
      const mapped = rawItems.map((item) =>
        mapRawCampaignBidToCampaignBid(item, toNumber(baseBudget)),
      );
      const nextPagination = res.pagination ?? res.meta ?? DEFAULT_PAGINATION;

      setItems(mapped);
      setPagination({
        total: Number(nextPagination.total ?? mapped.length) || 0,
        page: Number(nextPagination.page ?? page ?? 1) || 1,
        limit: Number(nextPagination.limit ?? limit ?? 10) || 10,
        totalPages:
          Number(nextPagination.totalPages ?? Math.ceil(mapped.length / 10)) ||
          1,
      });
    } catch {
      setItems([]);
      setPagination(DEFAULT_PAGINATION);
      setError("Failed to load agency quotations.");
    } finally {
      setIsLoading(false);
    }
  }, [
    campaignId,
    baseBudget,
    enabled,
    search,
    minFee,
    maxFee,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    page,
    limit,
  ]);

  React.useEffect(() => {
    run();
  }, [run]);

  return {
    items,
    pagination,
    isLoading,
    error,
    refetch: run,
  };
}
