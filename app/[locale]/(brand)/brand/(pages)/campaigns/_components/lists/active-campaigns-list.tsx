"use client";

import Link from "next/link";
import type {
  CampaignApi,
  CampaignMilestoneApi,
} from "@/app/[locale]/(brand)/brand/types/client-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";
import PercentageBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/percentage-bar";
import ListShell from "../list-shell";
// import { formatBDT, toNumberSafe, formatDateLabel } from "../../_lib/card-helpers";
import { getPlatformIcon } from "@/helpers/platforms";
import {
  formatBDT,
  formatDateLabel,
  toNumberSafe,
} from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/card-helpers";

function getPlatformsFromCampaign(c: CampaignApi): string[] {
  const raw = (c.milestones ?? [])
    .map((m: CampaignMilestoneApi) => String(m?.platform ?? "").trim())
    .filter(Boolean);
  return Array.from(new Set(raw));
}

function calcDeadlineIso(c: CampaignApi) {
  if (!c.startingDate || !c.duration) return null;
  const d = new Date(c.startingDate);
  d.setDate(d.getDate() + c.duration);
  return d.toISOString();
}

function buildDueLabel(c: CampaignApi) {
  const iso = calcDeadlineIso(c);
  if (!iso) return "Due: —";

  const now = new Date();
  const target = new Date(iso);
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff <= 0) return "Completed";
  if (diff === 1) return "Due: Tomorrow";
  return `Due: ${diff} Days`;
}

// you can improve mapping later when backend has real progress
function statusToPercent(status: string | null | undefined) {
  const s = String(status ?? "").toLowerCase();
  if (s.includes("completed")) return 100;
  if (s.includes("promot")) return 90;
  if (s.includes("paid")) return 75;
  if (s.includes("quote")) return 50;
  if (s.includes("submit")) return 25;
  return 75;
}

function ActiveCard({ c }: { c: CampaignApi }) {
  const offered = toNumberSafe(c.totalBudget) || toNumberSafe(c.baseBudget);
  const platforms = getPlatformsFromCampaign(c);

  const deadlineIso = calcDeadlineIso(c);
  const deadlineText = formatDateLabel(deadlineIso);
  const dueText = buildDueLabel(c);
  const percent = statusToPercent(c.status);

  return (
    <Card className="rounded-2xl border border-border/70 bg-white shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-xs">Influencer Promotion</p>
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">Platforms</p>
          <div className="flex items-center gap-2">
            {platforms.length ? (
              platforms.map((p) => (
                <span key={p} className="leading-none">
                  {getPlatformIcon(p, "h-6 w-6 text-light-green")}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </div>
        </div>

        {/* Offered */}
        <div className="rounded-xl border border-light-green/25 bg-light-green/10 px-4 py-4 space-y-1">
          <p className="text-Primary text-xs font-semibold">Offered</p>
          <p className="text-light-green text-3xl font-semibold">
            {formatBDT(offered)}
          </p>
        </div>

        {/* Deadline + Due */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-orange">
              <FaClock className="text-orange" />
              Deadline
            </p>
            <p className="text-orange text-sm">{deadlineText}</p>
          </div>

          <div className="w-full rounded-lg border border-orange bg-orange/10 px-4 py-2 text-center text-sm font-medium text-orange">
            {dueText}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <p className="text-orange text-sm font-medium">
            {Math.round(percent)}% Complete
          </p>
          <PercentageBar value={percent} />
        </div>

        {/* CTA */}
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/brand/campaign-details/${c.id}`}>
            View Campaign Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ActiveCampaignsList({
  campaigns,
  loading,
}: {
  campaigns: CampaignApi[];
  loading?: boolean;
}) {
  return (
    <ListShell
      loading={loading}
      empty={!loading && campaigns.length === 0}
      emptyTitle="No active campaigns found."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4 mt-6">
        {campaigns.map((c) => (
          <ActiveCard key={c.id} c={c} />
        ))}
      </div>
    </ListShell>
  );
}
