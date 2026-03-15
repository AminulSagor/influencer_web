"use client";

import React from "react";
import QuoteInfluencerAcceptPaymentDialog from "./dialog/quote-influencer-accept-payment-dialog";
import QuotePaidAdPayDueDialog from "./dialog/quote-paid-ad-pay-due-dialog";
import {
  ActionButton,
  SharedQuoteLayout,
  StatusButton,
} from "./quote-details-shared";
import type { QuoteDetailsCampaign } from "./quote-utils";

type QuoteDetailsCardInfluencerProps = {
  campaign: QuoteDetailsCampaign;
  quoteStateLabel: string;
  displayBaseBudget: number;
  displayVatAmount: number;
  displayTotalCost: number;
  paidAmount: number;
  dueAmount: number;
  isPaid: boolean;
  isNegotiating: boolean;
  isReceived: boolean;
  canPay: boolean;
  showConfirmedState: boolean;
  showQuoteActions: boolean;
  isLoadingNegotiations: boolean;
  isSubmittingAccept: boolean;
  isSubmittingPayment: boolean;
  onOpenRequote: () => void;
  onOpenAccept: () => void;
  onOpenInfluencerPayment: () => void;
  onInfluencerAcceptAndPay: (amount: number) => Promise<void>;
  onPayDue: (amount: number) => Promise<void>;
};

function QuoteDetailsCardInfluencer({
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
  onOpenRequote,
  onOpenInfluencerPayment,
  onPayDue,
}: QuoteDetailsCardInfluencerProps) {
  const actionSection = (
    <>
      {showQuoteActions && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ActionButton label="Requote" onClick={onOpenRequote} />
          <ActionButton
            label="Accept Quote"
            onClick={onOpenInfluencerPayment}
            loading={isSubmittingAccept || isSubmittingPayment}
            variant="primary"
          />
        </div>
      )}

      {isReceived && !isLoadingNegotiations && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ActionButton label="Requote" disabled />
          <ActionButton label="Accept Quote" disabled variant="primary" />
        </div>
      )}

      {!showQuoteActions && canPay && !isPaid && (
        <QuotePaidAdPayDueDialog
          campaign={campaign}
          dueAmount={dueAmount}
          isSubmitting={isSubmittingPayment}
          onSubmit={onPayDue}
        />
      )}

      {!isNegotiating &&
        !isReceived &&
        !canPay &&
        !showConfirmedState &&
        !isPaid && <StatusButton label="Waiting for admin response" />}

      {showConfirmedState && !canPay && !isPaid && (
        <StatusButton label="Quote Confirmed" />
      )}

      {isPaid && <StatusButton label="Fully Paid" />}
    </>
  );

  return (
    <SharedQuoteLayout
      quoteStateLabel={quoteStateLabel}
      displayBaseBudget={displayBaseBudget}
      displayVatAmount={displayVatAmount}
      displayTotalCost={displayTotalCost}
      paidAmount={paidAmount}
      dueAmount={dueAmount}
      isPaid={isPaid}
      showQuoteActions={showQuoteActions}
      isLoadingNegotiations={isLoadingNegotiations}
      isNegotiating={isNegotiating}
      actionSection={actionSection}
    />
  );
}

type PaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: QuoteDetailsCampaign;
  dueAmount: number;
  isSubmitting: boolean;
  onSubmit: (amount: number) => Promise<void>;
};

function InfluencerAcceptPaymentDialog({
  open,
  onOpenChange,
  campaign,
  dueAmount,
  isSubmitting,
  onSubmit,
}: PaymentDialogProps) {
  return (
    <QuoteInfluencerAcceptPaymentDialog
      open={open}
      onOpenChange={onOpenChange}
      campaign={campaign}
      dueAmount={dueAmount}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      hideTrigger
    />
  );
}

QuoteDetailsCardInfluencer.PaymentDialog = InfluencerAcceptPaymentDialog;

export default QuoteDetailsCardInfluencer as typeof QuoteDetailsCardInfluencer & {
  PaymentDialog: typeof InfluencerAcceptPaymentDialog;
};
