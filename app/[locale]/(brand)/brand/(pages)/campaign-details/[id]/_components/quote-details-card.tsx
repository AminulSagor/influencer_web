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
import {
  CampaignStatus,
  ClientCampaignDetails,
} from "@/types/client/campaigns/campaign-details";

type QuoteDetailsCardProps = {
  campaign: ClientCampaignDetails;
  onPayDue?: (amount: number) => void;
  onRequote?: () => void;
  onAcceptQuote?: () => void;
};

type PaymentPreset = "full" | "min" | null;

const quoteActionStatuses: CampaignStatus[] = [
  "received",
  "negotiating",
  "quoted",
  "pending_agency",
  "agency_negotiating",
  "pending_influencer",
  "budget_quoting",
  "budget_building",
];

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
        "rounded-full px-4 py-2 text-xs transition sm:text-sm",
        active
          ? "bg-Secondary text-Primary ring-2 ring-light-green/70"
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
      <p className="text-sm">{label}</p>
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
      <span className="text-sm text-Primary">Credit / Debit Card</span>
      <span className="text-sm text-black/80">▾</span>
    </button>
  );
}

export default function QuoteDetailsCard({
  campaign,
  onPayDue,
  onRequote,
  onAcceptQuote,
}: QuoteDetailsCardProps) {
  const [payAmount, setPayAmount] = React.useState(0);
  const [activePreset, setActivePreset] = React.useState<PaymentPreset>(null);

  const baseBudget = toNumber(campaign.baseBudget);
  const vatAmount = toNumber(campaign.vatAmount);
  const totalCost = toNumber(
    campaign.paymentInfo?.totalAmount ?? campaign.totalBudget,
  );
  const paidAmount = toNumber(
    campaign.paymentInfo?.paidAmount ?? campaign.paidAmount,
  );
  const dueAmount = toNumber(
    campaign.paymentInfo?.dueAmount ?? campaign.dueAmount,
  );

  const isInfluencerPromotion =
    campaign.campaignType === "influencer_promotion";

  const showQuoteActions =
    quoteActionStatuses.includes(campaign.status) &&
    campaign.assignedInfluencers.length === 0 &&
    !campaign.assignedAt;

  const isPendingPayment = campaign.paymentStatus === "pending";
  const isPartialPayment = campaign.paymentStatus === "partial";
  const isPaid = campaign.paymentStatus === "paid";

  const canPay =
    !showQuoteActions &&
    (isPendingPayment || isPartialPayment) &&
    dueAmount > 0;

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

  const acceptButtonLabel = isInfluencerPromotion
    ? "Accept Quote"
    : "Accept Budget";

  const showConfirmedState =
    !showQuoteActions && !canPay && !isPaid && dueAmount <= 0;

  return (
    <Card>
      <CardContent>
        <h2 className="text-base font-semibold text-Primary">Quote Details</h2>

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
                  valueClassName="text-base font-semibold tracking-tight text-light-green sm:text-base"
                />

                {!showQuoteActions &&
                  (paidAmount > 0 || dueAmount > 0 || isPaid) && (
                    <>
                      <div className="mt-2" />
                      <SummaryRow label="Paid" value={formatBDT(paidAmount)} />

                      {dueAmount > 0 && (
                        <>
                          <Divider />
                          <SummaryRow
                            label="Due"
                            value={formatBDT(dueAmount)}
                            valueClassName="text-base font-semibold tracking-tight text-light-green sm:text-base"
                          />
                        </>
                      )}
                    </>
                  )}
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-Secondary">
                <span className="text-base font-semibold text-Primary">৳</span>
              </div>
            </div>

            <div className="mt-4">
              {showQuoteActions && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onRequote}
                    className="w-full rounded-md border border-light-gray bg-[#EFEFEF] py-2 text-sm text-black"
                  >
                    Requote
                  </button>

                  <button
                    type="button"
                    onClick={onAcceptQuote}
                    className="w-full rounded-md border border-light-green bg-light-green py-2 text-sm text-white"
                  >
                    {acceptButtonLabel}
                  </button>
                </div>
              )}

              {canPay && (
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
                        <DialogTitle className="text-center text-base font-semibold text-Primary">
                          Fund Your Campaign
                        </DialogTitle>
                      </DialogHeader>

                      <div className="mt-5 rounded-xl bg-linear-to-r from-Primary to-light-green px-5 py-4 text-white">
                        <p className="truncate text-center text-sm font-medium">
                          {campaign.campaignName}
                        </p>

                        <div className="mt-4 text-center">
                          <p className="text-sm text-white/90">Total Due</p>
                          <p className="mt-1 text-base font-semibold tracking-tight">
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
                          className="h-12 border-light-gray text-center text-base focus-visible:ring-1"
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
                        <p className="text-sm font-semibold text-Primary">
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

              {showConfirmedState && <StatusButton label="Budget Confirmed" />}

              {isPaid && <StatusButton label="Paid" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
