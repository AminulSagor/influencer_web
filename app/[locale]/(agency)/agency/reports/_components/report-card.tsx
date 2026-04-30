"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { FaCheckCircle, FaClock, FaFlag } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getReports } from "@/service/agency/reports";
import type {
  ReportItem,
  ReportsMeta,
  ReportStatus,
} from "@/types/agency/reports";

const LIMIT = 4;

const defaultMeta: ReportsMeta = {
  total: 0,
  page: 1,
  limit: LIMIT,
  totalPages: 1,
};

const STATUS_CONFIG: Record<
  ReportStatus,
  {
    label: string;
    Icon: React.ElementType;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    cardBg: string;
    cardBorder: string;
    summaryBg: string;
    summaryBorder: string;
    summaryText: string;
    summaryActiveBg: string;
    summaryActiveText: string;
    summaryActiveRing: string;
  }
> = {
  flagged: {
    label: "Flagged",
    Icon: FaFlag,
    badgeBg: "bg-rose-600",
    badgeBorder: "border-rose-600",
    badgeText: "text-white",
    cardBg: "bg-rose-100",
    cardBorder: "border-rose-300",
    summaryBg: "bg-rose-100",
    summaryBorder: "border-rose-300",
    summaryText: "text-rose-600",
    summaryActiveBg: "bg-rose-600",
    summaryActiveText: "text-white",
    summaryActiveRing: "ring-rose-300",
  },
  pending: {
    label: "Pending",
    Icon: FaClock,
    badgeBg: "bg-orange",
    badgeBorder: "border-orange",
    badgeText: "text-white",
    cardBg: "bg-yellow-100/40",
    cardBorder: "border-yellow-300",
    summaryBg: "bg-yellow-100/40",
    summaryBorder: "border-yellow-300",
    summaryText: "text-orange",
    summaryActiveBg: "bg-orange",
    summaryActiveText: "text-white",
    summaryActiveRing: "ring-orange/30",
  },
  resolved: {
    label: "Resolved",
    Icon: FaCheckCircle,
    badgeBg: "bg-[#7A9B57]",
    badgeBorder: "border-[#7A9B57]",
    badgeText: "text-white",
    cardBg: "bg-[#EEF7F0]",
    cardBorder: "border-[#9BC27B]",
    summaryBg: "bg-[#EEF7F0]",
    summaryBorder: "border-[#9BC27B]",
    summaryText: "text-[#7A9B57]",
    summaryActiveBg: "bg-[#7A9B57]",
    summaryActiveText: "text-white",
    summaryActiveRing: "ring-[#7A9B57]/30",
  },
};

const normalizeReportStatus = (status?: string): ReportStatus => {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (normalized === "flagged") return "flagged";
  if (normalized === "resolved") return "resolved";
  return "pending";
};

