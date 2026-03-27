"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { RiUser3Fill } from "react-icons/ri";
import { FaClock } from "react-icons/fa6";
import { Slider } from "@/components/ui/slider";
import { FaArrowRightLong } from "react-icons/fa6";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { getWorkInProgress } from "@/service/influencer/dashboard/work_in_progress";
import { WorkInProgressItem } from "@/types/influencer/dashboard/work_in_progress";
import { Skeleton } from "@/components/ui/skeleton";

const WorkInProgressCard = () => {
  const t = useTranslations("influencer.dashboard.workInProgress");
  const locale = useLocale();
  const [jobs, setJobs] = useState<WorkInProgressItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getWorkInProgress();
      setJobs(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <Card>
      <CardHeader className="border-b flex items-center justify-between">
        <CardTitle className="text-[#2D5016]">{t("title")}</CardTitle>
        <CardAction>
          <Button className="bg-[#7A9B57]/90 hover:bg-[#7a9b57]" size={"sm"}>
            {total} {t("active")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border p-4 rounded-lg shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-7 w-28 rounded-lg" />
                </div>
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchJobs}>
              Retry
            </Button>
          </div>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No jobs in progress</p>
        ) : (
          jobs.map((data) => {
            const startDate = new Date(data.startedAt);
            const endDate = new Date(startDate.getTime() + data.duration * 24 * 60 * 60 * 1000);
            const dueInDays = Math.ceil((endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
            const dueDate = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

            return (
              <div className="border p-4 rounded-lg shadow-sm" key={data.jobId}>
                <div className="flex justify-between items-center space-y-1">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-[#2d5016]">{data.campaignName}</h3>
                  </div>
                  <div>
                    <div className="bg-yellow-600/30 border-yellow-700 border px-4 py-1 rounded-lg flex justify-center items-center">
                      <span className="text-yellow-700 text-sm font-medium">
                        {t("due")} {dueInDays} Days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-1">
                  <span>
                    <RiUser3Fill size={12} className="fill-yellow-600" />
                  </span>
                  <span className="text-xs text-yellow-600">{data.brandName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span>
                      <FaClock size={12} className="fill-yellow-600" />
                    </span>
                    <span className="text-xs text-yellow-600">{dueDate}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Slider defaultValue={[data.progress]} max={100} step={1} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-yellow-600 text-sm">
                    {data.progress}% {t("complete")}
                  </p>
                  <Button variant="link" size={"sm"}>
                    <Link href={`/${locale}/influencer/campaign-details/${data.jobId}`} className="flex items-center text-xs">
                      {t("view")} <ChevronRight />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button className="w-full md:w-[50%] bg-[#F5F5DC]/60 text-[#2D5016] border-[#2D5016] border hover:bg-[#F5F5DC] hover:text-[#2D5016] hover:border-[#2D5016] cursor-pointer" asChild>
          <Link href={`/${locale}/influencer/jobs/active-jobs`}>
            {t("viewAllJobs")}
            <span>
              <FaArrowRightLong />
            </span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkInProgressCard;
