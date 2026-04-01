"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa";
import { InfluencerJobService } from "@/service/influencer/job-service";
import { JobListItem } from "@/types/influencer/job_types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale } from "next-intl";

interface NewOfferListProps {
  search?: string;
  sort?: "high_budget" | "low_budget";
}

const LIMIT = 9;

const NewOfferList = ({ search, sort }: NewOfferListProps) => {
  const t = useTranslations("influencer.jobs");
  const locale = useLocale();
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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
        status: "new_offer",
        search,
        sort,
        page,
        limit: LIMIT,
      });
      setJobs(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [search, sort, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleAccept = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      await InfluencerJobService.acceptJob(jobId);
      toast.success("Job accepted successfully!");
      fetchJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept job");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      await InfluencerJobService.declineJob(jobId);
      toast.success("Job declined.");
      fetchJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to decline job");
    } finally {
      setActionLoading(null);
    }
  };

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
                <Skeleton className="h-10 w-full" />
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
        No new job offers available.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="relative overflow-hidden">
            <Badge className="absolute top-0 right-0 rounded-bl-lg rounded-tr-none rounded-tl-none rounded-br-none bg-light-green text-white px-3 py-1 text-xs">
              New
            </Badge>

            <CardHeader>
              <CardTitle className="text-Primary">
                <Link href={`/${locale}/influencer/campaign-details/${job.id}`}>
                  {job.campaignName}
                </Link>
              </CardTitle>

              <CardDescription className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {job.brandName?.charAt(0) || "B"}
                  </AvatarFallback>
                </Avatar>
                <p className="text-yellow-600 text-sm font-medium">
                  {job.brandName}
                </p>
              </CardDescription>

              <CardContent className="p-0 space-y-4">
                {/* Budget */}
                <div className="border border-light-green rounded-lg bg-linear-to-r from-Secondary to-white px-4 py-7 space-y-2">
                  <p className="text-Primary text-xs font-semibold">Offered</p>
                  <p className="text-light-green text-2xl font-semibold">
                    ৳{Number(job.offeredAmount).toLocaleString()}
                  </p>
                </div>

                {/* Deadline / Duration */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="flex items-center gap-1 text-sm text-yellow-600">
                      <FaClock /> {t("Deadline")}
                    </p>
                    <p className="text-yellow-600 text-sm">
                      {formatDate(job.startingDate)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="flex items-center gap-1 text-sm text-yellow-600">
                      <BsFillCalendarDateFill /> {t("Duration")}
                    </p>
                    <p className="text-yellow-600 text-sm">
                      {job.duration} days
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-light-green text-white"
                    onClick={() => handleAccept(job.id)}
                    disabled={actionLoading === job.id}
                  >
                    {actionLoading === job.id ? "..." : t("Accept")}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDecline(job.id)}
                    disabled={actionLoading === job.id}
                  >
                    {t("Decline")}
                  </Button>
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

export default NewOfferList;
