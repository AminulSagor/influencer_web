"use client";

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
import React from "react";

type QuoteDetailsCardProps = {
  // state
  pending: boolean;

  // common amounts
  baseBudget?: number;
  vatPercent?: number; // e.g. 15
  vatAmount?: number;
  totalCost?: number;

  // pending-only
  revisedTimes?: number;
  onRequote?: () => void;
  onAccept?: () => void;

  // not-pending-only
  paidAmount?: number;
  dueAmount?: number;
  onPayDue?: (amount: number) => void; // called when user confirms pay
  campaignTitle?: string;
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

const QuoteDetailsCard = ({
  pending,

  baseBudget = 100000,
  vatPercent = 15,
  vatAmount = 10000,
  totalCost = 110000,

  revisedTimes = 0,
  onRequote,
  onAccept,

  paidAmount = 1200,
  dueAmount = 4500,
  onPayDue,
  campaignTitle = "Summer Fashion Campaign",
}: QuoteDetailsCardProps) => {
  const [payAmount, setPayAmount] = React.useState<number>(
    Math.min(paidAmount, dueAmount) || 0
  );
  const [activePreset, setActivePreset] = React.useState<null | "full" | "min">(
    null
  );

  React.useEffect(() => {
    // default: show the paid amount like your screenshot (৳1,200) but clamp to due
    const initial = Math.min(Math.max(paidAmount, 0), Math.max(dueAmount, 0));
    setPayAmount(initial);
  }, [paidAmount, dueAmount]);

  const clamp = (v: number) => {
    const max = Math.max(dueAmount ?? 0, 0);
    if (!Number.isFinite(v)) return 0;
    return Math.min(Math.max(v, 0), max);
  };

  const setPercent = (pct: number) => {
    const max = Math.max(dueAmount ?? 0, 0);
    setPayAmount(clamp(Math.round((max * pct) / 100)));
  };

  const percent = (() => {
    const max = Math.max(dueAmount ?? 0, 0);
    if (!max) return 0;
    return Math.min(100, Math.max(0, Math.round((payAmount / max) * 100)));
  })();

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

        <div className="mt-2 rounded-lg border border-Primary bg-linear-to-r from-light-green/40 to-white p-4 overflow-x-scroll no-scrollbar">
          <div className="text-sm">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                {/* Base */}
                <div className="flex justify-between">
                  <p>Base Campaign Budget</p>
                  <p className="font-semibold text-light-green">
                    {formatBDT(baseBudget)}
                  </p>
                </div>

                {/* VAT */}
                <div className="flex justify-between">
                  <p>
                    VAT/Tax <span>({vatPercent}%)</span>
                  </p>
                  <p className="font-semibold text-light-green">
                    {formatBDT(vatAmount)}
                  </p>
                </div>

                {pending ? (
                  <>
                    <div className="my-3 h-px w-full bg-black/15" />

                    <div className="flex justify-between items-center">
                      <p>Total Campaign Cost</p>
                      <p className="text-2xl font-semibold tracking-tight text-light-green">
                        {formatBDT(totalCost)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="my-3 h-px w-full bg-black/15" />

                    <div className="flex justify-between">
                      <p>Total Campaign Cost</p>
                      <p className="font-semibold text-light-green">
                        {formatBDT(totalCost)}
                      </p>
                    </div>

                    <div className="flex justify-between">
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

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-light-green/30">
                <span className="text-xl font-semibold text-Primary">৳</span>
              </div>
            </div>

            {pending ? (
              <>
                <p className="text-sm">Revised: {revisedTimes} Times</p>

                <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={onRequote}
                        className="bg-[#F8F8F8] border border-light-gray text-black text-sm w-full rounded-md py-2 cursor-pointer"
                      >
                        Requote
                      </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-light-green font-semibold">
                          Requote
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-black font-semibold">
                            Requote your campaign budget
                          </Label>
                          <Input
                            className="border-light-green mt-2 focus-visible:ring-1"
                            type="text"
                            placeholder="Enter Amount"
                          />
                        </div>

                        <div>
                          <p className="text-base font-semibold">
                            New Requote Overview
                          </p>
                          <div className="border border-light-green p-3 lg:p-5 rounded-md bg-linear-to-r from-light-green/30 to-white text-sm mt-1">
                            <div className="pb-4 border-b border-dark-gray">
                              <div className="flex items-center justify-between">
                                <p>New Requote Overview</p>
                                <p>{formatBDT(baseBudget)}</p>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p>vAT/Tax ({vatPercent}%)</p>
                                <p>{formatBDT(vatAmount)}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <p>Total Campaign Cost</p>
                              <p>{formatBDT(totalCost)}</p>
                            </div>
                          </div>
                        </div>

                        <PrimaryButton className="mt-2">
                          Requote to Admin
                        </PrimaryButton>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <PrimaryButton onClick={onAccept}>Accept Quote</PrimaryButton>
                </div>
              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-light-green text-white border border-light-gray mt-3 text-sm w-full rounded-md py-2 cursor-pointer">
                    Pay Due
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md p-0">
                  {/* Outer white card look like screenshot */}
                  <div className="p-6 sm:p-7">
                    <DialogHeader>
                      <DialogTitle className="text-center text-Primary text-xl sm:text-2xl font-semibold">
                        Fund Your Campaign
                      </DialogTitle>
                    </DialogHeader>

                    {/* Top green mini card */}
                    <div className="mt-5 rounded-xl bg-linear-to-r from-Primary to-light-green px-5 py-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center">
                          <span className="text-lg font-semibold">🗂️</span>
                        </div>

                        <p className="text-sm sm:text-base font-medium truncate">
                          {campaignTitle}
                        </p>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-sm text-white/90">Total Due</p>
                        <p className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight">
                          {formatBDT(dueAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Amount input */}
                    <div className="mt-6">
                      <Input
                        value={
                          payAmount ? payAmount.toLocaleString("en-US") : ""
                        }
                        onChange={(e) => onAmountInput(e.target.value)}
                        inputMode="numeric"
                        placeholder="0"
                        className="h-12 text-center text-lg sm:text-xl border-light-gray focus-visible:ring-1"
                      />
                    </div>

                    {/* quick actions */}
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

                    {/* Pay % button */}
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setPercent(percent || 75)}
                        className="rounded-full bg-light-green px-10 py-2 text-sm font-medium text-white"
                        title="Quick fill"
                      >
                        Pay ({percent || 75}%)
                      </button>
                    </div>

                    {/* Payment method */}
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

                    {/* CTA */}
                    <PrimaryButton
                      className="mt-6 w-full"
                      onClick={() => onPayDue?.(payAmount)}
                    >
                      Pay Now ৳ {payAmount.toLocaleString("en-US")}
                    </PrimaryButton>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteDetailsCard;
