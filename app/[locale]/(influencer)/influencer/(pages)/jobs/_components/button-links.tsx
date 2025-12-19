"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ButtonLinks() {
  const t = useTranslations("influencer.jobs.jobLinks");
  const pathname = usePathname();
  const locale = pathname.split("/")[1]; // "en" বা "bn"

  const links = [
    { label: t("newOffers"), href: "/influencer/jobs" },
    { label: t("activeJobs"), href: "/influencer/jobs/active-jobs" },
    { label: t("completed"), href: "/influencer/jobs/completed" },
    { label: t("pending"), href: "/influencer/jobs/pending" },
    { label: t("declined"), href: "/influencer/jobs/declined" },
  ];

  const pathnameWithoutLocale = pathname.replace(/^\/(bn|en)(\/|$)/, "/");

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => {
        const isActive =
          link.href === "/influencer/jobs"
            ? pathnameWithoutLocale === "/influencer/jobs"
            : pathnameWithoutLocale === link.href ||
              pathnameWithoutLocale.startsWith(link.href + "/");

        return (
          <Button
            key={link.label}
            variant="link"
            className={cn(
              "rounded-full px-6 ",
              isActive &&
                "bg-light-green text-white shadow-md hover:no-underline"
            )}
          >
            <Link href={`/${locale}${link.href}`}>{link.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
