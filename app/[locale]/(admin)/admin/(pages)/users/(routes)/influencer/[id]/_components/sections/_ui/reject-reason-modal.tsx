"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
};

export default function RejectReasonModal({
  open,
  loading = false,
  onOpenChange,
  onSubmit,
}: Props) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  if (!open) return null;

  const canSubmit = reason.trim().length > 0 && !loading;

  function handleClose() {
    if (loading) return;
    onOpenChange(false);
  }

  function handleSubmit() {
    const v = reason.trim();
    if (!v || loading) return;
    onSubmit(v);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30">
      <div className="fixed inset-0 grid place-items-center p-4">
        <div className="w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6">
            <h3 className="text-2xl font-semibold text-black">
              Write Reject Reason
            </h3>

            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full text-black hover:bg-off-white active:scale-[0.98]",
                loading && "cursor-not-allowed opacity-60"
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 pb-8">
            <div className="rounded-2xl border border-light-gray bg-white p-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write your reasons..."
                className="h-[260px] w-full resize-none bg-transparent text-sm text-black outline-none"
              />
            </div>

            {/* Footer Button (always visible) */}
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className={cn(
                "mt-8 h-14 w-full rounded-2xl text-base font-semibold text-white",
                !canSubmit
                  ? "bg-red/60 cursor-not-allowed"
                  : "bg-red hover:brightness-95 active:scale-[0.98]"
              )}
            >
              {loading ? "Rejecting..." : "Reject & Notify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}