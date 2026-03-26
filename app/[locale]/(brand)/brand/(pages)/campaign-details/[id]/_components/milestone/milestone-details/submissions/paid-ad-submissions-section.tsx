"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Accordion } from "@/components/ui/accordion";
import PaidAdSubmissionAccordionItem from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/milestone/milestone-details/submissions/paid-ad-submission-accordion-item";
import {
  CampaignMilestone,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";
import { useMilestoneSubmissions } from "@/hooks/use-milestone-submissions";
import { SubmissionSummary } from "@/types/client/campaigns/campaign-submission.types";
import { useMilestoneStatusStore } from "@/store/use-milestone-status-store";

type Props = {
  campaign: ClientCampaignDetails;
  milestone: CampaignMilestone;
  selectedSubmissionIds: string[];
  onSelectedSubmissionIdsChange: (ids: string[]) => void;
};

type AggregateMetricResult = {
  averagePerformance: number;
  hasTargetMetrics: boolean;
};

function toNumber(value?: string | number | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculatePaidAdAggregatePerformance(
  items: SubmissionSummary[],
  milestone: CampaignMilestone,
): AggregateMetricResult {
  const reachTarget = toNumber(milestone.expectedReach);
  const likesTarget = toNumber(milestone.expectedLikes);
  const viewsTarget = toNumber(milestone.expectedViews);
  const commentsTarget = toNumber(milestone.expectedComments);
  const followsTarget = toNumber(milestone.expectedFollows);

  if (reachTarget > 0) {
    const totalAchieved = items.reduce(
      (sum, item) => sum + toNumber(item.achievedReach),
      0,
    );

    return {
      averagePerformance: Math.round((totalAchieved / reachTarget) * 100),
      hasTargetMetrics: true,
    };
  }

  if (likesTarget > 0) {
    const totalAchieved = items.reduce(
      (sum, item) => sum + toNumber(item.achievedLikes),
      0,
    );

    return {
      averagePerformance: Math.round((totalAchieved / likesTarget) * 100),
      hasTargetMetrics: true,
    };
  }

  if (viewsTarget > 0) {
    const totalAchieved = items.reduce(
      (sum, item) => sum + toNumber(item.achievedViews),
      0,
    );

    return {
      averagePerformance: Math.round((totalAchieved / viewsTarget) * 100),
      hasTargetMetrics: true,
    };
  }

  if (commentsTarget > 0) {
    const totalAchieved = items.reduce(
      (sum, item) => sum + toNumber(item.achievedComments),
      0,
    );

    return {
      averagePerformance: Math.round((totalAchieved / commentsTarget) * 100),
      hasTargetMetrics: true,
    };
  }

  if (followsTarget > 0) {
    const totalAchieved = items.reduce(
      (sum, item) => sum + toNumber(item.achievedFollows),
      0,
    );

    return {
      averagePerformance: Math.round((totalAchieved / followsTarget) * 100),
      hasTargetMetrics: true,
    };
  }

  return {
    averagePerformance: 0,
    hasTargetMetrics: false,
  };
}

export default function PaidAdSubmissionsSection({
  campaign,
  milestone,
  selectedSubmissionIds,
  onSelectedSubmissionIdsChange,
}: Props) {
  const t = useTranslations("brand.CampaignDetailsPage");
  const syncMilestonePerformance = useMilestoneStatusStore(
    (state) => state.syncMilestonePerformance,
  );

  const assignedInfluencers = campaign.assignedInfluencers ?? [];

  const { items, isLoading, error } = useMilestoneSubmissions({
    campaignId: campaign.id,
    campaignName: campaign.campaignName,
    milestoneId: milestone.id,
    campaignType: campaign.campaignType,
    assignedInfluencers,
    enabled: Boolean(campaign.id && milestone.id),
  });

  React.useEffect(() => {
    onSelectedSubmissionIdsChange([]);
  }, [milestone.id, onSelectedSubmissionIdsChange]);

  React.useEffect(() => {
    const validIds = new Set(items.map((item) => item.id));

    onSelectedSubmissionIdsChange(
      selectedSubmissionIds.filter((id) => validIds.has(id)),
    );
  }, [items]);

  React.useEffect(() => {
    if (!milestone.id) return;

    const result = calculatePaidAdAggregatePerformance(items, milestone);

    syncMilestonePerformance({
      milestoneId: milestone.id,
      averagePerformance: result.averagePerformance,
      hasTargetMetrics: result.hasTargetMetrics,
    });
  }, [items, milestone, syncMilestonePerformance]);

  const toggleSubmissionSelection = (submissionId: string) => {
    if (selectedSubmissionIds.includes(submissionId)) {
      onSelectedSubmissionIdsChange(
        selectedSubmissionIds.filter((id) => id !== submissionId),
      );
      return;
    }

    onSelectedSubmissionIdsChange([...selectedSubmissionIds, submissionId]);
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center text-sm text-black/60">
        {t("loadingSubmissions")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-center text-sm text-red-500">
        {t("noSubmissionsFoundForThisMilestonesss")}
      </div>
    );
  }

  return (
    <Accordion
      type="multiple"
      className="space-y-4"
      defaultValue={items[0] ? [items[0].id] : []}
    >
      {items.map((submission, index) => (
        <PaidAdSubmissionAccordionItem
          key={submission.id}
          submission={submission}
          index={index}
          campaign={campaign}
          milestone={milestone}
          isSelected={selectedSubmissionIds.includes(submission.id)}
          onToggleSelect={() => toggleSubmissionSelection(submission.id)}
        />
      ))}
    </Accordion>
  );
}