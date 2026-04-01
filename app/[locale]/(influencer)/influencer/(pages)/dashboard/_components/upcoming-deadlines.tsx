"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { getUpcomingDeadlines } from "@/service/influencer/dashboard/upcoming_deadlines";
import { UpcomingDeadlineItem } from "@/types/influencer/dashboard/upcoming_deadlines";

const UpcomingDeadline = () => {
  const t = useTranslations("influencer.dashboard.upcomingDeadline");
  const locale = useLocale();
  const [deadlines, setDeadlines] = useState<UpcomingDeadlineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeadlines = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getUpcomingDeadlines();
      setDeadlines(res.data);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeadlines();
  }, [fetchDeadlines]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex">
                <div className="w-4 bg-accent rounded-l-lg" />
                <div className="bg-secondary w-full p-2 space-y-2 rounded-br-lg rounded-tr-lg">
                  <div className="flex justify-between items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchDeadlines}>
              Retry
            </Button>
          </div>
        ) : deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
        ) : (
          deadlines.map((item) => {
            const d = new Date(item.deadline);
            const month = d.toLocaleDateString("en-US", { month: "short" });
            const day = d.getDate().toString();
            return (
              <div key={item.campaignId} className="flex">
                <div className="w-4 bg-[#2d5016]"></div>
                <div className="bg-secondary w-full p-2 space-y-4 rounded-br-lg rounded-tr-lg">
                  <div className="flex justify-between items-center gap-4">
                    <p className="text-center font-semibold text-[#2d5016] text-sm">
                      {month} <br />
                      {day}
                    </p>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2d5016] text-sm">
                        {item.campaignName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.milestonesLeftText}
                      </p>
                    </div>
                    <Button variant="link" size="sm" className="p-0">
                      <Link href={`/${locale}/influencer/campaign-details/${item.jobId}`} className="flex items-center text-xs">
                        {t("view")} <ChevronRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadline;
