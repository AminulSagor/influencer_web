import type { PaginationMeta } from "@/types/service-response";

export type PendingBonusItem = {
  payeeInfo: {
    id: string;
    name: string;
    image?: string;
    role: string;
    email: string;
    phone: string;
  };
  paymentType: string;
  campaign: {
    id: string;
    name: string;
    totalBudget: number;
    baseBudget?: number;
    lastMilestoneUpdatedAt: string;
  };
  bonusAmount: number;
  bonusRecordIds: string[];
};

export type PendingBonusesSummary = {
  totalPendingBonus: number;
  totalAgencyBonus: number;
  totalInfluencerBonus: number;
};

export type PendingBonusesResponse = {
  success: boolean;
  summary: PendingBonusesSummary;
  data: PendingBonusItem[];
  meta: PaginationMeta;
};

export type PendingBonusesQuery = {
  page?: number;
  limit?: number;
};

export type PayoutBonusTargetType = "agency" | "influencer";

export type PayoutBonusParams = {
  campaignId: string;
  targetType: PayoutBonusTargetType;
  targetId: string;
  amount: number;
};

