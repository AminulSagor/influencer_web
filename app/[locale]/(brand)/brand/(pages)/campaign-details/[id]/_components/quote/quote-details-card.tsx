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
import { serviceClient } from "@/service/base/axios_client";

type QuoteDetailsCardProps = {
  campaign: QuoteDetailsCampaign;
  onRefresh?: () => void | Promise<void>;
};

type NegotiationItem = {
  id: string;
  sender: "client" | "admin";
  action: string;
  message: string | null;
  proposedBaseBudget: string | null;
  proposedTotalBudget: string | null;
  isRead: boolean;
  createdAt: string;
};

type NegotiationResponse = {
  success: boolean;
  data: {
    campaign: {
      id: string;
      campaignName: string;
      status: string;
      negotiationTurn: string;
      yourTurn: boolean;
    };
    negotiations: NegotiationItem[];
  };
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

function InfoBadge({ label }: { label: string }) {
  return (
    <div className="mb-3 inline-flex rounded-full border border-light-green/30 bg-white/80 px-3 py-1 text-xs text-light-green">
      {label}
    </div>
  );
}

export default function QuoteDetailsCard({
  campaign,
  onRefresh,
}: QuoteDetailsCardProps) {
  const [isRequoteOpen, setIsRequoteOpen] = React.useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = React.useState(false);
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

  const isNegotiating = campaign.status === "negotiating";

  const fetchNegotiations = React.useCallback(async () => {
    if (!isNegotiating) {
      setNegotiations([]);
      return;
    }

    try {
      setIsLoadingNegotiations(true);
      const response = await serviceClient.get<NegotiationResponse>(
        `/campaign/${campaign.id}/negotiations`,
      );
      setNegotiations(response.data.data.negotiations ?? []);
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

  const latestNegotiation = React.useMemo(() => {
    if (!negotiations.length) return null;
    return (
      [...negotiations].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )[negotiations.length - 1] ?? null
    );
  }, [negotiations]);

  const latestAdminRequest = React.useMemo(() => {
    return (
      [...negotiations]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .reverse()
        .find(
          (item) =>
            item.sender === "admin" &&
            item.action === "request" &&
            !!item.proposedBaseBudget,
        ) ?? null
    );
  }, [negotiations]);

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
    if (showConfirmedState) return "Confirmed Budget";
    if (isPaid) return "Paid";
    if (isNegotiating && latestNegotiation?.sender === "admin") {
      return "Current Quote · Admin Offer";
    }
    if (isNegotiating && latestNegotiation?.sender === "client") {
      return "Current Quote · Your Counter Offer";
    }
    return "Initial Submission";
  }, [showConfirmedState, isPaid, isNegotiating, latestNegotiation]);

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

  return (
    <>
      <Card>
        <CardContent>
          <h2 className="text-base font-semibold text-Primary">
            Quote Details
          </h2>

          <div className="mt-2 overflow-x-auto rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white p-4 no-scrollbar">
            <div className="text-sm">
              <InfoBadge label={quoteStateLabel} />

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <SummaryRow
                    label="Base Campaign Budget"
                    value={formatBDT(displayBaseBudget)}
                  />

                  <SummaryRow
                    label="VAT/Tax"
                    value={formatBDT(displayVatAmount)}
                  />

                  <Divider />

                  <SummaryRow
                    label="Total Campaign Cost"
                    value={formatBDT(displayTotalCost)}
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
                {isLoadingNegotiations && isNegotiating && (
                  <div className="flex items-center justify-center py-2">
                    <Loader className="h-5 w-5 border-2 border-Primary border-t-transparent" />
                  </div>
                )}

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
                      onClick={() => setIsAcceptOpen(true)}
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

                {!isNegotiating &&
                  !canPay &&
                  !showConfirmedState &&
                  !isPaid && (
                    <StatusButton label="Waiting for admin response" />
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
    </>
  );
}
