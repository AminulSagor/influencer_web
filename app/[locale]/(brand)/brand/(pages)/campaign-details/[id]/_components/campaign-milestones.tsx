"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";

type CampaignDetails = (typeof campaignMocksData)[number];
type InfluencerCampaign = CampaignDetails["influencerCampaigns"][number];
type Milestone = InfluencerCampaign["milestones"][number];

type Props = {
  campaign: CampaignDetails;
};

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

  if (s === "completed") {
    return {
      card: "border-light-green bg-light-green/10",
      badge: "bg-light-green/20 text-light-green border-light-green/30",
      dot: "bg-light-green",
      text: "text-light-green",
    };
  }

  if (s === "inreview" || s === "in review") {
    return {
      card: "border-orange-400/50 bg-orange-50",
      badge: "bg-orange-100 text-orange-600 border-orange-200",
      dot: "bg-orange-500",
      text: "text-orange-600",
    };
  }

  if (s === "declined" || s === "rejected") {
    return {
      card: "border-red-400/50 bg-red-50",
      badge: "bg-red-100 text-red-600 border-red-200",
      dot: "bg-red-500",
      text: "text-red-600",
    };
  }

  // Pending / default
  return {
    card: "border-black/10 bg-[#F7F7F7]",
    badge: "bg-white text-black/60 border-black/10",
    dot: "bg-black/30",
    text: "text-black/60",
  };
};

