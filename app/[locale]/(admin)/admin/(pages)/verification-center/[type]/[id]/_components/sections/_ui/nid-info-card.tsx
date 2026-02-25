"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import type { InfluencerVerificationStatus } from "@/types/admin/user/influencer-verification-profile_type";
import SectionHeader from "./section-header";
import ActionButtons from "./action-buttons";

import { cn } from "@/lib/utils";
import { updateInfluencerNidStatus } from "@/api/admin/users/influencers/update-nid-status";

type Props = {
  nidNumber: string | null;
  frontImg: string | null;
  backImg: string | null;
  status?: InfluencerVerificationStatus;
  onUpdated?: () => void; 
};

function isUploadValue(v: string | null) {
  if (!v) return false;
  return v !== "pending-upload";
}

function StatusPill({ status }: { status?: InfluencerVerificationStatus }) {
  const s = status ?? "pending";
  const isApproved = s === "approved";
  const isRejected = s === "rejected";
  if (!isApproved && !isRejected) return null;

  return (
    <div
      className={cn(
        "h-10 px-4 rounded-full text-sm font-semibold flex items-center",
        isApproved
          ? "bg-light-green/10 text-light-green border border-light-green/30"
          : "bg-red/10 text-red border border-red/30"
      )}
    >
      {isApproved ? "Approved" : "Rejected"}
    </div>
  );
}

export default function NidInfoCard({
  nidNumber,
  frontImg,
  backImg,
  status,
  onUpdated,
}: Props) {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [loading, setLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState<InfluencerVerificationStatus | undefined>(
    status
  );

  const effectiveStatus = localStatus ?? status;

  async function handleUpdate(nidStatus: "approved" | "rejected") {
    if (!userId) {
      console.error("❌ NID: userId missing from route params");
      return;
    }

    try {
      setLoading(true);

      const res = await updateInfluencerNidStatus(userId, { nidStatus });

      setLocalStatus(nidStatus);

      onUpdated?.();
    } catch (e) {
      console.error("❌ NID UPDATE ERROR:", e);
    } finally {
      setLoading(false);
    }
  }

  const canShowButtons =
    effectiveStatus !== "approved" && effectiveStatus !== "rejected";

  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="NID Info" showNotify />

        <StatusPill status={effectiveStatus} />
      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold text-black">NID Number</div>
        <div className="mt-2 text-2xl font-semibold text-Primary">
          {nidNumber || "—"}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <div className="text-sm font-semibold text-black">Front Side of NID</div>
          <div className="mt-2 grid h-36 place-items-center rounded-lg border border-dashed border-primary/25 bg-off-white text-sm text-light-gray">
            {isUploadValue(frontImg) ? "Front Image Uploaded" : "Front Side of NID"}
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="text-sm font-semibold text-black">Back Side of NID</div>
          <div className="mt-2 grid h-36 place-items-center rounded-lg border border-dashed border-primary/25 bg-off-white text-sm text-light-gray">
            {isUploadValue(backImg) ? "Back Image Uploaded" : "Back Side of NID"}
          </div>
        </div>
      </div>

      {canShowButtons ? (
        <div className="mt-6">
          <ActionButtons
            loading={loading}
            disabled={!userId}
            leftLabel="Reject"
            rightLabel="Accept"
            onLeft={() => handleUpdate("rejected")}
            onRight={() => handleUpdate("approved")}
          />
        </div>
      ) : null}
    </div>
  );
}