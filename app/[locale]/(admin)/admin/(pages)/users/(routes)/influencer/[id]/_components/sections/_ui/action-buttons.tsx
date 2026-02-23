"use client";

type Props = {
  leftLabel?: string;
  rightLabel?: string;
  onLeft?: () => void;
  onRight?: () => void;
};

export default function ActionButtons({
  leftLabel = "Reject",
  rightLabel = "Approve",
  onLeft,
  onRight,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onLeft}
        className="h-10 rounded-md border border-medium-gray/40 bg-white px-6 text-sm font-medium text-black hover:bg-off-white active:scale-[0.98]"
      >
        {leftLabel}
      </button>

      <button
        type="button"
        onClick={onRight}
        className="h-10 rounded-md bg-Primary px-6 text-sm font-medium text-white hover:brightness-95 active:scale-[0.98]"
      >
        {rightLabel}
      </button>
    </div>
  );
}