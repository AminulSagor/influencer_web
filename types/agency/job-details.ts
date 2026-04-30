import type { AgencyMilestoneSubmissionItem } from "@/types/agency/campaign/milestone-submission.types";

export type AgencyCampaignAsset = {
    id: string;
    category: string;
    assetType: string;
    fileName: string;
    fileUrl: string;
    fileSize: string;
    mimeType: string;
    description: string;
    campaignId: string;
    createdAt: string;
};

export type AgencyCampaignMilestone = {
    id: string;
    contentTitle: string;
    platform: string;
    contentQuantity: string;
    deliveryDays: number;
    expectedReach: number | null;
    expectedViews: number | null;
    expectedLikes: number | null;
    expectedComments: number | null;
    expectedFollows: number | null;
    promotionGoal: string | null;
    amount: string;
    bonusAmount: string;
    bonusStatus: string;
    status: string;
    order: number;
    campaignId: string;
    createdAt: string;
    updatedAt: string;
    submissions?: AgencyMilestoneSubmissionItem[];
};

export type AgencyCampaignClientSocialLink = {
    url: string;
    status: string;
    platform: string;
};

export type AgencyCampaignClient = {
    id: string;
    brandName: string;
    firstName: string;
    lastName: string;
    profileImg: string | null;
    socialLinks: AgencyCampaignClientSocialLink[];
};

export type AgencyCampaignBudgetBreakdown = {
    baseBudget: string;
    vat: string;
    totalBudget: string;
    adminPlatformFee: string;
    estimatedAgencyProfit: string;
    netAvailableForAgency: string;
};

export type AgencyCampaignDetails = {
    id: string;
    campaignName: string;
    campaignType: string;
    productType: string;
    campaignNiche: string;
    preferredInfluencers: string[];
    notPreferableInfluencers: string[];
    suggestedAgencies: string[];
    assignedAt: string | null;
    campaignGoals: string;
    productServiceDetails: string;
    reportingRequirements: string;
    usageRights: string;
    startingDate: string;
    duration: number;
    dos: string;
    donts: string;
    isRated: boolean;
    rating: string;
    assets: AgencyCampaignAsset[];
    needSampleProduct: boolean;
    status: string;
    negotiationTurn: string | null;
    clientId: string;
    assignedAdminId: string | null;
    createdAt: string;
    updatedAt: string;
    milestones: AgencyCampaignMilestone[];
    client: AgencyCampaignClient;
    budgetBreakdown: AgencyCampaignBudgetBreakdown;
    invitedAt: string | null;
    timeLeftToRequoteMinutes: number;
};

export type AgencyCampaignDetailsResponse = {
    success: boolean;
    data: AgencyCampaignDetails;
};