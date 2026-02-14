"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import { apiClient } from "@/api/base/axios_client";

type Meta = { total: number; page: number; limit: number };

type ApiResponse = {
  success: boolean;
  data: CampaignSummary[];
  meta: Meta;
};

export function useMyCampaignsByStatus(status: string) {
  // Remove useToken hook - no token needed

  const [data, setData] = useState<CampaignSummary[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified key - only depends on status now
  const key = useMemo(() => `${status}`, [status]);

  useEffect(() => {
    // Remove token check - cookies handle authentication
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use apiClient instead of axiosInstance (make sure it has withCredentials: true)
        // Remove Authorization header - cookies will be sent automatically
        const res = await apiClient.get<ApiResponse>(
          `/campaign/my-campaigns?status=${encodeURIComponent(status)}`
          // No headers needed
        );

        if (cancelled) return;

        setData(res.data?.data ?? []);
        setMeta(res.data?.meta ?? { total: 0, page: 1, limit: 10 });
      } catch (error: unknown) {
        if (cancelled) return;
        if (axios.isAxiosError(error)) {
          // Handle 401 specifically
          if (error.response?.status === 401) {
            setError("Session expired. Please login again.");
            // Optionally redirect to login
            // const locale = document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] || 'en';
            // window.location.href = `/${locale}/login`;
          } else {
            setError(
              error?.response?.data?.message ?? "Failed to load campaigns"
            );
          }
        } else {
          setError("An unexpected error occurred");
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
  }, [key]); // Only depends on status now

  return { data, meta, loading, error };
}