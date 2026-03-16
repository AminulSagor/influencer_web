"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { LifetimeSummaryData } from "@/types/client/dashboard/dashboard-types";
import Link from "next/link";

interface LifetimeSummaryProps {
  data: LifetimeSummaryData;
}

export default function LifetimeSummary({ data }: LifetimeSummaryProps) {
  const t = useTranslations("brand.dashboard");

  const topInfluencer = data?.topInfluencer;
  const topInfluencerName = topInfluencer?.name || "-";
  const topInfluencerJobsCompleted = topInfluencer?.totalJobsCompleted ?? "-";
  const topInfluencerLastJobDate = topInfluencer?.lastCompletedJobDate
    ? new Date(topInfluencer.lastCompletedJobDate).toLocaleDateString()
    : "-";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("summary.title")}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2 rounded-lg border bg-secondary px-4 py-2">
          <p className="text-sm font-medium">{t("summary.topClient")}</p>
          <div>
            <h2 className="text-3xl font-semibold text-[#7a9b57]">
              {topInfluencerName}
            </h2>
            <p className="text-sm font-medium text-[#7a9b57]">
              {topInfluencerJobsCompleted} {t("summary.jobsCompleted")}
            </p>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {t("summary.lastJob")}: {topInfluencerLastJobDate}
          </p>
        </div>

        <div className="space-y-2 rounded-lg border bg-secondary px-4 py-2">
          <div className="flex h-full flex-col justify-center gap-1">
            <h2 className="text-3xl font-semibold text-[#7a9b57]">
              {data.totalCompleted ?? 0}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {t("summary.totalJobsCompleted")}
              </p>
              <Link href={"/brand/campaigns?tab=completed"}>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border bg-secondary px-4 py-2">
          <div className="flex h-full flex-col justify-center gap-1">
            <h2 className="text-3xl font-semibold text-yellow-700">
              {data.totalDeclined ?? 0}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {t("summary.totalJobsDeclined")}
              </p>
              <Link href={"/brand/campaigns?tab=cancelled"}>
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
