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
import { Label } from "@/components/ui/label";
import type { Campaignservice } from "@/app/[locale]/(brand)/brand/types/client-types";

type QuoteDetailsCardProps = {
  campaign: Campaignservice;
  onPayDue?: (amount: number) => void;
};

const toNumber = (v?: string | null) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const formatBDT = (n: number) => `৳${n.toLocaleString("en-US")}`;

const PercentChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "rounded-full px-4 py-2 text-xs sm:text-sm transition",
      "bg-[#EFEFEF] text-black",
      active ? "ring-2 ring-light-green/70" : "",
    ].join(" ")}
  >
    {label}
  </button>
);

export default function QuoteDetailsCard({ campaign, onPayDue }: QuoteDetailsCardProps) {
  const baseBudget = toNumber(campaign.baseBudget);
  const vatAmount = toNumber(campaign.vatAmount);
  const totalCost = toNumber(campaign.totalBudget);

  // If backend provides paid amount later, plug it here.
  // For now:
  const paidAmount = campaign.paymentStatus === "full" ? totalCost : 0;

  const dueAmount = Math.max(totalCost - paidAmount, 0);

  const isConfirmed = campaign.paymentStatus === "confirmed";
  const isPartial = campaign.paymentStatus === "partial";
  const isFull = campaign.paymentStatus === "full";
  const isPending = campaign.paymentStatus === "pending";

  const canPay = (isConfirmed || isPartial) && dueAmount > 0;

  // ------- Pay Due dialog -------
  const [payAmount, setPayAmount] = React.useState<number>(0);
  const [activePreset, setActivePreset] = React.useState<null | "full" | "min">(null);

  React.useEffect(() => {
    setPayAmount(Math.min(Math.max(0, dueAmount), dueAmount));
  }, [dueAmount]);

  const clamp = (v: number) => {
    const max = Math.max(dueAmount, 0);
    if (!Number.isFinite(v)) return 0;
    return Math.min(Math.max(v, 0), max);
  };

  const setPercent = (pct: number) => {
    const max = Math.max(dueAmount, 0);
    setPayAmount(clamp(Math.round((max * pct) / 100)));
  };

  const onAmountInput = (raw: string) => {
    setActivePreset(null);
    const digits = raw.replace(/[^\d]/g, "");
    const val = digits ? Number(digits) : 0;
    setPayAmount(clamp(val));
  };

  return (
    <Card>
      <CardContent>
        <h2 className="font-semibold text-Primary">Quote Details</h2>

        <div className="mt-2 rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white p-4 overflow-x-auto no-scrollbar">
          <div className="text-sm">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex justify-between">
                  <p>Base Campaign Budget</p>
                  <p className="font-semibold text-light-green">{formatBDT(baseBudget)}</p>
                </div>

                <div className="flex justify-between">
                  <p>VAT/Tax</p>
                  <p className="font-semibold text-light-green">{formatBDT(vatAmount)}</p>
                </div>

                <div className="my-3 h-px w-full bg-black/15" />

                <div className="flex justify-between items-center">
                  <p>Total Campaign Cost</p>
                  <p className="text-2xl font-semibold tracking-tight text-light-green">
                    {formatBDT(totalCost)}
                  </p>
                </div>

                {(isConfirmed || isPartial || isFull) && (
                  <>
                    <div className="mt-2 flex justify-between">
                      <p>Paid</p>
                      <p className="font-semibold text-light-green">
                        {formatBDT(paidAmount)}
                      </p>
                    </div>

                    <div className="my-3 h-px w-full bg-black/15" />

                    <div className="flex justify-between items-center">
                      <p>Due</p>
                      <p className="text-2xl font-semibold tracking-tight text-light-green">
                        {formatBDT(dueAmount)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-Secondary shrink-0">
                <span className="text-xl font-semibold text-Primary">৳</span>
              </div>
            </div>

            {/* Status-wise button */}
            {isPending && (
              <div className="mt-4">
                <button
                  className="bg-[#EFEFEF] border border-light-gray text-black/70 text-sm w-full rounded-md py-2 cursor-not-allowed"
                  disabled
                >
                  Budget Pending
                </button>
              </div>
            )}

            {(isConfirmed || isPartial) && (
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    disabled={!canPay}
                    className={[
                      "mt-3 text-sm w-full rounded-md py-2 cursor-pointer border border-light-gray",
                      canPay
                        ? "bg-light-green text-white"
                        : "bg-[#EFEFEF] text-black/60 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {canPay ? "Pay Due" : "No Due"}
                  </button>
                </DialogTrigger>

                {canPay && (
                  <DialogContent className="sm:max-w-md p-0">
                    <div className="p-6 sm:p-7">
                      <DialogHeader>
                        <DialogTitle className="text-center text-Primary text-xl sm:text-2xl font-semibold">
                          Fund Your Campaign
                        </DialogTitle>
                      </DialogHeader>

                      <div className="mt-5 rounded-xl bg-linear-to-r from-Primary to-light-green px-5 py-4 text-white">
                        <p className="text-sm sm:text-base font-medium truncate text-center">
                          {campaign.campaignName}
                        </p>

                        <div className="mt-4 text-center">
                          <p className="text-sm text-white/90">Total Due</p>
                          <p className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight">
                            {formatBDT(dueAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Input
                          value={payAmount ? payAmount.toLocaleString("en-US") : ""}
                          onChange={(e) => onAmountInput(e.target.value)}
                          inputMode="numeric"
                          placeholder="0"
                          className="h-12 text-center text-lg sm:text-xl border-light-gray focus-visible:ring-1"
                        />
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                        <PercentChip
                          label="Pay In Full (100%)"
                          active={activePreset === "full"}
                          onClick={() => {
                            setActivePreset("full");
                            setPercent(100);
                          }}
                        />
                        <PercentChip
                          label="Pay Minimum (50%)"
                          active={activePreset === "min"}
                          onClick={() => {
                            setActivePreset("min");
                            setPercent(50);
                          }}
                        />
                      </div>

                      <div className="mt-8">
                        <p className="text-Primary font-semibold text-sm sm:text-base">
                          Payment Method
                        </p>

                        <button
                          type="button"
                          className="mt-3 w-full rounded-md border border-light-gray bg-white px-4 py-3 flex items-center justify-between"
                        >
                          <span className="text-Primary text-sm sm:text-base">
                            Credit / Debit Card
                          </span>
                          <span className="text-black/80">▾</span>
                        </button>
                      </div>

                      <PrimaryButton
                        className="mt-6 w-full"
                        onClick={() => onPayDue?.(payAmount)}
                        disabled={payAmount <= 0}
                      >
                        Pay Now ৳ {payAmount.toLocaleString("en-US")}
                      </PrimaryButton>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            )}

            {isFull && (
              <div className="mt-4">
                <button
                  className="bg-[#EFEFEF] border border-light-gray text-black/70 text-sm w-full rounded-md py-2 cursor-not-allowed"
                  disabled
                >
                  Fully Paid
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
