"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import {
  clampAmount,
  formatBDT,
  parseNumericInput,
  type QuoteDetailsCampaign,
} from "./quote-utils";
import Loader from "@/components/spin-loader";

type QuotePayDueDialogProps = {
  campaign: QuoteDetailsCampaign;
  dueAmount: number;
  isSubmitting?: boolean;
  onSubmit: (amount: number) => Promise<void> | void;
};

type PresetKey = "full" | "min" | "seventyFive" | null;

function PercentButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm transition",
        active
          ? "bg-light-green text-white"
          : "bg-[#EAEAEA] text-black hover:bg-[#E0E0E0]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PaymentMethodButton() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-xl border border-light-gray bg-white px-4 py-3"
    >
      <span className="text-base text-Primary">Credit / Debit Card</span>
      <span className="text-base text-black">⌄</span>
    </button>
  );
}

export default function QuotePayDueDialog({
  campaign,
  dueAmount,
  isSubmitting = false,
  onSubmit,
}: QuotePayDueDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState<PresetKey>(null);
  const minimumAmount = Math.ceil(dueAmount * 0.5);
  const [payAmount, setPayAmount] = React.useState(dueAmount);

  React.useEffect(() => {
    if (open) {
      setPayAmount(dueAmount);
      setActivePreset("full");
    }
  }, [open, dueAmount]);

  const handlePreset = (percent: number, key: Exclude<PresetKey, null>) => {
    const nextAmount = clampAmount(
      Math.round((dueAmount * percent) / 100),
      dueAmount,
    );
    setPayAmount(nextAmount);
    setActivePreset(key);
  };

  const handleAmountInput = (raw: string) => {
    setActivePreset(null);
    setPayAmount(clampAmount(parseNumericInput(raw), dueAmount));
  };

  const isValidAmount =
    payAmount > 0 && payAmount <= dueAmount && payAmount >= minimumAmount;

  const handleSubmit = async () => {
    if (!isValidAmount) return;
    await onSubmit(payAmount);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-md border border-light-gray bg-light-green py-2 text-sm text-white"
        >
          Pay Due
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <DialogTitle className="text-center text-base font-semibold text-Primary">
            Fund Your Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green px-5 py-5 text-white">
            <p className="truncate text-center text-base font-medium">
              {campaign.campaignName ?? "Campaign"}
            </p>

            <div className="mt-4 text-center">
              <p className="text-sm text-white/90">Total Due</p>
              <p className="mt-1 text-base font-semibold">
                {formatBDT(dueAmount)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#F0B37A] bg-[#FCE8D6] px-4 py-3 text-center">
            <p className="text-sm text-[#D97E2B]">
              Minimum Fund Needed To Start The Campaign (50%)
            </p>
            <p className="mt-1 text-base font-semibold text-[#D97E2B]">
              {formatBDT(minimumAmount)}
            </p>
          </div>

          <Input
            value={payAmount ? payAmount.toLocaleString("en-US") : ""}
            onChange={(e) => handleAmountInput(e.target.value)}
            inputMode="numeric"
            placeholder="0"
            className="h-12 rounded-xl border-light-gray text-center text-base"
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <PercentButton
              label="Pay In Full (100%)"
              active={activePreset === "full"}
              onClick={() => handlePreset(100, "full")}
            />
            <PercentButton
              label="Pay Minimum (50%)"
              active={activePreset === "min"}
              onClick={() => handlePreset(50, "min")}
            />
            <PercentButton
              label="Pay (75%)"
              active={activePreset === "seventyFive"}
              onClick={() => handlePreset(75, "seventyFive")}
            />
          </div>

          <div>
            <p className="text-base font-semibold text-Primary">
              Payment Method
            </p>
            <div className="mt-3">
              <PaymentMethodButton />
            </div>
          </div>

          <PrimaryButton
            className="w-full"
            onClick={handleSubmit}
            disabled={!isValidAmount || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Processing...</span>
              </span>
            ) : (
              `Pay Now ${formatBDT(payAmount)}`
            )}
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
