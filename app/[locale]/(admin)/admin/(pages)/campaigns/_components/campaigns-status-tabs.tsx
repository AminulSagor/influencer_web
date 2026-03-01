"use client";

import { cn } from "@/lib/utils";
import type { CampaignUI } from "@/types/admin/campaign/campaign_ui_type";
import type { CampaignTabKey } from "@/types/admin/campaign/campaign_filter_types";
import { TAB_LABEL, TAB_TO_BACKEND_STATUSES } from "@/utils/admin/campaign/campaign_status_tab_util";

const ORDER: CampaignTabKey[] = [
  "all",
  "needs-quote",
  "active",
  "pending-invitation",
  "completed",
  "paid",
  "canceled",
];

export default function CampaignsStatusTabs({
  items,
  value,
  onChange,
}: {
  items: CampaignUI[];
  value: CampaignTabKey;
  onChange: (v: CampaignTabKey) => void;
}) {
  const countFor = (key: CampaignTabKey) => {
    if (key === "all") return items.length;
    const allowed = TAB_TO_BACKEND_STATUSES[key] || [];
    return items.filter((c) => allowed.includes(c.status)).length;
  };

  return (
    <div className="flex flex-wrap items-center gap-7">
      {ORDER.map((key) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              // ✅ DEBUG: shows allowed statuses for clicked tab
              console.log("TAB CLICK:", key, "allowed:", TAB_TO_BACKEND_STATUSES[key]);
              onChange(key);
            }}
            className={cn(
              "text-sm font-semibold transition",
              active
                ? "rounded-full bg-light-green px-5 py-2 text-white shadow-sm"
                : "text-black/80 hover:text-black"
            )}
          >
            {TAB_LABEL[key]}
            <span className={cn("ml-2 text-xs", active ? "text-white/90" : "text-black/50")}>
              {countFor(key)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
