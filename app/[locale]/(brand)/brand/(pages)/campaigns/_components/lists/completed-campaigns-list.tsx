"use client";

import Link from "next/link";
import type { CampaignOverView } from "@/types/client/campaigns/campaign-overview";
import { Card, CardContent } from "@/components/ui/card";
import ListShell from "../list-shell";
import { getAssignedUserBasedText } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/card-helpers";
import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { getPlatformIcon } from "@/utils/platforms_util";
import { formatDeadline } from "@/utils/date_util";

export default function CompletedCampaignsList({
  campaigns,
  loading,
}: {
  campaigns: CampaignOverView[];
  loading?: boolean;
}) {
  return (
    <ListShell
      loading={loading}
      empty={!loading && campaigns.length === 0}
      emptyTitle="No completed campaigns found."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 overflow-x-scroll gap-4 xl:gap-8 mt-6 items-start no-scrollbar">
        {campaigns.map((c) => (
          <CompletedCard key={c.id} c={c} />
        ))}
      </div>
    </ListShell>
  );
}

function fakeRatingFromId(id: string) {
  const n = Array.from(id).reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return 2 + (n % 4);
}

function CompletedCard({ c }: { c: CampaignOverView }) {
  const rating = fakeRatingFromId(c.id);

  const campaignType =
    c.campaignType === "paid_ad" ? "Paid Ad" : "Influencer Promotion";

  const isAssigned = (c.assignedTo?.length ?? 0) > 0;
  const assignText = getAssignedUserBasedText(isAssigned, c.campaignType);

  return (
    <Card className="py-8">
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-xs">{campaignType}</p>
        </div>

        <div className="flex gap-2 items-center">
          <AvatarStack users={c.assignedTo} />
          {!isAssigned && (
            <p className="text-xs text-dark-gray">{assignText}</p>
          )}
        </div>

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

        <div className="rounded-xl border bg-muted/30 px-4 py-4 space-y-1">
          <p className="text-Primary">Offered</p>
          <p className="text-light-green text-3xl font-semibold">
            ৳ {c.totalBudget}
          </p>
        </div>

        <div className="flex items-center justify-between text-orange text-sm">
          <p>Completed On</p>
          <p>{formatDeadline(c.deadline)}</p>
        </div>

        <div className="flex gap-1 text-xl leading-none items-center justify-center mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < rating
                  ? "text-yellow-400 text-6xl"
                  : "text-6xl text-muted-foreground"
              }
            >
              ★
            </span>
          ))}
        </div>

        <SecondaryButton className="w-full text-Primary px-2 py-2">
          <Link href={`/brand/campaign-details/${c.id}`}>
            View Campaign Details
          </Link>
        </SecondaryButton>
      </CardContent>
    </Card>
  );
}