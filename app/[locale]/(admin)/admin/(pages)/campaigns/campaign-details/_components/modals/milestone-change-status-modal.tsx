"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MilestoneStatusValue = "approved" | "in_review" | "todo" | "declined";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (status: MilestoneStatusValue) => void;
  loading?: boolean;
  currentStatus?: string;
};

const STATUS_OPTIONS = [
  { label: "To Do", value: "to_do" },
  { label: "In Review", value: "in_review" },
  { label: "Approved", value: "approved" },
  { label: "Declined", value: "declined" },
];

export default function MilestoneChangeStatusModal({
  open,
  onClose,
  onSubmit,
  loading = false,
  currentStatus = "to_do",
}: Props) {
  const [status, setStatus] = useState<MilestoneStatusValue>(
    (currentStatus as MilestoneStatusValue) || "to_do"
  );

  const handleSubmit = () => {
    onSubmit(status);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[480px] rounded-[18px] border-0 bg-white p-0 shadow-xl">
        <div className="rounded-[18px] bg-white p-6">
          <DialogTitle className="text-[18px] font-semibold text-Primary mb-4">
            Change Milestone Status
          </DialogTitle>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#4B5563]">
                Select Status
              </label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as MilestoneStatusValue)}
                disabled={loading}
              >
                <SelectTrigger className="w-full h-12 rounded-[12px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="h-12 rounded-[14px] border-[#CFCFCF] text-[16px]"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="h-12 rounded-[14px] bg-[#7EA055] text-[16px] text-white hover:brightness-95"
              >
                {loading ? "Changing..." : "Change"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
