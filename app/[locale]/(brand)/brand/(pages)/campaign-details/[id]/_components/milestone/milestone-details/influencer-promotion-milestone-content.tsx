"use client";

import { CampaignMilestone } from "@/types/client/campaigns/campaign-details";
import {
  MilestoneActions,
  MilestoneStatusCard,
  MilestoneTargetGrid,
  RequirementList,
} from "./milestone-details-shared";

type Props = {
  milestone: CampaignMilestone;
  submissionId?: string | null;
};

export default function InfluencerPromotionMilestoneContent({
  milestone,
}: Props) {
  return (
    <div className="rounded-[18px] border border-[#A8C381] bg-linear-to-r from-[#F5F5DC] to-white px-4 py-4 sm:rounded-[20px] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-[1.15fr_1.2fr_0.85fr_0.78fr] xl:items-center xl:gap-6">
        <div className="min-w-0">
          <RequirementList contentQuantity={milestone.contentQuantity} />
        </div>

        <div className="min-w-0">
          <MilestoneTargetGrid milestone={milestone} />
        </div>

        <div className="min-w-0">
          <MilestoneActions milestone={milestone} />
        </div>

        <div className="min-w-0">
          <MilestoneStatusCard milestone={milestone} />
        </div>
      </div>
    </div>
  );
}

