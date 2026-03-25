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
  submissionId: string;
  status: SubmissionStatus | string;
  onApprove?: (submissionId: string) => void | Promise<void>;
  onDecline?: (submissionId: string, reason: string) => void | Promise<void>;
  isSubmitting?: boolean;
};

function normalizeStatus(value?: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export default function SubmissionReportActions({
  submissionId,
  status,
  onApprove,
  onDecline,
  isSubmitting = false,
}: Props) {
  const value = normalizeStatus(status);
  const [open, setOpen] = React.useState(false);
  const [actionType, setActionType] = React.useState<ActionType>(null);
  const [text, setText] = React.useState("");

  const showReviewActions = value === "in_review";
  const isFinished = ["approved", "completed", "declined"].includes(value);

  if (!showReviewActions && isFinished) {
    return null;
  }

  if (!showReviewActions) {
    return null;
  }

  const handleOpenApprove = () => {
    setActionType("approve");
    setText("");
    setOpen(true);
  };

  const handleOpenDecline = () => {
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
    if (actionType === "approve") {
      await onApprove?.(submissionId);
      return;
    }

    if (actionType === "decline") {
      const reason = text.trim();
      if (!reason) return;
      await onDecline?.(submissionId, reason);
    }
  };

  const isApprove = actionType === "approve";
  const title = isApprove ? "Write Approval Report" : "Write Decline Reason";
  const placeholder = isApprove
    ? "Write your report..."
    : "Write your reasons...";
  const buttonText = isSubmitting
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
          disabled={isSubmitting}
          className="h-10 flex-1 rounded-xl border border-[#D5D5D5] bg-[#FAFAFA] px-4 text-sm font-medium text-black hover:bg-[#F3F3F3] disabled:bg-[#F1F1F1] disabled:text-[#BDBDBD]"
        >
          Decline
        </Button>

        <Button
          type="button"
          onClick={handleOpenApprove}
          disabled={isSubmitting}
          className="h-10 flex-1 rounded-xl bg-[#81A35A] px-4 text-sm font-medium text-white hover:bg-[#73944e] disabled:bg-[#B7B7B7] disabled:text-white"
        >
          Approve
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
                  isSubmitting || (actionType === "decline" && !text.trim())
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
                  buttonText
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
