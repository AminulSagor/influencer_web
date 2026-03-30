// app/[locale]/(brand)/brand/_components/payment/generic-payment-dialog.tsx

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
} from "@/app/[locale]/(brand)/brand/(pages)/campaign-details/[id]/_components/quote/quote-utils";
import Loader from "@/components/spin-loader";
import { notifyError } from "@/utils/toast_util";
import {
  createPaymentSession,
  type LocaleCode,
} from "@/service/client/payment/campaign-payment.service";
import Image from "next/image";

type PresetKey = "full" | "min" | "seventyFive";

interface PaymentConfig {
  amount: number;
  minPaymentPercent?: number;
  presets?: {
    label: string;
    value: number;
    key: PresetKey;
  }[];
  buttonText?: string;
  dialogTitle?: string;
  successMessage?: string;
  errorMessage?: string;
  showPaymentMethod?: boolean;
}

interface PaymentDialogProps {
  campaignId: string;
  campaignName?: string;
  config: PaymentConfig;
  onSuccess?: () => void | Promise<void>;
  onBeforePayment?: (amount: number) => Promise<void> | void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
  triggerClassName?: string;
  triggerLabel?: string;
}

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
        "min-w-[100px] flex-1 rounded-full px-3 py-2 text-center text-xs transition sm:flex-none sm:px-4 sm:text-sm",
        active
          ? "bg-light-green text-white"
          : "bg-[#EAEAEA] text-black hover:bg-[#E0E0E0]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PaymentMethodInfo() {
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

export default function PaymentDialog({
  campaignId,
  campaignName,
  config,
  onSuccess,
  onBeforePayment,
  open,
  onOpenChange,
  hideTrigger = false,
  triggerClassName = "w-full rounded-md border border-light-gray bg-light-green py-2 text-sm text-white",
  triggerLabel,
}: PaymentDialogProps) {
  const t = useTranslations("brand.payment");
  const locale = useLocale();
  const paymentLocale: LocaleCode = locale === "bn" ? "bn" : "en";

  const [internalOpen, setInternalOpen] = React.useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState<PresetKey | null>(
    null,
  );
  const [payAmount, setPayAmount] = React.useState<number>(config.amount);

  const isControlled =
    typeof open === "boolean" && typeof onOpenChange === "function";

  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const minPaymentPercent = config.minPaymentPercent ?? 50;
  const minimumAmount = Math.ceil((config.amount * minPaymentPercent) / 100);

  const defaultPresets = [
    { label: t("payInFull100"), value: 100, key: "full" as PresetKey },
    {
      label: t("payMinimum50"),
      value: minPaymentPercent,
      key: "min" as PresetKey,
    },
    { label: t("pay75"), value: 75, key: "seventyFive" as PresetKey },
  ];

  const presets = config.presets ?? defaultPresets;

  React.useEffect(() => {
    if (dialogOpen) {
      setPayAmount(config.amount);
      setActivePreset("full");
    }
  }, [dialogOpen, config.amount]);

  const handlePreset = (percent: number, key: PresetKey) => {
    const nextAmount = clampAmount(
      Math.round((config.amount * percent) / 100),
      config.amount,
    );
    setPayAmount(nextAmount);
    setActivePreset(key);
  };

  const handleAmountInput = (raw: string) => {
    setActivePreset(null);
    setPayAmount(clampAmount(parseNumericInput(raw), config.amount));
  };

  const isValidAmount =
    payAmount > 0 && payAmount <= config.amount && payAmount >= minimumAmount;

  const handlePayment = async () => {
    if (!isValidAmount) return;

    setIsPaymentLoading(true);

    try {
      const result = await createPaymentSession({
        campaignId,
        amount: payAmount,
        locale: paymentLocale,
      });

      if (result.success && result.data?.gatewayUrl) {
        sessionStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            campaignId,
            paymentId: result.data.paymentId,
            amount: payAmount,
            locale: paymentLocale,
            timestamp: Date.now(),
          }),
        );

        window.location.href = result.data.gatewayUrl;
      } else {
        notifyError(
          config.errorMessage || result.message || "Failed to initiate payment",
        );
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      notifyError(
        config.errorMessage || "Something went wrong. Please try again.",
      );
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isValidAmount) return;

    // if (onBeforePayment) {
    //   await onBeforePayment(payAmount);
    // }

    await handlePayment();
    setDialogOpen(false);
  };

  const isLoading = isPaymentLoading;

  const dialogTitle = config.dialogTitle || t("fundYourCampaign");
  const buttonLabel = triggerLabel || config.buttonText || t("payNow");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <button type="button" className={triggerClassName}>
            {buttonLabel}
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-Primary sm:text-base">
            {dialogTitle}
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
              <p className="truncate text-center text-sm font-medium sm:text-base">
                {campaignName ?? "Campaign"}
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-white/90 sm:text-sm">
                {t("totalCampaignCost")}
              </p>
              <p className="mt-1 text-sm font-semibold sm:text-base">
                {formatBDT(config.amount)}
              </p>
            </div>
          </div>

          {minPaymentPercent < 100 && (
            <div className="rounded-xl border border-[#F0B37A] bg-[#FCE8D6] px-3 py-3 text-center sm:px-4">
              <p className="text-xs text-[#D97E2B] sm:text-sm">
                {t("minimumFundNeededToStartTheCampaign", {
                  percent: minPaymentPercent,
                })}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#D97E2B] sm:text-base">
                {formatBDT(minimumAmount)}
              </p>
            </div>
          )}

          <Input
            value={payAmount ? payAmount.toLocaleString("en-US") : ""}
            onChange={(e) => handleAmountInput(e.target.value)}
            inputMode="numeric"
            placeholder="0"
            className="h-11 rounded-xl border-light-gray text-center text-sm sm:h-12 sm:text-base"
          />

          <div className="flex flex-wrap items-stretch justify-center gap-2 sm:gap-3">
            {presets.map((preset) => (
              <PercentButton
                key={preset.key}
                label={preset.label}
                active={activePreset === preset.key}
                onClick={() => handlePreset(preset.value, preset.key)}
              />
            ))}
          </div>

          {/* {config.showPaymentMethod !== false && (
            <div>
              <p className="text-sm font-semibold text-Primary sm:text-base">
                {t("paymentMethod")}
              </p>
              <div className="mt-3">
                <PaymentMethodInfo />
              </div>
            </div>
          )} */}

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
              `${t("acceptAndPay")}`
            )}
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
