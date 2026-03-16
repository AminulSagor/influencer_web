"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

import MileStoneCard from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/milestone-card";
import PaymentMilestone from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/payment-milestone-card";
import { MilestoneService } from "@/service/influencer/milestone-service";
import { MilestoneListItem } from "@/types/influencer/milestone_types";

interface Props {
  jobId: string;
  isAccepted: boolean;
}

const MilestoneClient = ({ jobId, isAccepted }: Props) => {
  const [milestones, setMilestones] = useState<MilestoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] =
    useState<MilestoneListItem | null>(null);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      const res = await MilestoneService.getJobMilestones(jobId);
      setMilestones(res.data.milestones);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load milestones"
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) fetchMilestones();
  }, [fetchMilestones, jobId]);

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-64" />
          ))}
        </div>
      </Card>
    );
  }

  const paidCount = milestones.filter(
    (m) => m.status === "paid" || m.status === "partial_paid"
  ).length;

  return (
    <>
      <div>
        <PaymentMilestone
          milestones={milestones}
          paid={paidCount}
          total={milestones.length}
          selectedMilestone={selectedMilestone}
          onSelectMilestone={setSelectedMilestone}
        />
      </div>
      {isAccepted && selectedMilestone && (
        <div>
          <MileStoneCard milestoneId={selectedMilestone.id} />
        </div>
      )}
    </>
  );
};

export default MilestoneClient;
