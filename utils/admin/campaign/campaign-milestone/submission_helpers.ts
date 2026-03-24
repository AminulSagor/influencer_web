import { toSafeNumber } from "./number_helpers";
import { normalizeCampaignMilestoneStatus } from "./milestone_status_util";

export type SubmissionItem = {
  id: string;
  influencerId?: string | null;
  influencerName?: string | null;
  influencerImage?: string | null;
  assignmentId?: string | null;
  assignedMilestoneId?: string | null;
  description?: string | null;
  attachments?: string[];
  liveLinks?: string[];
  requestedAmount?: number;
  paidAmount?: number;
  status?: string | null;
  paymentStatus?: string | null;
  isClientApproved?: boolean;
  metrics?: {
    reach?: number;
    views?: number;
    likes?: number;
    comments?: number;
  };
  submittedAt?: string | null;
  adminFeedback?: string | null;
  rejectionReason?: string | null;
};

export type MilestoneSubmissionBucket = {
  totalSubmissions: number;
  submissions: SubmissionItem[];
};

export function isCompletedStatus(status?: string | null) {
  const s = String(status ?? "").trim().toLowerCase();
  return ["approved", "partial_paid", "paid"].includes(s);
}

export function extractProgressPercent(progressRes: any): number {
  const percent = Number(progressRes?.data?.progressPercentage ?? 0);
  return Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
}

export function getSubmissionMetric(submissionData: SubmissionItem | null | undefined, key: string) {
  return toSafeNumber(
    submissionData?.metrics?.[key as keyof NonNullable<SubmissionItem["metrics"]>] ??
      (submissionData as any)?.performanceMetrics?.[key] ??
      (submissionData as any)?.[key] ??
      0
  );
}

export function computeAveragePerformance(
  metrics: {
    reach?: number;
    views?: number;
    likes?: number;
    comments?: number;
  },
  targets: {
    reach?: number | null;
    views?: number | null;
    likes?: number | null;
    comments?: number | null;
  }
) {
  const values = [
    {
      current: toSafeNumber(metrics?.reach),
      target: toSafeNumber(targets?.reach),
    },
    {
      current: toSafeNumber(metrics?.views),
      target: toSafeNumber(targets?.views),
    },
    {
      current: toSafeNumber(metrics?.likes),
      target: toSafeNumber(targets?.likes),
    },
    {
      current: toSafeNumber(metrics?.comments),
      target: toSafeNumber(targets?.comments),
    },
  ];

  const valid = values.filter((item) => item.target > 0);
  if (!valid.length) return 0;

  const totalPercent = valid.reduce((sum, item) => {
    const percent = (item.current / item.target) * 100;
    return sum + Math.max(0, Math.min(percent, 100));
  }, 0);

  return Math.round((totalPercent / valid.length) * 10) / 10;
}

export function formatDateLabel(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return "—";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 10);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function normalizeSubmissionStatus(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

export function normalizePaymentStatus(value?: string | null) {
  return String(value ?? "").trim().toLowerCase();
}

export function deriveAggregateMilestoneStatus(
  submissions: SubmissionItem[],
  fallback?: string | null
) {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    return normalizeCampaignMilestoneStatus(fallback);
  }

  const statusList = submissions.map((item) => normalizeSubmissionStatus(item?.status));
  const paymentStatusList = submissions.map((item) =>
    normalizePaymentStatus(item?.paymentStatus)
  );

  if (statusList.some((status) => status === "in_review")) return "in_review";
  if (statusList.some((status) => status === "declined")) return "declined";
  if (paymentStatusList.some((status) => status === "partial_paid")) {
    return "partial_paid";
  }
  if (
    paymentStatusList.length > 0 &&
    paymentStatusList.every((status) => status === "paid")
  ) {
    return "paid";
  }
  if (
    paymentStatusList.some((status) => status === "paid") ||
    statusList.some((status) => status === "approved")
  ) {
    return "approved";
  }

  return normalizeCampaignMilestoneStatus(fallback);
}
