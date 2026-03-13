import { ServiceResponse } from "@/types/service-response";

export type CounterOfferPayload = {
  campaignId: string;
  proposedBaseBudget: number;
  clientProposedServiceFee?: string;
};

export type AcceptQuotePayload = {
  campaignId: string;
};

export type PayDuePayload = {
  campaignId: string;
  amount: number;
};

export type QuoteActionResponseData = {
  id?: string;
  campaignId?: string;
  status?: string;
  message?: string;
};

export type QuoteActionResponse = ServiceResponse<QuoteActionResponseData>;