"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ButtonLinks() {
  const t = useTranslations("brand.campaigns.campaignsLinks");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const links = [
    { label: t("Active"), href: "/brand/campaigns" },
    {
      label: t("Budgeting & Quoting"),
      href: "/brand/campaigns/budgeting-quoting",
    },
    { label: t("completed"), href: "/brand/campaigns/completed" },
    { label: t("Draft"), href: "/brand/campaigns/draft" },
    { label: t("Cancelled"), href: "/brand/campaigns/cancelled" },
  ];

  const pathnameWithoutLocale = pathname.replace(/^\/(bn|en)(\/|$)/, "/");

  return (
    <div className="flex gap-2 lg:flex-wrap">
      {links.map((link) => {
        const isActive =
          link.href === "/brand/campaigns"
            ? pathnameWithoutLocale === "/brand/campaigns"
            : pathnameWithoutLocale === link.href ||
              pathnameWithoutLocale.startsWith(link.href + "/");

        return (
          <Button
            key={link.label}
            variant="link"
            className={cn(
              "rounded-full",
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
