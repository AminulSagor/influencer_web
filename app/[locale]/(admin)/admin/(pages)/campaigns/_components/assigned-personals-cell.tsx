"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { CampaignAssigneeUI } from "@/types/admin/campaign/campaign_ui_type";
import { FaCheckCircle } from "react-icons/fa";

export default function AssignedPersonalsCell({
  count,
  influencers,
  compact,
}: {
  count: number;
  influencers: CampaignAssigneeUI[];
  compact?: boolean;
}) {
  const assignees = influencers || [];
  const first3 = assignees.slice(0, 3);
  const avatarSize = compact ? "h-6 w-6" : "h-8 w-8";

  if (!assignees.length || count === 0) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="h-6 w-6 rounded-full bg-light-green/70" />
        <p className="text-[11px] text-light-green">None assigned</p>
      </div>
    );
  }

  const label = count > 1 ? `+${count} Assigned` : "1 Assigned";

  const content = (
    <div className="inline-flex cursor-default flex-col items-center gap-1">
      <div className="flex -space-x-2">
        {first3.map((assignee, idx) => {
          const name = assignee?.name || "Assigned";
          const avatar = assignee?.avatar || "";

          return (
            <Avatar
              key={`${assignee.id}-${idx}`}
              className={`${avatarSize} border-2 border-white`}
            >
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-light-green/50 text-[9px] text-white">
                {name?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </div>

      <p className="text-[11px] font-medium text-light-green underline underline-offset-2">
        {label}
      </p>
    </div>
  );

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>{content}</HoverCardTrigger>
      <HoverCardContent
        align="center"
        side="bottom"
        className="w-[245px] rounded-2xl border border-[#D8D8D8] bg-linear-to-br from-white to-[#FFFDE3] p-3 shadow-xl"
      >
        <div className="space-y-2">
          {assignees.map((assignee, idx) => {
            const name = assignee?.name || "Assigned";
            const avatar = assignee?.avatar || "";
            const location = assignee?.location || "Dhaka, Bangladesh";

            return (
              <div
                key={`${assignee.id}-${idx}-popup`}
                className="flex items-center gap-3 rounded-full border border-[#D5D5B8] bg-white/45 px-2 py-2"
              >
                <Avatar className="h-10 w-10 border border-white">
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="bg-[#F1F0C9] text-sm text-light-green">
                    {name?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-Primary">
                    {name}
                  </p>
                  <p className="truncate text-[10px] text-dark-gray">
                    {location}
                  </p>
                </div>

                <FaCheckCircle className="shrink-0 text-xs text-sky-400" />
              </div>
            );
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
