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
import { useCampaignOverallProgress } from "@/hooks/use-campaign-overall-progress";

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
  expectedReach?: number;
  expectedViews?: number;
  expectedLikes?: number;
  expectedComments?: number;
  expectedFollows?: number;
  promotionGoal?: string;
  order?: number;
  amount?: number;
  status?: string;
  submissions?: Array<{ id?: string }>;
};

function filterTopLevelMilestonesForInfluencer(
  allMilestones: CampaignMilestone[],
  influencer: CampaignAssignedInfluencer | null,
): CampaignMilestone[] {
  if (!influencer) return [];

  const allowedMilestoneIds = new Set(
    (influencer.assignedWork ?? [])
      .map((work) => work.masterMilestoneId)
      .filter(Boolean),
  );

  return allMilestones.filter((milestone) =>
    allowedMilestoneIds.has(milestone.id),
  );
}

function deriveMilestonesFromSelectedInfluencer(
  campaign: ClientCampaignDetails,
  influencer: CampaignAssignedInfluencer | null,
): CampaignMilestone[] {
  if (!influencer) return [];

  const works = (influencer.assignedWork ?? []) as DerivedAssignedWork[];

  return works
    .filter((work) => Boolean(work.masterMilestoneId))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((work, index) => {
      const normalizedStatus = String(work.status ?? "").toLowerCase();

      let milestoneStatus: CampaignMilestone["status"] = "pending";

      if (["completed", "approved"].includes(normalizedStatus)) {
        milestoneStatus = "completed";
      } else if (
        ["in_review", "active", "in_progress"].includes(normalizedStatus)
      ) {
        milestoneStatus = "in_progress";
      } else {
        milestoneStatus = "pending";
      }

      return {
        id: work.masterMilestoneId,
        contentTitle: work.contentTitle ?? "Untitled Milestone",
        contentQuantity: work.contentQuantity ?? "",
        platform: work.platform ?? "",
        deliveryDays: work.deliveryDays ?? 0,
        status: milestoneStatus,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        expectedReach: work.expectedReach ?? null,
        expectedViews: work.expectedViews ?? null,
        expectedLikes: work.expectedLikes ?? null,
        expectedComments: work.expectedComments ?? null,
        expectedFollows: work.expectedFollows ?? null,
        promotionGoal: work.promotionGoal ?? "",
        amount: String(Number(work.amount ?? 0)),
        bonusAmount: "0",
        bonusStatus: "unpaid",
        order: work.order ?? index + 1,
        campaignId: campaign.id,
      };
    });
}

function getMilestoneSubmissionIdForSelectedInfluencer(
  milestoneId: string,
  influencer: CampaignAssignedInfluencer | null,
) {
  if (!influencer) return null;

  for (const work of influencer.assignedWork ?? []) {
    if (work.masterMilestoneId !== milestoneId) continue;

    const submissionId = work.submissions?.[0]?.id;
    if (submissionId) return submissionId;
  }

  return null;
}

function getAssignmentIdForSelectedInfluencerMilestone(
  milestoneId: string,
  influencer: CampaignAssignedInfluencer | null,
) {
  if (!influencer) return undefined;

  const hasMilestone = (influencer.assignedWork ?? []).some(
    (work) => work.masterMilestoneId === milestoneId,
  );

  return hasMilestone ? influencer.assignmentId : undefined;
}

function shouldShowMilestoneDetails(status?: string) {
  const normalized = String(status ?? "").toLowerCase();
  return ["active", "completed", "cancelled"].includes(normalized);
}

