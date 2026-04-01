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
import { notifySuccess, notifyError } from "@/utils/toast_util";

type ActionType = "decline" | null;

type Props = {
  submissionIds: string[];
  status: SubmissionStatus | string;
  onApprove?: (submissionIds: string[]) => void | Promise<void>;
  onDecline?: (submissionIds: string[], reason: string) => void | Promise<void>;
  isSubmitting?: boolean;
  approveButtonText?: string;
  declineButtonText?: string;
  disabled?: boolean;
  successMessage?: string;
  errorMessage?: string;
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
  successMessage = "Submission approved successfully!",
  errorMessage = "Failed to approve submission. Please try again.",
}: Props) {
  const value = normalizeStatus(status);
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [localSubmitting, setLocalSubmitting] = React.useState(false);

  // Allow both "in_review" and "in_progress" to show review actions
  const showReviewActions = value === "in_review" || value === "in_progress";
  const isFinished = ["approved", "completed", "declined"].includes(value);
  const hasSelection = submissionIds.length > 0;

  if (!showReviewActions && isFinished) {
    return null;
  }

  if (!showReviewActions) {
    return null;
  }

  const isDisabled =
    disabled || !hasSelection || isSubmitting || localSubmitting;

  // Approve button: Direct API call without dialog
  const handleApprove = async () => {
    if (isDisabled) return;

    setLocalSubmitting(true);
    try {
      await onApprove?.(submissionIds);
      notifySuccess(successMessage);
    } catch (error) {
      console.error("Approve failed:", error);
      notifyError(errorMessage);
    } finally {
      setLocalSubmitting(false);
    }
  };

  // Decline button: Open dialog to enter reason
  const handleOpenDecline = () => {
    if (isDisabled) return;
    setText("");
    setOpen(true);
  };

  const handleClose = () => {
    if (isSubmitting || localSubmitting) return;
    setOpen(false);
    setText("");
  };

  const handleDeclineSubmit = async () => {
    if (!hasSelection) return;

    const reason = text.trim();
    if (!reason) return;

    setLocalSubmitting(true);
    try {
      await onDecline?.(submissionIds, reason);
      notifySuccess("Submission declined successfully!");
      setOpen(false);
      setText("");
    } catch (error) {
      console.error("Decline failed:", error);
      notifyError("Failed to decline submission. Please try again.");
    } finally {
      setLocalSubmitting(false);
    }
  };

  const title = "Write Decline Reason";
  const placeholder = "Write your reasons...";
  const submitButtonText = localSubmitting ? "" : "Decline & Submit Reason";

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
          onClick={handleApprove}
          disabled={isDisabled}
          className="h-10 flex-1 rounded-xl bg-[#81A35A] px-4 text-sm font-medium text-white hover:bg-[#73944e] disabled:bg-[#B7B7B7] disabled:text-white"
        >
          {localSubmitting ? (
            <Loader className="h-4 w-4 border-2 border-white" />
          ) : (
            approveButtonText
          )}
        </Button>
      </div>

      {/* Dialog only for Decline */}
      <Dialog
        open={open}
        onOpenChange={(next) =>
          !isSubmitting && !localSubmitting ? setOpen(next) : undefined
        }
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
                disabled={isSubmitting || localSubmitting}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EF3D2F] text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-base font-medium text-[#EF3D2F]">{title}</h3>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              disabled={isSubmitting || localSubmitting}
              className="min-h-[150px] resize-none rounded-[14px] border-[#FF8A8A] bg-white px-4 py-3 text-sm shadow-none focus-visible:ring-0 placeholder:text-[#A3A3A3]"
            />

            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                onClick={handleDeclineSubmit}
                disabled={
                  isSubmitting ||
                  localSubmitting ||
                  !hasSelection ||
                  !text.trim()
                }
                className="h-11 min-w-[235px] rounded-[10px] bg-[#F01408] px-6 text-sm font-semibold text-white hover:bg-[#d91207] disabled:bg-[#B7B7B7]"
              >
                {localSubmitting ? (
                  <Loader className="h-4 w-4 border-2 border-white" />
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
