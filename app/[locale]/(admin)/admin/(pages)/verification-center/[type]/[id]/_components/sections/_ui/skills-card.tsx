"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { X } from "lucide-react";

import type { InfluencerSkillItem } from "@/types/admin/user/influencer-verification-profile_type";
import SectionHeader from "./section-header";
import Chip from "./chip";
import ActionButtons from "./action-buttons";

import { cn } from "@/lib/utils";
import { updateInfluencerSkillStatus } from "@/api/admin/users/influencers/update-skill-status";

type Props = {
  skills: InfluencerSkillItem[];
  onUpdated?: () => void; // call to refetch
};

/* =========================
   Reusable status pill
========================= */
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

/* =========================
   Reject modal
========================= */
function RejectReasonModal({
  open,
  loading,
  skillName,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  skillName: string | null;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-[720px] rounded-2xl bg-white shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-red text-white">
              <X className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red">Write Reject Reason</h3>
              <div className="text-xs text-dark-gray mt-1">
                Skill: <span className="font-semibold text-black">{skillName ?? "—"}</span>
              </div>
            </div>
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

        {/* body */}
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

export default function SkillsCard({ skills, onUpdated }: Props) {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const list = skills ?? [];

  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  async function handleApprove(skillName: string) {
    if (!userId) return console.error("❌ userId missing");

    const key = `${skillName}:approved`;
    try {
      setLoadingKey(key);

      const res = await updateInfluencerSkillStatus(userId, {
        identifier: skillName,
        status: "approved",
        rejectReason: "",
      });

      onUpdated?.();
    } catch (e) {
      console.error("❌ SKILL APPROVE ERROR:", e);
    } finally {
      setLoadingKey(null);
    }
  }

  function openReject(skillName: string) {
    setActiveSkill(skillName);
    setRejectOpen(true);
  }

  async function handleRejectSubmit(reason: string) {
    if (!userId) return console.error("❌ userId missing");
    if (!activeSkill) return;

    const skillName = activeSkill;
    const key = `${skillName}:rejected`;

    try {
      setRejectOpen(false);
      setLoadingKey(key);

      console.log("🚀 SKILL REJECT REQUEST:", {
        userId,
        identifier: skillName,
        status: "rejected",
        rejectReason: reason,
      });

      const res = await updateInfluencerSkillStatus(userId, {
        identifier: skillName,
        status: "rejected",
        rejectReason: reason,
      });

      console.log("✅ SKILL REJECT RESPONSE:", res?.data);

      onUpdated?.();
    } catch (e) {
      console.error("❌ SKILL REJECT ERROR:", e);
    } finally {
      setLoadingKey(null);
      setActiveSkill(null);
    }
  }

  return (
    <div className="rounded-xl border border-Primary/15 bg-white p-6">
      <SectionHeader title="Skills" showNotify />

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <div className="text-sm text-light-gray">No skills found.</div>
        ) : (
          list.map((item, idx) => {
            const skillName = item.skill;
            const status = item.status; // must exist in InfluencerSkillItem
            const isApproved = status === "approved";
            const isRejected = status === "rejected";
            const rowLoading =
              loadingKey === `${skillName}:approved` || loadingKey === `${skillName}:rejected`;

            return (
              <div
                key={`${skillName}-${idx}`}
                className="flex items-center justify-between gap-3"
              >
                <Chip label={skillName} />

                {isApproved || isRejected ? (
                  <StatusPill status={status} />
                ) : (
                  <ActionButtons
                    loading={rowLoading}
                    disabled={!userId}
                    leftLabel="Reject"
                    rightLabel="Accept"
                    onLeft={() => openReject(skillName)}
                    onRight={() => handleApprove(skillName)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <RejectReasonModal
        open={rejectOpen}
        loading={Boolean(loadingKey)}
        skillName={activeSkill}
        onClose={() => {
          setRejectOpen(false);
          setActiveSkill(null);
        }}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
}