"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
} from "../quote-utils";
import Loader from "@/components/spin-loader";

type QuoteInfluencerAcceptPaymentDialogProps = {
  campaign: QuoteDetailsCampaign;
  dueAmount: number;
  isSubmitting?: boolean;
  onSubmit: (amount: number) => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  triggerLabel?: string;
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
        "min-w-[120px] flex-1 rounded-full px-3 py-2 text-center text-xs transition sm:flex-none sm:px-4 sm:text-sm",
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
  const t = useTranslations("brand.CampaignDetailsPage");

  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-xl border border-light-gray bg-white px-3 py-3 sm:px-4"
    >
      <span className="text-sm text-Primary sm:text-base">
        {t("creditDebitCard")}
      </span>
      <span className="text-sm text-black sm:text-base">⌄</span>
    </button>
  );
}

export default function QuoteInfluencerAcceptPaymentDialog({
  campaign,
  dueAmount,
  isSubmitting = false,
  onSubmit,
  open,
  onOpenChange,
  hideTrigger = false,
  triggerLabel = "Accept Quote",
}: QuoteInfluencerAcceptPaymentDialogProps) {
  const t = useTranslations("brand.CampaignDetailsPage");

  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";

  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const [activePreset, setActivePreset] = React.useState<PresetKey>(null);
  const minimumAmount = Math.ceil(dueAmount * 0.5);
  const [payAmount, setPayAmount] = React.useState(dueAmount);

  React.useEffect(() => {
    if (dialogOpen) {
      setPayAmount(dueAmount);
      setActivePreset("full");
    }
  }, [dialogOpen, dueAmount]);

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
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <button
            type="button"
            className="w-full rounded-md border border-light-gray bg-light-green py-2 text-sm text-white"
          >
            {triggerLabel}
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[90vh] w-[95vw] max-w-md overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-sm font-semibold text-Primary sm:text-base">
            {t("acceptQuoteStartCampaign")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5">
          <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green px-4 py-4 text-white sm:px-5 sm:py-5">
            <p className="truncate text-center text-sm font-medium sm:text-base">
              {campaign.campaignName ?? "Campaign"}
            </p>

            <div className="mt-4 text-center">
              <p className="text-xs text-white/90 sm:text-sm">
                {t("totalCampaignCost")}
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-base">
                {formatBDT(dueAmount)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#F0B37A] bg-[#FCE8D6] px-3 py-3 text-center sm:px-4">
            <p className="text-xs text-[#D97E2B] sm:text-sm">
              {t("minimumFundNeededToStartTheCampaign50")}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#D97E2B] sm:text-base">
              {formatBDT(minimumAmount)}
            </p>
          </div>

          <Input
            value={payAmount ? payAmount.toLocaleString("en-US") : ""}
            onChange={(e) => handleAmountInput(e.target.value)}
            inputMode="numeric"
            placeholder="0"
            className="h-11 rounded-xl border-light-gray text-center text-sm sm:h-12 sm:text-base"
          />

          <div className="flex flex-wrap items-stretch justify-center gap-2 sm:gap-3">
            <PercentButton
              label={t("payInFull100")}
              active={activePreset === "full"}
              onClick={() => handlePreset(100, "full")}
            />
            <PercentButton
              label={t("payMinimum50")}
              active={activePreset === "min"}
              onClick={() => handlePreset(50, "min")}
            />
            <PercentButton
              label={t("pay75")}
              active={activePreset === "seventyFive"}
              onClick={() => handlePreset(75, "seventyFive")}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-Primary sm:text-base">
              {t("paymentMethod")}
            </p>
            <div className="mt-3">
              <PaymentMethodButton />
            </div>
          </div>

          <PrimaryButton
            className="w-full text-sm sm:text-base"
            onClick={handleSubmit}
            disabled={!isValidAmount || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="h-4 w-4 border-2 border-white border-t-transparent" />
                <span>{t("processing")}</span>
              </span>
            ) : (
              `${t("acceptQuotePay")} ${formatBDT(payAmount)}`
            )}
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
