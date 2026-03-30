"use client";

import axios from "axios";
import { serviceClient } from "@/service/base/axios_client";
import {
  AcceptQuotePayload,
  CounterOfferPayload,
  PayDuePayload,
  QuoteActionResponse,
} from "@/types/client/campaigns/quote-actions";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export async function submitCampaignCounterOffer(
  payload: CounterOfferPayload,
): Promise<QuoteActionResponse> {
  try {
    const response = await serviceClient.post<QuoteActionResponse>(
      "/campaign/negotiation/counter-offer",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to submit counter offer."));
  }
}

export async function acceptCampaignQuote(
  payload: AcceptQuotePayload,
): Promise<QuoteActionResponse> {
  try {
    const response = await serviceClient.post<QuoteActionResponse>(
      "/campaign/negotiation/accept",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to accept quote."));
  }
}

export async function payClientCampaignDue(
  payload: PayDuePayload,
): Promise<QuoteActionResponse> {
  try {
    const response = await serviceClient.post<QuoteActionResponse>(
      "/campaign/client/pay-due",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to pay due."));
  }
}
