export type InvitationStatusType = "sent" | "accepted";

export type CampaignStatusType =
  | "needs-quote"
  | "pending-invitations"
  | "active"
  | "completed"
  | "paid";

export type InfluencerUI = { id: string; imageUrl: string; name: string };

export type CampaignMilestoneservice = {
  id: string;
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;

  expectedReach?: number | null;
  expectedViews?: number | null;
  expectedLikes?: number | null;
  expectedComments?: number | null;
  promotionGoal?: string | null;

  amount: string | number;
  bonusAmount?: string | number;
  bonusStatus?: string;
  status: string;
  order?: number;

  campaignId?: string;
  createdAt?: string;
  updatedAt?: string;

  masterMilestoneId?: string;
  assignmentId?: string;
  assignedToInfluencerId?: string;
  influencerName?: string | null;
  influencerImage?: string | null;
  influencerLocation?: string | null;
  influencerCountry?: string | null;
};