"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { FaClock } from "react-icons/fa";
import { InfluencerJobService } from "@/service/influencer/job-service";
import { JobListItem } from "@/types/influencer/job_types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface DeclinedJobListProps {
  search?: string;
  sort?: "high_budget" | "low_budget";
}

const LIMIT = 9;

const DeclinedJobList = ({ search, sort }: DeclinedJobListProps) => {
  const t = useTranslations("influencer.jobs");
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reset page when search or sort changes
  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await InfluencerJobService.getJobs({
        status: "declined",
        search,
        sort,
        page,
        limit: LIMIT,
      });
      setJobs(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load declined jobs");
    } finally {
      setLoading(false);
    }
  }, [search, sort, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const handler = () => {
      void fetchJobs();
    };

    window.addEventListener("app-data-refresh", handler);

    return () => {
      window.removeEventListener("app-data-refresh", handler);
    };
  }, [fetchJobs]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
              <div className="space-y-4 mt-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No declined jobs found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-dark-gray">{job.campaignName}</CardTitle>
              <CardDescription className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {job.brandName?.charAt(0) || "B"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-dark-gray text-sm font-medium">
                  {job.brandName}
                </p>
              </CardDescription>

              <CardContent className="p-0 space-y-4">
                {/* Budget */}
                <div className="border border-border bg-secondary rounded-lg px-4 py-5 space-y-2">
                  <p className="text-dark-gray text-xs font-semibold">Offered</p>
                  <p className="text-dark-gray text-2xl font-semibold">
                    ৳{Number(job.offeredAmount).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="flex items-center gap-1 text-sm text-dark-gray">
                      <FaClock /> {t("Deadline")}
                    </p>
                    <p className="text-dark-gray text-sm">
                      {formatDate(job.startingDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default DeclinedJobList;
