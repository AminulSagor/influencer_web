"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  heading: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  className?: string;
}

const CollapsibleCard = ({
  heading,
  children,
  defaultOpen = true,
  action,
  className,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("rounded-2xl border border-[#d9d9d9] bg-white p-5", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="min-w-0 text-[18px] font-semibold text-[#2f5d1d]">
            {heading}
          </div>

          {action ? <div onClick={(e) => e.stopPropagation()}>{action}</div> : null}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 text-[#2b2b2b]"
        >
          {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {open ? <div className="mt-5">{children}</div> : null}
    </div>
  );
};

export default CollapsibleCard;