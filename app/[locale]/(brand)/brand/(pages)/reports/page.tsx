"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Search,
  ChevronRight,
  Clock3,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

type ReportStatus = "pending" | "resolved";
type ActiveFilter = ReportStatus | null;

type ReportItem = {
  id: string;
  campaignName: string;
  milestone: string;
  timeAgo: string;
  message: string;
  brandName: string;
  date: string;
  status: ReportStatus;
};

const PAGE_SIZE = 4;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function countByStatus(items: ReportItem[]) {
  const base: Record<ReportStatus, number> = {
    pending: 0,
    resolved: 0,
  };
  for (const r of items) base[r.status] += 1;
  return base;
}

const ReportPage = () => {
  // Dummy data
  const dummyReports: ReportItem[] = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => {
        const status: ReportStatus = i % 2 === 0 ? "resolved" : "pending";

        return {
          id: `rep_${i + 1}`,
          campaignName: "Summer Fashion Campaign",
          milestone:
            status === "resolved"
              ? "Milestone 1"
              : "Milestone 2",
          timeAgo: "2 Hours Ago",
          message: "Audio Quality Does Not Meet Requirements",
          brandName: "StyleCo",
          date: "Dec 15, 2025",
          status,
        };
      }),
    []
  );

  const STATUS_UI = useMemo(
    () => ({
      pending: {
        label: "Pending",
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
        label: "Resolved",
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
    []
  );

  const [activeStatus, setActiveStatus] = useState<ActiveFilter>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => countByStatus(dummyReports), [dummyReports]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return dummyReports
      .filter((r) => (activeStatus ? r.status === activeStatus : true))
      .filter((r) => {
        if (!q) return true;
        return (
          r.campaignName.toLowerCase().includes(q) ||
          r.brandName.toLowerCase().includes(q) ||
          r.milestone.toLowerCase().includes(q)
        );
      });
  }, [activeStatus, query, dummyReports]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    [filtered.length]
  );

  const currentPage = clamp(page, 1, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

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
    setPage(1);
  }, []);

  const handleNext = useCallback(() => {
    setPage((p) => clamp(p + 1, 1, totalPages));
  }, [totalPages]);

  return (
    <section className="w-full p-4 bg-white rounded-lg">
      <div className="w-full h-full">
        <div>
          <h1 className="text-sm font-semibold text-[#2F3B2E]">
            Report Log
          </h1>
          <p className="mt-1 text-sm text-[#A0A4AA]">
            View reports on your works, manage and resolve them
          </p>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["pending", "resolved"] as ReportStatus[]).map((s) => {
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
                  {counts[s]}
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
              placeholder="Search By Campaign Name"
              className="w-full h-10 rounded-md border border-[#E6E7EA] bg-white pl-9 pr-3 text-sm text-[#2F343A] placeholder:text-[#B9BEC6] outline-none focus:border-[#C9CED6]"
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-4 space-y-4">
          {paginated.length === 0 ? (
            <div className="rounded-lg border border-[#E6E7EA] bg-white px-4 py-10 text-center">
              <p className="text-sm text-[#6B7280]">No reports found</p>
            </div>
          ) : (
            paginated.map((item) => {
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
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span className={ui.accentText}>•</span>
                          <span className={ui.accentText}>
                            {item.brandName}
                          </span>
                        </div>
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
              Show All
            </button>
          )}

          <div className="flex items-center gap-2 text-sm text-[#8C919A]">
            <span>Page</span>
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#E6E7EA] bg-[#F2EED6] px-2 text-[#2F3B2E]">
              {currentPage}
            </span>
            <span>Of</span>
            <span>{totalPages}</span>
          </div>

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
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportPage;