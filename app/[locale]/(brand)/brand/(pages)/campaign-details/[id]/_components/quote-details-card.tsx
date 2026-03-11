"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CampaignDetails } from "@/types/client/campaigns/campaign-details";

type QuoteDetailsCardProps = {
  campaign: CampaignDetails;
  onPayDue?: (amount: number) => void;
};

type PaymentPreset = "full" | "min" | null;

const toNumber = (value?: string | number | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatBDT = (value: number) => `৳${value.toLocaleString("en-US")}`;

const clampAmount = (value: number, max: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), Math.max(max, 0));
};

const parseNumericInput = (raw: string) => {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

function PercentChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-xs sm:text-sm transition",
        active
          ? "bg-Secondary ring-2 ring-light-green/70 text-Primary"
          : "bg-[#EFEFEF] text-black hover:bg-[#E8E8E8]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

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
      <p>{label}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-3 h-px w-full bg-black/15" />;
}

function StatusButton({
  label,
  disabled = true,
  className = "",
}: {
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "w-full rounded-md border border-light-gray py-2 text-sm",
        disabled
          ? "cursor-not-allowed bg-[#EFEFEF] text-black/70"
          : "cursor-pointer",
        className,
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
      className="mt-3 flex w-full items-center justify-between rounded-md border border-light-gray bg-white px-4 py-3"
    >
      <span className="text-sm text-Primary sm:text-base">
        Credit / Debit Card
      </span>
      <span className="text-black/80">▾</span>
    </button>
  );
}

export default function QuoteDetailsCard({
  campaign,
  onPayDue,
}: QuoteDetailsCardProps) {
  const [payAmount, setPayAmount] = React.useState(0);
  const [activePreset, setActivePreset] = React.useState<PaymentPreset>(null);

  const baseBudget = toNumber(campaign.baseBudget);
  const vatAmount = toNumber(campaign.vatAmount);
  const totalCost = toNumber(campaign.totalBudget);
  const availableBudgetForExecution = toNumber(
    campaign.availableBudgetForExecution,
  );

  const isPending = campaign.paymentStatus === "pending";
  const isPartial = campaign.paymentStatus === "partial";
  const isPaid = campaign.paymentStatus === "paid";

  const paidAmount = isPaid
    ? totalCost
    : isPartial
      ? Math.max(totalCost - availableBudgetForExecution, 0)
      : 0;

  const dueAmount = Math.max(totalCost - paidAmount, 0);
  const canPay = (isPartial || isPending) && dueAmount > 0;

  React.useEffect(() => {
    setPayAmount(dueAmount);
    setActivePreset(null);
  }, [dueAmount]);

  const handlePreset = (
    percent: number,
    preset: Exclude<PaymentPreset, null>,
  ) => {
    setActivePreset(preset);
    setPayAmount(
      clampAmount(Math.round((dueAmount * percent) / 100), dueAmount),
    );
  };

  const handleAmountInput = (raw: string) => {
    setActivePreset(null);
    setPayAmount(clampAmount(parseNumericInput(raw), dueAmount));
  };

  const handlePayNow = () => {
    if (payAmount <= 0) return;
    onPayDue?.(payAmount);
  };

  return (
    <Card>
      <CardContent>
        <h2 className="font-semibold text-Primary">Quote Details</h2>

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
                  valueClassName="text-2xl font-semibold tracking-tight text-light-green"
                />

                {(isPartial || isPaid) && (
                  <>
                    <div className="mt-2" />
                    <SummaryRow label="Paid" value={formatBDT(paidAmount)} />

                    <Divider />

                    <SummaryRow
                      label="Due"
                      value={formatBDT(dueAmount)}
                      valueClassName="text-2xl font-semibold tracking-tight text-light-green"
                    />
                  </>
                )}
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-Secondary">
                <span className="text-xl font-semibold text-Primary">৳</span>
              </div>
            </div>

            <div className="mt-4">
              {isPending && !canPay && <StatusButton label="Budget Pending" />}

              {(isPending || isPartial) && canPay && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full rounded-md border border-light-gray bg-light-green py-2 text-sm text-white"
                    >
                      Pay Due
                    </button>
                  </DialogTrigger>

                  <DialogContent className="p-0 sm:max-w-md">
                    <div className="p-6 sm:p-7">
                      <DialogHeader>
                        <DialogTitle className="text-center text-xl font-semibold text-Primary sm:text-2xl">
                          Fund Your Campaign
                        </DialogTitle>
                      </DialogHeader>

                      <div className="mt-5 rounded-xl bg-linear-to-r from-Primary to-light-green px-5 py-4 text-white">
                        <p className="truncate text-center text-sm font-medium sm:text-base">
                          {campaign.campaignName}
                        </p>

                        <div className="mt-4 text-center">
                          <p className="text-sm text-white/90">Total Due</p>
                          <p className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                            {formatBDT(dueAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Input
                          value={
                            payAmount ? payAmount.toLocaleString("en-US") : ""
                          }
                          onChange={(e) => handleAmountInput(e.target.value)}
                          inputMode="numeric"
                          placeholder="0"
                          className="h-12 border-light-gray text-center text-lg focus-visible:ring-1 sm:text-xl"
                        />
                      </div>

                      <div className="mt-4 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                        <PercentChip
                          label="Pay In Full (100%)"
                          active={activePreset === "full"}
                          onClick={() => handlePreset(100, "full")}
                        />
                        <PercentChip
                          label="Pay Minimum (50%)"
                          active={activePreset === "min"}
                          onClick={() => handlePreset(50, "min")}
                        />
                      </div>

                      <div className="mt-8">
                        <p className="text-sm font-semibold text-Primary sm:text-base">
                          Payment Method
                        </p>
                        <PaymentMethodButton />
                      </div>

                      <PrimaryButton
                        className="mt-6 w-full"
                        onClick={handlePayNow}
                        disabled={payAmount <= 0}
                      >
                        Pay Now ৳ {payAmount.toLocaleString("en-US")}
                      </PrimaryButton>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {isPartial && dueAmount <= 0 && <StatusButton label="No Due" />}

              {isPaid && <StatusButton label="Fully Paid" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
