"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  influencerName: string;
  reason: string;
  amount: string;
  maxAmount: number;
  onReasonChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
};

export default function MilestonePartialPaidModal({
  open,
  influencerName,
  reason,
  amount,
  maxAmount,
  onReasonChange,
  onAmountChange,
  onClose,
  onSubmit,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[480px] rounded-[18px] border-0 bg-white p-0 shadow-xl">
        <div className="rounded-[18px] bg-white p-6">
          <h2 className="text-[18px] font-semibold text-[#7EA055]">
            Partial Paid Reason
          </h2>

          <p className="mt-2 text-[16px] font-semibold text-[#29411B]">
            To: {influencerName}
          </p>

          <div className="mt-5">
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Write your reasons..."
              className="min-h-[140px] w-full rounded-[16px] border border-[#9BB97D] px-4 py-4 text-[16px] outline-none placeholder:text-[#A3A3A3]"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_220px]">
            <p className="text-[16px] font-semibold text-[#7EA055]">
              Set Partial Paid Amount
            </p>

            <div className="flex h-12 items-center rounded-[14px] border border-[#9BB97D] px-4">
              <span className="mr-2 text-[16px] font-semibold text-[#A3A3A3]">
                ৳
              </span>
              <input
                type="number"
                min="0"
                max={maxAmount}
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                className="w-full bg-transparent text-[16px] outline-none"
                placeholder={String(maxAmount)}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={loading || !reason.trim() || !amount}
              className="h-12 w-full rounded-[12px] bg-[#7EA055] text-base font-medium text-white hover:brightness-95 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Staus To Partial Paid"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}