export default function CampaignMilestonesSection({ campaign }: Props) {
  const assignedInfluencers = React.useMemo(
    () => campaign.assignedInfluencers ?? [],
    [campaign.assignedInfluencers],
  );

  const showInfluencerFlow =
    campaign.campaignType === "influencer_promotion" &&
    assignedInfluencers.length > 0;

  const influencerIds = React.useMemo(
    () =>
      assignedInfluencers
        .map((influencer) => influencer.influencerId)
        .filter((id): id is string => Boolean(id)),
    [assignedInfluencers],
  );

  const { progressPercentage } = useCampaignOverallProgress({
    campaignId: campaign.id,
    campaignType: campaign.campaignType,
    influencerIds,
  });

  const [selectedInfluencerId, setSelectedInfluencerId] = React.useState("");

  React.useEffect(() => {
    if (!showInfluencerFlow) {
      setSelectedInfluencerId("");
      return;
    }

    const hasCurrentSelection = assignedInfluencers.some(
      (influencer) => influencer.influencerId === selectedInfluencerId,
    );

    if (!hasCurrentSelection) {
      setSelectedInfluencerId(assignedInfluencers[0]?.influencerId ?? "");
    }
  }, [showInfluencerFlow, assignedInfluencers, selectedInfluencerId]);

  const selectedInfluencer = React.useMemo(() => {
    if (!showInfluencerFlow) return null;

    return (
      assignedInfluencers.find(
        (influencer) => influencer.influencerId === selectedInfluencerId,
      ) ??
      assignedInfluencers[0] ??
      null
    );
  }, [showInfluencerFlow, assignedInfluencers, selectedInfluencerId]);

  const milestones = React.useMemo(() => {
    const topLevelMilestones = campaign.milestones ?? [];
    const hasTopLevelMilestones = topLevelMilestones.length > 0;

    if (showInfluencerFlow) {
      if (hasTopLevelMilestones) {
        return filterTopLevelMilestonesForInfluencer(
          topLevelMilestones,
          selectedInfluencer,
        );
      }

      return deriveMilestonesFromSelectedInfluencer(
        campaign,
        selectedInfluencer,
      );
    }

    if (hasTopLevelMilestones) {
      return topLevelMilestones;
    }

    return [];
  }, [campaign, showInfluencerFlow, selectedInfluencer]);

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

    return getMilestoneSubmissionIdForSelectedInfluencer(
      expandedMilestoneId,
      selectedInfluencer,
    );
  }, [campaign.campaignType, expandedMilestoneId, selectedInfluencer]);

  const milestoneAssignmentId = React.useMemo(() => {
    if (
      campaign.campaignType !== "influencer_promotion" ||
      !expandedMilestoneId
    ) {
      return undefined;
    }

    return getAssignmentIdForSelectedInfluencerMilestone(
      expandedMilestoneId,
      selectedInfluencer,
    );
  }, [campaign.campaignType, expandedMilestoneId, selectedInfluencer]);

  const normalizedCampaign = React.useMemo(
    () => ({
      ...campaign,
      milestones,
    }),
    [campaign, milestones],
  );

  const showDangerZone = React.useMemo(() => {
    if (progressPercentage == null) return false;
    return progressPercentage < 50;
  }, [progressPercentage]);

  const showMilestoneDetails = React.useMemo(
    () => shouldShowMilestoneDetails(campaign.status),
    [campaign.status],
  );

  const handleSelectInfluencer = React.useCallback((influencerId: string) => {
    setSelectedInfluencerId(influencerId);
    setExpandedMilestoneId("");
  }, []);

  return (
    <div className="space-y-4">
      <CampaignMilestonesOverview
        campaign={normalizedCampaign}
        expandedMilestoneId={expandedMilestoneId}
        onSelectMilestone={setExpandedMilestoneId}
        selectedInfluencerId={selectedInfluencerId}
        onSelectInfluencer={handleSelectInfluencer}
      />

      {showMilestoneDetails && expandedMilestone && (
        <MilestoneDetailsCard
          campaign={normalizedCampaign}
          milestone={expandedMilestone}
          milestoneIndex={
            expandedMilestoneIndex >= 0 ? expandedMilestoneIndex : 0
          }
          submissionId={milestoneSubmissionId}
        />
      )}
      {campaign.status === "active" && (
        <>
          {showDangerZone ? (
            <DangerZoneCard
              campaignId={campaign.id}
              targetType={
                campaign.campaignType === "influencer_promotion"
                  ? "influencer"
                  : "agency"
              }
              assignmentId={milestoneAssignmentId}
              agencyOfferId={campaign.agencyOfferId}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
