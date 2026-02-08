"use client";

import React from "react";
import type {
  CampaignApi,
  CampaignMilestoneApi,
} from "@/app/[locale]/(brand)/brand/types/client-types";
import CampaignMilestonesOverview from "./campaign-milestones-overview";
import DangerZoneCard from "./danger-zone-card";
import { isMilestoneExpandable } from "../helpers/milestone-ui-helpers";

function BasicMilestonePanel({
  milestone,
}: {
  milestone: CampaignMilestoneApi;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-Primary font-semibold">{milestone.contentTitle}</p>
        <p className="text-xs text-black/60">{String(milestone.status)}</p>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-xs text-black/50">Platform</p>
          <p className="font-medium">{String(milestone.platform)}</p>
        </div>

        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-xs text-black/50">Quantity</p>
          <p className="font-medium">{milestone.contentQuantity}</p>
        </div>

        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-xs text-black/50">Targets</p>
          <p className="font-medium">
            Reach: {milestone.expectedReach ?? "—"} | Views:{" "}
            {milestone.expectedViews ?? "—"}
          </p>
        </div>

        <div className="rounded-lg border border-black/10 p-3">
          <p className="text-xs text-black/50">Amount</p>
          <p className="font-medium">
            ৳ {Number(milestone.amount ?? 0).toLocaleString("en-US")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CampaignMilestonesSection({
  campaign,
}: {
  campaign: CampaignApi;
}) {
  const milestones = campaign.milestones ?? [];

  const [expandedMilestoneId, setExpandedMilestoneId] =
    React.useState<string>("");

  const expandedMilestone = expandedMilestoneId
    ? milestones.find((m) => m.id === expandedMilestoneId)
    : undefined;

  return (
    <div className="space-y-4">
      <CampaignMilestonesOverview
        campaign={campaign}
        expandedMilestoneId={expandedMilestoneId}
        onSelectMilestone={setExpandedMilestoneId}
      />

      {/*Status-wise: do not show details for pending */}
      {expandedMilestone && isMilestoneExpandable(expandedMilestone.status) && (
        <>
          {campaign.campaignType === "paid_ad" ? (
            // next step: PaidAdMilestoneDetailsPanel (multiple submissions)
            <BasicMilestonePanel milestone={expandedMilestone} />
          ) : (
            // next step: InfluencerMilestoneDetailsPanel (single submission)
            <BasicMilestonePanel milestone={expandedMilestone} />
          )}
        </>
      )}

      <DangerZoneCard />
    </div>
  );
}
