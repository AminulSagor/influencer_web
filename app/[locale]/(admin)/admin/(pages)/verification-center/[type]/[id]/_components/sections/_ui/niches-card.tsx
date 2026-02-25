"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import ActionButtons from "./action-buttons";
import Chip from "./chip";
import SectionHeader from "./section-header";

import { updateInfluencerNicheStatus } from "@/api/admin/users/influencers/update-niche-status";
import { cn } from "@/lib/utils";

type NicheItem = {
  niche: string;
  status: string; // "approved" | "rejected" | "unverified"
};

type Props = {
  niches: NicheItem[];
  onUpdated?: () => void;
};

export default function NichesCard({ niches, onUpdated }: Props) {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const sorted = useMemo(() => niches ?? [], [niches]);

  async function handleUpdate(
    nicheName: string,
    status: "approved" | "rejected"
  ) {
    if (!userId) {
      console.error("❌ userId missing");
      return;
    }

    const key = `${nicheName}:${status}`;

    try {
      setLoadingKey(key);

      const res = await updateInfluencerNicheStatus(userId, {
        identifier: nicheName,
        status,
      });

      onUpdated?.();
    } catch (e) {
      console.error("❌ Niche update ERROR:", e);
    } finally {
      setLoadingKey(null);
    }
  }

  function StatusBadge({ status }: { status: string }) {
    const isApproved = status === "approved";
    const isRejected = status === "rejected";

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

  return (
    <div className="rounded-xl border border-Primary/15 bg-white p-6">
      <SectionHeader title="Niches" showNotify />

      <div className="mt-5 space-y-3">
        {sorted.length === 0 ? (
          <div className="text-sm text-light-gray">No niches found.</div>
        ) : (
          sorted.map((item, idx) => {
            const approvingKey = `${item.niche}:approved`;
            const rejectingKey = `${item.niche}:rejected`;
            const rowLoading =
              loadingKey === approvingKey || loadingKey === rejectingKey;

            const isApproved = item.status === "approved";
            const isRejected = item.status === "rejected";

            return (
              <div
                key={`${item.niche}-${idx}`}
                className="flex items-center justify-between gap-3"
              >
                <Chip label={item.niche} />

                {/* ✅ If approved/rejected show badge */}
                {isApproved || isRejected ? (
                  <StatusBadge status={item.status} />
                ) : (
                  <ActionButtons
                    loading={rowLoading}
                    disabled={!userId}
                    leftLabel="Reject"
                    rightLabel="Accept"
                    onLeft={() => handleUpdate(item.niche, "rejected")}
                    onRight={() => handleUpdate(item.niche, "approved")}
                  />
                )}
              </div>
            );
          })
        )}

        <button
          type="button"
          className="mt-4 w-full rounded-lg border border-dashed border-Primary/40 bg-off-white py-3 text-sm font-medium text-Primary hover:bg-Primary/5"
        >
          + Add Another Niche
        </button>
      </div>
    </div>
  );
}