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
    targetTitle: MilestoneTargetTitle;
    targetAmount: number;
}

export interface SubmitAgencyMilestoneResponse {
    success?: boolean;
    message: string | string[];
    statusCode?: number;
    error?: string;
}