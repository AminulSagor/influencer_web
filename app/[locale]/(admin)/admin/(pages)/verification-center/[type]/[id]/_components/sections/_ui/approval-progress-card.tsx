"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { InfluencerVerificationStatus } from "@/types/admin/user/influencer-verification-profile_type";
import {
  updateInfluencerVerificationStatus,
} from "@/api/admin/users/influencers/force-approve";

type OverallVerificationStatus = "pending" | "approved" | "rejected";
type Props = {
  nichesCount: number;
  socialLinksCount: number;
  nidStatus?: InfluencerVerificationStatus;
  payoutsCount: number;
  emailVerified?: boolean;
  onApproved?: () => void;
  verificationStatus?: OverallVerificationStatus;
};

function StepDot({ done }: { done: boolean }) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full",
        done ? "bg-Primary text-white" : "bg-light-gray/40 text-dark-gray"
      )}
    >
      {done ? "✓" : "⌛"}
    </div>
  );
}

function StepItem({
  label,
  sub,
  done,
}: {
  label: string;
  sub: string;
  done: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[140px]">
      <StepDot done={done} />
      <div className="text-sm font-semibold text-black">{label}</div>
      <div className="text-xs text-dark-gray">{sub}</div>
    </div>
  );
}

/* =========================
   Reject Modal
========================= */

function RejectReasonModal({
  open,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-[720px] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-red text-white">
              <X className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-red">
              Write Reject Reason
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-red hover:bg-red/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Write your reasons..."
            className="h-[220px] w-full resize-none rounded-2xl border border-red/50 p-4 text-sm outline-none"
          />

          <button
            type="button"
            disabled={loading || reason.trim().length === 0}
            onClick={() => onSubmit(reason.trim())}
            className={cn(
              "mt-6 h-14 w-full rounded-2xl text-base font-semibold text-white",
              loading || reason.trim().length === 0
                ? "bg-red/60 cursor-not-allowed"
                : "bg-red hover:brightness-95 active:scale-[0.98]"
            )}
          >
            {loading ? "Rejecting..." : "Reject & Notify"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export default function ApprovalProgressCard({
  nichesCount,
  socialLinksCount,
  nidStatus,
  payoutsCount,
  emailVerified,
  onApproved,
  verificationStatus
}: Props) {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const doneNiches = nichesCount > 0;
  const doneSocial = socialLinksCount > 0;
  const doneNid = nidStatus === "approved";
  const donePayout = payoutsCount > 0;
  const doneEmail = Boolean(emailVerified);

  const total = 5;
  const doneCount = [doneNiches, doneSocial, doneNid, donePayout, doneEmail].filter(Boolean).length;
  const overall = Math.round((doneCount / total) * 100);
  const pending = overall < 100;

  //API call

  async function updateStatus(
    status: "approved" | "rejected",
    rejectReason: string
  ) {
    if (!userId) {
      console.error("❌ userId missing");
      return;
    }

    try {
      setLoading(true);

      console.log("🚀 Sending verification update:", {
        userId,
        status,
        rejectReason,
      });

      const res = await updateInfluencerVerificationStatus(userId, {
        status,
        rejectReason,
      });

      onApproved?.();
    } catch (e) {
      console.error("❌ Verification API ERROR:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleApprove() {
    updateStatus("approved", "");
  }

  function handleRejectSubmit(reason: string) {
    setRejectOpen(false);
    updateStatus("rejected", reason);
  }

  return (
    <div className="rounded-xl border border-Primary/15 bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-Primary/10 text-Primary">
            ⟳
          </div>
          <h3 className="text-lg font-semibold text-black">
            Approval Progress
          </h3>
        </div>

        <div className="text-sm text-dark-gray">
          Overall Progress{" "}
          <span
            className={cn(
              "ml-2 font-semibold",
              pending ? "text-orange" : "text-light-green"
            )}
          >
            {overall}% {pending ? "Pending" : "Approved"}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="mt-8 flex items-center justify-between">
        <StepItem label="Niches" sub={`${nichesCount} Approved`} done={doneNiches} />
        <div className="h-px flex-1 bg-Primary/20" />
        <StepItem label="Social Links" sub={`${socialLinksCount} Approved`} done={doneSocial} />
        <div className="h-px flex-1 bg-Primary/20" />
        <StepItem label="NID" sub={doneNid ? "Approved" : "Pending"} done={doneNid} />
        <div className="h-px flex-1 bg-Primary/20" />
        <StepItem label="Payment Setup" sub={donePayout ? `${payoutsCount} Approved` : "Pending"} done={donePayout} />
        <div className="h-px flex-1 bg-Primary/20" />
        <StepItem label="Email" sub={doneEmail ? "Verified" : "Pending"} done={doneEmail} />
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 w-[550px] mx-auto rounded-xl border border-light-green/40 bg-gradient-to-b from-white to-Secondary/60 px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="text-sm font-semibold text-black">
            Approve With Current Progress!
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={loading || !userId}
              onClick={() => setRejectOpen(true)}
              className="h-10 w-[110px] rounded-lg border border-dark-gray/40 bg-white text-sm font-medium text-black hover:bg-off-white"
            >
              Reject
            </button>

            <button
              type="button"
              disabled={loading || !userId}
              onClick={handleApprove}
              className={cn(
                "h-10 w-[120px] rounded-lg text-sm font-medium text-white",
                loading || !userId
                  ? "bg-light-green/60 cursor-not-allowed"
                  : "bg-light-green hover:brightness-95 active:scale-[0.98]"
              )}
            >
              {loading ? "Approving..." : "Approve"}
            </button>
          </div>
        </div>
      </div>

      <RejectReasonModal
        open={rejectOpen}
        loading={loading}
        onClose={() => setRejectOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
}