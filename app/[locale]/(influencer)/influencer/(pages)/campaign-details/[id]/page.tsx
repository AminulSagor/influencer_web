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

import { InfluencerJobService } from "@/service/influencer/job-service";
import { JobDetail } from "@/types/influencer/job_types";

const Page = () => {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);

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
        <div className="flex flex-col lg:flex-row gap-4">
          <Card className="lg:w-1/2 p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
          <div className="space-y-3 lg:w-1/2">
            <Card className="p-6">
              <Skeleton className="h-16 w-full" />
            </Card>
            <Card className="p-6">
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

  return (
    <div className="space-y-4">
      {/* campaign details, deadline and offered amount */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/2">
          <CampaignDetailsCard job={job} onStatusChange={fetchJob} selectedAddressId={selectedAddressId} />
        </div>
        <div className="space-y-3 lg:w-1/2">
          <DeadlineCard
            startingDate={job.campaign.startingDate}
            duration={job.campaign.duration}
          />
          <OfferedCard amount={job.offeredAmount} />
        </div>
      </div>

      {/* assets and delivery location */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-3/5">
          <ContentAssetCard assets={job.campaign.assets} />
        </div>
        <div className="lg:w-2/5">
          <DeliveryLocation
            deliveryAddress={job.deliveryAddress}
            needSampleProduct={job.campaign.needSampleProduct}
            onAddressSelect={setSelectedAddressId}
          />
        </div>
      </div>

      {/* campaign brief and terms & conditions */}
      <CampaignBriefSection campaign={job.campaign} milestones={job.milestones} />

      {/* milestone area */}
      <MilestoneClient jobId={jobId} isAccepted={isAccepted} />
    </div>
  );
};

export default Page;
