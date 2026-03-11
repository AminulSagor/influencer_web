"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    label: "Agency Quotations",
    key: "agency-quotations",
  },
  {
    label: "Campaigns Details",
    key: "details",
  },
];

export default function CampaignDetailsTabs() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;

  return (
    <div className="rounded-full border border-light-gray bg-white p-1">
      <div className="grid grid-cols-2 gap-1">
        {tabs.map((tab) => {
          const href = `/${locale}/brand/campaign-details/${id}/${tab.key}`;
          const isActive = pathname === href;

          return (
            <Link
              key={tab.key}
              href={href}
              className={cn(
                "flex h-11 items-center justify-center rounded-full text-sm font-medium transition-all",
                isActive
                  ? "bg-[#7A9B57] text-white"
                  : "bg-transparent text-black/70 hover:bg-Primary/10",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}