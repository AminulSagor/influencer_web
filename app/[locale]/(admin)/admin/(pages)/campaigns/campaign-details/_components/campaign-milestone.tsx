"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  CampaignStatusType,
  InfluencerUI,
  CampaignMilestoneApi,
} from "@/types/admin/campaign/campaign_details_type";
import { splitEqual, money } from "@/utils/admin/campaign/campaign_calculation_util";

interface Props {
  influencers: InfluencerUI[];
  campaignStatus: CampaignStatusType;
  milestones: CampaignMilestoneApi[];

  activeMilestoneId: string | null;
  onSelectMilestone: (id: string) => void;

  // ✅ NEW: offered amount per influencer (calculated)
  offeredAmountPerInfluencer: number;
}

function safeStr(v: any) {
  return String(v ?? "").trim();
}

export default function CampaignMilestone({
  influencers,
  campaignStatus,
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  offeredAmountPerInfluencer,
}: Props) {
  const [editing, setEditing] = useState(false);

  const milestoneCount = (milestones ?? []).length;
  const { per: milestoneAmount } = useMemo(() => {
    return splitEqual(offeredAmountPerInfluencer, milestoneCount);
  }, [offeredAmountPerInfluencer, milestoneCount]);

  const milestoneInputs = useMemo(() => {
    return (milestones ?? []).slice(0, 4).map((m, idx) => ({
      key: safeStr(m?.id) || `m-${idx}`,
      label: `Milestone ${idx + 1}`,
    }));
  }, [milestones]);

  const cards = useMemo(() => {
    const list = [...(milestones ?? [])];
    list.sort((a: any, b: any) => Number(a?.order ?? 0) - Number(b?.order ?? 0));

    return list.map((m: any, idx: number) => {
      const id = safeStr(m?.id) || `m-${idx}`;
      const order = Number(m?.order ?? idx);
      const title = safeStr(m?.contentTitle) || "Milestone Title";
      const subtitle = safeStr(m?.contentQuantity) || "";
      const day = safeStr(m?.dayLabel) || `DAY ${order + 1}`;
      return { id, order, title, subtitle, day };
    });
  }, [milestones]);

  const activeId = safeStr(activeMilestoneId);

  return (
    <div className="rounded-xl border bg-white">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-Primary">Milestone Amounts</div>

          <Button
            type="button"
            size="sm"
            className="h-8 rounded-md px-5 bg-orange text-white hover:brightness-95"
            onClick={() => setEditing((p) => !p)}
          >
            Edit
          </Button>
        </div>

        {/* calculated inputs */}
        <div className="mt-3 rounded-lg border p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {milestoneInputs.map((m) => (
              <div key={m.key} className="space-y-1">
                <div className="text-xs text-Primary">{m.label}</div>

                <div
                  className={cn(
                    "flex items-center rounded-md border px-3 py-2",
                    editing ? "bg-white" : "bg-[rgba(248,250,252,1)]"
                  )}
                >
                  <span className="text-sm text-gray-500">৳</span>
                  <input
                    type="text"
                    value={money(milestoneAmount)}
                    readOnly
                    className={cn(
                      "ml-2 w-full bg-transparent text-right text-sm outline-none",
                      !editing && "text-gray-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* cards row */}
      <div className="px-4 pb-4 pt-4">
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {cards.map((c) => {
              const isActive = c.id === activeId;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectMilestone(c.id)}
                  className={cn(
                    "min-w-[280px] max-w-[320px] flex-1 rounded-lg border px-4 py-3 text-left",
                    isActive ? "border-light-green" : "border-[rgba(100,116,139,0.25)]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold",
                        isActive
                          ? "bg-light-green text-white"
                          : "bg-[rgba(100,116,139,0.12)] text-Primary"
                      )}
                    >
                      {c.order + 1}
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-semibold text-Primary">{c.title}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {c.subtitle || "\u00A0"}
                      </div>

                      {/* ✅ calculated amount */}
                      <div className="mt-2 text-lg font-semibold text-light-green">
                        ৳ {money(milestoneAmount)}
                      </div>
                    </div>

                    <div className="text-xs text-light-green mt-1">{c.day}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}