"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { label: "All", href: "/admin/campaigns" },
  { label: "Needs Quote", href: "/admin/campaigns/needs-quote" },
  { label: "Active", href: "/admin/campaigns/active" },
  { label: "Pending Invitation", href: "/admin/campaigns/pending" },
  { label: "Completed", href: "/admin/campaigns/completed" },
  { label: "Paid", href: "/admin/campaigns/paid" },
  { label: "Canceled", href: "/admin/campaigns/canceled" },
];

export default function CampaignLinks() {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/(en|bn)/, "");

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => {
        const isRootJobs = link.href === "/agency/jobs";

        const isActive = isRootJobs
          ? normalizedPath === "/agency/jobs"
          : normalizedPath === link.href ||
            normalizedPath.startsWith(link.href + "/");

        return (
          <Button
            key={link.label}
            variant="link"
            asChild
            className={cn(
              isActive &&
                "bg-light-green shadow-md text-white hover:no-underline rounded-full px-6"
            )}
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
