"use client";

import { useEffect, useState } from "react";
import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import type { PaginationMeta } from "@/types/service-response";
import { getCampaignByStatus } from "@/service/client/campaigns/campaigns-by-status";
import type { CampaignSortValue } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-list-utils";

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 0,
  totalPages: 1,
};

export function useMyCampaignsByStatus(
  status: string,
  page: number,
  limit: number,
  search?: string,
  sort?: CampaignSortValue,
) {
  const [data, setData] = useState<CampaignOverView[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!status.trim()) {
        setData([]);
        setMeta(defaultMeta);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await getCampaignByStatus({
        status,
        page,
        limit,
        search,
        sort,
      });

      if (!mounted) return;

      if (result.error) {
        setData([]);
        setMeta(defaultMeta);
        setError(result.error);
      } else {
        const items = result.data ?? [];
        setData(items);
        setMeta(
          result.meta ?? {
            total: items.length,
            page,
            limit,
            totalPages: Math.ceil(items.length / limit) || 1,
          },
        );
        setError(null);
      }

      setLoading(false);
    };

    run();

    return () => {
      mounted = false;
    };
  }, [status, page, limit, search, sort]);

  return { data, meta, loading, error };
}
