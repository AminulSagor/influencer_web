"use client";

import React from "react";
import DangerZoneCard from "./danger-zone-card";
import MilestoneDetailsCard from "./milestone-details/milestone-details-card";
import CampaignMilestonesOverview from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-overview/campaign-milestones-overview";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import { CampaignAssignedInfluencer } from "@/types/client/campaigns/campaign-submission.types";

type Props = {
  campaign: ClientCampaignDetails;
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
  submissions?: Array<{ id?: string }>;
};

function deriveMilestonesFromAssignedInfluencers(
  campaign: ClientCampaignDetails,
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
        existing.statuses.push(String(work.status ?? "").toLowerCase());
        existing.works.push(work);
        continue;
      }

      grouped.set(work.masterMilestoneId, {
        masterMilestoneId: work.masterMilestoneId,
        contentTitle: work.contentTitle ?? "Untitled Milestone",
        platform: work.platform ?? "",
        contentQuantity: work.contentQuantity ?? "",
        deliveryDays: work.deliveryDays ?? 0,
        statuses: [String(work.status ?? "").toLowerCase()],
        works: [work],
      });
    }
  }

  return Array.from(grouped.values()).map((group, index) => {
    let mergedStatus: CampaignMilestone["status"] = "pending";

    if (
      group.statuses.length > 0 &&
      group.statuses.every((status) =>
        ["completed", "approved"].includes(status),
      )
    ) {
      mergedStatus = "completed";
    } else if (
      group.statuses.some((status) =>
        [
          "in_review",
          "active",
          "in_progress",
          "completed",
          "approved",
        ].includes(status),
      )
    ) {
      mergedStatus = "in_progress";
    } else {
      mergedStatus = "pending";
    }

    const totalAmount = group.works.reduce(
      (sum, work) => sum + Number(work.amount ?? 0),
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
      updatedAt: campaign.updatedAt,
      expectedReach: null,
      expectedViews: null,
      expectedLikes: null,
      expectedComments: null,
      promotionGoal: "",
      amount: String(totalAmount),
      bonusAmount: "0",
      bonusStatus: "unpaid",
      order: index + 1,
      campaignId: campaign.id,
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

export default function CampaignMilestonesSection({ campaign }: Props) {
  const assignedInfluencers = campaign.assignedInfluencers ?? [];

  const milestones = React.useMemo(() => {
    const hasTopLevelMilestones = (campaign.milestones ?? []).length > 0;
    const hasAssignedInfluencers = assignedInfluencers.length > 0;

    if (
      campaign.campaignType === "influencer_promotion" &&
      hasAssignedInfluencers
    ) {
      return deriveMilestonesFromAssignedInfluencers(
        campaign,
        assignedInfluencers,
      );
    }

    if (hasTopLevelMilestones) {
      return campaign.milestones;
    }

    return [];
  }, [campaign, assignedInfluencers]);

  const [expandedMilestoneId, setExpandedMilestoneId] = React.useState("");

  React.useEffect(() => {
    if (!milestones.length) {
      setExpandedMilestoneId("");
      return;
    }

    if (!expandedMilestoneId) {
      setExpandedMilestoneId(milestones[0].id);
      return;
    }

    if (!milestones.some((milestone) => milestone.id === expandedMilestoneId)) {
      setExpandedMilestoneId(milestones[0].id);
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

  const normalizedCampaign = React.useMemo(
    () => ({
      ...campaign,
      milestones,
    }),
    [campaign, milestones],
  );

  return (
    <div className="space-y-4">
      <CampaignMilestonesOverview
        campaign={normalizedCampaign}
        expandedMilestoneId={expandedMilestoneId}
        onSelectMilestone={setExpandedMilestoneId}
      />

      {expandedMilestone && (
        <MilestoneDetailsCard
          campaign={normalizedCampaign}
          milestone={expandedMilestone}
          milestoneIndex={
            expandedMilestoneIndex >= 0 ? expandedMilestoneIndex : 0
          }
          submissionId={milestoneSubmissionId}
        />
      )}

      <DangerZoneCard />
    </div>
  );
}
