"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  milestoneTitle: string;
  influencerName: string;
  onClose: () => void;
  onApprove: () => void;
  loading?: boolean;
};

export default function MilestoneApproveModal({
  open,
  milestoneTitle,
  influencerName,
  onClose,
  onApprove,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[480px] rounded-[18px] border-0 bg-white p-0 shadow-xl">
        <div className="rounded-[18px] bg-white p-6">
          <h2 className="text-[18px] font-semibold text-[#7EA055]">
            Are You Sure To Approve ?
          </h2>

          <div className="mt-3 space-y-1">
            <p className="text-[16px] font-semibold text-[#29411B]">
              {milestoneTitle}
            </p>
            <p className="text-[16px] font-semibold text-[#29411B]">
              To: {influencerName}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="h-12 rounded-[14px] border-[#CFCFCF] text-[16px]"
            >
              Decline
            </Button>

            <Button
              type="button"
              onClick={onApprove}
              disabled={loading}
              className="h-12 rounded-[14px] bg-[#7EA055] text-[16px] text-white hover:brightness-95"
            >
              {loading ? "Approving..." : "Approve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}