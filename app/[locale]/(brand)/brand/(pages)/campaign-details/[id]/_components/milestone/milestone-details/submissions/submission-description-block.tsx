"use client";

import { User } from "lucide-react";

type Props = {
  description: string | null;
};

export default function SubmissionDescriptionBlock({ description }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium text-black">
        <User className="h-4 w-4 fill-current" />
        <span>Description / Update</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-black/70">
        {description || "No description provided."}
      </p>
    </div>
  );
}
