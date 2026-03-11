"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CollapsibleCard from "./collapsible-card";
import RejectReasonModal from "./reject-reason-modal";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { approveRejectAgencyNiche } from "@/service/admin/verification-center/agency/approve-reject-niche";
import { approveRejectNiche } from "@/service/admin/verification-center/influencer/approve-reject-niche";

type CardStatus = "Pending" | "Rejected" | "Accepted";
type VerificationType = "influencer" | "agency";

interface Niche {
  name: string;
  status: CardStatus;
  rejectReason?: string | null;
}

interface Props {
  userId: string;
  niches: Niche[];
  verificationType?: VerificationType;
}

const statusBadgeMap: Record<
  Exclude<CardStatus, "Pending">,
  { label: string; className: string }
> = {
  Accepted: {
    label: "Approved",
    className:
      "border-0 bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee] px-5 py-2",
  },
  Rejected: {
    label: "Rejected",
    className:
      "border-0 bg-[#fff1f0] text-[#e73508] hover:bg-[#fff1f0] px-5 py-2",
  },
};

const NicheCard = ({
  userId,
  niches,
  verificationType = "influencer",
}: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<Niche[]>(niches);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState<string | null>(null);

  const updateItem = (
    name: string,
    status: CardStatus,
    rejectReason?: string | null
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.name === name
          ? { ...item, status, rejectReason: rejectReason ?? null }
          : item
      )
    );
  };

  const submitAction = async ({
    identifier,
    status,
    rejectReason,
  }: {
    identifier: string;
    status: "approved" | "rejected";
    rejectReason?: string;
  }) => {
    if (verificationType === "agency") {
      return approveRejectAgencyNiche({
        userId,
        identifier,
        status,
        rejectReason,
      });
    }

    return approveRejectNiche({
      userId,
      identifier,
      status,
      rejectReason,
    });
  };

  const handleApprove = async (name: string) => {
    try {
      setLoadingName(name);

      await submitAction({
        identifier: name,
        status: "approved",
      });

      updateItem(name, "Accepted");
      router.refresh();
    } catch (error) {
      console.error("approve niche failed", error);
    } finally {
      setLoadingName(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedName) return;

    try {
      setLoadingName(selectedName);

      await submitAction({
        identifier: selectedName,
        status: "rejected",
        rejectReason: reason,
      });

      updateItem(selectedName, "Rejected", reason);
      setRejectOpen(false);
      setSelectedName(null);
      router.refresh();
    } catch (error) {
      console.error("reject niche failed", error);
    } finally {
      setLoadingName(null);
    }
  };

  return (
    <>
      <CollapsibleCard heading="Niches">
        <div className="space-y-4">
          {items.map((niche) => {
            const isLoading = loadingName === niche.name;

            return (
              <div
                key={niche.name}
                className="flex items-center justify-between gap-4"
              >
                <Badge variant="lightGreen" className="border-0 px-6 py-2">
                  {niche.name}
                </Badge>

                {niche.status === "Pending" ? (
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-w-[90px] border-[#e73508] text-[#e73508] hover:bg-[#fff5f5] hover:text-[#e73508]"
                      disabled={isLoading}
                      onClick={() => {
                        setSelectedName(niche.name);
                        setRejectOpen(true);
                      }}
                    >
                      {isLoading ? "Please wait..." : "Reject"}
                    </Button>

                    <Button
                      type="button"
                      variant="lightGreen"
                      className="min-w-[90px]"
                      disabled={isLoading}
                      onClick={() => handleApprove(niche.name)}
                    >
                      {isLoading ? "Please wait..." : "Approve"}
                    </Button>
                  </div>
                ) : (
                  <Badge className={statusBadgeMap[niche.status].className}>
                    {statusBadgeMap[niche.status].label}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CollapsibleCard>

      <RejectReasonModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Write Reject Reason"
        loading={!!selectedName && loadingName === selectedName}
        onSubmit={handleReject}
      />
    </>
  );
};

export default NicheCard;