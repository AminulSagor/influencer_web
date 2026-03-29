"use client";

import { useState } from "react";
import Image from "next/image";

import CollapsibleCard from "./collapsible-card";
import RejectReasonModal from "./reject-reason-modal";
import NotifyUser from "./notify-user";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { approveRejectNid } from "@/service/admin/verification-center/influencer/approve-reject-nid";
import { approveRejectAgencyNid } from "@/service/admin/verification-center/agency/approve-reject-nid";
import { approveRejectClientNid } from "@/service/admin/verification-center/brand/approve-reject-nid";

type CardStatus = "Pending" | "Rejected" | "Accepted";
type VerificationType = "influencer" | "agency" | "client";

interface NidInfo {
  nidNumber: string;
  frontSideImageUrl: string;
  backSideImageUrl: string;
  status?: CardStatus;
  rejectReason?: string | null;
}

interface Props {
  userId: string;
  nidInfo: NidInfo;
  verificationType?: VerificationType;
}

const statusBadgeMap: Record<
  Exclude<CardStatus, "Pending">,
  { label: string; className: string }
> = {
  Accepted: {
    label: "Approved",
    className:
      "border-0 bg-[#e8f8ee] px-5 py-2 text-[#078834] hover:bg-[#e8f8ee]",
  },
  Rejected: {
    label: "Rejected",
    className:
      "border-0 bg-[#fff1f0] px-5 py-2 text-[#e73508] hover:bg-[#fff1f0]",
  },
};

const NidInfoCard = ({
  userId,
  nidInfo,
  verificationType = "influencer",
}: Props) => {
  const [status, setStatus] = useState<CardStatus>(nidInfo.status ?? "Pending");
  const [rejectReason, setRejectReason] = useState<string | null>(
    nidInfo.rejectReason ?? null
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitAction = async ({
    nidStatus,
    rejectReason,
  }: {
    nidStatus: "approved" | "rejected";
    rejectReason?: string;
  }) => {
    if (verificationType === "agency") {
      return approveRejectAgencyNid({
        userId,
        nidStatus,
        rejectReason,
      });
    }

    if (verificationType === "client") {
      return approveRejectClientNid({
        userId,
        nidStatus,
        rejectionReason: rejectReason,
      });
    }

    return approveRejectNid({
      userId,
      nidStatus,
      rejectReason,
    });
  };

  const handleApprove = async () => {
    try {
      setLoading(true);

      await submitAction({
        nidStatus: "approved",
      });

      setStatus("Accepted");
      setRejectReason(null);
    } catch (error) {
      console.error("approve nid failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    try {
      setLoading(true);

      await submitAction({
        nidStatus: "rejected",
        rejectReason: reason,
      });

      setStatus("Rejected");
      setRejectReason(reason);
      setRejectOpen(false);
    } catch (error) {
      console.error("reject nid failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CollapsibleCard
        heading="NID Info"
        action={
          status === "Pending" ? (
            <NotifyUser
              userId={userId}
              targetRole={verificationType}
              reminderKey="nid"
            />
          ) : null
        }
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-Primary text-lg font-semibold">NID Number</h3>
              <p className="text-light-green text-2xl font-semibold">
                {nidInfo.nidNumber}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className={`min-w-[108px] rounded-2xl ${
                  status === "Rejected"
                    ? "border-[#fff1f0] bg-[#fff1f0] text-[#e73508] hover:bg-[#fff1f0]/90"
                    : "border-[#d7d7d7] bg-white text-black hover:bg-[#fafafa]"
                }`}
                disabled={loading || status === "Rejected"}
                onClick={() => setRejectOpen(true)}
              >
                {loading && status !== "Rejected" ? "Please wait..." : status === "Rejected" ? "Rejected" : "Reject"}
              </Button>

              <Button
                type="button"
                variant="lightGreen"
                className={`min-w-[108px] rounded-2xl ${
                  status === "Accepted"
                    ? "bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee]/90"
                    : "bg-[#86a857] text-white hover:bg-[#78994d]"
                }`}
                disabled={loading || status === "Accepted"}
                onClick={() => void handleApprove()}
              >
                {loading && status !== "Accepted" ? "Please wait..." : status === "Accepted" ? "Approved" : "Approve"}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <h3 className="text-Primary text-lg font-semibold">
                Front Side Of Nid
              </h3>
              <div className="relative h-[120px] w-full overflow-hidden rounded-md border border-dashed bg-gray-100">
                {nidInfo.frontSideImageUrl ? (
                  <Image
                    src={nidInfo.frontSideImageUrl}
                    alt="NID Front"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : null}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-Primary text-lg font-semibold">
                Back Side Of Nid
              </h3>
              <div className="relative h-[120px] w-full overflow-hidden rounded-md border border-dashed bg-gray-100">
                {nidInfo.backSideImageUrl ? (
                  <Image
                    src={nidInfo.backSideImageUrl}
                    alt="NID Back"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {status === "Rejected" && rejectReason ? (
            <div className="rounded-md bg-[#fff1f0] px-4 py-3">
              <p className="text-sm font-medium text-[#e73508]">
                Reject Reason: {rejectReason}
              </p>
            </div>
          ) : null}
        </div>
      </CollapsibleCard>

      <RejectReasonModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Write Reject Reason"
        loading={loading}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
};

export default NidInfoCard;