"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Play,
  Heart,
  MessageCircle,
  Link2,
  UploadCloud,
} from "lucide-react";

import {
  Milestone,
  MilestoneMetricKey,
} from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/types/type";
import { useMilestoneUIStore } from "@/app/[locale]/(influencer)/influencer/z-store/campaign-milestone";
import { milestoneThemes } from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/theme/theme";

/* ---------------- helpers ---------------- */

function metricLabel(k: MilestoneMetricKey) {
  if (k === "reach") return "Reach";
  if (k === "views") return "Views";
  if (k === "reactions") return "Reaction";
  return "Comment";
}

function metricIcon(k: MilestoneMetricKey) {
  if (k === "reach") return <Eye className="h-4 w-4" />;
  if (k === "views") return <Play className="h-4 w-4" />;
  if (k === "reactions") return <Heart className="h-4 w-4" />;
  return <MessageCircle className="h-4 w-4" />;
}

const formatK = (n?: number) => {
  if (!n) return "-";
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};

const currencyBDT = (n: number) =>
  `৳ ${new Intl.NumberFormat("en-US").format(n)}`;

/* ---------------- section shell ---------------- */

function SectionShell({
  titleLeft,
  right,
  children,
  defaultOpen = true,
}: {
  titleLeft: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen((s) => !s);
        }}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">{titleLeft}</div>
        <div className="flex items-center gap-3">
          {right}
          {open ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      <div
        className={[
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- MAIN PANEL ---------------- */

export function MilestoneDetailsPanel({
  milestones,
}: {
  milestones: Milestone[];
}) {
  const { selectedId, isDetailsOpen, close } = useMilestoneUIStore();

  const milestone = useMemo(
    () => milestones.find((m) => m.id === selectedId) ?? null,
    [milestones, selectedId]
  );

  if (!milestone) return null;

  const theme = milestoneThemes[milestone.status];

  return (
    <div
      className={[
        "mt-6 transition-all duration-300",
        isDetailsOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden",
      ].join(" ")}
    >
      <SectionShell
        titleLeft={
          <div>
            <div className="text-xs text-[#6B7280]">
              Milestone {milestone.step}
            </div>
            <div className={`text-sm font-semibold ${theme.title}`}>
              {milestone.title}
            </div>
          </div>
        }
        right={
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
          >
            Close
          </button>
        }
        defaultOpen
      >
       {/* ================= SUMMARY CARD ================= */}
<div
  className={`rounded-2xl border p-5 ${theme.cardBg} ${theme.cardBorder}`}
>
  <div className="grid gap-4 md:grid-cols-5 md:items-center">
    {/* 1️⃣ Content requirements */}
    <div>
      <div className={`text-sm font-semibold ${theme.title}`}>
        Content Requirements
      </div>
      <ul className={`mt-2 list-disc pl-5 text-xs ${theme.subtitle}`}>
        {(milestone.contentRequirements ?? [
          "2 Instagram Posts + 3 Stories",
        ]).map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>

    {/* 2️⃣ Milestone Target (span 2 cols) */}
    <div className="md:col-span-2">
      <div className={`text-sm font-semibold ${theme.title}`}>
        Milestone Target
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-[340px]">
        {(
          ["reach", "views", "reactions", "comments"] as MilestoneMetricKey[]
        ).map((k) => (
          <div
            key={k}
            className="rounded-xl border border-black/10 bg-white p-3"
          >
            <div
              className={`flex items-center justify-between text-xs ${theme.title}`}
            >
              <span>{metricLabel(k)}</span>
              <span className="opacity-70">{metricIcon(k)}</span>
            </div>
            <div className={`mt-1 text-lg font-semibold ${theme.title}`}>
              {formatK(milestone.targetMetrics?.[k] ?? 300_000)}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 3️⃣ Money (own column) */}
    <div className="text-right">
      <div className="text-xs text-[#6B7280]">Payout On Approval</div>
      <div className={`text-2xl font-semibold ${theme.amount}`}>
        {currencyBDT(milestone.amount)}
      </div>
    </div>

    {/* 4️⃣ Status (own column) */}
    {!theme.hideBadge && (
      <div className="flex justify-end">
        <div className="rounded-2xl border bg-white px-4 py-3 text-center">
          <div className="text-xs text-[#6B7280]">Status</div>

          <div
            className={`mt-2 inline-flex rounded-full px-4 py-1 text-sm font-semibold ring-1
              ${theme.badgeBg} ${theme.badgeText} ${theme.badgeRing}`}
          >
            {theme.badgeLabel}
          </div>

          <div className="mt-2 text-[11px] text-[#6B7280]">
            {milestone.approvedAt ?? "Dec 15, 2025"}
          </div>
        </div>
      </div>
    )}
  </div>
</div>


        {/* ================= SUBMISSION ================= */}
        <div className="mt-4">
          <SectionShell
            titleLeft={
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${theme.title}`}>
                  Your Submission
                </span>
                {!theme.hideBadge && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeRing}`}
                  >
                    {theme.badgeLabel}
                  </span>
                )}
              </div>
            }
            defaultOpen
          >
            <textarea
              className="h-28 w-full rounded-xl border p-3 text-sm"
              placeholder="Description of the proof will be visible here"
              defaultValue={milestone.submission?.description ?? ""}
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Link2 className="h-4 w-4" />
                  Platform
                </div>
                <div className="mt-2 underline text-sm">
                  {milestone.submission?.platformUrl}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <MetricLine label="Reach" value="300K" icon={<Eye />} />
                  <MetricLine label="Views" value="250K" icon={<Play />} />
                  <MetricLine label="Likes" value="50K" icon={<Heart />} />
                  <MetricLine
                    label="Comments"
                    value="3K"
                    icon={<MessageCircle />}
                  />
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <UploadCloud className="h-4 w-4" />
                  Attach Proof
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl border border-dashed bg-gray-50"
                    />
                  ))}
                </div>
              </div>
            </div>
          </SectionShell>
        </div>
      </SectionShell>
    </div>
  );
}

function MetricLine({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <div>{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}
