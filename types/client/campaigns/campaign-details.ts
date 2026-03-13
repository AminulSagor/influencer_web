import {
  CampaignAssignedInfluencer,
} from "@/types/client/campaigns/campaign-submission.types";

export type CampaignType = "influencer_promotion" | "paid_ad";

export type CampaignAsset = {
  id: string;
  category: string | null;
  assetType: string | null;
  fileName: string | null;
  fileUrl: string;
  fileSize: string | null;
  mimeType: string | null;
  description: string | null;
  campaignId: string;
  createdAt: string;
};

export type CampaignSocialLink = {
  platform: string;
  url: string;
};

export type CampaignClient = {
  id: string;
  brandName: string;
  profileImg: string | null;
  socialLinks: CampaignSocialLink[];
};

export type CampaignMilestoneStatus =
  | "pending"
  | "in_review"
  | "accepted"
  | "approved"
  | "completed"
  | "declined"
  | "in_progress"
  | string;

export type CampaignMilestone = {
  id: string;
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number | null;
  expectedViews: number | null;
  expectedLikes: number | null;
  expectedComments: number | null;
  promotionGoal: string | null;
  amount: string;
  bonusAmount: string;
  bonusStatus: string;
  status: CampaignMilestoneStatus;
  order: number;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignPaymentInfo = {
  totalAmount: string;
  paidAmount: string;
  dueAmount: string;
  showPayDueButton: boolean;
};

export type CampaignStatus =
  | "draft"
  | "received"
  | "negotiating"
  | "quoted"
  | "paid"
  | "partial_paid"
  | "promoting"
  | "accepted"
  | "approved"
  | "active"
  | "in_review"
  | "pending_agency"
  | "agency_accepted"
  | "agency_negotiating"
  | "completed"
  | "cancelled"
  | "declined"
  | "pending_influencer"
  | "budget_quoting"
  | "budget_building"
  | string;

export type CampaignPaymentStatus = "pending" | "partial" | "paid" | string;

export type ClientCampaignDetails = {
  id: string;
  campaignName: string;
  campaignType: CampaignType;
  productType: string | null;
  campaignNiche: string | null;
  preferredInfluencers: string[];
  notPreferableInfluencers: string[];
  suggestedAgencies: string[] | null;
  assignedAt: string | null;
  platformFeeAmount: string;
  availableBudgetForExecution: string;
  campaignGoals: string | null;
  productServiceDetails: string | null;
  reportingRequirements: string | null;
  usageRights: string | null;
  startingDate: string;
  duration: number;
  dos: string | null;
  donts: string | null;
  baseBudget: string;
  vatAmount: string;
  totalBudget: string;
  netPayableAmount: string;
  selectedAgencyId: string | null;
  paymentStatus: CampaignPaymentStatus;
  paidAmount: string;
  dueAmount: string;
  isRated: boolean;
  rating: string;
  assets: CampaignAsset[];
  needSampleProduct: boolean;
  status: CampaignStatus;
  currentStep: number;
  isPlaced: boolean;
  placedAt: string | null;
  negotiationTurn: string | null;
  clientId: string;
  assignedAdminId: string | null;
  createdAt: string;
  updatedAt: string;
  agencyOfferId: string | null;
  client: CampaignClient | null;
  milestones: CampaignMilestone[];
  assignedInfluencers: CampaignAssignedInfluencer[];
  paymentInfo: CampaignPaymentInfo | null;
};

export type ClientCampaignDetailsResponse = {
  assignedInfluencers?: CampaignAssignedInfluencer[];
};