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
  onDecline: () => void;
  onApprove: () => void;
  paymentStatus: string;
  onPaymentStatusChange: (value: string) => void;
};

export default function InReviewActions({
  onDecline,
  onApprove,
  paymentStatus,
  onPaymentStatusChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onDecline}
        className="h-10 min-w-[110px] rounded-[10px] border-[#D4D4D8] bg-white text-[#3F3F46] hover:bg-white"
      >
        Decline
      </Button>

      <Button
        type="button"
        onClick={onApprove}
        className="h-10 min-w-[110px] rounded-[10px] bg-[#7EA055] text-white hover:brightness-95"
      >
        Approve
      </Button>

      <div className="w-full md:w-[180px]">
        <Select value={paymentStatus} onValueChange={onPaymentStatusChange}>
          <SelectTrigger className="h-10 rounded-[10px] border-[#D4D4D8] bg-white">
            <SelectValue placeholder="Select payment" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="partial_paid">Partial Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
