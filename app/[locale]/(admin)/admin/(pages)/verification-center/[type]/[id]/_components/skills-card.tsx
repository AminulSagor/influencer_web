"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CollapsibleCard from "./collapsible-card";
import RejectReasonModal from "./reject-reason-modal";

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
      "border-0 bg-[#e8f8ee] text-[#078834] hover:bg-[#e8f8ee] px-5 py-2",
  },
  Rejected: {
    label: "Rejected",
    className:
      "border-0 bg-[#fff1f0] text-[#e73508] hover:bg-[#fff1f0] px-5 py-2",
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
      <CollapsibleCard heading="Skills">
        <div className="space-y-4">
          {items.map((skill) => {
            const isLoading = loadingName === skill.name;

            return (
              <div
                key={skill.name}
                className="flex items-center justify-between gap-4"
              >
                <Badge variant="lightGreen" className="border-0 px-6 py-2">
                  {skill.name}
                </Badge>

                {skill.status === "Pending" ? (
                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      variant="outline"
                      className="min-w-[92px] border-[#e73508] text-[#e73508] hover:bg-[#fff5f5] hover:text-[#e73508]"
                      disabled={isLoading}
                      onClick={() => {
                        setSelectedName(skill.name);
                        setRejectOpen(true);
                      }}
                    >
                      {isLoading ? "Please wait..." : "Reject"}
                    </Button>

                    <Button
                      variant="lightGreen"
                      className="min-w-[92px]"
                      disabled={isLoading}
                      onClick={() => handleApprove(skill.name)}
                    >
                      {isLoading ? "Please wait..." : "Approve"}
                    </Button>
                  </div>
                ) : (
                  <Badge className={statusBadgeMap[skill.status].className}>
                    {statusBadgeMap[skill.status].label}
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

export default SkillsCard;