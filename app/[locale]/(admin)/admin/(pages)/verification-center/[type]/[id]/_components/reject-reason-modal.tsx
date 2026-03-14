"use client";

import { useEffect, useState } from "react";
import { CircleX, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  loading?: boolean;
  onSubmit: (reason: string) => Promise<void> | void;
}

const RejectReasonModal = ({
  open,
  onOpenChange,
  title = "Write Reject Reason",
  loading = false,
  onSubmit,
}: Props) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const handleSubmit = async () => {
    const trimmed = reason.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-[24px] border-0 p-0 overflow-hidden [&>button]:hidden">
        <div className="bg-white px-7 pt-7 pb-8">
          <DialogHeader className="mb-5 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ef3b2d] text-white">
                <CircleX className="h-5 w-5" />
              </div>

              <DialogTitle className="text-[18px] font-semibold text-[#ef3b2d]">
                {title}
              </DialogTitle>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[#ef3b2d] transition hover:opacity-80"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogHeader>

          <div className="space-y-6">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write your reasons..."
              className="min-h-[200px] resize-none rounded-[18px] border border-[#ff4b4b] px-4 py-4 text-base placeholder:text-[#b0b0b0] focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !reason.trim()}
                className="h-11 min-w-[260px] rounded-[12px] bg-[#f20d00] px-8 text-base font-medium text-white hover:bg-[#d90c00] disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Reject & Notify"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectReasonModal;