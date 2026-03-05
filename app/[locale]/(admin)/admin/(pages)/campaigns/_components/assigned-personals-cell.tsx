"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AssignedPersonalsCell({
  count,
  influencers,
  compact,
}: {
  count: number;
  influencers: any[];
  compact?: boolean;
}) {
  const first3 = (influencers || []).slice(0, 3);

  if (!first3.length) {
    return (
      <div className="flex items-center gap-2">
        <div className="rounded-md border border-light-green bg-white px-3 py-1 text-sm">
          {count} assigned
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {first3.map((inf, idx) => {
          const name = inf?.name || inf?.fullName || "—";
          const avatar = inf?.avatar || inf?.photo || "";
          return (
            <Avatar key={idx} className={compact ? "h-7 w-7" : "h-8 w-8"}>
              <AvatarImage src={avatar} />
              <AvatarFallback>{name?.[0] || "A"}</AvatarFallback>
            </Avatar>
          );
        })}
      </div>

      <div className="text-xs text-[var(--color-medium-gray)]">{count} assigned</div>
    </div>
  );
}
