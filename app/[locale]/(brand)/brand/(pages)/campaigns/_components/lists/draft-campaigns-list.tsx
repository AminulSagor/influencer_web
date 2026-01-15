"use client";

import Link from "next/link";
import type { CampaignApi, CampaignMilestoneApi } from "@/app/[locale]/(brand)/brand/types/client-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";
import ListShell from "../list-shell";
import { formatBDT, formatDateLabel, toNumberSafe } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/card-helpers";
import { getPlatformIcon } from "@/helpers/platforms";

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

function DraftCard({ c }: { c: CampaignApi }) {
  const offered = toNumberSafe(c.totalBudget) || toNumberSafe(c.baseBudget);
  const platforms = getPlatformsFromCampaign(c);

  const deadlineIso = calcDeadlineIso(c);
  const deadlineText = formatDateLabel(deadlineIso);

  const hasInfluencers = (c.preferredInfluencers?.length ?? 0) > 0;

  return (
    <Card className="rounded-2xl border border-border/70 bg-white shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-xs">Influencer Promotion</p>
        </div>

        <p className="text-muted-foreground text-xs">
          {hasInfluencers ? "Influencers Assigned" : "No Influencers Assigned"}
        </p>

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

        <div className="rounded-xl border bg-muted/30 px-4 py-4 space-y-1">
          <p className="text-Primary text-xs font-semibold">Offered</p>
          <p className="text-light-green text-3xl font-semibold">
            {offered ? formatBDT(offered) : "None"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-orange">
            <FaClock className="text-orange" />
            Deadline
          </p>
          <p className="text-orange text-sm">{deadlineText}</p>
        </div>

        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/brand/create-campaign?draftId=${c.id}`}>
            Continue Editing Campaign Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DraftCampaignsList({
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
      emptyTitle="No draft campaigns found."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4 mt-6">
        {campaigns.map((c) => (
          <DraftCard key={c.id} c={c} />
        ))}
      </div>
    </ListShell>
  );
}
