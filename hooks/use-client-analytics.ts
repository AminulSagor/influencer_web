"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientAnalytics } from "@/service/client/analytics/get-client-analytics";
import type {
  AnalyticsSortOrder,
  ClientAnalyticsData,
} from "@/types/client/analytics/analytics";
import type { PaginationMeta } from "@/types/service-response";

const DEFAULT_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 500;

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  totalPages: 1,
};

export function useClientAnalytics() {
  const [data, setData] = useState<ClientAnalyticsData | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrderInput] =
    useState<AnalyticsSortOrder>("high_to_low");
  const [page, setPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const totalPages = Math.max(meta.totalPages ?? 1, 1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    let isActive = true;

    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);

      const response = await getClientAnalytics({
        page,
        limit,
        search: debouncedSearch,
        sortOrder,
      });

      if (!isActive) return;

      if (response.error) {
        setError(response.error);
      }

      setData(response.data);
      setMeta(response.meta ?? DEFAULT_META);
      setLoading(false);
    };

    loadAnalytics();

    return () => {
      isActive = false;
    };
  }, [debouncedSearch, limit, page, sortOrder]);

  const setSearch = useCallback((value: string) => {
    setSearchInput(value);
    setPage(1);
  }, []);

  const setSortOrder = useCallback((value: AnalyticsSortOrder) => {
    setSortOrderInput(value);
    setPage(1);
  }, []);

  const goToPage = useCallback(
    (nextPage: number) => {
      const normalizedPage = Math.min(
        Math.max(Math.floor(nextPage), 1),
        totalPages,
      );

      setPage(normalizedPage);
    },
    [totalPages],
  );

  const goNext = useCallback(() => {
    setPage((currentPage) => Math.min(currentPage + 1, totalPages));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }, []);

  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;

  return useMemo(
    () => ({
      data,
      meta,
      loading,
      error,
      search,
      sortOrder,
      page,
      canGoNext,
      canGoPrev,
      setSearch,
      setSortOrder,
      goNext,
      goPrev,
      goToPage,
    }),
    [
      canGoNext,
      canGoPrev,
      data,
      error,
      goNext,
      goPrev,
      goToPage,
      loading,
      meta,
      page,
      search,
      setSearch,
      setSortOrder,
      sortOrder,
    ],
  );
}
