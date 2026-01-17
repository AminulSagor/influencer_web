"use client";

import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import { useToken } from "@/hooks/useGetToken";
import axios from "axios";

type Meta = { total: number; page: number; limit: number };

type ApiResponse = {
  success: boolean;
  data: CampaignSummary[];
  meta: Meta;
};

export function useMyCampaignsByStatus(status: string) {
  const { token } = useToken();

  const [data, setData] = useState<CampaignSummary[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = useMemo(() => `${status}|${token ?? ""}`, [status, token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get<ApiResponse>(
          `/campaign/my-campaigns?status=${encodeURIComponent(status)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (cancelled) return;

        setData(res.data?.data ?? []);
        setMeta(res.data?.meta ?? { total: 0, page: 1, limit: 10 });
      } catch (error: unknown) {
        if (cancelled) return;
        if (axios.isAxiosError(error)) {
          setError(
            error?.response?.data?.message ?? "Failed to load campaigns"
          );
        }
        setData([]);
        setMeta({ total: 0, page: 1, limit: 10 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, meta, loading, error };
}
