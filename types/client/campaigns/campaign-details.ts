export type CampaignType = "paid_ad" | "influencer_promotion";

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

export type PaymentStatus = "pending" | "partial" | "paid" | "failed" | string;

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "twitter"
  | "linkedin"
  | string;

export interface ClientSocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface CampaignClient {
  id: string;
  brandName: string;
  profileImg: string | null;
  socialLinks: ClientSocialLink[];
}

export interface AgencyLite {
  id: string;
  agencyName: string;
  logo: string | null;
}

export interface AssignedAgency {
  id: string;
  agencyId: string;
  agency: AgencyLite;
  isDeclined: boolean;
}

export type MilestoneStatus = "pending" | "accepted" | "completed" | string;
export type BonusStatus = "unpaid" | "paid" | string;

export interface CampaignMilestone {
  id: string;
  masterMilestoneId?: string;
  contentTitle: string;
  platform: SocialPlatform;
  contentQuantity: string;
  deliveryDays: number;

  expectedReach?: number | null;
  expectedViews?: number | null;
  expectedLikes?: number | null;
  expectedComments?: number | null;

  promotionGoal?: string | null;

  amount: string | number;
  bonusAmount?: string | number;
  bonusStatus?: BonusStatus;

  status: MilestoneStatus;
  order?: number;

  campaignId?: string;
  createdAt?: string;
  updatedAt?: string;

  assignmentId?: string | null;
  jobStatus?: string;
  assignedToInfluencerId?: string | null;
  influencerName?: string | null;
  influencerImage?: string | null;
  influencerLocation?: string | null;
  influencerCountry?: string | null;
}

export type AssetCategory = "brand" | "content" | string;

export interface CampaignAsset {
  id: string;
  category: AssetCategory;
  assetType: string;
  fileName: string;
  fileUrl: string;
  fileSize: string | null;
  mimeType: string | null;
  description: string | null;
  campaignId: string;
  createdAt: string;
}

export interface CampaignDetails {
  id: string;
  campaignName: string;
  campaignType: CampaignType;

  productType: string | null;
  campaignNiche: string | null;

  preferredInfluencers: string[];
  notPreferableInfluencers: string[];

  suggestedAgencies: string[] | null;
  assignedAgencies: AssignedAgency[];

  availableBudgetForExecution: string | null;
  campaignGoals: string | null;
  productServiceDetails: string | null;
  reportingRequirements: string | null;
  usageRights: string | null;

  startingDate: string | null;
  duration: number | null;

  dos: string | null;
  donts: string | null;

  baseBudget: string | null;
  vatAmount: string | null;
  totalBudget: string | null;

  selectedAgencyId: string | null;
  paymentStatus: PaymentStatus;

  isRated: boolean;
  rating: string;

  milestones: CampaignMilestone[];
  assets: CampaignAsset[];

  status: CampaignStatus;
  currentStep: number;

  client: CampaignClient;

  createdAt: string;
  agencyOfferId: string | null;
}
