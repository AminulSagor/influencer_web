"use client";

import { CampaignMilestone } from "@/types/client/campaigns/campaign-details";
import {
  SubmissionDetail,
  SubmissionMetricRow,
  SubmissionStatus,
} from "@/types/client/campaigns/campaign-submission.types";

export function formatSubmissionStatusLabel(status: SubmissionStatus | string) {
  switch (String(status ?? "").toLowerCase()) {
    case "in_review":
      return "In Review";
    case "declined":
      return "Declined";
    case "approved":
    case "completed":
      return "Completed";
    default:
      return "Pending";
  }
}

export function getSubmissionStatusClasses(status: SubmissionStatus | string) {
  switch (String(status ?? "").toLowerCase()) {
    case "declined":
      return {
        badge: "bg-red-500 text-white",
        border: "border-red-400",
        text: "text-red-500",
        panel: "border-red-400",
      };
    case "approved":
    case "completed":
      return {
        badge: "bg-[#7BA35A] text-white",
        border: "border-[#B8C99D]",
        text: "text-[#7BA35A]",
        panel: "border-[#D8E4C5]",
      };
    case "in_review":
    default:
      return {
        badge: "bg-[#D8892B] text-white",
        border: "border-[#E6C8A3]",
        text: "text-[#D8892B]",
        panel: "border-[#E5E7EB]",
      };
  }
}

export function toNumber(value?: string | number | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculatePercent(achieved: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.round((achieved / target) * 100);
}

export function getAveragePerformance(metrics: SubmissionMetricRow[]) {
  const metricsWithTarget = metrics.filter((item) => item.target > 0);

  if (!metricsWithTarget.length) return 0;

  const total = metricsWithTarget.reduce((sum, item) => sum + item.percent, 0);
  return Math.round(total / metricsWithTarget.length);
}

export function buildSubmissionMetrics(
  detail: SubmissionDetail,
  milestone: CampaignMilestone,
  campaignType: string,
): SubmissionMetricRow[] {
  const reachTarget = toNumber(milestone.expectedReach);
  const likesTarget = toNumber(milestone.expectedLikes);
  const viewsTarget = toNumber(milestone.expectedViews);
  const commentsTarget = toNumber(milestone.expectedComments);

  const reachAchieved = toNumber(detail.achievedReach);
  const likesAchieved = toNumber(detail.achievedLikes);
  const viewsAchieved = toNumber(detail.achievedViews);
  const commentsAchieved = toNumber(detail.achievedComments);

  if (campaignType === "influencer_promotion") {
    const metrics: SubmissionMetricRow[] = [
      {
        key: "reach",
        label: "Reach",
        achieved: reachAchieved,
        target: reachTarget,
        percent: calculatePercent(reachAchieved, reachTarget),
      },
      {
        key: "likes",
        label: "Likes",
        achieved: likesAchieved,
        target: likesTarget,
        percent: calculatePercent(likesAchieved, likesTarget),
      },
      {
        key: "views",
        label: "Views",
        achieved: viewsAchieved,
        target: viewsTarget,
        percent: calculatePercent(viewsAchieved, viewsTarget),
      },
      {
        key: "comments",
        label: "Comments",
        achieved: commentsAchieved,
        target: commentsTarget,
        percent: calculatePercent(commentsAchieved, commentsTarget),
      },
    ];

    return metrics.filter((item) => item.achieved > 0 || item.target > 0);
  }

  return [
    {
      key: "reach",
      label: "Reach",
      achieved: reachAchieved,
      target: reachTarget,
      percent: calculatePercent(reachAchieved, reachTarget),
    },
  ].filter((item) => item.achieved > 0 || item.target > 0);
}

export function shouldShowBonus(
  averagePerformance: number,
  status: SubmissionStatus | string,
  hasTargetMetrics: boolean,
) {
  const normalizedStatus = String(status ?? "").toLowerCase();

  return (
    hasTargetMetrics &&
    (normalizedStatus === "approved" ||
      normalizedStatus === "completed" ||
      normalizedStatus === "completed_plus_plus") &&
    averagePerformance > 100
  );
}
