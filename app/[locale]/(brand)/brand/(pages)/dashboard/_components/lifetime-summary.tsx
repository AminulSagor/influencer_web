"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { LifetimeSummaryData } from "@/types/client/dashboard/dashboard-types";

interface LifetimeSummaryProps {
  data: LifetimeSummaryData;
}

export default function LifetimeSummary({ data }: LifetimeSummaryProps) {
  const t = useTranslations("brand.dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("summary.title")}</CardTitle>
      </CardHeader>

      <CardContent className="grid lg:grid-cols-3 gap-4">
        <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
          <p className="text-sm font-medium">{t("summary.topClient")}</p>
          <div>
            <h2 className="text-3xl font-semibold text-[#7a9b57]">
              {data.topInfluencer.name}
            </h2>
            <p className="text-sm font-medium text-[#7a9b57]">
              {data.topInfluencer.totalJobsCompleted}{" "}
              {t("summary.jobsCompleted")}
            </p>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {t("summary.lastJob")}:{" "}
            {new Date(
              data.topInfluencer.lastCompletedJobDate,
            ).toLocaleDateString()}
          </p>
        </div>

        <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
          <div className="flex flex-col justify-center gap-1 h-full">
            <h2 className="text-3xl font-semibold text-[#7a9b57]">
              {data.totalCompleted}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {t("summary.totalJobsCompleted")}
              </p>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
          <div className="flex flex-col justify-center gap-1 h-full">
            <h2 className="text-3xl font-semibold text-yellow-700">
              {data.totalDeclined}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {t("summary.totalJobsDeclined")}
              </p>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
