"use client";

import PayDueDialog from "../../../../payment/_components/pay-due-dialog";
import {
  ActionButton,
  SharedQuoteLayout,
  StatusButton,
} from "./quote-details-shared";
import type { QuoteDetailsCampaign } from "./quote-utils";

type QuoteDetailsCardPaidAdProps = {
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
  showDisabledQuoteActions: boolean;
  isLoadingNegotiations: boolean;
  isSubmittingAccept: boolean;
  isSubmittingPayment: boolean;
  onOpenRequote: () => void;
  onOpenAccept: () => void;
  onOpenInfluencerPayment: () => void;
  onInfluencerAcceptAndPay: (amount: number) => Promise<void>;
  onPayDue: (amount: number) => Promise<void>;
};

export default function QuoteDetailsCardPaidAd({
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
  showDisabledQuoteActions,
  isLoadingNegotiations,
  isSubmittingAccept,
  isSubmittingPayment,
  onOpenRequote,
  onOpenAccept,
  onPayDue,
}: QuoteDetailsCardPaidAdProps) {
  const actionSection = (
    <>
      {showQuoteActions && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ActionButton label="Requote" onClick={onOpenRequote} />
          <ActionButton
            label="Accept Budget"
            onClick={onOpenAccept}
            loading={isSubmittingAccept}
            variant="primary"
          />
        </div>
      )}

      {showDisabledQuoteActions && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ActionButton label="Requote" disabled />
          <ActionButton label="Accept Budget" disabled variant="primary" />
        </div>
      )}

      {isReceived && !isLoadingNegotiations && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ActionButton label="Requote" disabled />
          <ActionButton label="Accept Budget" disabled variant="primary" />
        </div>
      )}

      {!showQuoteActions && !showDisabledQuoteActions && canPay && !isPaid && (
        <PayDueDialog
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
        <StatusButton label="Budget Confirmed" />
      )}

      {isPaid && <StatusButton label="Paid" />}
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
      showConfirmedState={showConfirmedState}
      actionSection={actionSection}
    />
  );
}
