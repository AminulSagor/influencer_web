"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

import MilestoneTopRow from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone-top-row";
import MilestoneSubmissionDetails from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone-submission-details";
import { campaignMocksData } from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/campaign-milestones";
import { statusStyle } from "../helpers/milestone-ui-helpers";

type CampaignDetails = (typeof campaignMocksData)[number];
type InfluencerCampaign = CampaignDetails["influencerCampaigns"][number];
export type Milestone = InfluencerCampaign["milestones"][number];

export default function MilestoneDetailsPanel({
  milestone,
}: {
  milestone?: Milestone;
}) {
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    setOpen(true);
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
          {/* TOP ROW */}
          <MilestoneTopRow milestone={milestone} st={st} />

          {/* SUBMISSION DETAILS */}
          <MilestoneSubmissionDetails milestone={milestone} st={st} />
        </div>
      )}
    </div>
  );
}
