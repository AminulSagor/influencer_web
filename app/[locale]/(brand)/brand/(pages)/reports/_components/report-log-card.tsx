"use client";

import React from "react";
import {
  Search,
  Clock3,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ClientReportItem } from "@/types/client/reports/reports";
import {
  formatCurrencyBDT,
  formatReportDate,
  getRelativeTimeLabel,
  normalizeReportStatus,
} from "../_utils/report-formatters";

type Props = {
  items: ClientReportItem[];
  totalResults: number;
  page: number;
  totalPages: number;
  search: string;
  loading?: boolean;
  onSearchChange: (value: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
};

const STATUS_UI = {
  pending: {
    labelClass: "text-[#FF6600]",
    listBg: "bg-[#F2EED6]",
    listBorder: "border-[#E6E0B8]",
    badgeBg: "bg-[#FF6600]",
    badgeIcon: <Clock3 className="h-4 w-4 text-white" />,
  },
  resolved: {
    labelClass: "text-[#7A9B57]",
    listBg: "bg-[#F3FFF6]",
    listBorder: "border-[#D7ECDD]",
    badgeBg: "bg-[#7A9B57]",
    badgeIcon: <CheckCircle2 className="h-4 w-4 text-white" />,
  },
} as const;

export default function ReportLogCard({
  items,
  totalResults,
  page,
  totalPages,
  search,
  loading = false,
  onSearchChange,
  onPrevPage,
  onNextPage,
  canGoPrev,
  canGoNext,
}: Props) {
  const t = useTranslations("brand.reports");
  const locale = useLocale();

  return (
    <section className="w-full rounded-lg bg-white p-4">
      <div>
        <h1 className="text-sm font-semibold text-[#2F3B2E]">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-[#A0A4AA]">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-5">
        <div className="relative w-full max-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B9BEC6]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 w-full rounded-md border border-[#E6E7EA] bg-white pl-9 pr-3 text-sm text-[#2F343A] outline-none placeholder:text-[#B9BEC6] focus:border-[#C9CED6]"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#8C919A]">
          {t("showingResults", { total: totalResults })}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {loading ? (
          <div className="rounded-lg border border-[#E6E7EA] bg-white px-4 py-10 text-center">
            <p className="text-sm text-[#6B7280]">{t("loading")}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-[#E6E7EA] bg-white px-4 py-10 text-center">
            <p className="text-sm text-[#6B7280]">{t("noReportsFound")}</p>
          </div>
        ) : (
          items.map((item) => {
            const normalizedStatus = normalizeReportStatus(item.status);
            const ui = STATUS_UI[normalizedStatus];

            return (
              <div
                key={item.reportId}
                className={[
                  "overflow-hidden rounded-lg border",
                  ui.listBg,
                  ui.listBorder,
                ].join(" ")}
              >
                <div className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#2F3B2E]">
                    {item.campaignName}
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#7BA06C]">
                      {item.milestoneTitle}
                    </p>
                    <p className="text-sm font-semibold text-[#7BA06C]">
                      {formatCurrencyBDT(item.amount)}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-[#A0A4AA]">
                    {getRelativeTimeLabel(item.submissionDate, locale)}
                  </p>

                  <div className="mt-3 rounded-md border border-[#E9EBEF] bg-white px-3 py-3">
                    <p className="text-sm text-[#6B7280]">{item.details}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className={`h-4 w-4 ${ui.labelClass}`} />
                        <span className={ui.labelClass}>
                          {formatReportDate(item.submissionDate, locale)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white",
                          ui.badgeBg,
                        ].join(" ")}
                      >
                        {ui.badgeIcon}
                        {t(normalizedStatus)}
                      </span>

                      {/* <button
                        type="button"
                        className="flex items-center gap-1 text-sm font-medium text-[#2F3B2E] hover:opacity-80"
                      >
                        <span>{t("viewDetails")}</span>
                        <ChevronRight className="h-5 w-5" />
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <div className="flex items-center gap-2 text-sm text-[#8C919A]">
          <span>{t("page")}</span>
          <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-[#E6E7EA] bg-[#F2EED6] px-2 text-[#2F3B2E]">
            {page}
          </span>
          <span>{t("of")}</span>
          <span>{totalPages}</span>
        </div>

        <button
          type="button"
          onClick={onPrevPage}
          disabled={!canGoPrev}
          className={[
            "h-8 rounded-md px-5 text-sm font-semibold transition",
            canGoPrev
              ? "border border-[#E6E7EA] bg-white text-[#2F3B2E] hover:bg-[#FAFAFB]"
              : "cursor-not-allowed border border-[#E6E7EA] bg-[#F4F5F6] text-[#A0A4AA]",
          ].join(" ")}
        >
          {t("prev")}
        </button>

        <button
          type="button"
          onClick={onNextPage}
          disabled={!canGoNext}
          className={[
            "h-8 rounded-md px-5 text-sm font-semibold transition",
            canGoNext
              ? "bg-[#6E8E59] text-white hover:brightness-95"
              : "cursor-not-allowed bg-[#D7DDD3] text-white",
          ].join(" ")}
        >
          {t("next")}
        </button>
      </div>
    </section>
  );
}