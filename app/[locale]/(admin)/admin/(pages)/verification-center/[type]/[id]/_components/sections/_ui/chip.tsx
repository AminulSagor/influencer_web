"use client";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  className?: string;
};

export default function Chip({ label, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-Primary/10 px-4 py-2 text-sm font-medium text-Primary",
        className
      )}
    >
      {label}
    </span>
  );
}