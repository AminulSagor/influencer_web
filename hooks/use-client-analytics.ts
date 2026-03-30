"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientAnalytics } from "@/service/client/analytics/get-client-analytics";
import {
  AnalyticsSortOrder,
  ClientAnalyticsData,
} from "@/types/client/analytics/analytics";
import { PaginationMeta } from "@/types/service-response";
import { useDebounce } from "@/hooks/use-debounce";

const DEFAULT_LIMIT = 10;

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: DEFAULT_LIMIT,
  totalPages: 1,
};

export function useClientAnalytics() {
  const [data, setData] = useState<ClientAnalyticsData | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrderState] =
    useState<AnalyticsSortOrder>("high_to_low");

  const debouncedSearch = useDebounce(search, 500);

  const fetchAnalytics = useCallback(async () => {
    const result = await getClientAnalytics({
      page,
      limit: DEFAULT_LIMIT,
      search: debouncedSearch,
      sortOrder,
    });

    if (result.error) {
      setError(result.error);
      setData(null);
      setMeta(defaultMeta);
      setLoading(false);
      setIsFetching(false);
      return;
    }

    setData(result.data);
    setMeta(result.meta ?? defaultMeta);
    setError(null);
    setLoading(false);
    setIsFetching(false);
  }, [page, debouncedSearch, sortOrder]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const result = await getClientAnalytics({
        page,
        limit: DEFAULT_LIMIT,
        search: debouncedSearch,
        sortOrder,
      });

      if (!active) return;

      if (result.error) {
        setError(result.error);
        setData(null);
        setMeta(defaultMeta);
        setLoading(false);
        setIsFetching(false);
        return;
      }

      setData(result.data);
      setMeta(result.meta ?? defaultMeta);
      setError(null);
      setLoading(false);
      setIsFetching(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [page, debouncedSearch, sortOrder]);

  const setSearch = useCallback((value: string) => {
    setIsFetching(true);
    setSearchState(value);
    setPage(1);
  }, []);

  const setSortOrder = useCallback((value: AnalyticsSortOrder) => {
    setIsFetching(true);
    setSortOrderState(value);
    setPage(1);
  }, []);

  const goNext = useCallback(() => {
    setPage((prev) => {
      const totalPages = meta.totalPages ?? 1;
      if (prev < totalPages) {
        setIsFetching(true);
        return prev + 1;
      }
      return prev;
    });
  }, [meta.totalPages]);

  const goPrev = useCallback(() => {
    setPage((prev) => {
      if (prev > 1) {
        setIsFetching(true);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const refetch = useCallback(async () => {
    setIsFetching(true);
    await fetchAnalytics();
  }, [fetchAnalytics]);

  const canGoPrev = page > 1;
  const canGoNext = page < (meta.totalPages ?? 1);

  const actions = useMemo(
    () => ({
      setSearch,
      setSortOrder,
      goNext,
      goPrev,
      setPage,
      refetch,
    }),
    [setSearch, setSortOrder, goNext, goPrev, refetch],
  );

  return {
    data,
    meta,
    loading,
    isFetching,
    error,
    search,
    page,
    sortOrder,
    canGoPrev,
    canGoNext,
    ...actions,
  };
}
