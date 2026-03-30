"use client";

import { useMemo, useState } from "react";
import { Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { provideMilestoneBonus } from "@/service/client/campaigns/milestone-bonus.service";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import Loader from "@/components/spin-loader";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestoneId: string;
  campaignType: string;
};

export default function MilestoneBonusDialog({
  open,
  onOpenChange,
  milestoneId,
  campaignType,
}: Props) {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericAmount = useMemo(() => Number(amount), [amount]);
  const isAmountValid = Number.isFinite(numericAmount) && numericAmount > 0;

  const resetForm = () => {
    setAmount("");
    setIsSubmitting(false);
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setTimeout(() => {
        resetForm();
      }, 150);
    }
  };

  const handleSubmit = async () => {
    if (!isAmountValid) {
      notifyError("Please enter a valid bonus amount.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await provideMilestoneBonus({
        milestoneId,
        campaignType,
        amount: numericAmount,
      });

      notifySuccess(
        response?.message || "Bonus has been submitted successfully.",
      );
      handleClose(false);
    } catch (err: any) {
      notifyError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit bonus.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-white/30 bg-[#5C7F3C] w-[400px]">
        <div>
          <DialogHeader className="space-y-0 text-left">
            <div className="flex gap-3">
              <div className="mt-1">
                <Gift className="h-6 w-6 text-white" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold leading-tight text-white">
                  Provide Bonus Amount
                </DialogTitle>
                <p className="mt-2 text-sm text-white/90">
                  Complete your bonus payment
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            <div>
              <Input
                type="number"
                min="1"
                inputMode="numeric"
                placeholder="৳ 18,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-14 rounded-lg border-0 bg-white text-center text-2xl font-medium text-[#5C5C5C] placeholder:text-[#B8B8B8]"
              />
            </div>

            {/* <div>
              <p className="mb-3 text-sm font-semibold text-white">
                Payment Method
              </p>
            </div> */}

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-[#F5F5E8] text-base font-medium text-[#1F1F1F] hover:bg-[#F5F5E8]/90"
            >
              {isSubmitting ? <Loader className="h-5 w-5" /> : "Pay Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