const Donut = ({ value }: { value: number }) => {
  const v = Math.max(0, Math.min(100, value));
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <div className="relative h-[90px] w-[90px]">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r={r} strokeWidth="10" fill="none" className="stroke-black/10" />
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

export default function CampaignMilestones({ campaign }: Props) {
  const influencers = campaign.influencerCampaigns ?? [];

  const defaultInfluencerId =
    campaign.selectedInfluencerId ?? influencers?.[0]?.influencer?.id ?? "";

  const [selectedInfluencerId, setSelectedInfluencerId] =
    React.useState<string>(defaultInfluencerId);

  const selectedInfluencerCampaign = React.useMemo(() => {
    return influencers.find((x) => x.influencer.id === selectedInfluencerId) ?? influencers[0];
  }, [influencers, selectedInfluencerId]);

  const milestones = selectedInfluencerCampaign?.milestones ?? [];

  const defaultExpanded =
    campaign.expandedMilestoneId ?? milestones?.[0]?.id ?? "";

  const [expandedMilestoneId, setExpandedMilestoneId] =
    React.useState<string>(defaultExpanded);

  const [detailsOpen, setDetailsOpen] = React.useState(true);
  const [submissionOpen, setSubmissionOpen] = React.useState(true);
  const [dangerOpen, setDangerOpen] = React.useState(false);

  React.useEffect(() => {
    // when influencer changes, auto expand first milestone
    const first = selectedInfluencerCampaign?.milestones?.[0]?.id ?? "";
    setExpandedMilestoneId(first);
    setDetailsOpen(true);
    setSubmissionOpen(true);
  }, [selectedInfluencerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = selectedInfluencerCampaign?.progress;
  const completedCount =
    progress?.completedCount ??
    milestones.filter((m) => String(m.status).toLowerCase() === "completed").length;

  const totalCount = progress?.totalCount ?? milestones.length;
  const percentCompleted =
    progress?.percentCompleted ??
    (totalCount ? Math.round((completedCount / totalCount) * 100) : 0);

  const expandedMilestone = milestones.find((m) => m.id === expandedMilestoneId);

  return (
    <Card className="border-none">
      <CardHeader className="space-y-3">
        {/* Header row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icons/milestone.svg" height={18} width={18} alt="icon" />
            <h2 className="text-Primary font-semibold">Campaign Milestones</h2>
          </div>

          <Select
            value={selectedInfluencerId}
            onValueChange={(v) => setSelectedInfluencerId(v)}
          >
            <SelectTrigger className="w-full md:w-[260px] bg-white">
              <SelectValue placeholder="Select influencer" />
            </SelectTrigger>

            <SelectContent>
              {influencers.map((inf) => (
                <SelectItem key={inf.influencer.id} value={inf.influencer.id}>
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-light-green/20 border border-light-green/20" />
                    <span className="truncate">{inf.influencer.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Overall progress */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-black/60">Overall Progress</p>
            <p className="text-lg font-semibold text-orange-500">
              {percentCompleted}% Completed
            </p>
          </div>

          <p className="text-xs text-black/60">
            {completedCount} of {totalCount} Completed
          </p>
        </div>

        <Progress value={percentCompleted} className="h-2 bg-black/10" />
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Milestone cards carousel */}
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {milestones.map((m, idx) => {
                const s = statusStyle(m.status);
                const active = m.id === expandedMilestoneId;

                return (
                  <CarouselItem
                    key={m.id}
                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedMilestoneId(m.id);
                        setDetailsOpen(true);
                        setSubmissionOpen(true);
                      }}
                      className={[
                        "w-full text-left rounded-lg border p-3 transition",
                        s.card,
                        active ? "ring-2 ring-light-green/50" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-light-green text-white text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <p className="text-sm font-semibold text-Primary truncate">
                              {m.title}
                            </p>
                          </div>

                          <p className="mt-1 text-xs text-black/50 truncate">
                            {(m.contentRequirements ?? []).join(" + ") || "—"}
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className={["shrink-0", s.badge].join(" ")}
                        >
                          {String(m.status)}
                        </Badge>
                      </div>

                      <p className={["mt-6 text-right text-xs font-semibold", s.text].join(" ")}>
                        {m.dayLabel ?? `DAY ${idx + 1}`}
                      </p>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className="left-1 border-none" />
            <CarouselNext className="right-1 border-none" />
          </Carousel>
        </div>

        {/* Expanded milestone details */}
        {expandedMilestone && (
          <div className="rounded-xl border border-black/10 bg-white">
            {/* Details header */}
            <button
              type="button"
              onClick={() => setDetailsOpen((p) => !p)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Image src="/icons/milestone.svg" height={16} width={16} alt="icon" />
                <p className="text-Primary font-semibold">
                  {expandedMilestone.title}
                </p>
              </div>

              {detailsOpen ? (
                <ChevronUp className="h-4 w-4 text-black/60" />
              ) : (
                <ChevronDown className="h-4 w-4 text-black/60" />
              )}
            </button>

            {detailsOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Top row: content req + targets + actions + status */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  {/* Content req */}
                  <div className="lg:col-span-4 rounded-lg border border-black/10 bg-light-green/5 p-3">
                    <p className="text-xs font-semibold text-Primary">
                      Content Requirements
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-black/60">
                      {(expandedMilestone.contentRequirements ?? []).length ? (
                        expandedMilestone.contentRequirements!.map((r, i) => (
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
                  <div className="lg:col-span-4 rounded-lg border border-black/10 bg-white p-3">
                    <p className="text-xs font-semibold text-Primary">
                      Milestone Target
                    </p>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(expandedMilestone.milestoneTargets ?? []).map((t) => (
                        <div
                          key={t.key}
                          className="rounded-md border border-black/10 px-2 py-1.5"
                        >
                          <p className="text-[10px] text-black/50">{t.label}</p>
                          <p className="text-sm font-semibold text-Primary">
                            {compact(t.target)}
                          </p>
                        </div>
                      ))}

                      {(!expandedMilestone.milestoneTargets ||
                        expandedMilestone.milestoneTargets.length === 0) && (
                        <p className="text-xs text-black/50">—</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex flex-col gap-2">
                    <Button
                      variant="default"
                      className="bg-Primary text-white"
                      disabled={!expandedMilestone.actions?.canReportAdmin}
                    >
                      Report Admin
                    </Button>

                    <Button
                      variant="outline"
                      className="border-black/10"
                      disabled={!expandedMilestone.actions?.canViewSubmittedReport}
                    >
                      View Submitted Report
                    </Button>
                  </div>

                  {/* Status box */}
                  <div className="lg:col-span-2 rounded-lg border border-black/10 p-3">
                    <p className="text-xs text-black/50">Status</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={[
                          "h-2.5 w-2.5 rounded-full",
                          statusStyle(expandedMilestone.status).dot,
                        ].join(" ")}
                      />
                      <p className="text-sm font-semibold text-Primary">
                        {String(expandedMilestone.status)}
                      </p>
                    </div>

                    <div className="mt-2 text-xs text-black/50">
                      <p>Due</p>
                      <p className="text-Primary font-semibold">
                        {formatDate(expandedMilestone.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submission details */}
                <div className="rounded-lg border border-black/10 bg-white">
                  <button
                    type="button"
                    onClick={() => setSubmissionOpen((p) => !p)}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-Primary font-semibold">
                        Submission Details
                      </p>
                      <Badge
                        variant="outline"
                        className={statusStyle(expandedMilestone.status).badge}
                      >
                        {String(expandedMilestone.status)}
                      </Badge>
                    </div>

                    {submissionOpen ? (
                      <ChevronUp className="h-4 w-4 text-black/60" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-black/60" />
                    )}
                  </button>

                  {submissionOpen && (
                    <div className="px-4 pb-4 space-y-4">
                      {/* Description */}
                      <div>
                        <p className="text-xs font-semibold text-Primary">
                          Description / Update
                        </p>
                        <p className="mt-1 text-xs text-black/60">
                          {expandedMilestone.submission?.description ??
                            "Description of the proof will be visible here"}
                        </p>
                      </div>

                      {/* Links + proofs */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="rounded-lg border border-black/10 p-3">
                          <p className="text-xs font-semibold text-Primary">
                            Platform
                          </p>

                          <div className="mt-2 space-y-2">
                            {(expandedMilestone.submission?.platformLinks ?? [])
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

                            {(!expandedMilestone.submission?.platformLinks ||
                              expandedMilestone.submission.platformLinks.length ===
                                0) && (
                              <p className="text-xs text-black/50">—</p>
                            )}
                          </div>
                        </div>

                        <div className="rounded-lg border border-black/10 p-3">
                          <p className="text-xs font-semibold text-Primary">
                            Attached Proof
                          </p>

                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {(expandedMilestone.submission?.proofs ?? [])
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

                            {(!expandedMilestone.submission?.proofs ||
                              expandedMilestone.submission.proofs.length ===
                                0) && (
                              <p className="text-xs text-black/50">—</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Performance metrics */}
                      {!!expandedMilestone.performance?.metrics?.length && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                          <div className="lg:col-span-8 rounded-lg border border-black/10 p-3">
                            <p className="text-xs font-semibold text-Primary">
                              Performance Metrics
                            </p>

                            <div className="mt-3 space-y-3">
                              {expandedMilestone.performance.metrics.map((m) => {
                                const current = Number(m.current ?? 0);
                                const target = Number(m.target ?? 0);
                                const pct =
                                  target > 0
                                    ? Math.min(100, Math.round((current / target) * 100))
                                    : 0;

                                return (
                                  <div key={m.key}>
                                    <div className="flex items-center justify-between text-xs">
                                      <p className="text-black/70 font-semibold">
                                        {m.label}
                                      </p>
                                      <p className="text-black/50">
                                        {compact(current)} / {compact(target)}
                                      </p>
                                    </div>

                                    <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
                                      <div
                                        className="h-full bg-light-green"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>

                                    <p className="mt-1 text-[10px] text-black/40">
                                      Target hit threshold:{" "}
                                      {expandedMilestone.performance?.targetHitThresholdPercent ??
                                        0}
                                      %
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="lg:col-span-4 rounded-lg border border-black/10 p-3 flex flex-col items-center justify-center">
                            <p className="text-xs font-semibold text-Primary">
                              Average Performance
                            </p>
                            <div className="mt-3">
                              <Donut
                                value={
                                  Number(
                                    expandedMilestone.performance?.averagePerformancePercent ?? 0
                                  ) || 0
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer action buttons (optional) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <Button variant="outline" className="border-black/10">
                          Decline
                        </Button>
                        <Button className="bg-light-green text-white">
                          Approve
                        </Button>
                      </div>

                      {/* Declined reason example (only show when status is Declined) */}
                      {String(expandedMilestone.status).toLowerCase() ===
                        "declined" && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                          <p className="text-xs font-semibold text-red-600">
                            Declined Reason
                          </p>
                          <Textarea
                            className="mt-2 border-red-200 bg-white"
                            placeholder="Description of the proof will be visible here"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Danger Zone */}
        <div className="rounded-xl border border-red-200 bg-red-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setDangerOpen((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <X className="h-4 w-4" />
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-red-600">Danger Zone</p>
                <p className="text-[11px] text-red-500">Cancel Campaign</p>
              </div>
            </div>

            {dangerOpen ? (
              <ChevronUp className="h-4 w-4 text-red-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-red-600" />
            )}
          </button>

          {dangerOpen && (
            <div className="px-4 pb-4 space-y-3">
              <Textarea
                className="bg-white border-red-200"
                placeholder="Write your reason..."
              />
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Request Cancellation & Submit Reason
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
