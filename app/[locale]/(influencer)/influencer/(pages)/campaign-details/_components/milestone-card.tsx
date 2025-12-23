"use client";

import { milestoneThemes } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/theme/theme";
import { Milestone } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/types/type";
import { useMilestoneUIStore } from "@/app/[locale]/(influencer)/influencer/z-store/campaign-milestone";


const currencyBDT = (n: number) =>
  `৳ ${new Intl.NumberFormat("en-US").format(n)}`;

export function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const t = milestoneThemes[milestone.status];
  const { selectedId, toggleFor } = useMilestoneUIStore();

  const isActive = selectedId === milestone.id;

  return (
    <button
      type="button"
      onClick={() => toggleFor(milestone.id)}
      className={[
        "min-w-[290px] max-w-[290px] md:min-w-[360px] md:max-w-[360px]",
        "snap-start rounded-2xl border p-4 md:p-5 relative text-left",
        "transition",
        t.cardBg,
        t.cardBorder,
        isActive ? "ring-2 ring-[#7EA35A]/40" : "hover:shadow-sm",
      ].join(" ")}
    >
      {!t.hideBadge && (
        <div
          className={[
            "absolute right-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            t.badgeBg,
            t.badgeText,
            "ring-1 ring-inset",
            t.badgeRing,
          ].join(" ")}
        >
          {t.badgeLabel}
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={[
            "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
            t.stepBg,
            t.stepText,
          ].join(" ")}
        >
          {milestone.step}
        </div>

        <div className="min-w-0">
          <div className={["text-[15px] font-semibold", t.title].join(" ")}>
            {milestone.title}
          </div>
          <div className={["mt-1 text-xs", t.subtitle].join(" ")}>
            {milestone.subtitle}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className={["text-2xl font-semibold", t.amount].join(" ")}>
          {currencyBDT(milestone.amount)}
        </div>
        <div className={["text-xs font-semibold", t.day].join(" ")}>
          {milestone.dayLabel}
        </div>
      </div>
    </button>
  );
}
