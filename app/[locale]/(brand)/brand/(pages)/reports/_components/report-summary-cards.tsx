"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ReportStatusFilter } from "@/types/client/reports/reports";

type Props = {
  activeStatus: ReportStatusFilter;
  pendingCount: number;
  resolvedCount: number;
  onSelectStatus: (value: ReportStatusFilter) => void;
};

const STATUS_UI = {
  Pending: {
    labelKey: "pending",
    activeBg: "bg-[#FF6600]",
    softBg: "bg-[#F2EAD1]",
    softBorder: "border-[#E6D8A7]",
    accentText: "text-[#FF6600]",
  },
  Resolved: {
    labelKey: "resolved",
    activeBg: "bg-[#7A9B57]",
    softBg: "bg-[#F4FEF7]",
    softBorder: "border-[#CFE6D2]",
    accentText: "text-[#7A9B57]",
  },
} as const;

export default function ReportSummaryCards({
  activeStatus,
  pendingCount,
  resolvedCount,
  onSelectStatus,
}: Props) {
  const t = useTranslations("brand.reports");

  const cards = [
    { key: "Pending" as const, count: pendingCount },
    { key: "Resolved" as const, count: resolvedCount },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map(({ key, count }) => {
        const ui = STATUS_UI[key];
        const isActive = activeStatus === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectStatus(key)}
            className={[
              "w-full rounded-lg border px-5 py-4 text-left transition min-h-[74px]",
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
              {t(ui.labelKey)}
            </p>
            <p
              className={[
                "mt-1 text-2xl font-semibold leading-none",
                isActive ? "text-white" : ui.accentText,
              ].join(" ")}
            >
              {count}
            </p>
          </button>
        );
      })}
    </div>
  );
}