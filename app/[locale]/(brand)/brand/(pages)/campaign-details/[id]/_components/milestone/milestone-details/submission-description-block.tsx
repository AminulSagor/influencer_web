"use client";

import { CircleDot } from "lucide-react";

type Props = {
  description: string | null;
  statusLabel: string;
};

export default function SubmissionDescriptionBlock({
  description,
  statusLabel,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h5 className="text-[16px] font-semibold text-[#2F4F1E]">
          Submission Details
        </h5>

        <span className="rounded-full bg-[#7BA35A] px-3 py-[3px] text-[10px] font-medium text-white">
          {statusLabel}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm font-medium text-black">
          <CircleDot className="h-4 w-4 fill-current" />
          <span>Description / Update</span>
        </div>

        <p className="mt-4 text-sm text-black/70">
          {description || "No description provided."}
        </p>
      </div>
    </div>
  );
}