"use client";

import { CampaignMilestone } from "@/types/client/campaigns/campaign-details";
import {
  MilestoneActions,
  MilestoneStatusCard,
  PromotionGoalBlock,
  PromotionTargetBlock,
  RequirementList,
} from "./milestone-details-shared";

type Props = {
  milestone: CampaignMilestone;
};

function getPaidAdTarget(milestone: CampaignMilestone) {
  const targets = [
    { label: "Reach", value: milestone.expectedReach },
    { label: "Comments", value: milestone.expectedComments },
    { label: "Views", value: milestone.expectedViews },
    { label: "Likes", value: milestone.expectedLikes },
    { label: "Follows", value: milestone.expectedFollows },
  ];

  const activeTarget = targets.find(
    (item) => item.value !== null && item.value !== undefined,
  );

  return activeTarget ?? { label: "Reach", value: null };
}

export default function PaidAdMilestoneContent({ milestone }: Props) {
  const target = getPaidAdTarget(milestone);

  return (
    <div className="rounded-[18px] border border-[#A8C381] bg-linear-to-r from-[#F5F5DC] to-white px-4 py-4 sm:rounded-[20px] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-[1.2fr_0.8fr_0.85fr_0.78fr] xl:items-center xl:gap-6">
        <div className="min-w-0">
          <RequirementList contentQuantity={milestone.contentQuantity} />
          <PromotionGoalBlock goal={milestone.promotionGoal} />
        </div>

        <div className="min-w-0">
          <PromotionTargetBlock
            platform={milestone.platform}
            label={target.label}
            value={target.value}
          />
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
