"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Hourglass, Target } from "lucide-react";
import axios from "axios";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RejectReasonModal from "./reject-reason-modal";
import {
  forceApproveUser,
  forceRejectUser,
} from "@/service/admin/verification-center/force-approve-reject-user";

interface ApprovalStep {
  label: string;
  status: "completed" | "pending";
  subtitle: string;
}

interface Props {
  userId: string;
  steps: ApprovalStep[];
  initialIsVerified?: boolean;
  initialRejectReason?: string | null;
}

type VerificationStatus = "pending" | "approved" | "rejected";

const getInitialStatus = (
  isVerified?: boolean,
  rejectReason?: string | null
): VerificationStatus => {
  if (isVerified === true) return "approved";
  if (isVerified === false && !!rejectReason?.trim()) return "rejected";
  return "pending";
};

const ApprovalProgress = ({
  userId,
  steps,
  initialIsVerified = false,
  initialRejectReason = null,
}: Props) => {
  const router = useRouter();

  const [status, setStatus] = useState<VerificationStatus>(
    getInitialStatus(initialIsVerified, initialRejectReason)
  );
  const [rejectReason, setRejectReason] = useState<string | null>(
    initialRejectReason
  );

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const completedCount = useMemo(
    () => steps.filter((s) => s.status === "completed").length,
    [steps]
  );

  const totalSteps = steps.length || 1;
  const pendingPercentage =
    100 - Math.round((completedCount / totalSteps) * 100);

  const handleApprove = async () => {
    try {
      setIsApproving(true);

      const res = await forceApproveUser(userId);

      if (res?.success && res?.data?.isVerified === true) {
        setStatus("approved");
        setRejectReason(null);
      }

      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Approve failed:", error.response?.data || error.message);
      } else {
        console.error("Approve failed:", error);
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    try {
      setIsRejecting(true);

      const res = await forceRejectUser(userId, reason);

      if (res?.success && res?.data?.isVerified === false) {
        setStatus("rejected");
        setRejectReason(res.data.rejectReason || reason);
        setRejectModalOpen(false);
      }

      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Reject failed:", error.response?.data || error.message);
      } else {
        console.error("Reject failed:", error);
      }
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <Card className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-[#355E1D]">
              <Target className="h-6 w-6 fill-current" />
            </div>

            <h2 className="text-[18px] font-semibold text-[#355E1D]">
              Approval Progress
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-black">Overall Progress</span>
            <span className="font-semibold text-[#D9822B]">
              {pendingPercentage}% Pending
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div
            className="relative mx-auto flex min-w-[720px] items-start justify-between"
            style={{ width: `${Math.max(steps.length * 110, 720)}px` }}
          >
            <div className="absolute left-[48px] right-[48px] top-4 h-[1px] bg-gray-300" />

            {steps.map((step) => {
              const isCompleted = step.status === "completed";

              return (
                <div
                  key={step.label}
                  className="relative z-10 flex w-[110px] flex-col items-center text-center"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      isCompleted ? "bg-[#355E1D]" : "bg-[#E5E5E5]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Hourglass className="h-4 w-4 text-[#9E9E9E]" />
                    )}
                  </div>

                  <p className="mt-3 text-sm font-medium text-black">
                    {step.label}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8B8B8B]">
                    {step.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex w-full max-w-[500px] items-center justify-between rounded-xl border border-[#C7D6A4] bg-[#F7F8EE] px-5 py-3">
            <p className="text-sm font-medium text-black">
              Approve With Current Progress!
            </p>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className={`h-8 rounded-xl px-5 text-xs ${
                      status === "rejected"
                        ? "border-[#fff1f0] bg-[#fff1f0] text-[#e73508] hover:bg-[#fff1f0]/90"
                        : "border-gray-300 bg-[#F4F4F4] text-black hover:bg-gray-100"
                    }`}
                    onClick={() => setRejectModalOpen(true)}
                    disabled={isApproving || isRejecting || status === "rejected"}
                  >
                    {isRejecting ? "Rejecting..." : status === "rejected" ? "Rejected" : "Reject"}
                  </Button>

                  <Button
                    variant="lightGreen"
                    className={`h-8 rounded-xl px-5 text-xs ${
                      status === "approved"
                        ? "bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee]/90"
                        : "bg-[#86a857] text-white hover:bg-[#78994d]"
                    }`}
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting || status === "approved"}
                  >
                    {isApproving ? "Approving..." : status === "approved" ? "Approved" : "Approve"}
                  </Button>
                </div>
                {status === "rejected" && rejectReason ? (
                  <span className="max-w-[220px] text-right text-xs text-[#8B8B8B]">
                    {rejectReason}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <RejectReasonModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        loading={isRejecting}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
};

export default ApprovalProgress;