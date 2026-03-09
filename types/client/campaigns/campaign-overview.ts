export type CampaignType = "paid_ad" | "influencer_promotion";

interface AssignedMember {
  id: number;
  name: string;
  image: string | null;
  type: string;
}

export interface CampaignOverView {
  id: string;
  campaignName: string;
  campaignType: CampaignType;
  status: string;
  totalBudget: number;
  assignedTo: AssignedMember[];
  platforms: string[];
  deadline: string;
  progress: number;
  budgetPendingAmount: number;
  negotiationRevisedTimes: number;
  totalQuotationsReceived: number;
}
