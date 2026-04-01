"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";
import { useTranslations, useLocale } from "next-intl";

import WorkInProgressCard from "./_components/work-in-progress-card";
import UpcomingDeadline from "./_components/upcoming-deadlines";
import NewJobOffers from "./_components/new-job-offers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EarningOverviewCard from "./_components/earning-overview-card";
import ActionRequiredCard from "./_components/action-required-card";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth_store";
import { useRouter } from "next/navigation";
import { getDashboardSummary } from "@/service/influencer/dashboard/summary";
import { DashboardSummary } from "@/types/influencer/dashboard/summary";
import { getLifetimeSummary } from "@/service/influencer/dashboard/lifetime_summary";
import { LifetimeSummary } from "@/types/influencer/dashboard/lifetime_summary";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("influencer.dashboard");
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [lifetimeData, setLifetimeData] = useState<LifetimeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [summary, lifetime] = await Promise.all([
        getDashboardSummary(),
        getLifetimeSummary(),
      ]);
      setDashboardData(summary);
      setLifetimeData(lifetime);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    fetchDashboardData();
  }, [token, router, locale, fetchDashboardData]);

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="pb-20">
        <div className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-5 space-y-8 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/2 bg-white/20" />
                  <Skeleton className="h-9 w-9 rounded-md bg-white/20" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-1/3 bg-white/20" />
                  <Skeleton className="h-4 w-16 bg-white/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
            <div className="space-y-4 lg:col-span-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-red-500">{error}</p>
        <button type="button" onClick={fetchDashboardData} className="h-8 rounded-md px-4 text-sm font-semibold bg-[#6E8E59] text-white hover:brightness-95">Retry</button>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: t("cards.lifetimeEarning"),
      value: `৳ ${(dashboardData?.lifetimeEarnings ?? 0).toLocaleString()}`,
      icon: GoGoal,
    },
    {
      title: t("cards.pendingEarning"),
      value: `৳ ${(dashboardData?.pendingEarnings ?? 0).toLocaleString()}`,
      icon: IoIosHourglass,
    },
    {
      title: t("cards.activeJobs"),
      value: (dashboardData?.activeJobs ?? 0).toString(),
      icon: BiSolidBriefcaseAlt,
      link: `/${locale}/influencer/jobs/active-jobs`,
    },
    {
      title: t("cards.newOffers"),
      value: (dashboardData?.newOffers ?? 0).toString(),
      icon: FaHandHoldingHeart,
      link: `/${locale}/influencer/jobs`,
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
                    {lifetimeData?.topClient?.name ?? "—"}
                  </h2>
                  <p className="text-sm font-medium text-[#7a9b57]">
                    {lifetimeData?.topClient?.jobsCompleted ?? 0} {t("summary.jobsCompleted")}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t("summary.lastJob")}: {lifetimeData?.topClient?.lastCompletedJob
                    ? new Date(lifetimeData.topClient.lastCompletedJob.completedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </p>
              </div>

              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <div className="flex flex-col justify-center gap-1 h-full">
                  <h2 className="text-3xl font-semibold text-[#7a9b57]">{lifetimeData?.totalJobsCompleted ?? 0}</h2>
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
                  <h2 className="text-3xl font-semibold text-yellow-700">{lifetimeData?.totalJobsDeclined ?? 0}</h2>
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
                    {lifetimeData?.mostUsedPlatform ?? "—"}
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