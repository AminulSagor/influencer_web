"use client";

import { Gift } from "lucide-react";

type Props = {
  influencerName?: string | null;
};

export default function SubmissionBonusCard({ influencerName }: Props) {
  return (
    <div className="rounded-[10px] bg-[#5C7F3C] p-4 text-white">
      <div className="flex items-center gap-2">
        <Gift className="h-4 w-4" />
        <p className="text-sm font-semibold">Bonus</p>
      </div>

      <p className="mt-1 text-xs text-white/80">
        {influencerName
          ? `${influencerName} has achieved more than the required target.`
          : "Bonus is available because the target was exceeded."}
      </p>

      <div className="mt-4 rounded-[8px] bg-[#F5F5E8] px-4 py-3 text-center text-sm font-medium text-[#5C7F3C]">
        Provide Bonus Amount
      </div>
    </div>
  );
}
