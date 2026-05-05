"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

import CampaignDetailsCard from "../_components/campaign-details-card";
import DeadlineCard from "../_components/deadline-card";
import ContentAssetCard from "../_components/content-asset-card";
import DeliveryLocation from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/delivery-location";
import CampaignBriefSection from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/campaign-brief-card";
import MilestoneClient from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/[id]/milestone-client";
import OfferedCard from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/offered.card";
import CampaignEarningsCard from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/campaign-earnings-card";
import { cn } from "@/lib/utils";

import { InfluencerJobService } from "@/service/influencer/job-service";
import { JobDetail } from "@/types/influencer/job_types";

const Page = () => {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      const res = await InfluencerJobService.getJobDetail(jobId);
      setJob(res.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <Card className="p-6 space-y-4 lg:w-1/2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
          <div className="flex flex-col gap-3 lg:w-1/2">
            <Card className="flex-1 p-6">
              <Skeleton className="h-16 w-full" />
            </Card>
            <Card className="flex-1 p-6">
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Job not found.
      </div>
    );
  }

  const isAccepted = job.status === "active" || job.status === "completed";
  const showDeliveryLocation = job.campaign.needSampleProduct === true;
  const showCampaignEarnings =
    job.status !== "new_offer" && job.status !== "declined";

  return (
    <div className="space-y-4">
      {/* campaign details, deadline and offered amount */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="flex lg:w-1/2">
          <CampaignDetailsCard job={job} onStatusChange={fetchJob} />
        </div>
        <div className="flex flex-col gap-3 lg:w-1/2 lg:self-stretch">
          <DeadlineCard
            startingDate={job.campaign.startingDate}
            duration={job.campaign.duration}
          />
          <OfferedCard amount={job.offeredAmount} />
        </div>
      </div>

      {/* assets, delivery location and earnings */}
      <div
        className={cn(
          "grid gap-4",
          showDeliveryLocation && showCampaignEarnings
            ? "lg:grid-cols-3"
            : showDeliveryLocation || showCampaignEarnings
              ? "lg:grid-cols-2"
              : "grid-cols-1"
        )}
      >
        <ContentAssetCard assets={job.campaign.assets} />
        {showDeliveryLocation && (
          <DeliveryLocation
            deliveryAddress={job.deliveryAddress}
            needSampleProduct={job.campaign.needSampleProduct}
          />
        )}
        {showCampaignEarnings && (
          <CampaignEarningsCard campaignId={job.campaignId} />
        )}
      </div>

      {/* campaign brief and terms & conditions */}
      <CampaignBriefSection campaign={job.campaign} milestones={job.milestones} />

      {/* milestone area */}
      <MilestoneClient
        jobId={jobId}
        isAccepted={isAccepted}
        onMilestoneChanged={fetchJob}
      />
    </div>
  );
};

export default Page;
