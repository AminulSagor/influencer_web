import type {
  AgencyMilestoneSubmissionItem,
  MilestoneTargetTitle,
} from "@/types/agency/campaign/milestone-submission.types";

export const TODO = "To Do";
export const PAID = "Paid";
export const PARTIAL_PAID = "Partial Paid";
export const IN_REVIEW = "In Review";
export const COMPLETED = "Completed";
export const COMPLETED_PLUS_PLUS = "Completed++";

export interface PaymanetMilestoneDataType {
  id: number;
  milestoneId: string;
  title: string;
  contentRequirement: string[];
  promotionTarget: string;
  targetTitle: MilestoneTargetTitle | null;
  payout: number;
  status: string;
  isMetrixOverflowed?: boolean;
  day: number;
  updatedAt?: string | null;
  promotionalGoal: string;
  submissions?: AgencyMilestoneSubmissionItem[];
}
export const paymentMileStoneData = [
  {
    id: 1,
    title: "Initial Brand Awarness",
    contentRequirement: ["2 instagram posts", "3 stories"],
    promotionalGoal: "Gain page like as much as possible",
    promotionTarget: "300k",
    targetTitle: "Reach" as const,
    payout: 3000,
    status: TODO,
    day: 1,
  },
  {
    id: 2,
    title: "Lead Generation",
    contentRequirement: ["2 instagram posts", "3 stories"],
    promotionalGoal: "Gain page like as much as possible",
    promotionTarget: "300k",
    targetTitle: "Reach" as const,
    payout: 5000,
    status: PAID,
    day: 2,
  },
  {
    id: 3,
    title: "Sales Convertion",
    contentRequirement: ["1 sponsored video (60 seconds)"],
    promotionalGoal: "Gain page like as much as possible",
    promotionTarget: "300k",
    targetTitle: "Reach" as const,
    payout: 5000,
    status: IN_REVIEW,
    day: 3,
  },
  {
    id: 4,
    title: "Campaing Wrapup",
    contentRequirement: ["Final Report"],
    promotionalGoal: "Gain page like as much as possible",
    promotionTarget: "300k",
    targetTitle: "Reach" as const,
    payout: 5000,
    status: TODO,
    day: 4,
  },
];
