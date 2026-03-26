"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { SubmissionStatus } from "@/types/client/campaigns/campaign-submission.types";
import Loader from "@/components/spin-loader";

type ActionType = "approve" | "decline" | null;

type Props = {
  submissionIds: string[];
  status: SubmissionStatus | string;
  onApprove?: (submissionIds: string[]) => void | Promise<void>;
  onDecline?: (submissionIds: string[], reason: string) => void | Promise<void>;
  isSubmitting?: boolean;
  approveButtonText?: string;
  declineButtonText?: string;
  disabled?: boolean;
};

function normalizeStatus(value?: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export default function SubmissionReportActions({
  submissionIds,
  status,
  onApprove,
  onDecline,
  isSubmitting = false,
  approveButtonText = "Approve",
  declineButtonText = "Decline",
  disabled = false,
}: Props) {
  const value = normalizeStatus(status);
  const [open, setOpen] = React.useState(false);
  const [actionType, setActionType] = React.useState<ActionType>(null);
  const [text, setText] = React.useState("");

  const showReviewActions = value === "in_review";
  const isFinished = ["approved", "completed", "declined"].includes(value);
  const hasSelection = submissionIds.length > 0;

  if (!showReviewActions && isFinished) {
    return null;
  }

  if (!showReviewActions) {
    return null;
  }

  const isDisabled = disabled || !hasSelection || isSubmitting;

  const handleOpenApprove = () => {
    if (isDisabled) return;
    setActionType("approve");
    setText("");
    setOpen(true);
  };

  const handleOpenDecline = () => {
    if (isDisabled) return;
    setActionType("decline");
    setText("");
    setOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setOpen(false);
    setActionType(null);
    setText("");
  };

  const handleSubmit = async () => {
    if (!hasSelection) return;

    if (actionType === "approve") {
      await onApprove?.(submissionIds);
      return;
    }

    if (actionType === "decline") {
      const reason = text.trim();
      if (!reason) return;
      await onDecline?.(submissionIds, reason);
    }
  };

  const isApprove = actionType === "approve";
  const title = isApprove ? "Write Approval Report" : "Write Decline Reason";
  const placeholder = isApprove
    ? "Write your report..."
    : "Write your reasons...";
  const submitButtonText = isSubmitting
    ? ""
    : isApprove
      ? "Approve & Submit Report"
      : "Decline & Submit Reason";

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenDecline}
          disabled={isDisabled}
          className="h-10 flex-1 rounded-xl border border-[#D5D5D5] bg-[#FAFAFA] px-4 text-sm font-medium text-black hover:bg-[#F3F3F3] disabled:bg-[#F1F1F1] disabled:text-[#BDBDBD]"
        >
          {declineButtonText}
        </Button>

        <Button
          type="button"
          onClick={handleOpenApprove}
          disabled={isDisabled}
          className="h-10 flex-1 rounded-xl bg-[#81A35A] px-4 text-sm font-medium text-white hover:bg-[#73944e] disabled:bg-[#B7B7B7] disabled:text-white"
        >
          {approveButtonText}
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => (!isSubmitting ? setOpen(next) : undefined)}
      >
        <DialogContent className="max-w-[520px] rounded-[18px] border-0 bg-white p-0 shadow-none sm:rounded-[18px]">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-white ${
                  isApprove ? "bg-[#81A35A]" : "bg-[#EF3D2F]"
                }`}
              >
                <X className="h-4 w-4" />
              </button>

              <h3
                className={`text-base font-medium ${
                  isApprove ? "text-[#81A35A]" : "text-[#EF3D2F]"
                }`}
              >
                {title}
              </h3>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              disabled={isSubmitting}
              className={`min-h-[150px] resize-none rounded-[14px] bg-white px-4 py-3 text-sm shadow-none focus-visible:ring-0 ${
                isApprove
                  ? "border-[#81A35A] placeholder:text-[#A3A3A3]"
                  : "border-[#FF8A8A] placeholder:text-[#A3A3A3]"
              }`}
            />

            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !hasSelection ||
                  (actionType === "decline" && !text.trim())
                }
                className={`h-11 min-w-[235px] rounded-[10px] px-6 text-sm font-semibold text-white ${
                  isApprove
                    ? "bg-[#81A35A] hover:bg-[#73944e] disabled:bg-[#B7B7B7]"
                    : "bg-[#F01408] hover:bg-[#d91207] disabled:bg-[#B7B7B7]"
                }`}
              >
                {isSubmitting ? (
                  <Loader className="h-4 w-4 border-2" />
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
