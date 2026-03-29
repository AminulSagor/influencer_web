"use client";

import { cn } from "@/lib/utils";

export type CampaignTabKey =
  | "all"
  | "needs-quote"
  | "active"
  | "pending-invitation"
  | "completed"
  | "canceled";

export const ORDER: CampaignTabKey[] = [
  "all",
  "needs-quote",
  "active",
  "pending-invitation",
  "completed",
  "canceled",
];

const TAB_LABEL: Record<CampaignTabKey, string> = {
  all: "All",
  "needs-quote": "Needs Quote",
  active: "Active",
  "pending-invitation": "Pending Invitation",
  completed: "Completed",
  canceled: "Canceled",
};

export default function CampaignsStatusTabs({
  value,
  onChange,
}: {
  value: CampaignTabKey;
  onChange: (v: CampaignTabKey) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {ORDER.map((key) => {
        const active = value === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              active
                ? "bg-light-green text-white shadow-sm"
                : "text-black/80 hover:text-black"
            )}
          >
            {TAB_LABEL[key]}
          </button>
        );
      })}
    </div>
  );
}