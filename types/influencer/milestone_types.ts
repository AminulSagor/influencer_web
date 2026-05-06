// Types derived from the Postman API collection for milestones and submissions

export type MilestoneStatus =
  | "todo"
  | "in_review"
  | "approved"
  | "completed"
  | "completed_plus_plus"
  | "paid"
  | "declined"
  | "partial_paid";

// GET /campaign/influencer/job/:jobId/milestones
export interface MilestoneListItem {
  id: string;
  title: string;
  contentQuantity: string;
  amount: number;
  deliveryDays: number;
  order: number;
  expectedLikes: number;
  expectedComments: number;
  expectedFollows?: number | null;
  isMetrixOverflowed?: boolean;
  status: MilestoneStatus;
}

export interface MilestoneListResponse {
  success: boolean;
  data: {
    jobId: string;
    campaignId: string;
    milestones: MilestoneListItem[];
  };
}

// GET /campaign/influencer/milestone/:milestoneId
export interface MilestoneDetail {
  id: string;
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number | null;
  expectedViews: number | null;
  expectedLikes: number | null;
  expectedComments: number | null;
  expectedFollows?: number | null;
  promotionGoal: string | null;
  order: number;
  createdAt: string;
  updatedAt?: string | null;
  amount: number;
  bonusAmount: number;
  bonusStatus: string;
  isMetrixOverflowed?: boolean;
}

export interface MilestoneSubmission {
  id: string;
  submissionDescription: string;
  submissionAttachments: string[];
  submissionLiveLinks: string[];
  requestedAmount: string;
  submittedByRole: string;
  rejectionReason: string | null;
  isClientApproved: boolean;
  achievedReach: number;
  achievedViews: number;
  achievedLikes: number;
  achievedComments: number;
  achievedFollows?: number | null;
  paidAmount: string;
  paymentStatus: string;
  adminFeedback: string | null;
  status: string;
  assignmentId: string;
  milestoneId: string;
  assignedMilestoneId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneDetailResponse {
  success: boolean;
  data: {
    jobId: string;
    campaignId: string;
    milestone: MilestoneDetail;
    status: MilestoneStatus;
    latestSubmission: MilestoneSubmission | null;
    submissions: MilestoneSubmission[];
  };
}

// POST /campaign/influencer/milestone/:milestoneId/submit
export interface SubmitMilestonePayload {
  description: string;
  liveLinks: string[];
  proofAttachments: string[];
  achievedViews: number;
  achievedReach: number;
  achievedLikes: number;
  achievedComments: number;
}

export interface SubmitMilestoneResponse {
  success: boolean;
  message: string;
}

// PATCH /campaign/influencer/submission/:submissionId/resubmit
export interface ResubmitMilestonePayload {
  description?: string;
  liveLinks?: string[];
  proofAttachments?: string[];
  achievedViews?: number;
  achievedReach?: number;
  achievedLikes?: number;
  achievedComments?: number;
}

export interface ResubmitMilestoneResponse {
  success: boolean;
  message: string;
}

// PATCH update metrics (same endpoint as resubmit)
export interface UpdateMetricsPayload {
  proofAttachments?: string[];
  achievedViews: number;
  achievedReach: number;
  achievedLikes: number;
  achievedComments: number;
}

// GET /campaign/influencer/submissions
export interface SubmissionListItem {
  id: string;
  campaignName: string;
  milestoneTitle: string;
  amount: string;
  status: string;
  paymentStatus: string;
  submittedAt: string;
  adminFeedback: string | null;
}

export interface SubmissionListResponse {
  success: boolean;
  count: number;
  data: SubmissionListItem[];
}

// GET /campaign/influencer/submissions/:submissionId
export interface SubmissionDetail {
  id: string;
  campaignName: string;
  milestoneTitle: string;
  amount: string;
  description: string;
  attachments: string[];
  liveLinks: string[];
  status: string;
  paymentStatus: string;
  adminFeedback: string | null;
  rejectionReason: string | null;
  metrics: {
    views: number;
    reach: number;
    likes: number;
    comments: number;
  };
  createdAt: string;
}

export interface SubmissionDetailResponse {
  success: boolean;
  data: SubmissionDetail;
}

// GET /campaign/influencer/campaign/:campaignId/withdrawable-balance
export interface WithdrawableBalanceData {
  campaignId: string;
  campaignName: string;
  totalBudget: number;
  financials: {
    totalInReview: number;
    totalApproved: number;
    totalPaid: number;
    pendingWithdrawalAmount: number;
    availableToWithdraw: number;
  };
}

export interface WithdrawableBalanceResponse {
  success: boolean;
  data: WithdrawableBalanceData;
}

// POST /campaign/influencer/withdrawal/request
export interface WithdrawalRequestPayload {
  campaignId: string;
  amount: number;
}

export interface WithdrawalRequestResponse {
  success: boolean;
  message: string;
}
