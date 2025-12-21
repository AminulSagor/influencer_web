"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function LifetimeSummary({
  title,
  topClientLabel,
  jobsCompletedLabel,
  lastJobLabel,
  totalJobsCompletedLabel,
  totalJobsDeclinedLabel,
  mostUsedPlatformLabel,
}: {
  title: string;
  topClientLabel: string;
  jobsCompletedLabel: string;
  lastJobLabel: string;
  totalJobsCompletedLabel: string;
  totalJobsDeclinedLabel: string;
  mostUsedPlatformLabel: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid lg:grid-cols-4 gap-2">
        <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
          <p className="text-sm font-medium">{topClientLabel}</p>
          <div>
            <h2 className="text-3xl font-semibold text-[#7a9b57]">TechGuru</h2>
            <p className="text-sm font-medium text-[#7a9b57]">
              12 {jobsCompletedLabel}
            </p>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {lastJobLabel}: 12 Dec 2025
          </p>
        </div>

        <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
          <div className="flex flex-col justify-center gap-1 h-full">
            <h2 className="text-3xl font-semibold text-[#7a9b57]">40</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{totalJobsCompletedLabel}</p>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
          <div className="flex flex-col justify-center gap-1 h-full">
            <h2 className="text-3xl font-semibold text-yellow-700">4</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{totalJobsDeclinedLabel}</p>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>

        <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
          <div className="flex flex-col justify-center gap-1 h-full">
            <h2 className="text-3xl font-semibold text-[#7a9b57]">Tiktok</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{mostUsedPlatformLabel}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
