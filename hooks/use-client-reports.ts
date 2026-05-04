"use client";

import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { getClientReports } from "@/service/client/reports/get-client-reports";
import {
  ClientReportItem,
  ReportStatusFilter,
} from "@/types/client/reports/reports";
import { PaginationMeta } from "@/types/service-response";

const DEFAULT_LIMIT = 10;

const defaultMeta: PaginationMeta = {
  total: 0,
  page: 1,
  limit: DEFAULT_LIMIT,
  totalPages: 1,
};

export function useClientReports() {
  const [items, setItems] = useState<ClientReportItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(defaultMeta);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({ pending: 0, resolved: 0 });

  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilterState] =
    useState<ReportStatusFilter>("all");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const result = await getClientReports({
        page,
        limit: DEFAULT_LIMIT,
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });

      if (!active) return;

      if (result.error) {
        setItems([]);
        setMeta(defaultMeta);
        setError(result.error);
        setLoading(false);
        setIsFetching(false);
        return;
      }

      setItems(result.data ?? []);
      setMeta(result.meta ?? defaultMeta);
      setError(null);
      setLoading(false);
      setIsFetching(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const [pendingResult, resolvedResult] = await Promise.all([
          getClientReports({
            page: 1,
            limit: 1,
            search: debouncedSearch || undefined,
            status: "Pending",
          }),
          getClientReports({
            page: 1,
            limit: 1,
            search: debouncedSearch || undefined,
            status: "Resolved",
          }),
        ]);

        if (!active) return;

        setCounts({
          pending: pendingResult.meta?.total ?? 0,
          resolved: resolvedResult.meta?.total ?? 0,
        });
      } catch (err) {
        if (!active) return;
        setCounts({ pending: 0, resolved: 0 });
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  const setSearch = useCallback((value: string) => {
    setIsFetching(true);
    setSearchState(value);
    setPage(1);
  }, []);

  const setStatusFilter = useCallback((value: ReportStatusFilter) => {
    setIsFetching(true);
    setStatusFilterState((previous) =>
      previous === value && value !== "all" ? "all" : value,
    );
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

  const canGoPrev = page > 1;
  const canGoNext = page < (meta.totalPages ?? 1);

  return {
    items,
    meta,
    counts,
    loading,
    isFetching,
    error,
    search,
    page,
    statusFilter,
    canGoPrev,
    canGoNext,
    setSearch,
    setStatusFilter,
    goNext,
    goPrev,
  };
}