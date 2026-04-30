"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  ChevronRight,
  Flag,
  Clock3,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { getReportLogs } from "@/service/influencer/report_logs";
import { ReportLogItem } from "@/types/influencer/report_logs";

import { Skeleton } from "@/components/ui/skeleton";

type ReportStatus = "flagged" | "pending" | "resolved";
type ActiveFilter = ReportStatus | null;

type ReportItem = {
  id: string;
  campaignName: string;
  milestone: string;
  timeAgo: string;
  message: string;
  date: string;
  status: ReportStatus;
};

const REPORT_STATUSES: ReportStatus[] = ["flagged", "pending", "resolved"];

function normalizeReportStatus(status?: string | null): ReportStatus {
  const normalized = status?.trim().toLowerCase();

  if (
    normalized === "flagged" ||
    normalized === "pending" ||
    normalized === "resolved"
  ) {
    return normalized;
  }

  if (normalized === "approved" || normalized === "approve") {
    return "resolved";
  }

  if (normalized === "declined" || normalized === "decline") {
    return "flagged";
  }

  return "pending";
}

function getSafeDate(iso?: string | null): string {
  const parsed = iso ? new Date(iso) : new Date();
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

function formatDate(iso?: string | null): string {
  return new Date(getSafeDate(iso)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(iso?: string | null): string {
  const diff = Math.max(0, Date.now() - new Date(getSafeDate(iso)).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} Min${mins !== 1 ? "s" : ""} Ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} Hour${hrs !== 1 ? "s" : ""} Ago`;
  const days = Math.floor(hrs / 24);
  return `${days} Day${days !== 1 ? "s" : ""} Ago`;
}

function mapToReportItem(item: ReportLogItem, index: number): ReportItem {
  const rawStatus = item.logStatus ?? item.submissionStatus;

  return {
    id: item.reportId || `${item.campaignName || "report"}-${item.date || index}`,
    campaignName: item.campaignName || "Untitled Campaign",
    milestone: item.milestoneTitle || "Untitled Milestone",
    timeAgo: timeAgo(item.date),
    message: item.feedback || "No feedback provided.",
    date: formatDate(item.date),
    status: normalizeReportStatus(rawStatus),
  };
}

const PAGE_SIZE = 4;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const ReportPage = () => {
  const t = useTranslations("influencer.reports");

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<ReportStatus, number>>({
    flagged: 0,
    pending: 0,
    resolved: 0,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<ActiveFilter>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [query]);

  const fetchStatusCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        REPORT_STATUSES.map(async (status) => {
          const res = await getReportLogs({
            status,
            page: 1,
            limit: 1,
            search: debouncedQuery || undefined,
          });

          return [status, res.meta?.total ?? 0] as const;
        }),
      );

      setStatusCounts({
        flagged: results.find(([status]) => status === "flagged")?.[1] ?? 0,
        pending: results.find(([status]) => status === "pending")?.[1] ?? 0,
        resolved: results.find(([status]) => status === "resolved")?.[1] ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch report status counts:", err);
      setStatusCounts({ flagged: 0, pending: 0, resolved: 0 });
    }
  }, [debouncedQuery]);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getReportLogs({
        page,
        limit: PAGE_SIZE,
        status: activeStatus || undefined,
        search: debouncedQuery || undefined,
      });
      const reportLogs = Array.isArray(res.data) ? res.data : [];
      setReports(reportLogs.map(mapToReportItem));
      setTotalPages(Math.max(1, res.meta?.totalPages ?? 1));
    } catch (err) {
      console.error("Failed to fetch report logs:", err);
      setError("Failed to load report logs.");
    } finally {
      setIsLoading(false);
    }
  }, [activeStatus, debouncedQuery, page]);

  useEffect(() => {
    fetchStatusCounts();
  }, [fetchStatusCounts]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const STATUS_UI = useMemo(
    () => ({
      flagged: {
        label: t("Flagged"),
        activeBg: "bg-[#C62828]",
        softBg: "bg-[#FDEBEE]",
        softBorder: "border-[#F2BFC6]",
        listBg: "bg-[#FDEBEE]",
        listBorder: "border-[#F2D7DB]",
        badgeBg: "bg-[#C62828]",
        badgeIcon: <Flag className="h-4 w-4 text-white" />,
        accentText: "text-[#C62828]",
      },
      pending: {
        label: t("Pending"),
        activeBg: "bg-[#FF6600]",
        softBg: "bg-[#F2EAD1]",
        softBorder: "border-[#E6D8A7]",
        listBg: "bg-[#F2EED6]",
        listBorder: "border-[#E6E0B8]",
        badgeBg: "bg-[#FF6600]",
        badgeIcon: <Clock3 className="h-4 w-4 text-white" />,
        accentText: "text-[#FF6600]",
      },
      resolved: {
        label: t("Resolved"),
        activeBg: "bg-[#7A9B57]",
        softBg: "bg-[#F4FEF7]",
        softBorder: "border-[#CFE6D2]",
        listBg: "bg-[#F3FFF6]",
        listBorder: "border-[#D7ECDD]",
        badgeBg: "bg-[#7A9B57]",
        badgeIcon: <CheckCircle2 className="h-4 w-4 text-white" />,
        accentText: "text-[#7A9B57]",
      },
    }),
    [t]
  );

  const currentPage = clamp(page, 1, totalPages);

  const handleSelectStatus = useCallback((s: ReportStatus) => {
    setActiveStatus(s);
    setPage(1);
  }, []);

  const handleResetAll = useCallback(() => {
    setActiveStatus(null);
    setPage(1);
  }, []);

  const handleSearch = useCallback((v: string) => {
    setQuery(v);
  }, []);

  const handlePrev = useCallback(() => {
    setPage((p) => clamp(p - 1, 1, totalPages));
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setPage((p) => clamp(p + 1, 1, totalPages));
  }, [totalPages]);

  if (isLoading) {
    return (
      <section className="w-full p-4 bg-white rounded-lg">
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[74px] rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-[260px] mt-5" />
          <div className="space-y-4 mt-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[180px] rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full p-4 bg-white rounded-lg">
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={() => {
              fetchStatusCounts();
              fetchReports();
            }}
            className="h-8 rounded-md px-4 text-sm font-semibold bg-[#6E8E59] text-white hover:brightness-95"
          >
            {t("Retry")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full p-4 bg-white rounded-lg">
      <div className="w-full h-full">
        <div>
          <h1 className="text-sm font-semibold text-[#2F3B2E]">
            {t("Report Log")}
          </h1>
          <p className="mt-1 text-sm text-[#A0A4AA]">
            {t("View reports on your works, manage and resolve them")}
          </p>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {REPORT_STATUSES.map((s) => {
            const ui = STATUS_UI[s];
            const isActive = activeStatus === s;

            return (
              <button
                key={s}
                type="button"
                onClick={() => handleSelectStatus(s)}
                className={[
                  "w-full text-left rounded-lg border px-5 py-4 transition min-h-[74px]",
                  isActive
                    ? `${ui.activeBg} border-transparent`
                    : `${ui.softBg} ${ui.softBorder} hover:shadow-sm`,
                ].join(" ")}
              >
                <p
                  className={[
                    "text-sm font-semibold",
                    isActive ? "text-white" : "text-[#2F3B2E]",
                  ].join(" ")}
                >
                  {ui.label}
                </p>
                <p
                  className={[
                    "mt-1 text-2xl font-semibold leading-none",
                    isActive ? "text-white" : ui.accentText,
                  ].join(" ")}
                >
                  {statusCounts[s]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mt-5">
          <div className="relative w-full max-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B9BEC6]" />
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t("Search By Campaign Name")}
              className="w-full h-10 rounded-md border border-[#E6E7EA] bg-white pl-9 pr-3 text-sm text-[#2F343A] placeholder:text-[#B9BEC6] outline-none focus:border-[#C9CED6]"
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-4 space-y-4">
          {reports.length === 0 ? (
            <div className="rounded-lg border border-[#E6E7EA] bg-white px-4 py-10 text-center">
              <p className="text-sm text-[#6B7280]">{t("No reports found")}</p>
            </div>
          ) : (
            reports.map((item) => {
              const ui = STATUS_UI[item.status];
              return (
                <div
                  key={item.id}
                  className={[
                    "rounded-lg border overflow-hidden",
                    ui.listBg,
                    ui.listBorder,
                  ].join(" ")}
                >
                  <div className="px-4 py-4">
                    <p className="text-sm font-semibold text-[#2F3B2E]">
                      {item.campaignName}
                    </p>
                    <p className="text-sm font-semibold text-[#7BA06C]">
                      {item.milestone}
                    </p>
                    <p className="text-sm text-[#A0A4AA]">{item.timeAgo}</p>

                    <div className="mt-3 rounded-md border border-[#E9EBEF] bg-white px-3 py-3">
                      <p className="text-sm text-[#6B7280]">{item.message}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays
                            className={["h-4 w-4", ui.accentText].join(" ")}
                          />
                          <span className={ui.accentText}>{item.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={[
                            "inline-flex items-center gap-2 rounded-full px-4 py-2",
                            "text-sm font-semibold text-white",
                            ui.badgeBg,
                          ].join(" ")}
                        >
                          {ui.badgeIcon}
                          {ui.label}
                        </span>

                        <ChevronRight className="h-5 w-5 text-[#2F3B2E]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-end gap-3">
          {activeStatus !== null && (
            <button
              type="button"
              onClick={handleResetAll}
              className="h-8 rounded-md px-4 text-sm font-semibold border border-[#E6E7EA] bg-white text-[#2F3B2E] hover:bg-[#FAFAFB]"
            >
              {t("Show All")}
            </button>
          )}

          <div className="flex items-center gap-2 text-sm text-[#8C919A]">
            <span>{t("Page")}</span>
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#E6E7EA] bg-[#F2EED6] px-2 text-[#2F3B2E]">
              {currentPage}
            </span>
            <span>{t("Of")}</span>
            <span>{totalPages}</span>
          </div>

          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className={[
              "h-8 rounded-md px-5 text-sm font-semibold transition",
              currentPage > 1
                ? "bg-[#6E8E59] text-white hover:brightness-95"
                : "bg-[#D7DDD3] text-white cursor-not-allowed",
            ].join(" ")}
          >
            {t("Previous")}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={[
              "h-8 rounded-md px-5 text-sm font-semibold transition",
              currentPage < totalPages
                ? "bg-[#6E8E59] text-white hover:brightness-95"
                : "bg-[#D7DDD3] text-white cursor-not-allowed",
            ].join(" ")}
          >
            {t("Next")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportPage;