const ReportCard = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [meta, setMeta] = useState<ReportsMeta>(defaultMeta);
  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [activeFilter, setActiveFilter] = useState<ReportStatus | null>(null);

  const [flaggedCount, setFlaggedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  const resetToDefaultView = () => {
    setActiveFilter(null);
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  };

  useEffect(() => {
    const handleReset = () => {
      resetToDefaultView();
    };

    window.addEventListener("reports-reset", handleReset);

    return () => {
      window.removeEventListener("reports-reset", handleReset);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        setIsLoading(true);

        const response = await getReports({
          page,
          limit: LIMIT,
          search: debouncedSearch,
          status: activeFilter ?? undefined,
        });

        if (!isMounted) return;

        if (response.success) {
          setReports(response.data);
          setMeta({
            total: response.meta.total,
            page: response.meta.page,
            limit: LIMIT,
            totalPages: response.meta.totalPages,
          });
        } else {
          setReports([]);
          setMeta(defaultMeta);
        }
      } catch (error) {
        console.error("Failed to load reports:", error);

        if (!isMounted) return;

        setReports([]);
        setMeta(defaultMeta);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [page, debouncedSearch, activeFilter]);

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      try {
        const [flaggedResponse, pendingResponse, resolvedResponse] =
          await Promise.all([
            getReports({ page: 1, limit: 1, status: "flagged" }),
            getReports({ page: 1, limit: 1, status: "pending" }),
            getReports({ page: 1, limit: 1, status: "resolved" }),
          ]);

        if (!isMounted) return;

        setFlaggedCount(flaggedResponse.meta.total ?? 0);
        setPendingCount(pendingResponse.meta.total ?? 0);
        setResolvedCount(resolvedResponse.meta.total ?? 0);
      } catch (error) {
        console.error("Failed to load report counts:", error);

        if (!isMounted) return;

        setFlaggedCount(0);
        setPendingCount(0);
        setResolvedCount(0);
      }
    };

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const reportsSummary = useMemo(
    () => [
      { id: 1, tag: "flagged" as ReportStatus, count: flaggedCount },
      { id: 2, tag: "pending" as ReportStatus, count: pendingCount },
      { id: 3, tag: "resolved" as ReportStatus, count: resolvedCount },
    ],
    [flaggedCount, pendingCount, resolvedCount]
  );

  const handleFilterClick = (status: ReportStatus) => {
    setPage(1);
    setActiveFilter((previous) => (previous === status ? null : status));
  };

  const handlePageInputChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setPageInput(numericValue);

    if (!numericValue) return;

    const nextPage = Math.min(
      Math.max(Number(numericValue), 1),
      Math.max(meta.totalPages, 1)
    );

    setPageInput(String(nextPage));
    setPage(nextPage);
  };

  const handlePrevious = () => {
    if (page <= 1 || isLoading) return;
    setPage((previous) => previous - 1);
  };

  const handleNext = () => {
    if (page >= meta.totalPages || isLoading) return;
    setPage((previous) => previous + 1);
  };

  const isPreviousDisabled = page <= 1 || isLoading;
  const isNextDisabled = page >= meta.totalPages || isLoading;

  return (
    <Card>
      <CardHeader className="space-y-4 border-b">
        <div className="space-y-2">
          <CardTitle>Report Log</CardTitle>
          <CardDescription>
            View reports on your works, manage and resolve them
          </CardDescription>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          {reportsSummary.map((report) => {
            const config = STATUS_CONFIG[report.tag];
            const isActive = activeFilter === report.tag;

            return (
              <button
                key={report.id}
                type="button"
                onClick={() => handleFilterClick(report.tag)}
                className={cn(
                  "flex-1 rounded-lg border p-3 text-left transition-colors duration-200",
                  config.summaryBg,
                  config.summaryBorder,
                  config.summaryText,
                  isActive &&
                  cn(
                    "ring-2 ring-offset-1",
                    config.summaryActiveBg,
                    config.summaryActiveText,
                    config.summaryActiveRing
                  )
                )}
              >
                <h2 className="text-xl">{config.label}</h2>
                <p className="text-2xl font-medium">{report.count}</p>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="relative w-full md:w-[40%]">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            className="pl-10"
            placeholder="Search By Campaign Name"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-gray-500">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed text-sm text-gray-500">
            No reports found
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((item) => {
              const normalizedStatus = normalizeReportStatus(item.status);
              const {
                label,
                Icon,
                badgeBg,
                badgeBorder,
                badgeText,
                cardBg,
                cardBorder,
              } = STATUS_CONFIG[normalizedStatus];

              return (
                <div
                  key={item.reportId}
                  className={cn(
                    "rounded-[20px] border p-6",
                    cardBg,
                    cardBorder
                  )}
                >
                  <div className="space-y-1">
                    <h2 className="text-[20px] font-semibold leading-tight text-Primary md:text-[22px]">
                      {item.campaignName}
                    </h2>

                    <p className="text-[15px] font-medium text-light-green md:text-[16px]">
                      {item.milestoneTitle}
                    </p>

                    <p className="text-sm text-gray-400">
                      Time not available
                    </p>
                  </div>

                  <div className="mt-5 rounded-[18px] border border-gray-200 bg-white px-4 py-6">
                    <p className="text-sm text-gray-500 md:text-base">
                      {item.issueSummary}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2 text-orange">
                      <div className="flex items-center gap-2 text-sm md:text-base">
                        <span>👤</span>
                        <span>Brand name not available</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm md:text-base">
                        <span>🕒</span>
                        <span>Date not available</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm",
                          badgeBg,
                          badgeBorder,
                          badgeText
                        )}
                      >
                        <Icon className="size-4" />
                        {label}
                      </div>

                      <ChevronRight size={14} className="text-gray-600" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2 text-gray-500">
            <span>Page</span>
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={(event) => handlePageInputChange(event.target.value)}
              disabled={isLoading}
              className="h-9 w-16 rounded-2xl border-light-green bg-Secondary px-3 text-center text-Primary"
            />
            <span>Of {meta.totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={isPreviousDisabled}
              className="bg-[#7A9B57] text-white hover:bg-[#6d8e4d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              className="bg-[#7A9B57] text-white hover:bg-[#6d8e4d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
