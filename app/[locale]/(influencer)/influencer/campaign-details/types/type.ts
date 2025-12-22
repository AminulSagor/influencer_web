export type MilestoneStatus =
  | "to_do"
  | "declined"
  | "in_review"
  | "partial_paid"
  | "approved";

export type MilestoneMetricKey = "reach" | "views" | "reactions" | "comments";

export type Milestone = {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  amount: number;
  dayLabel: string; // "DAY 1"
  status: MilestoneStatus;

  // details panel fields
  contentRequirements?: string[];
  targetMetrics?: Partial<Record<MilestoneMetricKey, number>>;
  approvedAt?: string; // "Dec 15, 2025"

  submission?: {
    approved?: boolean;
    description?: string;
    platformLabel?: string;
    platformUrl?: string;
    performance?: Partial<Record<MilestoneMetricKey | "likes", number>>;
    proofs?: { id: string; url?: string }[];
  };
};
