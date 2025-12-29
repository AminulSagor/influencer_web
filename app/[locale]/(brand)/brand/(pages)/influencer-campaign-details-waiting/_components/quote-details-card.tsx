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

type QuoteDetailsCardProps = {
  baseBudget?: number;
  vatPercent?: number; // e.g. 15
  vatAmount?: number;
  totalCost?: number;
  revisedTimes?: number;
  onRequote?: () => void;
  onAccept?: () => void;
};

const formatBDT = (n: number) => `৳${n.toLocaleString("en-US")}`;

const QuoteDetailsCard = ({
  baseBudget = 100000,
  vatPercent = 15,
  vatAmount = 10000,
  totalCost = 110000,
  revisedTimes = 0,
  onRequote,
  onAccept,
}: QuoteDetailsCardProps) => {
  return (
    <Card>
      <CardContent>
        <h2 className="font-semibold text-Primary">Quote Details</h2>

        <div className="mt-2 rounded-lg border border-Primary bg-linear-to-r from-light-green/40 to-white p-4 md:p-6 overflow-x-scroll no-scrollbar">
          <div className="flex items-start justify-between gap-6">
            {/* LEFT: rows */}
            <div className="flex-1">
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p>Base Campaign Budget</p>
                  <p className="font-semibold text-light-green">
                    {formatBDT(baseBudget)}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <p>
                    VAT/Tax <span>({vatPercent}%)</span>
                  </p>
                  <p className="font-semibold text-light-green">
                    {formatBDT(vatAmount)}
                  </p>
                </div>
              </div>

              <div className="my-6 h-px w-full bg-black/15" />

              <div className="flex items-end justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-lg text-black/80">Total Campaign Cost</p>
                  <p className="text-sm text-black/60">
                    Revised: {revisedTimes} Times
                  </p>
                </div>

                <p className="text-3xl font-semibold tracking-tight text-Primary">
                  {formatBDT(totalCost)}
                </p>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-[#F8F8F8] border border-light-gray text-black text-sm w-full rounded-md py-2 cursor-pointer">
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
                              <p>৳ 100,000</p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p>vAT/Tax (15%)</p>
                              <p>৳ 10,000</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <p>Total Campaign Cost</p>
                            <p>৳ 110,000</p>
                          </div>
                        </div>
                      </div>

                      <PrimaryButton className="mt-2">
                        Requote to Admin
                      </PrimaryButton>
                    </div>
                  </DialogContent>
                </Dialog>

                <PrimaryButton>Accept Quote</PrimaryButton>
              </div>
            </div>

            {/* RIGHT: currency icon */}
            <div className="hidden md:block">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-light-green/30">
                <span className="text-xl font-semibold text-Primary">৳</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteDetailsCard;
