"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Button
            variant={"link"}
            key={link.label}
            className={cn(
              isActive &&
                "bg-light-green shadow-md text-white hover:no-underline  rounded-full px-6"
            )}
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
