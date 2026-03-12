"use client";

import React from "react";
import DangerZoneCard from "./danger-zone-card";
import MilestoneDetailsCard from "./milestone-details/milestone-details-card";
import {
  CampaignDetails,
  CampaignMilestone,
} from "@/types/client/campaigns/campaign-details";
import CampaignMilestonesOverview from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-overview/campaign-milestones-overview";
import { CampaignAssignedInfluencer } from "@/types/client/campaigns/campaign-submission.types";

type Props = {
  campaign: CampaignDetails;
  assignedInfluencers: CampaignAssignedInfluencer[];
};

type DerivedAssignedWork = {
  id: string;
  masterMilestoneId: string;
  contentTitle?: string;
  platform?: string;
  contentQuantity?: string;
  deliveryDays?: number;
  amount?: number;
  status?: string;
  submissions?: Array<unknown>;
};

function deriveMilestonesFromAssignedInfluencers(
  campaign: CampaignDetails,
  assignedInfluencers: CampaignAssignedInfluencer[],
): CampaignMilestone[] {
  const grouped = new Map<
    string,
    {
      masterMilestoneId: string;
      contentTitle: string;
      platform: string;
      contentQuantity: string;
      deliveryDays: number;
      statuses: string[];
      works: DerivedAssignedWork[];
    }
  >();

  for (const influencer of assignedInfluencers) {
    for (const rawWork of influencer.assignedWork ?? []) {
      const work = rawWork as DerivedAssignedWork;

      if (!work.masterMilestoneId) continue;

      const existing = grouped.get(work.masterMilestoneId);

      if (existing) {
        existing.statuses.push((work.status ?? "").toLowerCase());
        existing.works.push(work);
        continue;
      }

      grouped.set(work.masterMilestoneId, {
        masterMilestoneId: work.masterMilestoneId,
        contentTitle: work.contentTitle ?? "Untitled Milestone",
        platform: work.platform ?? "",
        contentQuantity: work.contentQuantity ?? "",
        deliveryDays: work.deliveryDays ?? 0,
        statuses: [(work.status ?? "").toLowerCase()],
        works: [work],
      });
    }
  }

  return Array.from(grouped.values()).map((group, index) => {
    let mergedStatus: CampaignMilestone["status"] = "pending";

    if (
      group.statuses.length > 0 &&
      group.statuses.every((s) => s === "completed")
    ) {
      mergedStatus = "completed";
    } else if (group.statuses.some((s) => s === "completed")) {
      mergedStatus = "in_progress";
    } else if (group.statuses.some((s) => s === "todo")) {
      mergedStatus = "pending";
    }

    const totalAmount = group.works.reduce(
      (sum, work) => sum + (work.amount ?? 0),
      0,
    );

    return {
      id: group.masterMilestoneId,
      contentTitle: group.contentTitle,
      contentQuantity: group.contentQuantity,
      platform: group.platform,
      deliveryDays: group.deliveryDays,
      status: mergedStatus,
      createdAt: campaign.createdAt,
      expectedReach: 0,
      expectedViews: 0,
      expectedLikes: 0,
      expectedComments: 0,
      promotionGoal: "",
      amount: totalAmount,
      order: index + 1,
    };
  });
}

function getInfluencerPromotionMilestoneSubmissionId(
  milestoneId: string,
  assignedInfluencers: CampaignAssignedInfluencer[],
) {
  for (const influencer of assignedInfluencers) {
    for (const work of influencer.assignedWork ?? []) {
      if (work.masterMilestoneId !== milestoneId) continue;

      const submissionId = work.submissions?.[0]?.id;
      if (submissionId) return submissionId;
    }
  }

  return null;
}

export default function CampaignMilestonesSection({
  campaign,
  assignedInfluencers,
}: Props) {
  const milestones = React.useMemo(() => {
    if ((campaign.milestones ?? []).length > 0) {
      return campaign.milestones;
    }

    if (campaign.campaignType === "influencer_promotion") {
      return deriveMilestonesFromAssignedInfluencers(
        campaign,
        assignedInfluencers,
      );
    }

    return [];
  }, [campaign, assignedInfluencers]);

  const [expandedMilestoneId, setExpandedMilestoneId] = React.useState("");

  React.useEffect(() => {
    if (
      expandedMilestoneId &&
      !milestones.some((milestone) => milestone.id === expandedMilestoneId)
    ) {
      setExpandedMilestoneId("");
    }
  }, [milestones, expandedMilestoneId]);

  const expandedMilestone = React.useMemo(
    () => milestones.find((milestone) => milestone.id === expandedMilestoneId),
    [milestones, expandedMilestoneId],
  );

  const expandedMilestoneIndex = React.useMemo(
    () =>
      milestones.findIndex((milestone) => milestone.id === expandedMilestoneId),
    [milestones, expandedMilestoneId],
  );

  const milestoneSubmissionId = React.useMemo(() => {
    if (
      campaign.campaignType !== "influencer_promotion" ||
      !expandedMilestoneId
    ) {
      return null;
    }

    return getInfluencerPromotionMilestoneSubmissionId(
      expandedMilestoneId,
      assignedInfluencers,
    );
  }, [campaign.campaignType, expandedMilestoneId, assignedInfluencers]);

  return (
    <div className="space-y-4">
      <CampaignMilestonesOverview
        campaign={{
          ...campaign,
          milestones,
        }}
        expandedMilestoneId={expandedMilestoneId}
        onSelectMilestone={setExpandedMilestoneId}
      />

      {expandedMilestone && (
        <MilestoneDetailsCard
          campaign={{
            ...campaign,
            milestones,
          }}
          milestone={expandedMilestone}
          milestoneIndex={
            expandedMilestoneIndex >= 0 ? expandedMilestoneIndex : 0
          }
          assignedInfluencers={assignedInfluencers}
          submissionId={milestoneSubmissionId}
        />
      )}

      <DangerZoneCard />
    </div>
  );
}