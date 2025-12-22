"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type MilestoneStatus =
  | "to_do"
  | "declined"
  | "in_review"
  | "partial_paid"
  | "approved";

type Milestone = {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  amount: number;
  dayLabel: string; // e.g. "DAY 3"
  status: MilestoneStatus;
};

const currencyBDT = (n: number) =>
  `৳ ${new Intl.NumberFormat("en-US").format(n)}`;

type CardTheme = {
  // card container
  cardBg: string;
  cardBorder: string;

  // step circle
  stepBg: string;
  stepText: string;

  // texts
  title: string;
  subtitle: string;
  amount: string;
  day: string;

  // badge
  badgeBg: string;
  badgeText: string;
  badgeRing: string;
  badgeLabel: string;

  // optional: hide badge for approved (to match your gray example)
  hideBadge?: boolean;
};

const themes: Record<MilestoneStatus, CardTheme> = {
  // Soft / default
  to_do: {
    cardBg: "bg-[#F7FAEC]",
    cardBorder: "border-[#BFD6A7]",
    stepBg: "bg-[#7EA35A]",
    stepText: "text-white",
    title: "text-[#2D5016]",
    subtitle: "text-[#6B7280]",
    amount: "text-[#7EA35A]",
    day: "text-[#7EA35A]",
    badgeBg: "bg-[#EEF6E8]",
    badgeText: "text-[#2D5016]",
    badgeRing: "ring-[#D6E7C9]",
    badgeLabel: "To Do",
  },

  // ORANGE like your "In Review" card
  in_review: {
    cardBg: "bg-[#FFF7ED]",
    cardBorder: "border-[#FDBA74]",
    stepBg: "bg-[#EA580C]",
    stepText: "text-white",
    title: "text-[#9A3412]",
    subtitle: "text-[#9A3412]/60",
    amount: "text-[#EA580C]",
    day: "text-[#EA580C]",
    badgeBg: "bg-[#FED7AA]",
    badgeText: "text-[#9A3412]",
    badgeRing: "ring-[#FDBA74]",
    badgeLabel: "In Review",
  },

  // BLUE (nice for partial paid)
  partial_paid: {
    cardBg: "bg-[#EFF6FF]",
    cardBorder: "border-[#BFDBFE]",
    stepBg: "bg-[#2563EB]",
    stepText: "text-white",
    title: "text-[#1E40AF]",
    subtitle: "text-[#1E40AF]/60",
    amount: "text-[#2563EB]",
    day: "text-[#2563EB]",
    badgeBg: "bg-[#DBEAFE]",
    badgeText: "text-[#1E40AF]",
    badgeRing: "ring-[#BFDBFE]",
    badgeLabel: "Partial Paid",
  },

  // GRAY like your "Campaign Wrap Up" example (badge hidden by default)
  approved: {
    cardBg: "bg-[#F3F4F6]",
    cardBorder: "border-[#E5E7EB]",
    stepBg: "bg-[#9CA3AF]",
    stepText: "text-white",
    title: "text-[#374151]",
    subtitle: "text-[#6B7280]",
    amount: "text-[#374151]",
    // your screenshot shows DAY is green even when card is gray
    day: "text-[#7EA35A]",
    badgeBg: "bg-[#ECFDF5]",
    badgeText: "text-[#065F46]",
    badgeRing: "ring-[#A7F3D0]",
    badgeLabel: "Approved",
    hideBadge: true, // remove this if you want badge on approved too
  },

  // RED like your "Declined" card
  declined: {
    cardBg: "bg-[#FFE4E6]",
    cardBorder: "border-[#FF0000]",
    stepBg: "bg-[#FF0000]",
    stepText: "text-white",
    title: "text-[#FF0000]",
    subtitle: "text-[#FF0000]/70",
    amount: "text-[#FF0000]",
    day: "text-[#FF0000]",
    badgeBg: "bg-[#FF0000]",
    badgeText: "text-white",
    badgeRing: "ring-[#FF0000]",
    badgeLabel: "Declined",
  },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PaymentMilestones() {
  // Demo data (replace later with API)
  const milestones: Milestone[] = [
    {
      id: "m3",
      step: 3,
      title: "TikTok Campaign",
      subtitle: "1 Sponsored Video (60 Sec)",
      amount: 2000,
      dayLabel: "DAY 3",
      status: "in_review",
    },
    {
      id: "m4",
      step: 4,
      title: "Campaign Wrap Up",
      subtitle: "Final Report",
      amount: 1000,
      dayLabel: "DAY 4",
      status: "approved",
    },
    {
      id: "m4d",
      step: 4,
      title: "Campaign Wrap Up",
      subtitle: "Final Report + 2 Instagram Stories",
      amount: 1000,
      dayLabel: "DAY 4",
      status: "declined",
    },
    {
      id: "m2",
      step: 2,
      title: "YouTube Video Upload",
      subtitle: "1 Sponsored Video (60 Sec)",
      amount: 5000,
      dayLabel: "DAY 2",
      status: "partial_paid",
    },
    {
      id: "m1",
      step: 1,
      title: "Initial Content Creation",
      subtitle: "2 Instagram Posts + 3 Stories",
      amount: 3000,
      dayLabel: "DAY 1",
      status: "to_do",
    },
  ];

  const paidCount = useMemo(
    () =>
      milestones.filter(
        (m) => m.status === "approved" || m.status === "partial_paid"
      ).length,
    [milestones]
  );

  const progressPct = useMemo(() => {
    const total = milestones.length || 1;
    return clamp((paidCount / total) * 100, 0, 100);
  }, [paidCount, milestones.length]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 2);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateScrollButtons());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.85) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#EEF6E8] ring-1 ring-inset ring-[#D6E7C9]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 3h6"
                  stroke="#2D5016"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 3v6.2L4.7 18.6A2 2 0 0 0 6.4 22h11.2a2 2 0 0 0 1.7-3.4L14 9.2V3"
                  stroke="#2D5016"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 14h7"
                  stroke="#2D5016"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#1F2937]">
              Payment Milestones
            </h2>
          </div>

          {/* Progress */}
          <div className="flex flex-1 flex-col gap-2 md:mx-8 md:max-w-[520px]">
            <div className="text-center text-xs font-medium text-[#374151]">
              Progress
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#9DB47B]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between md:block md:text-right">
            <div className="text-sm font-semibold text-[#1F2937]">
              {paidCount} of {milestones.length} Paid
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative mt-5">
          <button
            type="button"
            onClick={() => scrollByCards("left")}
            disabled={!canLeft}
            className="absolute -left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#E5E7EB] bg-white shadow-sm transition hover:bg-[#F9FAFB] disabled:opacity-40"
            aria-label="Scroll left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scrollByCards("right")}
            disabled={!canRight}
            className="absolute -right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[#E5E7EB] bg-white shadow-sm transition hover:bg-[#F9FAFB] disabled:opacity-40"
            aria-label="Scroll right"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            ref={scrollerRef}
            className={[
              "flex gap-4 overflow-x-auto pb-2 pt-1",
              "scroll-smooth",
              "[scrollbar-width:none] [-ms-overflow-style:none]",
              "[&::-webkit-scrollbar]:hidden",
              "snap-x snap-mandatory",
              "px-1",
            ].join(" ")}
          >
            {milestones.map((m) => {
              const t = themes[m.status];

              return (
                <div
                  key={m.id}
                  className={[
                    "min-w-[290px] max-w-[290px] md:min-w-[360px] md:max-w-[360px]",
                    "snap-start rounded-2xl border p-4 md:p-5 relative",
                    t.cardBg,
                    t.cardBorder,
                  ].join(" ")}
                >
                  {/* Badge */}
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
                      {m.step}
                    </div>

                    <div className="min-w-0">
                      <div className={["text-[15px] font-semibold", t.title].join(" ")}>
                        {m.title}
                      </div>
                      <div className={["mt-1 text-xs", t.subtitle].join(" ")}>
                        {m.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div className={["text-2xl font-semibold", t.amount].join(" ")}>
                      {currencyBDT(m.amount)}
                    </div>
                    <div className={["text-xs font-semibold", t.day].join(" ")}>
                      {m.dayLabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* edge fade */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
