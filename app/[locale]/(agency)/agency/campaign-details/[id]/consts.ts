export const TODO = "To Do";
export const PAID = "Paid";
export const PARTIAL_PAID = "Partial Paid";
export const IN_REVIEW = "In Review";

export interface PaymanetMilestoneDataType {
  id: number;
  milestoneId: string;
  title: string;
  contentRequirement: string[];
  promotionTarget: string;
  payout: number;
  status: string;
  day: number;
  promotionalGoal: string;
}
export const paymentMileStoneData = [
  {
    id: 1,
    title: "Initial Brand Awarness",
    contentRequirement: ["2 instagram posts", "3 stories"],
    promotionalGoal: "Gain page like as much as possible",
    promotionTarget: "300k",
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
    payout: 5000,
    status: TODO,
    day: 4,
  },
];
