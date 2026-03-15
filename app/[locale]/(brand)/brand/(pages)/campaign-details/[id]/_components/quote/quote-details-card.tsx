"use client";

import React from "react";
import { useRouter } from "next/navigation";
import QuoteAcceptDialog from "./dialog/quote-accept-paid-ad-dialog";
import { getQuoteSummary, type QuoteDetailsCampaign } from "./quote-utils";
import { useQuoteActions } from "@/hooks/use-quote-actions";
import { getCampaignNegotiations } from "@/service/client/negotiation/get-campaign-negotiations";
import type { NegotiationItem } from "@/types/client/negotiation/negotiation.types";
import QuoteDetailsCardInfluencer from "./quote-details-card-influencer";
import QuoteDetailsCardPaidAd from "./quote-details-card-paid-ad";
import QuoteRequoteDialog from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/quote/dialog/quote-requote-dialog";

type QuoteDetailsCardProps = {
  campaign: QuoteDetailsCampaign;
  onRefresh?: () => void | Promise<void>;
};

export default function QuoteDetailsCard({
  campaign,
  onRefresh,
}: QuoteDetailsCardProps) {
  console.log(campaign.id)
  const [isRequoteOpen, setIsRequoteOpen] = React.useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = React.useState(false);
  const [isInfluencerPaymentOpen, setIsInfluencerPaymentOpen] =
    React.useState(false);
  const [isLoadingNegotiations, setIsLoadingNegotiations] =
    React.useState(false);
  const [negotiations, setNegotiations] = React.useState<NegotiationItem[]>([]);
  const router = useRouter();

  const {
    baseBudget,
    vatAmount,
    totalCost,
    paidAmount,
    dueAmount,
    isInfluencerPromotion,
    canPay,
    isPaid,
    showConfirmedState,
  } = getQuoteSummary(campaign);

  const normalizedStatus = campaign.status?.toLowerCase();
  const isNegotiating = normalizedStatus === "negotiating";
  const isReceived = normalizedStatus === "received";

  const fetchNegotiations = React.useCallback(async () => {
    if (!isNegotiating) {
      setNegotiations([]);
      return;
    }

    try {
      setIsLoadingNegotiations(true);
      const data = await getCampaignNegotiations(campaign.id);
      setNegotiations(data);
    } catch (error) {
      console.error("Failed to load negotiations", error);
      setNegotiations([]);
    } finally {
      setIsLoadingNegotiations(false);
    }
  }, [campaign.id, isNegotiating]);

  React.useEffect(() => {
    void fetchNegotiations();
  }, [fetchNegotiations]);

  const sortedNegotiations = React.useMemo(() => {
    return [...negotiations].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [negotiations]);

  const latestNegotiation = React.useMemo(() => {
    if (!sortedNegotiations.length) return null;
    return sortedNegotiations[sortedNegotiations.length - 1] ?? null;
  }, [sortedNegotiations]);

  const latestAdminRequest = React.useMemo(() => {
    return (
      [...sortedNegotiations]
        .reverse()
        .find(
          (item) =>
            item.sender === "admin" &&
            item.action === "request" &&
            !!item.proposedBaseBudget,
        ) ?? null
    );
  }, [sortedNegotiations]);

  const displayBaseBudget = React.useMemo(() => {
    if (
      isNegotiating &&
      latestNegotiation?.proposedBaseBudget &&
      !Number.isNaN(Number(latestNegotiation.proposedBaseBudget))
    ) {
      return Number(latestNegotiation.proposedBaseBudget);
    }

    return baseBudget;
  }, [isNegotiating, latestNegotiation, baseBudget]);

  const displayTotalCost = React.useMemo(() => {
    if (
      isNegotiating &&
      latestNegotiation?.proposedTotalBudget &&
      !Number.isNaN(Number(latestNegotiation.proposedTotalBudget))
    ) {
      return Number(latestNegotiation.proposedTotalBudget);
    }

    return totalCost;
  }, [isNegotiating, latestNegotiation, totalCost]);

  const displayVatAmount = React.useMemo(() => {
    if (isNegotiating && latestNegotiation?.proposedBaseBudget) {
      const proposedBase = Number(latestNegotiation.proposedBaseBudget);
      const proposedTotal = latestNegotiation.proposedTotalBudget
        ? Number(latestNegotiation.proposedTotalBudget)
        : null;

      if (proposedTotal != null && !Number.isNaN(proposedTotal)) {
        return Math.max(proposedTotal - proposedBase, 0);
      }

      return proposedBase * 0.15;
    }

    return vatAmount;
  }, [isNegotiating, latestNegotiation, vatAmount]);

  const quoteStateLabel = React.useMemo(() => {
    if (showConfirmedState) {
      return isInfluencerPromotion ? "Confirmed Quote" : "Confirmed Budget";
    }

    if (isPaid) return "Paid";

    if (isReceived) {
      return isInfluencerPromotion
        ? "Quote Awaiting Admin Review"
        : "Budget Awaiting Admin Review";
    }

    if (isNegotiating && latestNegotiation?.sender === "admin") {
      return isInfluencerPromotion
        ? "Current Quote · Admin Offer"
        : "Current Budget · Admin Offer";
    }

    if (isNegotiating && latestNegotiation?.sender === "client") {
      return isInfluencerPromotion
        ? "Current Quote · Your Counter Offer"
        : "Current Budget · Your Counter Offer";
    }

    return isInfluencerPromotion ? "Initial Submission" : "Initial Budget";
  }, [
    showConfirmedState,
    isPaid,
    isReceived,
    isNegotiating,
    latestNegotiation,
    isInfluencerPromotion,
  ]);

  const showQuoteActions =
    isNegotiating &&
    !!latestAdminRequest &&
    !isLoadingNegotiations &&
    latestNegotiation?.sender === "admin";

  const {
    submitRequote,
    acceptQuote,
    payDue,
    isSubmittingRequote,
    isSubmittingAccept,
    isSubmittingPayment,
  } = useQuoteActions({
    onSuccess: async () => {
      if (onRefresh) {
        await onRefresh();
      } else {
        router.refresh();
      }

      await fetchNegotiations();
    },
  });

  const handleSubmitRequote = async (payload: {
    proposedBaseBudget: number;
    clientProposedServiceFee?: string;
  }) => {
    await submitRequote({
      campaignId: campaign.id,
      proposedBaseBudget: payload.proposedBaseBudget,
      clientProposedServiceFee: payload.clientProposedServiceFee,
    });
  };

  const handleAcceptBudget = async () => {
    await acceptQuote({ campaignId: campaign.id });
  };

  const handleInfluencerAcceptAndPay = async (amount: number) => {
    await acceptQuote({ campaignId: campaign.id });
    await payDue({
      campaignId: campaign.id,
      amount,
    });
  };

  const handlePayDue = async (amount: number) => {
    await payDue({
      campaignId: campaign.id,
      amount,
    });
  };

  const sharedProps = {
    campaign,
    quoteStateLabel,
    displayBaseBudget,
    displayVatAmount,
    displayTotalCost,
    paidAmount,
    dueAmount,
    isPaid,
    isNegotiating,
    isReceived,
    canPay,
    showConfirmedState,
    showQuoteActions,
    isLoadingNegotiations,
    isSubmittingAccept,
    isSubmittingPayment,
    onOpenRequote: () => setIsRequoteOpen(true),
    onOpenAccept: () => setIsAcceptOpen(true),
    onOpenInfluencerPayment: () => setIsInfluencerPaymentOpen(true),
    onInfluencerAcceptAndPay: handleInfluencerAcceptAndPay,
    onPayDue: handlePayDue,
  };

  return (
    <>
      {isInfluencerPromotion ? (
        <QuoteDetailsCardInfluencer {...sharedProps} />
      ) : (
        <QuoteDetailsCardPaidAd {...sharedProps} />
      )}

      <QuoteRequoteDialog
        open={isRequoteOpen}
        onOpenChange={setIsRequoteOpen}
        campaign={campaign}
        isSubmitting={isSubmittingRequote}
        onSubmit={handleSubmitRequote}
      />

      {!isInfluencerPromotion && (
        <QuoteAcceptDialog
          open={isAcceptOpen}
          onOpenChange={setIsAcceptOpen}
          campaign={campaign}
          isSubmitting={isSubmittingAccept}
          onConfirm={handleAcceptBudget}
          onRequote={() => {
            setIsAcceptOpen(false);
            setIsRequoteOpen(true);
          }}
          adminProposedBaseBudget={
            latestAdminRequest?.proposedBaseBudget
              ? Number(latestAdminRequest.proposedBaseBudget)
              : null
          }
          adminProposedTotalBudget={
            latestAdminRequest?.proposedTotalBudget
              ? Number(latestAdminRequest.proposedTotalBudget)
              : null
          }
        />
      )}

      {isInfluencerPromotion && (
        <QuoteDetailsCardInfluencer.PaymentDialog
          open={isInfluencerPaymentOpen}
          onOpenChange={setIsInfluencerPaymentOpen}
          campaign={campaign}
          dueAmount={displayTotalCost}
          isSubmitting={isSubmittingAccept || isSubmittingPayment}
          onSubmit={handleInfluencerAcceptAndPay}
        />
      )}
    </>
  );
}
