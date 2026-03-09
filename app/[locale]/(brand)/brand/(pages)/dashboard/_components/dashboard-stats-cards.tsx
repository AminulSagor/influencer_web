"use client";

import { useTranslations } from "next-intl";
import { Briefcase, ChevronRight } from "lucide-react";
import { IoIosHourglass } from "react-icons/io";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatsCard } from "@/types/client/dashboard/dashboard-types";

type Props = {
  activeJobsTotal: number;
  pendingCampaings: number | null;
  pendingCampaignsError?: string | null;
};

export default function DashboardStatsCards({
  activeJobsTotal,
  pendingCampaings,
  pendingCampaignsError,
}: Props) {
  const t = useTranslations("brand.dashboard");

  const dashboardCards: StatsCard[] = [
    {
      title: t("cards.Active Jobs"),
      value: String(activeJobsTotal),
      icon: Briefcase,
      link: "/brand/campaigns",
    },
    {
      title: t("cards.Pending"),
      value: pendingCampaignsError
        ? "Error"
        : pendingCampaings !== null
          ? String(pendingCampaings)
          : "-",
      icon: IoIosHourglass,
    },
  ];

  const viewAllLabel = t("cards.viewAll");

  return (
    <div className="pt-4 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dashboardCards.map(({ icon: Icon, title, value, link }, index) => (
          <div
            key={index}
            className="bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-5 space-y-8 shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-white">{title}</p>
              <Icon size={30} className="text-white" />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-2xl">{value}</p>

              {link && (
                <Button
                  asChild
                  variant="link"
                  className="text-white p-0"
                  type="button"
                >
                  <Link href={link}>
                    {viewAllLabel} <ChevronRight />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
