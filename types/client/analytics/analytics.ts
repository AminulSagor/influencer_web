import { PaginationMeta } from "@/types/service-response";

export type AnalyticsSortOrder = "low_to_high" | "high_to_low";

export type ClientAnalyticsTopCampaign = {
  id: string;
  title: string;
  budget: string | number | null;
  date: string;
};

export type ClientAnalyticsTopInfluencer = {
  id: string;
  name: string;
  completedJobs: number;
  profileImage?: string | null;
} | null;

export type ClientAnalyticsHighlights = {
  topCampaign: ClientAnalyticsTopCampaign | null;
  topInfluencer: ClientAnalyticsTopInfluencer;
};

export type ClientAnalyticsTransactionItem = {
  transactionId: string;
  campaignName: string;
  campaignId: string;
  amount: string;
  date: string;
  status: string;
};

export type ClientAnalyticsTransactions = {
  data: ClientAnalyticsTransactionItem[];
  meta: PaginationMeta;
};

export type ClientAnalyticsData = {
  highlights: ClientAnalyticsHighlights;
  transactions: ClientAnalyticsTransactions;
};

export type ClientAnalyticsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: AnalyticsSortOrder;
};