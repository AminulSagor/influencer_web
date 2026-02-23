"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = {
  type: "influencer" | "brand";
  name: string;
};

export default function VerificationBreadcrumb({ type, name }: Props) {
  const prettyType = type === "influencer" ? "Verify Influencer" : "Verify Brand";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/admin/verification-center"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-Primary hover:bg-primary/20"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-black">Verification Center</h1>
        <div className="mt-0.5 text-sm text-light-gray">
          <span>Verification Center</span>
          <span className="mx-2">›</span>
          <span>{prettyType}</span>
          <span className="mx-2">›</span>
          <span className="text-Primary">{name || "—"}</span>
        </div>
      </div>
    </div>
  );
}