"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import {
  getQuoteSummary,
  formatBDT,
  type QuoteDetailsCampaign,
} from "./quote-utils";
import Loader from "@/components/spin-loader";

type QuoteAcceptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: QuoteDetailsCampaign;
  isSubmitting?: boolean;
  onConfirm: () => Promise<void> | void;
  onRequote: () => void;
};

export default function QuoteAcceptDialog({
  open,
  onOpenChange,
  campaign,
  isSubmitting = false,
  onConfirm,
  onRequote,
}: QuoteAcceptDialogProps) {
  const { baseBudget, vatAmount, totalCost } = getQuoteSummary(campaign);

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
            Confirm Budget ?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border border-light-green/40 bg-[#F7F7E9] p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base text-black">Base Campaign Budget</p>
                <p className="text-base font-semibold text-light-green">
                  {formatBDT(baseBudget)}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-base text-black">VAT/Tax (15%)</p>
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
                  <span>Confirming...</span>
                </span>
              ) : (
                "Confirm"
              )}
            </PrimaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
