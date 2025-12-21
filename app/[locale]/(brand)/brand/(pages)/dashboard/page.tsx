"use client";

import { Briefcase } from "lucide-react";
import { IoIosHourglass } from "react-icons/io";
import { useTranslations } from "next-intl";

import DashboardStatsCards from "./_components/dashboard-stats-cards";
import DashboardMainGrid from "./_components/dashboard-main-grid";
import LifetimeSummary from "./_components/lifetime-summary";

const Page = () => {
  const t = useTranslations("brand.dashboard");

  const dashboardCards = [
    {
      title: t("cards.Active Jobs"),
      value: "20",
      icon: Briefcase,
    },
    {
      title: t("cards.Pending"),
      value: "৳ 120",
      icon: IoIosHourglass,
    },
  ];

  return (
    <div className="pb-20">
      <DashboardStatsCards
        cards={dashboardCards}
        viewAllLabel={t("cards.viewAll")}
      />

      <DashboardMainGrid />

      <div className="pt-6 px-4">
        <LifetimeSummary
          title={t("summary.title")}
          topClientLabel={t("summary.topClient")}
          jobsCompletedLabel={t("summary.jobsCompleted")}
          lastJobLabel={t("summary.lastJob")}
          totalJobsCompletedLabel={t("summary.totalJobsCompleted")}
          totalJobsDeclinedLabel={t("summary.totalJobsDeclined")}
          mostUsedPlatformLabel={t("summary.mostUsedPlatform")}
        />
      </div>
    </div>
  );
};

export default Page;
