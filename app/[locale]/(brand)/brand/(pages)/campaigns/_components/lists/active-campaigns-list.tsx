"use client";

import Link from "next/link";
import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";
import PercentageBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/percentage-bar";
import ListShell from "../list-shell";
import { getPlatformIcon } from "@/helpers/platforms";
import { buildDueLabelFromDeadline, formatDeadline } from "@/helpers/helper";
import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";

export default function ActiveCampaignsList({
  campaigns,
  loading,
}: {
  campaigns: CampaignSummary[];
  loading?: boolean;
}) {
  return (
    <ListShell
      loading={loading}
      empty={!loading && campaigns.length === 0}
      emptyTitle="No active campaigns found."
    >
      <div className="grid gap-4 mt-6 items-start grid-cols-[repeat(auto-fit,minmax(300px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
        {campaigns.map((c) => (
          <div key={c.id} className="w-full max-w-[420px] justify-self-start">
            <ActiveCard c={c} />
          </div>
        ))}
      </div>
    </ListShell>
  );
}

//active card
function ActiveCard({ c }: { c: CampaignSummary }) {
  const campaignType =
    c.campaignType === "paid_ad" ? "Paid Ad" : "Influencer Promotion";

  const isAssigned = (c.assignedTo?.length ?? 0) > 0;

  const isPaid = c.campaignType === "paid_ad";
  const isInfluencerPromotion = c.campaignType === "influencer_promotion";

  const assignText = (() => {
    if (isPaid) {
      return !isAssigned && "No agency assigned";
    }
    if (isInfluencerPromotion) {
      return !isAssigned && "No influencer assigned";
    }
    return "";
  })();

  const dueLabel = buildDueLabelFromDeadline(c.deadline);

  return (
    <Card className="rounded-2xl border border-border/70 bg-white shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-sm">{campaignType}</p>
        </div>

        <div className="flex gap-2 items-center">
          <AvatarStack />
          {!isAssigned && (
            <p className="text-xs text-dark-gray">{assignText}</p>
          )}
        </div>

        {/* Platforms */}
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground text-sm">Platforms</p>
          <div className="flex items-center gap-2">
            {c.platforms.length ? (
              c.platforms.map((p) => (
                <span
                  key={p}
                  className="leading-none p-1.5 rounded-md bg-light-green"
                >
                  {getPlatformIcon(p, "h-4 w-4 text-white")}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </div>
        </div>

        {/* Offered */}
        <div className="rounded-xl border border-light-green/25 bg-light-green/10 px-4 py-4 space-y-1">
          <p className="text-Primary text-lg">Offered</p>
          <p className="text-light-green text-3xl font-semibold">
            {c.totalBudget > 0 ? c.totalBudget : "None"}
          </p>
        </div>

        {/* Deadline + Due */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm text-orange">
              <FaClock className="text-orange" />
              Deadline
            </p>
            <p className="text-orange text-sm">{formatDeadline(c.deadline)}</p>
          </div>

          <div className="w-full rounded-lg border-orange bg-orange/10 px-4 py-2 text-center text-sm text-orange border">
            {dueLabel}
          </div>
        </div>

        {/* Progress */}
        <PercentageBar value={c.progress} />

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
