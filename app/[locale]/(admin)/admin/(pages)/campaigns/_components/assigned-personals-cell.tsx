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
        <div className="text-sm text-light-green underline underline-offset-2">
          {count} Assigned
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, count - 3);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {first3.map((inf, idx) => {
          const name = inf?.name || inf?.fullName || "—";
          const avatar = inf?.avatar || inf?.photo || "";
          return (
            <div key={idx} className="group relative">
              <Avatar className={compact ? "h-6 w-6 border-white border" : "h-8 w-8 border-white border"}>
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-light-green/40 text-[9px]">
                  {name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>

              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 hidden -translate-x-1/2 flex-col items-center group-hover:flex">
                <div className="flex items-center gap-2 whitespace-nowrap rounded-md border border-gray-200 bg-white px-2 py-1.5 shadow-md">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="bg-light-green/40 text-[9px]">{name?.[0] || "A"}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold text-gray-700">{name}</span>
                </div>
                {/* Arrow */}
                <div className="h-1.5 w-1.5 rotate-45 border-b border-r border-gray-200 bg-white -mt-1 shadow-sm"></div>
              </div>
            </div>
          );
        })}
      </div>

      {remaining >= 0 && (
        <div className="text-xs text-light-green underline underline-offset-2 font-medium">
          {count > 3 ? `+${remaining}` : `${count}`} Assigned
        </div>
      )}
    </div>
  );
}
