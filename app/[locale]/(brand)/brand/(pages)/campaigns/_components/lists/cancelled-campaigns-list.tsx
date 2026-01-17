"use client";

import type { CampaignSummary } from "@/app/[locale]/(brand)/brand/types/client-types";
import { Card, CardContent } from "@/components/ui/card";
import { FaClock } from "react-icons/fa";
import ListShell from "../list-shell";
import { getPlatformIcon } from "@/helpers/platforms";
import { formatDeadline } from "@/helpers/helper";
import { getAssignedUserBasedText } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/card-helpers";
import AvatarStack from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/avatar-stack";

export default function CancelledCampaignsList({
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
      emptyTitle="No cancelled campaigns found."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4 mt-6">
        {campaigns.map((c) => (
          <CancelledCard key={c.id} c={c} />
        ))}
      </div>
    </ListShell>
  );
}

function CancelledCard({ c }: { c: CampaignSummary }) {
  const campaignType =
    c.campaignType === "paid_ad" ? "Paid Ad" : "Influencer Promotion";

  const isAssigned = (c.assignedTo?.length ?? 0) > 0;

  const assignText = getAssignedUserBasedText(isAssigned, c.campaignType);
  return (
    <Card className="bg-white shadow-sm opacity-70 py-8">
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-dark-gray font-semibold leading-tight">
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
          <p className="text-dark-gray">Offered</p>
          <p className="text-light-green text-3xl font-semibold">
            {c.totalBudget}
          </p>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <p className="flex items-center gap-2 text-sm">
            <FaClock />
            Deadline
          </p>
          <p className="text-sm">{formatDeadline(c.deadline)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
