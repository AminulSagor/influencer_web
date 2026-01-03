export const TODO = "To Do";
export const PAID = "Paid";
export const PARTIAL_PAID = "Partial Paid";

export const DECLINED = "Declined";
export const IN_REVIEW = "In Review";
export const COMPLETED = "Completed";

export type CampaignStatusType =
  | typeof DECLINED
  | typeof IN_REVIEW
  | typeof COMPLETED
  | typeof TODO
  | typeof PAID
  | typeof PARTIAL_PAID;

export interface CampaignMilestoneDataType {
  id: number;
  title: string;
  contentRequirement: string[];
  status?: CampaignStatusType;
  day: number;
}
export const campaignMilestoneData: CampaignMilestoneDataType[] = [
  {
    id: 1,
    title: "Initial Content Creation",
    contentRequirement: ["2 instagram posts", "3 stories"],

    status: "Completed",
    day: 1,
  },
  {
    id: 2,
    title: "YouTube Video Upload",
    contentRequirement: ["1 Sponsored video (60 Sec)"],
    // promotionalGoal: "Gain page like as much as possible",
    // promotionTarget: "300k",
    // payout: 5000,
    status: "Declined",
    day: 2,
  },
  {
    id: 3,
    title: "TikTok Campaign",
    contentRequirement: ["1 Sponsored video (60 Sec)"],
    // promotionalGoal: "Gain page like as much as possible",
    // promotionTarget: "300k",
    // payout: 5000,
    status: IN_REVIEW,
    day: 3,
  },
  {
    id: 4,
    title: "Campaing Wrapup",
    contentRequirement: ["Final Report"],
    // promotionalGoal: "Gain page like as much as possible",
    // promotionTarget: "300k",
    // payout: 5000,
    status: "Completed",
    day: 4,
  },
];
