
import { CampaignMilestone } from "@/types/client/campaigns/campaign-details";
import { SubmissionDetail, SubmissionMetricRow, SubmissionStatus } from "@/types/client/campaigns/campaign-submission.types";

export function formatSubmissionStatusLabel(status: SubmissionStatus) {
  switch (status) {
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

export function getSubmissionStatusClasses(status: SubmissionStatus) {
  switch (status) {
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
  if (!metrics.length) return 0;
  const total = metrics.reduce((sum, item) => sum + item.percent, 0);
  return Math.round(total / metrics.length);
}

export function buildSubmissionMetrics(
  detail: SubmissionDetail,
  milestone: CampaignMilestone,
  campaignType: string,
): SubmissionMetricRow[] {
  if (campaignType === "influencer_promotion") {
    const metrics: SubmissionMetricRow[] = [
      {
        key: "reach",
        label: "Reach",
        achieved: detail.achievedReach ?? 0,
        target: Number(milestone.expectedReach ?? 0),
        percent: calculatePercent(
          detail.achievedReach ?? 0,
          Number(milestone.expectedReach ?? 0),
        ),
      },
      {
        key: "likes",
        label: "Likes",
        achieved: detail.achievedLikes ?? 0,
        target: Number(milestone.expectedLikes ?? 0),
        percent: calculatePercent(
          detail.achievedLikes ?? 0,
          Number(milestone.expectedLikes ?? 0),
        ),
      },
      {
        key: "views",
        label: "Views",
        achieved: detail.achievedViews ?? 0,
        target: Number(milestone.expectedViews ?? 0),
        percent: calculatePercent(
          detail.achievedViews ?? 0,
          Number(milestone.expectedViews ?? 0),
        ),
      },
      {
        key: "comments",
        label: "Comments",
        achieved: detail.achievedComments ?? 0,
        target: Number(milestone.expectedComments ?? 0),
        percent: calculatePercent(
          detail.achievedComments ?? 0,
          Number(milestone.expectedComments ?? 0),
        ),
      },
    ];

    return metrics.filter((item) => item.target > 0);
  }

  return [
    {
      key: "reach",
      label: "Reach",
      achieved: detail.achievedReach ?? 0,
      target: Number(milestone.expectedReach ?? 0),
      percent: calculatePercent(
        detail.achievedReach ?? 0,
        Number(milestone.expectedReach ?? 0),
      ),
    },
  ].filter((item) => item.target > 0);
}

export function shouldShowBonus(averagePerformance: number, status: SubmissionStatus) {
  return (
    (status === "approved" || status === "completed") &&
    averagePerformance > 100
  );
}