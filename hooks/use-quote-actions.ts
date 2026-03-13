"use client";

import { useState } from "react";
import {
  acceptCampaignQuote,
  payClientCampaignDue,
  submitCampaignCounterOffer,
} from "@/service/client/campaigns/quote-actions";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type UseQuoteActionsProps = {
  onSuccess?: () => void | Promise<void>;
};

const getMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export function useQuoteActions({ onSuccess }: UseQuoteActionsProps = {}) {
  const [isSubmittingRequote, setIsSubmittingRequote] = useState(false);
  const [isSubmittingAccept, setIsSubmittingAccept] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const submitRequote = async (payload: {
    campaignId: string;
    proposedBaseBudget: number;
    clientProposedServiceFee?: string;
  }) => {
    try {
      setIsSubmittingRequote(true);

      const response = await submitCampaignCounterOffer(payload);

      notifySuccess(response.message || "Requote submitted successfully.");
      await onSuccess?.();

      return response;
    } catch (error) {
      notifyError(getMessage(error, "Failed to submit requote."));
      throw error;
    } finally {
      setIsSubmittingRequote(false);
    }
  };

  const acceptQuote = async (payload: { campaignId: string }) => {
    try {
      setIsSubmittingAccept(true);

      const response = await acceptCampaignQuote(payload);

      notifySuccess(response.message || "Quote accepted successfully.");
      await onSuccess?.();

      return response;
    } catch (error) {
      notifyError(getMessage(error, "Failed to accept quote."));
      throw error;
    } finally {
      setIsSubmittingAccept(false);
    }
  };

  const payDue = async (payload: { campaignId: string; amount: number }) => {
    try {
      setIsSubmittingPayment(true);

      const response = await payClientCampaignDue(payload);

      notifySuccess(response.message || "Payment completed successfully.");
      await onSuccess?.();

      return response;
    } catch (error) {
      notifyError(getMessage(error, "Failed to pay due."));
      throw error;
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return {
    submitRequote,
    acceptQuote,
    payDue,
    isSubmittingRequote,
    isSubmittingAccept,
    isSubmittingPayment,
  };
}
