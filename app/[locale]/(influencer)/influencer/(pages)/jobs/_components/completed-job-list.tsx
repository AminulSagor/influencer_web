"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { FaClock } from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useLocale } from "next-intl";

import StarRating from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/star-rating";
import { InfluencerJobService } from "@/service/influencer/job-service";
import { JobListItem } from "@/types/influencer/job_types";

interface CompletedJobListProps {
  search?: string;
  sort?: "high_budget" | "low_budget";
}

const formatBDT = (amount: number | string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `৳${num.toLocaleString("en-US")}`;
};

function formatDateLabel(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getCompletedDate(startingDate: string, duration: number) {
  const endDate = new Date(startingDate);
  endDate.setDate(endDate.getDate() + duration);
  return endDate.toISOString();
}

function CompletedCampaignCard({ job }: { job: JobListItem }) {
  const locale = useLocale();
  const offeredAmount = job.offeredAmount ?? 0;
  const completedOnLabel = formatDateLabel(
    getCompletedDate(job.startingDate, job.duration)
  );
  const stars = parseFloat(job.rating) || 0;

  return (
    <Card className="rounded-2xl border border-border/70 bg-white shadow-sm">
      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-Primary font-semibold leading-tight">
            {job.campaignName}
          </h3>
          <p className="text-dark-gray text-xs">{job.brandName}</p>
        </div>

        {/* Offered box */}
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 space-y-2">
          <p className="text-Primary text-base font-medium">Offered</p>
          <p className="text-light-green text-4xl font-semibold leading-none">
            {formatBDT(offeredAmount)}
          </p>
        </div>

        {/* Completed On */}
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-orange text-sm">
            <FaClock className="text-orange" />
            Completed On
          </p>
          <p className="text-orange text-sm">{completedOnLabel}</p>
        </div>

        {/* Stars */}
        <div className="py-1">
          <StarRating rating={stars} />
        </div>

        {/* CTA */}
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={`/${locale}/influencer/campaign-details/${job.id}`}>
            View Campaign Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const LIMIT = 9;

const CompletedJobList = ({ search, sort }: CompletedJobListProps) => {
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
        status: "completed",
        search,
        sort,
        page,
        limit: LIMIT,
      });
      setJobs(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load completed jobs"
      );
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No completed jobs found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <CompletedCampaignCard key={job.id} job={job} />
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

export default CompletedJobList;
