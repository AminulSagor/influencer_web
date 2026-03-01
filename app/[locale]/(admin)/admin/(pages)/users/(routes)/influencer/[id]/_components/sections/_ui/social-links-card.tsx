"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Instagram, Youtube, Music2, Link2, X } from "lucide-react";

import type { InfluencerSocialLink } from "@/types/admin/user/influencer-verification-profile_type";
import SectionHeader from "./section-header";
import ActionButtons from "./action-buttons";
import { cn } from "@/lib/utils";

import { extractUrlHandle } from "@/utils/admin/users/extract_url_handle_util";
import { updateInfluencerSocialStatus } from "@/api/admin/users/influencers/update-social-status";

function iconFor(platform: string) {
  const p = String(platform ?? "").toLowerCase();
  if (p.includes("instagram")) return <Instagram className="h-5 w-5" />;
  if (p.includes("youtube")) return <Youtube className="h-5 w-5" />;
  if (p.includes("tiktok")) return <Music2 className="h-5 w-5" />;
  return <Link2 className="h-5 w-5" />;
}

function StatusPill({ status }: { status: string }) {
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

/* optional reject modal (only if you want rejectReason for social too) */
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
            <h3 className="text-xl font-semibold text-red">Write Reject Reason</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-red hover:bg-red/10 active:scale-[0.98]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Write your reasons..."
            className="h-[220px] w-full resize-none rounded-2xl border border-red/30 p-4 text-sm outline-none focus:border-red"
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

type Props = {
  socialLinks: InfluencerSocialLink[];
  onUpdated?: () => void; // refetch after update
};

export default function SocialLinksCard({ socialLinks, onUpdated }: Props) {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const list = socialLinks ?? [];

  // local status override so UI updates immediately after click
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [activeIdentifier, setActiveIdentifier] = useState<string | null>(null);

  function getIdentifier(s: any) {
    // backend payload uses profileUrl in your response
    return String(s?.profileUrl ?? s?.url ?? "");
  }

  function getCurrentStatus(s: any) {
    const identifier = getIdentifier(s);
    return statusMap[identifier] ?? String(s?.status ?? "pending");
  }

  async function approve(identifier: string) {
    if (!userId) return console.error("❌ userId missing from route params");
    if (!identifier) return console.error("❌ identifier missing (profileUrl/url empty)");

    const key = `${identifier}:approved`;

    try {
      setLoadingKey(key);

      console.log("🚀 SOCIAL APPROVE REQUEST:", {
        userId,
        identifier,
        status: "approved",
      });

      const res = await updateInfluencerSocialStatus(userId, {
        identifier,
        status: "approved",
      });

      console.log("✅ SOCIAL APPROVE RESPONSE:", res?.data);

      setStatusMap((p) => ({ ...p, [identifier]: "approved" }));
      onUpdated?.();
    } catch (e) {
      console.error("❌ SOCIAL APPROVE ERROR:", e);
    } finally {
      setLoadingKey(null);
    }
  }

  function openReject(identifier: string) {
    setActiveIdentifier(identifier);
    setRejectOpen(true);
  }

  async function rejectSubmit(reason: string) {
    if (!userId) return console.error("❌ userId missing from route params");
    if (!activeIdentifier) return;

    const identifier = activeIdentifier;
    const key = `${identifier}:rejected`;

    try {
      setRejectOpen(false);
      setLoadingKey(key);

      console.log("🚀 SOCIAL REJECT REQUEST:", {
        userId,
        identifier,
        status: "rejected",
        rejectReason: reason,
      });

      const res = await updateInfluencerSocialStatus(userId, {
        identifier,
        status: "rejected",
        rejectReason: reason,
      });

      console.log("✅ SOCIAL REJECT RESPONSE:", res?.data);

      setStatusMap((p) => ({ ...p, [identifier]: "rejected" }));
      onUpdated?.();
    } catch (e) {
      console.error("❌ SOCIAL REJECT ERROR:", e);
    } finally {
      setLoadingKey(null);
      setActiveIdentifier(null);
    }
  }

  return (
    <div className="rounded-xl border border-Primary/15 bg-white p-6">
      <SectionHeader title="Social Links" showNotify />

      <div className="mt-5 space-y-4">
        {list.length === 0 ? (
          <div className="text-sm text-light-gray">No social links found.</div>
        ) : (
          list.map((s: any, idx) => {
            const identifier = getIdentifier(s); // ✅ full url used for API
            const status = getCurrentStatus(s);

            const isApproved = status === "approved";
            const isRejected = status === "rejected";
            const rowLoading =
              loadingKey === `${identifier}:approved` || loadingKey === `${identifier}:rejected`;

            return (
              <div
                key={`${identifier || s.platform}-${idx}`}
                className="flex items-center justify-between gap-4"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-off-white text-black">
                    {iconFor(s.platform)}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium text-black truncate">
                      @{extractUrlHandle(identifier)}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="shrink-0">
                  {isApproved || isRejected ? (
                    <StatusPill status={status} />
                  ) : (
                    <ActionButtons
                      loading={rowLoading}
                      disabled={!userId || !identifier}
                      leftLabel="Reject"
                      rightLabel="Accept"
                      onLeft={() => openReject(identifier)}
                      onRight={() => approve(identifier)}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <RejectReasonModal
        open={rejectOpen}
        loading={Boolean(loadingKey)}
        onClose={() => {
          setRejectOpen(false);
          setActiveIdentifier(null);
        }}
        onSubmit={rejectSubmit}
      />
    </div>
  );
}