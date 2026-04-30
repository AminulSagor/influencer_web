export type MilestoneTargetTitle =
    | "Reach"
    | "Views"
    | "Likes"
    | "Comments"
    | "Follows";

export interface AgencyMilestoneSubmissionItem {
    id: string;
    submissionDescription: string | null;
    submissionAttachments: string[];
    submissionLiveLinks: string[];
    requestedAmount: string;
    submittedByRole: string;
    rejectionReason: string | null;
    isClientApproved: boolean;
    achievedReach: number | null;
    achievedViews: number | null;
    achievedLikes: number | null;
    achievedComments: number | null;
    achievedFollows: number | null;
    paidAmount: string;
    paymentStatus: string;
    adminFeedback: string | null;
    status: string;
    assignmentId: string | null;
    milestoneId: string;
    assignedMilestoneId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AgencyMilestoneDetails {
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
    promotionGoal: string;
    amount: string;
    status: string;
    order: number;
    campaignId: string;
    submissions: AgencyMilestoneSubmissionItem[];
    createdAt: string;
    updatedAt: string;
    bonusAmount: number;
    bonusStatus: string;
}

export interface GetAgencyMilestoneDetailsResponse {
    success: boolean;
    data: AgencyMilestoneDetails;
}

export interface SubmitAgencyMilestonePayload {
    description: string;
    liveLinks: string[];
    proofAttachments: string[];
    requestPaymentAmount: number;
    achievedReach?: number;
    achievedViews?: number;
    achievedLikes?: number;
    achievedComments?: number;
    achievedFollows?: number;
}

export interface SubmitAgencyMilestoneResponse {
    success?: boolean;
    message: string | string[];
    statusCode?: number;
    error?: string;
}

export interface MilestoneSubmissionMetricsResponse {
    reach: number | null;
    views: number | null;
    likes: number | null;
    comments: number | null;
    follows?: number | null;
}

export interface MilestoneSubmissionApiItem {
    id: string;
    influencerId: string;
    influencerName: string;
    influencerImage: string | null;
    assignmentId: string | null;
    assignedMilestoneId: string | null;
    description: string | null;
    attachments: string[];
    liveLinks: string[];
    requestedAmount: number;
    paidAmount: number;
    status: string;
    paymentStatus: string;
    isClientApproved: boolean;
    metrics: MilestoneSubmissionMetricsResponse | null;
    submittedAt: string;
    adminFeedback: string | null;
    rejectionReason: string | null;
}

export interface GetMilestoneSubmissionsResponse {
    success: boolean;
    data: {
        queriedId: string;
        queryType: string;
        milestoneTitle: string;
        campaignName: string;
        totalSubmissions: number;
        submissions: MilestoneSubmissionApiItem[];
    };
}