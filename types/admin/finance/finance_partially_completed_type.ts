import type { PaginationMeta } from "@/types/service-response";

	export type PartiallyCompletedTab = "agencypayout" | "influencerpayout" | "brandpayment";

export type PartiallyCompletedItem = {
  id: string;
  tabType: PartiallyCompletedTab;
  payeeInfo: {
    name: string;
    image?: string;
    role: string;
  };
  campaign: string;
  milestoneCompleted: string;
  agreedAmount: number;
  totalPaid: number;
  status: string;
  sortAmount: number;
  date: string;
};

export type PartiallyCompletedResponse = {
  success: boolean;
  data: PartiallyCompletedItem[];
  meta: PaginationMeta;
};

export type PartiallyCompletedQuery = {
  tab?: PartiallyCompletedTab;
  page?: number;
  limit?: number;
};

