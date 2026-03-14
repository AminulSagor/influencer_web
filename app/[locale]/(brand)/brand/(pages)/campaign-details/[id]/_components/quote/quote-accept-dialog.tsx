"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { formatBDT, type QuoteDetailsCampaign } from "./quote-utils";
import Loader from "@/components/spin-loader";

type QuoteAcceptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: QuoteDetailsCampaign;
  isSubmitting?: boolean;
  onConfirm: () => Promise<void> | void;
  onRequote: () => void;
  adminProposedBaseBudget?: number | null;
  adminProposedTotalBudget?: number | null;
};

export default function QuoteAcceptDialog({
  open,
  onOpenChange,
  campaign,
  isSubmitting = false,
  onConfirm,
  onRequote,
  adminProposedBaseBudget,
  adminProposedTotalBudget,
}: QuoteAcceptDialogProps) {
  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  const dialogTitle = isInfluencerPromotion
    ? "Confirm Quote?"
    : "Confirm Budget?";

  const confirmButtonText = isInfluencerPromotion
    ? "Accept Quote"
    : "Accept Budget";

  const loadingText = isInfluencerPromotion ? "Accepting..." : "Confirming...";

  const vatAmount = React.useMemo(() => {
    if (adminProposedBaseBudget == null) return 0;

    if (adminProposedTotalBudget != null) {
      return Math.max(adminProposedTotalBudget - adminProposedBaseBudget, 0);
    }

    return adminProposedBaseBudget * 0.15;
  }, [adminProposedBaseBudget, adminProposedTotalBudget]);

  const totalCost = React.useMemo(() => {
    if (adminProposedTotalBudget != null) {
      return adminProposedTotalBudget;
    }

    if (adminProposedBaseBudget != null) {
      return adminProposedBaseBudget + vatAmount;
    }

    return 0;
  }, [adminProposedBaseBudget, adminProposedTotalBudget, vatAmount]);

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const handleRequote = () => {
    onOpenChange(false);
    onRequote();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-light-green">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border border-light-green/40 bg-[#F7F7E9] p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base text-black">Admin Proposed Budget</p>
                <p className="text-base font-semibold text-light-green">
                  {formatBDT(adminProposedBaseBudget ?? 0)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-base text-black">VAT/Tax</p>
                <p className="text-base font-semibold text-light-green">
                  {formatBDT(vatAmount)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-base font-semibold text-light-green">
              Total Campaign Cost
            </p>
            <p className="mt-1 text-base font-semibold text-light-green">
              {formatBDT(totalCost)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleRequote}
              className="rounded-xl border border-light-gray bg-white py-3 text-base text-black"
            >
              Requote
            </button>

            <PrimaryButton onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>{loadingText}</span>
                </span>
              ) : (
                confirmButtonText
              )}
            </PrimaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
