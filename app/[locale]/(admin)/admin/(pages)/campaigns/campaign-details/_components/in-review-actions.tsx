"use client";

import { Button } from "@/components/ui/button";
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
};

export default function InReviewActions({
  submissionStatus,
  paymentStatus,
  selectedPaymentAction,
  onDecline,
  onApprove,
  onPay,
  onPaymentActionChange,
  loading = false,
}: Props) {
  const normalizedSubmissionStatus = String(
    submissionStatus || ""
  ).toLowerCase();
  const normalizedPaymentStatus = String(paymentStatus || "").toLowerCase();

  const isInReview = normalizedSubmissionStatus === "in_review";
  const isApproved = normalizedSubmissionStatus === "approved";

  const isPaid = normalizedPaymentStatus === "paid";
  const isPartialPaid = normalizedPaymentStatus === "partial_paid";

  // when payment already done or partially done, show nothing
  if (isPaid || isPartialPaid) {
    return null;
  }

  if (isInReview) {
    return (
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
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
    );
  }

  if (isApproved) {
    return (
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
    );
  }

  return null;
}