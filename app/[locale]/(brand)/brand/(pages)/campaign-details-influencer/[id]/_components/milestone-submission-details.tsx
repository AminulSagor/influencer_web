"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Eye, Heart, Play, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";

import type { Milestone } from "./milestone-details-panel";
import { compact } from "./milestone-ui-helpers";

const metricIconMap: Record<string, LucideIcon> = {
  reach: Eye,
  likes: Heart,
  like: Heart,
  reaction: Heart,
  views: Play,
  view: Play,
  comment: MessageCircle,
  comments: MessageCircle,
};

const normalizeMetricKey = (k?: string) =>
  (k ?? "").trim().toLowerCase().replaceAll(" ", "_");

function Donut({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <div className="relative h-[140px] w-[140px]">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle
          cx="50"
          cy="50"
          r={r}
          strokeWidth="10"
          fill="none"
          className="stroke-black/10"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          strokeWidth="10"
          fill="none"
          className="stroke-light-green"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[10px] text-black/50">Average</p>
        <p className="text-sm font-semibold text-black/70">{v.toFixed(1)}%</p>
      </div>
    </div>
  );
}

export default function MilestoneSubmissionDetails({
  milestone,
  st,
}: {
  milestone: Milestone;
  st: { badge: string };
}) {
  const [submissionOpen, setSubmissionOpen] = React.useState(true);

  React.useEffect(() => {
    setSubmissionOpen(true);
  }, [milestone?.id]);

  return (
    <div className="rounded-lg border border-black/10">
      <button
        type="button"
        onClick={() => setSubmissionOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <p className="text-Primary font-semibold">Submission Details</p>
          <Badge variant="outline" className={st.badge}>
            {String(milestone.status)}
          </Badge>
        </div>

        {submissionOpen ? (
          <ChevronUp className="h-6 w-6 text-Primary" />
        ) : (
          <ChevronDown className="h-6 w-6 text-Primary" />
        )}
      </button>

      {submissionOpen && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-Primary">
              Description / Update
            </p>
            <p className="mt-1 text-xs text-black/60">
              {milestone.submission?.description ??
                "Description of the proof will be visible here"}
            </p>
          </div>

          <div className="p-2 lg:p-4 border rounded-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Platforms */}
              <div className="rounded-lg p-3">
                <p className="text-sm font-semibold text-Primary">Platform</p>

                <div className="mt-2 space-y-2">
                  {(milestone.submission?.platformLinks ?? [])
                    .slice(0, 4)
                    .map((l, i) => (
                      <div
                        key={`${l.platform}-${i}`}
                        className="rounded-md border border-black/10 bg-white px-3 py-2"
                      >
                        <p className="text-[10px] text-black/50">
                          {l.platform}
                        </p>
                        <p className="text-xs text-black/70 truncate">
                          {l.url}
                        </p>
                      </div>
                    ))}

                  {(!milestone.submission?.platformLinks ||
                    milestone.submission.platformLinks.length === 0) && (
                    <p className="text-xs text-black/50">—</p>
                  )}
                </div>
              </div>

              {/* Proofs */}
              <div className="p-3">
                <p className="text-sm font-semibold text-Primary">
                  Attached Proof
                </p>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(milestone.submission?.proofs ?? []).slice(0, 6).map((p) => (
                    <div
                      key={p.id}
                      className="aspect-square rounded-md border border-black/10 bg-[#F7F7F7] overflow-hidden"
                      title={p.label}
                    >
                      {p.previewUrl ? (
                        <Image
                          src={p.previewUrl}
                          alt={p.label ?? "proof"}
                          width={200}
                          height={200}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-black/40">
                          —
                        </div>
                      )}
                    </div>
                  ))}

                  {(!milestone.submission?.proofs ||
                    milestone.submission.proofs.length === 0) && (
                    <p className="text-xs text-black/50">—</p>
                  )}
                </div>
              </div>
            </div>

            {/* Metrics + Donut */}
            {/* Metrics + Donut */}
            {!!milestone.performance?.metrics?.length && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Metrics */}
                <div className="lg:col-span-8 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-black/70" />
                    <p className="font-semibold text-black/80">
                      Performance Metrics
                    </p>
                  </div>

                  <div className="mt-4 space-y-8">
                    {milestone.performance.metrics.map((m) => {
                      const cur = Number(m.current ?? 0);
                      const tar = Number(m.target ?? 0);

                      // screenshot-style "Target Hit xx%"
                      const pctRaw = tar > 0 ? (cur / tar) * 100 : 0;
                      const pct = Math.max(
                        0,
                        Math.min(100, Math.round(pctRaw))
                      );

                      const Icon =
                        metricIconMap[normalizeMetricKey(m.key ?? m.label)];

                      return (
                        <div key={m.key} className="space-y-2">
                          {/* icon + label */}
                          <div className="flex items-center gap-2">
                            {Icon ? (
                              <Icon className="h-4 w-4 text-black/70" />
                            ) : (
                              <span className="h-4 w-4" />
                            )}
                            <p className="text-sm font-semibold text-black/80">
                              {m.label}
                            </p>
                          </div>

                          {/* left current (green) + right target (orange) */}
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold text-light-green">
                              {compact(cur)}
                            </p>
                            <p className="text-lg font-semibold text-orange-500">
                              {compact(tar)}
                            </p>
                          </div>

                          {/* progress bar */}
                          <div className="h-2.5 rounded-full bg-light-green/20 overflow-hidden">
                            <div
                              className="h-full bg-light-green rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>

                          {/* target hit */}
                          <p className="text-xs text-orange-500">
                            Target Hit {pct}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Donut */}
                <div className="lg:col-span-4 rounded-lg p-3 flex flex-col items-center justify-center">
                  <p className="font-semibold text-Primary">
                    Average Performance
                  </p>
                  <div className="mt-3">
                    <Donut
                      value={
                        Number(
                          milestone.performance?.averagePerformancePercent ?? 0
                        ) || 0
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Declined reason block */}
            {String(milestone.status).toLowerCase() === "declined" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-600">
                  Declined Reason
                </p>
                <Textarea
                  className="mt-2 border-red-200 bg-white"
                  placeholder="Write reason..."
                />
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <SecondaryButton>Decline</SecondaryButton>
            <PrimaryButton>Approve</PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
