"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { InfluencerJobService } from "@/service/influencer/job-service";
import { JobListItem } from "@/types/influencer/job_types";

const NewJobOffers = () => {
  const t = useTranslations("influencer.dashboard.newJobOffers");
  const locale = useLocale();
  const [offers, setOffers] = useState<JobListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await InfluencerJobService.getJobs({ status: "new_offer", limit: 3 });
      setOffers(res.data);
    } catch (err) {
      setError("Failed to load new job offers.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-[#2d5016]">{t("title")}</CardTitle>
        <div>
          <Button variant="link" size="sm" className="p-0 text-[#2d5016]">
            <Link href={`/${locale}/influencer/jobs`} className="flex items-center text-xs">
              {t("viewAll")}
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg bg-secondary px-4 py-2 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchOffers}>
              Retry
            </Button>
          </div>
        ) : offers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No new offers</p>
        ) : (
          offers.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg bg-secondary px-4 py-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-[#2d5016]">
                  {item.campaignName}
                </h3>

                <Button variant="link" size="sm" className="p-0 text-[#2d5016]">
                  <Link href={`/${locale}/influencer/campaign-details/${item.id}`} className="flex items-center text-xs">
                    {t("view")} <ChevronRight />
                  </Link>
                </Button>
              </div>

              <p className="text-sm font-medium text-[#2d5016]">
                {t("budget")}: ৳{Number(item.offeredAmount).toLocaleString()}
              </p>

              <p className="text-xs text-muted-foreground">{item.brandName}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NewJobOffers;
