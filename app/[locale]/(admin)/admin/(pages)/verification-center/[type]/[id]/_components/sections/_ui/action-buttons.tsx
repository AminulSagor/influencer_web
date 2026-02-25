"use client";

import { cn } from "@/lib/utils";

type Props = {
  onLeft?: () => void;                 // Reject
  onRight?: () => void;                // Accept
  leftLabel?: string;
  rightLabel?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function ActionButtons({
  onLeft,
  onRight,
  leftLabel = "Reject",
  rightLabel = "Accept",
  loading = false,
  disabled = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        disabled={isDisabled}
        onClick={onLeft}
        className={cn(
          "h-10 w-[110px] rounded-lg border text-sm font-medium active:scale-[0.98]",
          isDisabled
            ? "border-dark-gray/30 bg-white text-dark-gray cursor-not-allowed"
            : "border-dark-gray/40 bg-white text-black hover:bg-off-white"
        )}
      >
        {loading ? "..." : leftLabel}
      </button>

      <button
        type="button"
        disabled={isDisabled}
        onClick={onRight}
        className={cn(
          "h-10 w-[120px] rounded-lg text-sm font-medium text-white active:scale-[0.98]",
          isDisabled
            ? "bg-light-green/60 cursor-not-allowed"
            : "bg-light-green hover:brightness-95"
        )}
      >
        {loading ? "..." : rightLabel}
      </button>
    </div>
  );
}