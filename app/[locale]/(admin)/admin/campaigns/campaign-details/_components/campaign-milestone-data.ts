export const TODO = "To Do";
export const PAID = "Paid";
export const PARTIAL_PAID = "Partial Paid";
export const IN_REVIEW = "In Review";

export interface CampaignMilestoneDataType {
  id: number;
  title: string;
  contentRequirement: string[];
  //   promotionTarget: string;
  //   payout: number;
  //   status: string;
  day: number;
  //   promotionalGoal: string;
}
export const campaignMilestoneData: CampaignMilestoneDataType[] = [
  {
    id: 1,
    title: "Initial Content Creation",
    contentRequirement: ["2 instagram posts", "3 stories"],
    // promotionalGoal: "Gain page like as much as possible",
    // promotionTarget: "300k",
    // payout: 3000,
    // status: TODO,
    day: 1,
  },
  {
    id: 2,
    title: "YouTube Video Upload",
    contentRequirement: ["1 Sponsored video (60 Sec)"],
    // promotionalGoal: "Gain page like as much as possible",
    // promotionTarget: "300k",
    // payout: 5000,
    // status: PAID,
    day: 2,
  },
  {
    id: 3,
    title: "TikTok Campaign",
    contentRequirement: ["1 Sponsored video (60 Sec)"],
    // promotionalGoal: "Gain page like as much as possible",
    // promotionTarget: "300k",
    // payout: 5000,
    // status: IN_REVIEW,
    day: 3,
  },
  {
    id: 4,
    title: "Campaing Wrapup",
    contentRequirement: ["Final Report"],
    // promotionalGoal: "Gain page like as much as possible",
    // promotionTarget: "300k",
    // payout: 5000,
    // status: TODO,
    day: 4,
  },
];
