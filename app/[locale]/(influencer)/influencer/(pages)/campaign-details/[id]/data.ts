export const TODO = "To Do";
export const PAID = "Paid";
export const PARTIAL_PAID = "Partial Paid";
export const IN_REVIEW = "In Review";
export const DECLINED = 'Declined'

export interface MilestoneTarget {
  reach: number;
  views: number;
  reactions: number;
  comments: number;
}

export interface PaymanetMilestoneDataType {
  id: number;
  title: string;
  contentRequirement: string[];
  milestoneTarget: MilestoneTarget;
  payout: number;
  status: string;
  day: number;
}
export const paymentMileStoneData: PaymanetMilestoneDataType[] = [
  {
    id: 1,
    title: "Initial Content Creation",
    contentRequirement: ["2 Instagram posts", "3 Stories"],
    milestoneTarget: {
      reach: 150_000,
      views: 100_000,
      reactions: 80_000,
      comments: 20_000,
    },
    payout: 3000,
    status: TODO,
    day: 1,
  },
  {
    id: 2,
    title: "YouTube Video Upload",
    contentRequirement: ["1 Sponsored video (60 sec)"],
    milestoneTarget: {
      reach: 250_000,
      views: 200_000,
      reactions: 120_000,
      comments: 35_000,
    },
    payout: 5000,
    status: PARTIAL_PAID,
    day: 1,
  },
  {
    id: 3,
    title: "Lead Generation",
    contentRequirement: ["2 Instagram posts", "3 Stories"],
    milestoneTarget: {
      reach: 400_000,
      views: 300_000,
      reactions: 200_000,
      comments: 60_000,
    },
    payout: 5000,
    status: PAID,
    day: 2,
  },
  {
    id: 4,
    title: "TikTok Campaign",
    contentRequirement: ["1 Sponsored video (60 sec)"],
    milestoneTarget: {
      reach: 500_000,
      views: 450_000,
      reactions: 350_000,
      comments: 90_000,
    },
    payout: 5000,
    status: IN_REVIEW,
    day: 3,
  },
  {
    id: 5,
    title: "Campaign Wrap-up",
    contentRequirement: ["Final Report"],
    milestoneTarget: {
      reach: 700_000,
      views: 600_000,
      reactions: 500_000,
      comments: 120_000,
    },
    payout: 5000,
    status: DECLINED,
    day: 4,
  },
];

