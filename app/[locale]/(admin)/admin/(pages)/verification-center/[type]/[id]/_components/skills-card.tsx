"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CollapsibleCard from "./collapsible-card";
import RejectReasonModal from "./reject-reason-modal";
import NotifyUser from "./notify-user";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveRejectSkill } from "@/service/admin/verification-center/influencer/approve-reject-skill";

type CardStatus = "Pending" | "Rejected" | "Accepted";

interface Skill {
  name: string;
  status: CardStatus;
  rejectReason?: string | null;
}

interface Props {
  userId: string;
  skills: Skill[];
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

const SkillsCard = ({ userId, skills }: Props) => {
  const router = useRouter();
  const [items, setItems] = useState<Skill[]>(skills);
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

  const handleApprove = async (name: string) => {
    try {
      setLoadingName(name);

      await approveRejectSkill({
        userId,
        identifier: name,
        status: "approved",
      });

      updateItem(name, "Accepted");
      router.refresh();
    } catch (error) {
      console.error("approve skill failed", error);
    } finally {
      setLoadingName(null);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedName) return;

    try {
      setLoadingName(selectedName);

      await approveRejectSkill({
        userId,
        identifier: selectedName,
        status: "rejected",
        rejectReason: reason,
      });

      updateItem(selectedName, "Rejected", reason);
      setRejectOpen(false);
      setSelectedName(null);
      router.refresh();
    } catch (error) {
      console.error("reject skill failed", error);
    } finally {
      setLoadingName(null);
    }
  };

  return (
    <>
      <CollapsibleCard
        heading="Skills"
        action={
          <NotifyUser
            userId={userId}
            targetRole="influencer"
            reminderKey="skill"
            customLabel="Skill"
          />
        }
      >
        <div className="space-y-4">
          {items.map((skill) => {
            const isLoading = loadingName === skill.name;

            return (
              <div
                key={skill.name}
                className="flex items-center justify-between gap-4"
              >
                <Badge
                  variant="lightGreen"
                  className="border-0 bg-[#f2f1dc] px-6 py-2 text-[#5f7e32] hover:bg-[#f2f1dc]"
                >
                  {skill.name}
                </Badge>

                <div className="flex shrink-0 items-center gap-3">
                  <Button
                    variant="outline"
                    className={`min-w-[108px] rounded-2xl ${
                      skill.status === "Rejected"
                        ? "border-[#fff1f0] bg-[#fff1f0] text-[#e73508] hover:bg-[#fff1f0]/90"
                        : "border-[#d7d7d7] bg-white text-black hover:bg-[#fafafa]"
                    }`}
                    disabled={isLoading || skill.status === "Rejected"}
                    onClick={() => {
                      setSelectedName(skill.name);
                      setRejectOpen(true);
                    }}
                  >
                    {isLoading && loadingName === skill.name ? "Please wait..." : skill.status === "Rejected" ? "Rejected" : "Reject"}
                  </Button>

                  <Button
                    variant="lightGreen"
                    className={`min-w-[108px] rounded-2xl ${
                      skill.status === "Accepted"
                        ? "bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee]/90"
                        : "bg-[#86a857] text-white hover:bg-[#78994d]"
                    }`}
                    disabled={isLoading || skill.status === "Accepted"}
                    onClick={() => handleApprove(skill.name)}
                  >
                    {isLoading && loadingName === skill.name ? "Please wait..." : skill.status === "Accepted" ? "Approved" : "Approve"}
                  </Button>
                </div>
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

export default SkillsCard;