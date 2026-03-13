"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import {
  buildPaidAdPreview,
  formatBDT,
  formatRangeBDT,
  formatRangeDollar,
  getDollarRate,
  getServiceFeeRange,
  getVatRate,
  parseNumericInput,
  toNumber,
  type QuoteDetailsCampaign,
} from "./quote-utils";
import Loader from "@/components/spin-loader";

type QuoteRequoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: QuoteDetailsCampaign;
  isSubmitting?: boolean;
  onSubmit: (payload: {
    proposedBaseBudget: number;
    clientProposedServiceFee?: string;
  }) => Promise<void> | void;
};

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-black/80">{label}</p>
      <p
        className={[
          "text-sm text-light-green",
          strong ? "font-semibold" : "font-medium",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

export default function QuoteRequoteDialog({
  open,
  onOpenChange,
  campaign,
  isSubmitting = false,
  onSubmit,
}: QuoteRequoteDialogProps) {
  const initialBudget = toNumber(campaign.baseBudget);
  const [proposedBaseBudget, setProposedBaseBudget] =
    React.useState(initialBudget);

  React.useEffect(() => {
    if (open) {
      setProposedBaseBudget(initialBudget);
    }
  }, [open, initialBudget]);

  const isPaidAd = campaign.campaignType === "paid_ad";
  const vatRate = getVatRate(campaign);
  const feeRangeText = getServiceFeeRange(campaign);
  const dollarRate = getDollarRate(campaign);

  const vatAmount = Math.round((proposedBaseBudget * vatRate) / 100);
  const totalCampaignCost = proposedBaseBudget + vatAmount;

  const paidAdPreview = buildPaidAdPreview(
    proposedBaseBudget,
    feeRangeText,
    dollarRate,
    vatRate,
  );

  const handleSubmit = async () => {
    if (proposedBaseBudget <= 0) return;

    await onSubmit({
      proposedBaseBudget,
      clientProposedServiceFee: isPaidAd ? feeRangeText : undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-light-green">
            Requote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="text-base font-medium text-black">
              Requote your campaign budget
            </p>

            <Input
              value={
                proposedBaseBudget
                  ? proposedBaseBudget.toLocaleString("en-US")
                  : ""
              }
              onChange={(e) =>
                setProposedBaseBudget(parseNumericInput(e.target.value))
              }
              inputMode="numeric"
              placeholder="0"
              className="mt-4 h-12 rounded-xl border-light-green text-center text-base text-light-green"
            />
          </div>

          <div>
            <p className="text-base font-medium text-black">
              New Requote Overview
            </p>

            <div className="mt-3 rounded-xl border border-light-green/40 bg-[#F7F7E9] p-4">
              <div className="space-y-2">
                <Row
                  label="Base Campaign Budget"
                  value={formatBDT(proposedBaseBudget)}
                />
                <Row
                  label={`VAT/Tax (${vatRate}%)`}
                  value={formatBDT(vatAmount)}
                />
              </div>

              <div className="my-3 h-px w-full bg-black/10" />

              <Row
                label="Total Campaign Cost"
                value={formatBDT(totalCampaignCost)}
                strong
              />
            </div>
          </div>

          {isPaidAd && (
            <div className="rounded-xl border border-light-green/40 bg-[#F7F7E9] p-4">
              <div className="space-y-2">
                <Row
                  label={`Agency Fee (${feeRangeText})`}
                  value={formatRangeBDT(
                    paidAdPreview.agencyFeeMin,
                    paidAdPreview.agencyFeeMax,
                  )}
                />
                <Row
                  label="Campaign Budget Excluding Agency Fee"
                  value={formatRangeBDT(
                    paidAdPreview.excludingAgencyFeeMin,
                    paidAdPreview.excludingAgencyFeeMax,
                  )}
                />
                <Row
                  label={`In Dollars (Based On Avg. ${dollarRate} BDT/$ )`}
                  value={formatRangeDollar(
                    paidAdPreview.dollarsMin,
                    paidAdPreview.dollarsMax,
                  )}
                  strong
                />
              </div>
            </div>
          )}

          <PrimaryButton
            className="w-full"
            disabled={proposedBaseBudget <= 0 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Submitting...</span>
              </span>
            ) : (
              "Requote To Admin"
            )}
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
