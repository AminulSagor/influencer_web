"use client";

import Link from "next/link";
import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";
import ListShell from "../list-shell";

import { getPlatformIcon } from "@/helpers/platforms";
import AvatarFallbackStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";
import { formatDeadline } from "@/helpers/helper";
import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";

export default function DraftCampaignsList({
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
      emptyTitle="No draft campaigns found."
    >
      <div className="grid gap-4 mt-6 items-start grid-cols-[repeat(auto-fit,minmax(300px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(340px,1fr))]">
        {campaigns.map((c) => (
          <div key={c.id} className="w-full max-w-[420px] justify-self-start">
            <DraftCard c={c} />
          </div>
        ))}
      </div>
    </ListShell>
  );
}

//============drafted card start=============//

function DraftCard({ c }: { c: CampaignSummary }) {
  const campaignType =
    c.campaignType === "paid_ad" ? "Paid Ad" : "Influencer Promotion";

  const isPaidAd = c.campaignType === "paid_ad";
  const isInfluencerCampaign = c.campaignType === "influencer_promotion";
  const isAssigned = (c.assignedTo?.length ?? 0) > 0;

  const assignmentText = (() => {
    if (isPaidAd) {
      return isAssigned ? "Agency Assigned" : "No Agency Assigned";
    }

    if (isInfluencerCampaign) {
      return isAssigned ? "Influencer Assigned" : "No Influencers Assigned";
    }

    return "";
  })();
  return (
    <Card>
      <CardContent className="space-y-4 lg:px-3 xl:px-6">
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight text-lg">
            {c.campaignName}
          </h3>
          <p className="text-dark-gray text-sm">{campaignType}</p>
        </div>

        <div className="text-muted-foreground text-sm flex gap-4 items-center">
          <AvatarStack users={c.assignedTo}/> {assignmentText}
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

        <div className="rounded-xl border bg-muted/40 px-4 py-5 space-y-2">
          <p className="text-Primary">Offered</p>
          <p className="text-light-green text-3xl font-semibold">
            {c.totalBudget > 0 ? c.totalBudget : "None"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-orange">
            <FaClock className="text-orange" />
            Deadline
          </p>
          <p className="text-orange text-sm">{formatDeadline(c.deadline)}</p>
        </div>

        <Button asChild variant="outline" className="w-full rounded-lg">
          <Link
            href={`/brand/create-campaign?draftId=${c.id}`}
            className="text-sm"
          >
            Continue Editing Campaign Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
