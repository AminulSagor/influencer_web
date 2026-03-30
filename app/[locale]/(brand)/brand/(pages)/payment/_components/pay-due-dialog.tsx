"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
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
} from "../../campaign-details/[id]/_components/quote/quote-utils";
import Loader from "@/components/spin-loader";
import { notifyError } from "@/utils/toast_util";
import {
  createPayDueSession,
  type LocaleCode,
} from "@/service/client/payment/campaign-payment.service";
import Image from "next/image";

type QuotePaidAdPayDueDialogProps = {
  campaign: QuoteDetailsCampaign;
  dueAmount: number;
  isSubmitting?: boolean;
  onSubmit: (amount: number) => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  triggerLabel?: string;
};

type PresetKey = "full" | "half" | "seventyFive" | null;

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
    <div className="flex w-full items-center justify-between rounded-xl border border-light-gray bg-white px-3 py-3 sm:px-4">
      <span className="text-sm text-Primary sm:text-base">
        {t("paymentMethod")}
      </span>
      <span className="text-sm text-black/70 sm:text-base">
        bKash • Nagad • Rocket • Card • Bank
      </span>
    </div>
  );
}

export default function PayDueDialog({
  campaign,
  dueAmount,
  isSubmitting = false,
  onSubmit,
  open,
  onOpenChange,
  hideTrigger = false,
  triggerLabel = "Pay Due",
}: QuotePaidAdPayDueDialogProps) {
  const t = useTranslations("brand.CampaignDetailsPage");
  const locale = useLocale();
  const paymentLocale: LocaleCode = locale === "bn" ? "bn" : "en";

  console.log(paymentLocale);

  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = React.useState(false);

  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";

  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const [activePreset, setActivePreset] = React.useState<PresetKey>(null);
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

  const isValidAmount = payAmount > 0 && payAmount <= dueAmount;

  const handlePayment = async () => {
    if (!isValidAmount) return;

    setIsPaymentLoading(true);

    try {
      const result = await createPayDueSession({
        campaignId: campaign.id,
        amount: payAmount,
        locale: paymentLocale,
      });

      if (result.success && result.data?.gatewayUrl) {
        sessionStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            campaignId: campaign.id,
            paymentId: result.data.paymentId,
            amount: payAmount,
            type: "pay_due",
            locale: paymentLocale,
            timestamp: Date.now(),
          }),
        );

        window.location.href = result.data.gatewayUrl;
      } else {
        notifyError(result.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      notifyError("Something went wrong. Please try again.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isValidAmount) return;

    if (onSubmit) {
      await onSubmit(payAmount);
    }

    await handlePayment();
    setDialogOpen(false);
  };

  const isLoading = isSubmitting || isPaymentLoading;

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

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-sm font-semibold text-Primary sm:text-base lg:text-xl">
            {t("fundYourCampaign")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5">
          <div className="rounded-2xl bg-linear-to-r from-Primary to-light-green px-4 py-4 text-white sm:px-5 sm:py-5">
            <div className="flex items-center justify-center gap-2">
              <Image
                height={20}
                width={20}
                alt="flag"
                src={"/icons/flag.png"}
                className="h-10 w-10"
              />
              <p className="truncate text-center text-sm sm:text-base">
                {campaign.campaignName ?? "Campaign"}
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-white/90 sm:text-sm">
                {t("remainingDue")}
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-base lg:text-xl">
                {formatBDT(dueAmount)}
              </p>
            </div>
          </div>

          <Input
            value={payAmount ? payAmount.toLocaleString("en-US") : ""}
            onChange={(e) => handleAmountInput(e.target.value)}
            inputMode="numeric"
            placeholder="0"
            className="h-11 rounded-lg border-light-gray text-center !text-xl placeholder:!text-xl sm:h-12 sm:text-base"
          />

          <div className="mx-auto flex max-w-sm flex-wrap justify-center gap-2 sm:gap-3">
            <PercentButton
              label={t("payInFull100")}
              active={activePreset === "full"}
              onClick={() => handlePreset(100, "full")}
            />
            <PercentButton
              label={t("pay75")}
              active={activePreset === "seventyFive"}
              onClick={() => handlePreset(75, "seventyFive")}
            />
            <PercentButton
              label={t("pay50")}
              active={activePreset === "half"}
              onClick={() => handlePreset(50, "half")}
            />
          </div>

          {/* <div>
            <p className="text-sm font-semibold text-Primary sm:text-base">
              {t("paymentMethod")}
            </p>
            <div className="mt-3">
              <PaymentMethodButton />
            </div>
          </div> */}

          <PrimaryButton
            className="w-full text-sm sm:text-base"
            onClick={handleSubmit}
            disabled={!isValidAmount || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="h-4 w-4 border-2 border-white border-t-transparent" />
                <span>{t("processing")}</span>
              </span>
            ) : (
              `${t("payNow")} ${formatBDT(payAmount)}`
            )}
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
