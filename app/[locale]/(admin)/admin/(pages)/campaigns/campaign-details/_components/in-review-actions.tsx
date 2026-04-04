"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  submissionStatus: string;
  paymentStatus: string;
  selectedPaymentAction: string;
  onDecline: () => void;
  onApprove: () => void;
  onPay: () => void;
  onPaymentActionChange: (value: string) => void;
  loading?: boolean;
  isPaidAd?: boolean;
  rollbackLoading?: boolean;
  onSubmissionStatusRollback?: (
    status: "completed" | "in_review"
  ) => void;
};

function ChangeStatusDropdown({
  rollbackLoading,
  onSubmissionStatusRollback,
  showInReviewOption,
  showApprovedOption,
  showDeclinedOption,
}: {
  rollbackLoading: boolean;
  onSubmissionStatusRollback: (
    status: "completed" | "in_review" 
  ) => void;
  showInReviewOption: boolean;
  showApprovedOption: boolean;
  showDeclinedOption: boolean;
}) {
  if (!showInReviewOption && !showApprovedOption && !showDeclinedOption) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          disabled={rollbackLoading}
          className="h-10 min-w-[150px] rounded-[10px] bg-[#7a9d54] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#6b8e46] disabled:opacity-60"
        >
          Change Status
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-90" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {showInReviewOption ? (
          <DropdownMenuItem
            disabled={rollbackLoading}
            className="cursor-pointer"
            onSelect={() => onSubmissionStatusRollback("in_review")}
          >
            In review
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function InReviewActions({
  submissionStatus,
  paymentStatus,
  selectedPaymentAction,
  onDecline,
  onApprove,
  onPay,
  onPaymentActionChange,
  loading = false,
  isPaidAd = false,
  rollbackLoading = false,
  onSubmissionStatusRollback,
}: Props) {
  const normalizedSubmissionStatus = String(
    submissionStatus || ""
  ).toLowerCase();
  const normalizedPaymentStatus = String(paymentStatus || "").toLowerCase();

  const isInReview = normalizedSubmissionStatus === "in_review";
  const isApproved = normalizedSubmissionStatus === "approved";

  const isPaid = normalizedPaymentStatus === "paid";
  const isPartialPaid = normalizedPaymentStatus === "partial_paid";
  const paymentDone = isPaid || isPartialPaid;

  const eligibleForInReviewRollback =
    !paymentDone &&
    (normalizedSubmissionStatus === "approved" ||
      normalizedSubmissionStatus === "declined");

  const showInReviewOption =
    Boolean(onSubmissionStatusRollback) &&
    (paymentDone ||
      (normalizedSubmissionStatus !== "in_review" &&
        eligibleForInReviewRollback));

  const showApprovedOption = Boolean(onSubmissionStatusRollback) && paymentDone;
  const showDeclinedOption = Boolean(onSubmissionStatusRollback) && paymentDone;

  const hasChangeStatusOptions =
    showInReviewOption || showApprovedOption || showDeclinedOption;

  const changeStatusBlock =
    onSubmissionStatusRollback && hasChangeStatusOptions ? (
      <ChangeStatusDropdown
        rollbackLoading={rollbackLoading}
        onSubmissionStatusRollback={onSubmissionStatusRollback}
        showInReviewOption={showInReviewOption}
        showApprovedOption={showApprovedOption}
        showDeclinedOption={showDeclinedOption}
      />
    ) : null;

  if (isPartialPaid) {
    return changeStatusBlock;
  }

  if (isPaid) {
    return changeStatusBlock;
  }

  if (isInReview) {
    return (
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onDecline}
            disabled={loading}
            className="h-10 min-w-[110px] rounded-[10px] border-[#D4D4D8] bg-white text-[#3F3F46] hover:bg-white"
          >
            Decline
          </Button>

          <Button
            type="button"
            onClick={onApprove}
            disabled={loading}
            className="h-10 min-w-[110px] rounded-[10px] bg-[#7EA055] text-white hover:brightness-95"
          >
            Approve
          </Button>
        </div>
      </div>
    );
  }

  if (isApproved) {
    return (
      <div className="flex w-full flex-col gap-3 md:items-end">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          <div className="w-full md:w-[180px]">
            <Select
              value={selectedPaymentAction}
              onValueChange={onPaymentActionChange}
            >
              <SelectTrigger className="h-10 rounded-[10px] border-[#D4D4D8] bg-white">
                <SelectValue placeholder="Select payment" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="partial_paid">Partial Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            onClick={onPay}
            disabled={loading || !selectedPaymentAction}
            className="h-10 min-w-[110px] rounded-[10px] bg-[#7EA055] text-white hover:brightness-95"
          >
            Pay
          </Button>
        </div>
        {changeStatusBlock ? (
          <div className="flex justify-end">{changeStatusBlock}</div>
        ) : null}
      </div>
    );
  }

  if (normalizedSubmissionStatus === "declined") {
    return changeStatusBlock;
  }

  return changeStatusBlock;
}
