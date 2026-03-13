"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SubmissionStatus } from "@/types/client/campaigns/campaign-submission.types";

type Props = {
  submissionId: string;
  status: SubmissionStatus | string;
  onApprove?: (submissionId: string) => void;
  onDecline?: (submissionId: string) => void;
  isSubmitting?: boolean;
};

function normalizeStatus(value?: string) {
  return String(value ?? "").trim().toLowerCase();
}

export default function SubmissionReportActions({
  submissionId,
  status,
  onApprove,
  onDecline,
  isSubmitting = false,
}: Props) {
  const value = normalizeStatus(status);

  const showReviewActions = value === "in_review";
  const isFinished = ["approved", "completed", "declined"].includes(value);

  if (!showReviewActions && isFinished) {
    return null;
  }

  if (!showReviewActions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        variant="outline"
        onClick={() => onDecline?.(submissionId)}
        disabled={isSubmitting}
        className="h-10 flex-1 rounded-xl border border-[#D5D5D5] bg-[#FAFAFA] px-4 text-sm font-medium text-black hover:bg-[#F3F3F3] disabled:bg-[#F1F1F1] disabled:text-[#BDBDBD]"
      >
        Decline
      </Button>

      <Button
        type="button"
        onClick={() => onApprove?.(submissionId)}
        disabled={isSubmitting}
        className="h-10 flex-1 rounded-xl bg-[#81A35A] px-4 text-sm font-medium text-white hover:bg-[#73944e] disabled:bg-[#B7B7B7] disabled:text-white"
      >
        Approve
      </Button>
    </div>
  );
}