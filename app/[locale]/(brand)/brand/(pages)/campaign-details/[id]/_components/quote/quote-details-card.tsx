"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatBDT,
  getQuoteSummary,
  type QuoteDetailsCampaign,
} from "./quote-utils";
import QuoteRequoteDialog from "./quote-requote-dialog";
import QuoteAcceptDialog from "./quote-accept-dialog";
import QuotePayDueDialog from "./quote-pay-due-dialog";
import { useQuoteActions } from "@/hooks/use-quote-actions";
import { useRouter } from "next/navigation";
import Loader from "@/components/spin-loader";

type QuoteDetailsCardProps = {
  campaign: QuoteDetailsCampaign;
  onRefresh?: () => void | Promise<void>;
};

function SummaryRow({
  label,
  value,
  valueClassName = "font-semibold text-light-green",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm">{label}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px w-full bg-black/15" />;
}

function StatusButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="w-full cursor-not-allowed rounded-md border border-light-gray bg-[#EFEFEF] py-2 text-sm text-black/70"
    >
      {label}
    </button>
  );
}

export default function QuoteDetailsCard({
  campaign,
  onRefresh,
}: QuoteDetailsCardProps) {
  const [isRequoteOpen, setIsRequoteOpen] = React.useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = React.useState(false);
  const router = useRouter();

  const {
    baseBudget,
    vatAmount,
    totalCost,
    paidAmount,
    dueAmount,
    isInfluencerPromotion,
    showQuoteActions,
    canPay,
    isPaid,
    showConfirmedState,
  } = getQuoteSummary(campaign);

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
        return;
      }

      router.refresh();
    },
  });

  const acceptButtonLabel = isInfluencerPromotion
    ? "Accept Quote"
    : "Accept Budget";

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

  const handleAccept = async () => {
    await acceptQuote({ campaignId: campaign.id });
  };

  const handlePayDue = async (amount: number) => {
    await payDue({
      campaignId: campaign.id,
      amount,
    });
  };

  const handleAcceptClick = () => {
    if (isInfluencerPromotion) {
      void handleAccept();
      return;
    }

    setIsAcceptOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent>
          <h2 className="text-base font-semibold text-Primary">
            Quote Details
          </h2>

          <div className="mt-2 overflow-x-auto rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white p-4 no-scrollbar">
            <div className="text-sm">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <SummaryRow
                    label="Base Campaign Budget"
                    value={formatBDT(baseBudget)}
                  />

                  <SummaryRow label="VAT/Tax" value={formatBDT(vatAmount)} />

                  <Divider />

                  <SummaryRow
                    label="Total Campaign Cost"
                    value={formatBDT(totalCost)}
                    valueClassName="text-base font-semibold tracking-tight text-light-green"
                  />

                  {!showQuoteActions &&
                    (paidAmount > 0 || dueAmount > 0 || isPaid) && (
                      <>
                        <div className="mt-2" />
                        <SummaryRow
                          label="Paid"
                          value={formatBDT(paidAmount)}
                        />

                        {dueAmount > 0 && (
                          <>
                            <Divider />
                            <SummaryRow
                              label="Due"
                              value={formatBDT(dueAmount)}
                              valueClassName="text-base font-semibold tracking-tight text-light-green"
                            />
                          </>
                        )}
                      </>
                    )}
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-Secondary">
                  <span className="text-base font-semibold text-Primary">
                    ৳
                  </span>
                </div>
              </div>

              <div className="mt-4">
                {showQuoteActions && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setIsRequoteOpen(true)}
                      className="w-full rounded-md border border-light-gray bg-[#EFEFEF] py-2 text-sm text-black"
                    >
                      Requote
                    </button>

                    <button
                      type="button"
                      onClick={handleAcceptClick}
                      disabled={isSubmittingAccept}
                      className="w-full rounded-md border border-light-green bg-light-green py-2 text-sm text-white disabled:opacity-70"
                    >
                      {isSubmittingAccept ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Submitting...</span>
                        </span>
                      ) : (
                        acceptButtonLabel
                      )}
                    </button>
                  </div>
                )}

                {canPay && (
                  <QuotePayDueDialog
                    campaign={campaign}
                    dueAmount={dueAmount}
                    isSubmitting={isSubmittingPayment}
                    onSubmit={handlePayDue}
                  />
                )}

                {showConfirmedState && (
                  <StatusButton label="Budget Confirmed" />
                )}

                {isPaid && <StatusButton label="Paid" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <QuoteRequoteDialog
        open={isRequoteOpen}
        onOpenChange={setIsRequoteOpen}
        campaign={campaign}
        isSubmitting={isSubmittingRequote}
        onSubmit={handleSubmitRequote}
      />

      <QuoteAcceptDialog
        open={isAcceptOpen}
        onOpenChange={setIsAcceptOpen}
        campaign={campaign}
        isSubmitting={isSubmittingAccept}
        onConfirm={handleAccept}
        onRequote={() => setIsRequoteOpen(true)}
      />
    </>
  );
}
