"use client";

import Image from "next/image";

import CollapsibleCard from "./collapsible-card";
import NotifyUser from "./notify-user";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { VerifyReminderKey } from "@/utils/admin/templete/verify-reminder-templete";
import type { VerifyReminderTargetRole } from "@/service/admin/verification-center/send-verify-reminder";

type CardStatus = "Pending" | "Rejected" | "Accepted";

interface Props {
  userId: string;
  targetRole: VerifyReminderTargetRole;
  reminderKey: VerifyReminderKey;
  title: string;
  numberLabel: string;
  numberValue: string;
  imageUrl?: string;
  status?: CardStatus;
  customNotifyLabel?: string;
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

const DocumentCard = ({
  userId,
  targetRole,
  reminderKey,
  title,
  numberLabel,
  numberValue,
  imageUrl,
  status = "Pending",
  customNotifyLabel,
}: Props) => {
  return (
    <CollapsibleCard
      heading={title}
      action={
        status === "Pending" ? (
          <NotifyUser
            userId={userId}
            targetRole={targetRole}
            reminderKey={reminderKey}
            customLabel={customNotifyLabel}
          />
        ) : null
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">{numberLabel}</p>
            <p className="text-lg font-semibold text-light-green">
              {numberValue || "N/A"}
            </p>
          </div>

          {status !== "Pending" ? (
            <Badge className={statusBadgeMap[status].className}>
              {statusBadgeMap[status].label}
            </Badge>
          ) : null}
        </div>

        <div className="relative h-[120px] w-full overflow-hidden rounded-md border border-dashed bg-gray-50">
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

        {status === "Pending" ? (
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              className="min-w-[108px] rounded-2xl border-[#d7d7d7] bg-white text-black hover:bg-[#fafafa]"
            >
              Reject
            </Button>
            <Button
              variant="lightGreen"
              size="sm"
              className="min-w-[108px] rounded-2xl bg-[#86a857] text-white hover:bg-[#78994d]"
            >
              Approve
            </Button>
          </div>
        ) : null}
      </div>
    </CollapsibleCard>
  );
};

export default DocumentCard;