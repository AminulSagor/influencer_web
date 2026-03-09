"use client";

import type { CampaignTabKey } from "../_lib/campaign-status";

type TabItem = {
  key: CampaignTabKey;
  label: string;
};

type Props = {
  items: TabItem[];
  activeTab: CampaignTabKey;
  activeCount: number;
  onChange: (tab: CampaignTabKey) => void;
};

export default function CampaignTabs({
  items,
  activeTab,
  activeCount,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center lg:justify-end">
      {items.map(({ key, label }) => {
        const isActive = activeTab === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={[
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition cursor-pointer",
              isActive
                ? "bg-light-green text-white"
                : "bg-transparent text-Primary hover:bg-Secondary",
            ].join(" ")}
          >
            <span>{label}</span>

            {isActive && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-xs font-medium bg-white text-light-green">
                {activeCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}