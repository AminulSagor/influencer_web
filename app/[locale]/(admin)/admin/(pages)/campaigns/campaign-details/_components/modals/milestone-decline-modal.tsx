"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
};

export default function MilestoneDeclineModal({
  open,
  value,
  onChange,
  onClose,
  onSubmit,
  loading = false,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[470px] rounded-[18px] border-0 bg-white p-0 shadow-xl">
        <div className="rounded-[18px] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2341D] text-white">
              <X className="h-5 w-5" />
            </div>
            <h2 className="text-[18px] font-semibold text-[#E53935]">
              Write Decline Reason
            </h2>
          </div>

          <div className="mt-5">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your reasons..."
              className="min-h-[180px] w-full rounded-[16px] border border-[#FF5A52] px-4 py-4 text-[16px] outline-none placeholder:text-[#A3A3A3]"
            />
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={loading || !value.trim()}
              className="h-11 w-full rounded-[12px] bg-[#F20D00] text-base font-medium text-white hover:brightness-95 disabled:opacity-60"
            >
              {loading ? "Updating..." : "Decline & Update Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}