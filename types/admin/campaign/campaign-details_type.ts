export type InvitationStatusType = "sent" | "accepted";

export type CampaignStatusType =
  | "needs-quote"
  | "pending-invitations"
  | "active"
  | "completed"
  | "paid";

export type InfluencerUI = { imageUrl: string; name: string };

// (optional) if you want strict typing for milestone API
export type CampaignMilestoneApi = {
  id: string;
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number;
  expectedViews: number;
  expectedLikes: number;
  expectedComments: number;
  promotionGoal: string | null;
  amount: string; // backend gives string like "0.00"
  bonusAmount: string;
  bonusStatus: string;
  status: string;
  order: number;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
};
