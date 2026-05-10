export type FinanceTableTab = "agency" | "influencer" | "brand";

export type PendingClearanceApiTab = "agencypayout" | "influencerpayout";

export type CompletedPaymentApiTab =
  | "agencypayout"
  | "influencerpayout"
  | "brandpayment";

export type PendingPaymentType =
  | "milestonepayment"
  | "partialpayment"
  | "finalpayment";

export type CompletedPaymentType =
  | "milestonepayment"
  | "partialpayment"
  | "finalpayment";

export type AmountSortType = "high" | "low";

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/* ================= PENDING AGENCY / INFLUENCER ================= */

export type PendingClearanceItem = {
  id: string;
  submissionId?: string;
  type: "agency" | "influencer";
  transactionType: string;
  payeeName: string;
  email: string;
  phone: string;
  campaign: string;
  amountRequested: number;
  milestoneReachedDate: string;
  requestDate: string;
};

export type PendingClearanceResponse = {
  success: boolean;
  data: PendingClearanceItem[];
  meta: PaginationMeta;
};

export type PendingClearanceQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tab?: PendingClearanceApiTab;
  paymentType?: PendingPaymentType;
  amountSort?: AmountSortType;
  dateFrom?: string;
  dateTo?: string;
};

/* ================= PENDING BRAND ================= */

export type BrandPendingPaymentItem = {
  campaignId: string;
  clientId: string;
  brandName: string;
  profileImage?: string;
  role: string;
  email: string;
  phone: string;
  campaignName: string;
  campaignCreatedAt: string;
  lastCampaignPaidDate: string;
  milestoneLastUpdatedAt: string;
  lastPaidAmount: number;
  dueAmount: number;
};

export type BrandPendingPaymentResponse = {
  success: boolean;
  data: BrandPendingPaymentItem[];
  meta: PaginationMeta;
};

export type BrandPendingPaymentQuery = {
  page?: number;
  limit?: number;
  search?: string;
  amountSort?: AmountSortType;
  dateFrom?: string;
  dateTo?: string;
};

/* ================= COMPLETED ================= */

export type CompletedPaymentItem = {
  id: string;
  tabType: CompletedPaymentApiTab;
  payeeInfo: {
    name: string;
    image?: string;
    role: string;
  };
  campaign: string;
  milestoneCompleted: string;
  campaignBudget?: number;
  vatPercent?: number;
  paidByClient?: number;
  talentFee?: number;
  profit?: number;
  agreedAmount?: number;
  totalPaid?: number;
  sortAmount?: number;
  date: string;
};

export type CompletedPaymentResponse = {
  success: boolean;
  data: CompletedPaymentItem[];
  meta: PaginationMeta;
};

export type CompletedPaymentQuery = {
  page?: number;
  limit?: number;
  search?: string;
  tab?: CompletedPaymentApiTab;
  paymentType?: CompletedPaymentType;
  amountSort?: AmountSortType;
  dateFrom?: string;
  dateTo?: string;
};