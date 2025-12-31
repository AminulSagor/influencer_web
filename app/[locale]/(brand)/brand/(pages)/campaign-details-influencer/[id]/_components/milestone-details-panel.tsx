"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Play, Heart, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";

type CampaignDetails = (typeof campaignMocksData)[number];
type InfluencerCampaign = CampaignDetails["influencerCampaigns"][number];
type Milestone = InfluencerCampaign["milestones"][number];

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const compact = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`;
  if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
  return String(n);
};

const statusStyle = (status?: string) => {
  const s = String(status ?? "").toLowerCase();
  if (s === "completed")
    return {
      badge: "bg-light-green/20 text-light-green border-light-green/30",
    };
  if (s === "inreview" || s === "in review")
    return { badge: "bg-orange-100 text-orange-600 border-orange-200" };
  if (s === "declined" || s === "rejected")
    return { badge: "bg-red-100 text-red-600 border-red-200" };
  return { badge: "bg-white text-black/60 border-black/10" };
};

const Donut = ({ value }: { value: number }) => {
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
};

const targetIconMap: Record<string, LucideIcon> = {
  reach: Eye,
  views: Play,
  reaction: Heart,
  comment: MessageCircle,
};

const normalizeKey = (k?: string) =>
  (k ?? "").trim().toLowerCase().replaceAll(" ", "_");

export default function MilestoneDetailsPanel({
  milestone,
}: {
  milestone?: Milestone;
}) {
  const [open, setOpen] = React.useState(true);
  const [submissionOpen, setSubmissionOpen] = React.useState(true);

  React.useEffect(() => {
    setOpen(true);
    setSubmissionOpen(true);
  }, [milestone?.id]);

  if (!milestone) return null;

  const st = statusStyle(milestone.status);

  return (
    <div className="rounded-xl border border-black/10 bg-white">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Image src="/icons/milestone.svg" height={16} width={16} alt="icon" />
          <p className="text-Primary font-semibold">{milestone.title}</p>
        </div>
        {open ? (
          <ChevronUp className="h-6 w-6 text-Primary" />
        ) : (
          <ChevronDown className="h-6 w-6 text-Primary" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Top row */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border bg-linear-to-r from-light-green/30 to-white rounded-md border-light-green p-4">
            {/* Content req */}
            <div className="">
              <p className="font-semibold text-Primary">Content Requirements</p>
              <ul className="space-y-1 text-xs text-black/60">
                {(milestone.contentRequirements ?? []).length ? (
                  milestone.contentRequirements!.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-light-green" />
                      <span className="min-w-0">{r}</span>
                    </li>
                  ))
                ) : (
                  <li>—</li>
                )}
              </ul>
            </div>

            {/* Targets */}
            <div>
              <p className="font-semibold text-Primary text-sm">
                Milestone Target
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(milestone.milestoneTargets ?? []).map((t) => {
                  const Icon = targetIconMap[normalizeKey(t.key)];
                  return (
                    <div
                      key={t.key}
                      className="rounded-md border max-w-24 min-w-24 border-light-green px-2 py-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-Primary/90">{t.label}</p>

                        {Icon ? (
                          <Icon className="h-4 w-4 text-Primary/80" />
                        ) : (
                          // fallback (optional)
                          <span className="h-4 w-4" />
                        )}
                      </div>

                      <p className="text-xl font-semibold text-Primary">
                        {compact(t.target)}
                      </p>
                    </div>
                  );
                })}

                {(!milestone.milestoneTargets ||
                  milestone.milestoneTargets.length === 0) && (
                  <p className="text-Primary">—</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <PrimaryButton disabled={!milestone.actions?.canReportAdmin}>
                Report Admin
              </PrimaryButton>
              <SecondaryButton
                disabled={!milestone.actions?.canViewSubmittedReport}
              >
                View Submitted Report
              </SecondaryButton>
            </div>

            {/* Status */}
            <div className="border p-4 rounded-lg flex flex-col items-center">
              <p className="text-sm text-black/50">Status</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={st.badge}>
                  {String(milestone.status)}
                </Badge>
              </div>

              <div className="mt-3 text-xs text-black/50">
                <p className="text-Primary font-semibold">
                  {formatDate(milestone.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Submission Details */}
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
                      <p className="text-sm font-semibold text-Primary">
                        Platform
                      </p>
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
                        {(milestone.submission?.proofs ?? [])
                          .slice(0, 6)
                          .map((p) => (
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
                  {!!milestone.performance?.metrics?.length && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                      <div className="lg:col-span-8 rounded-lg p-3">
                        <p className="font-semibold text-Primary">
                          Performance Metrics
                        </p>
                        <div className="mt-3 space-y-3">
                          {milestone.performance.metrics.map((m) => {
                            const cur = Number(m.current ?? 0);
                            const tar = Number(m.target ?? 0);
                            const pct =
                              tar > 0
                                ? Math.min(100, Math.round((cur / tar) * 100))
                                : 0;

                            return (
                              <div key={m.key}>
                                <div className="flex items-center justify-between text-xs">
                                  <p className="text-black/70 font-semibold">
                                    {m.label}
                                  </p>
                                  <p className="text-black/50">
                                    {compact(cur)} / {compact(tar)}
                                  </p>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
                                  <div
                                    className="h-full bg-light-green"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="lg:col-span-4 rounded-lg p-3 flex flex-col items-center justify-center">
                        <p className="font-semibold text-Primary">
                          Average Performance
                        </p>
                        <div className="mt-3">
                          <Donut
                            value={
                              Number(
                                milestone.performance
                                  ?.averagePerformancePercent ?? 0
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
        </div>
      )}
    </div>
  );
}
