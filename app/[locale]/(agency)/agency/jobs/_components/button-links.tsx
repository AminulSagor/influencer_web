"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { label: "New Offers", href: "/agency/jobs" },
  { label: "Quoted", href: "/agency/jobs/quoted" },
  { label: "Active Jobs", href: "/agency/jobs/active-jobs" },
  { label: "Completed", href: "/agency/jobs/completed" },
  { label: "Pending", href: "/agency/jobs/pending" },
  { label: "Declined", href: "/agency/jobs/declined" },
];

export default function ButtonLinks() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || "en";
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
            <Link href={`/${locale}${link.href}`}>{link.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
