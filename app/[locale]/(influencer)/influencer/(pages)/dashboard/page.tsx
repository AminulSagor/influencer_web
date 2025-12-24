"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";
import { useTranslations } from "next-intl";

import WorkInProgressCard from "./_components/work-in-progress-card";
import UpcomingDeadline from "./_components/upcoming-deadlines";
import NewJobOffers from "./_components/new-job-offers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EarningOverviewCard from "./_components/earning-overview-card";
import ActionRequiredCard from "./_components/action-required-card";

const Page = () => {
  const t = useTranslations("influencer.dashboard");

  const dashboardCards = [
    {
      title: t("cards.lifetimeEarning"),
      value: "৳ 3,000,000",
      icon: GoGoal,
    },
    {
      title: t("cards.pendingEarning"),
      value: "৳ 120,000",
      icon: IoIosHourglass,
    },
    {
      title: t("cards.activeJobs"),
      value: "14",
      icon: BiSolidBriefcaseAlt,
      link: "/",
    },
    {
      title: t("cards.newOffers"),
      value: "6",
      icon: FaHandHoldingHeart,
      link: "/",
    },
  ];

  return (
    <div className="pb-20">
      <div className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {dashboardCards.map(({ icon: Icon, link, title, value }, index) => (
            <div
              key={index}
              className="bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-5 space-y-8 shadow-md"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <p className="text-white">{title}</p>
                <Icon size={35} className="text-white" />
              </div>

              {/* Value + Link Row */}
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-2xl">{value}</p>
                {link && (
                  <Button variant="link" className="text-white p-0">
                    <Link href={link} className="flex items-center">
                      {t("cards.viewAll")} <ChevronRight />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          {/* Left section */}
          <div className="space-y-4 lg:col-span-4">
            <EarningOverviewCard />
            <WorkInProgressCard />
          </div>

          {/* Right section */}
          <div className="space-y-4 lg:col-span-2">
            <ActionRequiredCard />
            <UpcomingDeadline />
            <NewJobOffers />
          </div>
        </div>

        {/* Lifetime Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2d5016]">
                {t("summary.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-4 gap-2">
              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <p className="text-sm font-medium">{t("summary.topClient")}</p>
                <div>
                  <h2 className="text-3xl font-semibold text-[#7a9b57]">
                    TechGuru
                  </h2>
                  <p className="text-sm font-medium text-[#7a9b57]">
                    12 {t("summary.jobsCompleted")}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t("summary.lastJob")}: 12 Dec 2025
                </p>
              </div>

              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <div className="flex flex-col justify-center gap-1 h-full">
                  <h2 className="text-3xl font-semibold text-[#7a9b57]">40</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {t("summary.totalJobsCompleted")}
                    </p>
                    <div>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <div className="flex flex-col justify-center gap-1 h-full">
                  <h2 className="text-3xl font-semibold text-yellow-700">4</h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {t("summary.totalJobsDeclined")}
                    </p>
                    <div>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <div className="flex flex-col justify-center gap-1 h-full">
                  <h2 className="text-3xl font-semibold text-[#7a9b57]">
                    Tiktok
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {t("summary.mostUsedPlatform")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
