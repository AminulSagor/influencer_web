"use client";

import { useEffect, useState } from "react";
import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import type { PaginationMeta } from "@/types/service-response";
import { getCampaignByStatus } from "@/service/client/campaigns/campaigns-by-status";

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
) {
  const [data, setData] = useState<CampaignSummary[]>([]);
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
  }, [status, page, limit]);

  return { data, meta, loading, error };
}
