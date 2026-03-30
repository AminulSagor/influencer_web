"use client";

import * as React from "react";
import { campaignBidsService } from "@/service/client/campaigns/campaign-bids.service";
import { CampaignBid } from "@/types/client/campaigns/campaign-bids.types";
import { mapRawCampaignBidToCampaignBid } from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/agency-quotations/_components/agency-bids.mapper";

type Params = {
  campaignId?: string;
  baseBudget?: string | number | null;
  enabled?: boolean;
};

type Result = {
  items: CampaignBid[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function useCampaignBids({
  campaignId,
  baseBudget,
  enabled = true,
}: Params): Result {
  const [items, setItems] = React.useState<CampaignBid[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback(async () => {
    if (!enabled || !campaignId) {
      setItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await campaignBidsService.getCampaignBids(campaignId);
      const rawItems = Array.isArray(res.data) ? res.data : [];
      const mapped = rawItems.map((item) =>
        mapRawCampaignBidToCampaignBid(item, toNumber(baseBudget)),
      );

      setItems(mapped);
    } catch {
      setItems([]);
      setError("Failed to load agency quotations.");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, baseBudget, enabled]);

  React.useEffect(() => {
    run();
  }, [run]);

  return {
    items,
    isLoading,
    error,
    refetch: run,
  };
}
