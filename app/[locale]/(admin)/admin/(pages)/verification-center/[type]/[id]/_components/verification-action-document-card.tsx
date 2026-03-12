"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import CollapsibleCard from "./collapsible-card";
import RejectReasonModal from "./reject-reason-modal";
import NotifyUser from "./notify-user";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { approveRejectAgencyBin } from "@/service/admin/verification-center/agency/approve-reject-bin";
import { approveRejectAgencyTin } from "@/service/admin/verification-center/agency/approve-reject-tin";
import { approveRejectAgencyTradeLicense } from "@/service/admin/verification-center/agency/approve-reject-trade-license";
import { approveRejectClientBin } from "@/service/admin/verification-center/brand/approve-reject-bin";
import { approveRejectClientTin } from "@/service/admin/verification-center/brand/approve-reject-tin";
import { approveRejectClientTradeLicense } from "@/service/admin/verification-center/brand/approve-reject-trade-license";

type CardStatus = "Pending" | "Rejected" | "Accepted";
type DocType = "trade-license" | "tin" | "bin";
type VerificationType = "agency" | "client";

interface Props {
  userId: string;
  verificationType?: VerificationType;
  docType: DocType;
  title: string;
  numberLabel: string;
  numberValue: string;
  imageUrl?: string;
  status?: CardStatus;
  rejectReason?: string | null;
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

const getReminderKey = (docType: DocType) => {
  if (docType === "trade-license") return "trade-license";
  if (docType === "tin") return "tin";
  return "bin";
};

const getReminderLabel = (docType: DocType) => {
  if (docType === "trade-license") return "Trade License";
  if (docType === "tin") return "TIN";
  return "BIN";
};

const VerificationActionDocumentCard = ({
  userId,
  verificationType = "agency",
  docType,
  title,
  numberLabel,
  numberValue,
  imageUrl,
  status = "Pending",
  rejectReason,
}: Props) => {
  const router = useRouter();

  const [itemStatus, setItemStatus] = useState<CardStatus>(status);
  const [itemRejectReason, setItemRejectReason] = useState<string | null>(
    rejectReason ?? null
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [loadingType, setLoadingType] = useState<"approve" | "reject" | null>(
    null
  );

  const submitAction = async ({
    status,
    rejectReason,
  }: {
    status: "approved" | "rejected";
    rejectReason?: string;
  }) => {
    if (verificationType === "client") {
      if (docType === "trade-license") {
        return approveRejectClientTradeLicense({
          userId,
          tradeLicenseStatus: status,
          rejectionReason: rejectReason,
        });
      }

      if (docType === "tin") {
        return approveRejectClientTin({
          userId,
          tinStatus: status,
          rejectionReason: rejectReason,
        });
      }

      return approveRejectClientBin({
        userId,
        binStatus: status,
        rejectionReason: rejectReason,
      });
    }

    if (docType === "trade-license") {
      return approveRejectAgencyTradeLicense({
        userId,
        tradeLicenseStatus: status,
        rejectReason,
      });
    }

    if (docType === "tin") {
      return approveRejectAgencyTin({
        userId,
        tinStatus: status,
        rejectReason,
      });
    }

    return approveRejectAgencyBin({
      userId,
      binStatus: status,
      rejectReason,
    });
  };

  const handleApprove = async () => {
    try {
      setLoadingType("approve");

      await submitAction({
        status: "approved",
      });

      setItemStatus("Accepted");
      setItemRejectReason(null);
      router.refresh();
    } catch (error) {
      console.error(`approve ${docType} failed`, error);
    } finally {
      setLoadingType(null);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      setLoadingType("reject");

      await submitAction({
        status: "rejected",
        rejectReason: reason,
      });

      setItemStatus("Rejected");
      setItemRejectReason(reason);
      setRejectOpen(false);
      router.refresh();
    } catch (error) {
      console.error(`reject ${docType} failed`, error);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <>
      <CollapsibleCard
        heading={title}
        action={
          itemStatus === "Pending" ? (
            <NotifyUser
              userId={userId}
              targetRole={verificationType}
              reminderKey={getReminderKey(docType)}
              customLabel={getReminderLabel(docType)}
            />
          ) : null
        }
      >
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">{numberLabel}</p>
              <p className="text-lg font-semibold text-light-green">
                {numberValue || "N/A"}
              </p>
            </div>

            {itemStatus === "Pending" ? (
              <Badge className="border-0 bg-[#fff7ed] px-5 py-2 text-[#f97316] hover:bg-[#fff7ed]">
                Pending
              </Badge>
            ) : (
              <Badge className={statusBadgeMap[itemStatus].className}>
                {statusBadgeMap[itemStatus].label}
              </Badge>
            )}
          </div>

          {itemRejectReason ? (
            <div className="rounded-md border border-[#e73508]/15 bg-[#fff1f0] px-3 py-2">
              <p className="text-xs font-medium text-[#e73508]">
                Reject Reason
              </p>
              <p className="mt-1 text-sm text-[#e73508]">{itemRejectReason}</p>
            </div>
          ) : null}

          <div className="relative h-[180px] w-full overflow-hidden rounded-md border border-dashed bg-gray-50">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                {title}
              </div>
            )}
          </div>

          {itemStatus === "Pending" ? (
            <div className="flex shrink-0 items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="min-w-[108px] rounded-2xl border-[#d7d7d7] bg-white text-black hover:bg-[#fafafa]"
                disabled={loadingType !== null}
                onClick={() => setRejectOpen(true)}
              >
                {loadingType === "reject" ? "Please wait..." : "Reject"}
              </Button>

              <Button
                type="button"
                variant="lightGreen"
                className="min-w-[108px] rounded-2xl bg-[#86a857] text-white hover:bg-[#78994d]"
                disabled={loadingType !== null}
                onClick={handleApprove}
              >
                {loadingType === "approve" ? "Please wait..." : "Approve"}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end">
              <Badge className={statusBadgeMap[itemStatus].className}>
                {statusBadgeMap[itemStatus].label}
              </Badge>
            </div>
          )}
        </div>
      </CollapsibleCard>

      <RejectReasonModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Write Reject Reason"
        loading={loadingType === "reject"}
        onSubmit={handleReject}
      />
    </>
  );
};

export default VerificationActionDocumentCard;