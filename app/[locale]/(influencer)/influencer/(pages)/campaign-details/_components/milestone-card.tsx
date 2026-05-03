"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { FaClock } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import SubmissionForm from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/submission-form";
import SubmissionHistory from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/submission-history";
import MilestoneTargetCard from "@/app/[locale]/(influencer)/influencer/(pages)/campaign-details/_components/milestone-target-card";
import { MilestoneService } from "@/service/influencer/milestone-service";
import {
  MilestoneDetail,
  MilestoneStatus,
  MilestoneSubmission,
} from "@/types/influencer/milestone_types";

interface MileStoneCardProps {
  milestoneId: string;
}

const statusConfig: Record<MilestoneStatus, { border: string; text: string; badge: string }> = {
  todo: { border: "from-off-white to-white border-gray-300", text: "text-dark-gray", badge: "bg-dark-gray" },
  in_review: { border: "from-white to-orange/20 border-orange-400", text: "text-orange", badge: "bg-orange" },
  approved: { border: "from-Secondary to-white border-light-green", text: "text-light-green", badge: "bg-light-green" },
  paid: { border: "from-Secondary to-white border-light-green", text: "text-light-green", badge: "bg-light-green" },
  partial_paid: { border: "from-Secondary to-white border-light-green", text: "text-light-green", badge: "bg-light-green" },
  declined: { border: "from-white to bg-red-300 border-red-300", text: "text-red-400", badge: "bg-red-400" },
};

const statusLabel: Record<MilestoneStatus, string> = {
  todo: "To Do",
  in_review: "In Review",
  approved: "Approved",
  paid: "Paid",
  partial_paid: "Partial Paid",
  declined: "Declined",
};

const MileStoneCard = ({ milestoneId }: MileStoneCardProps) => {
  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [status, setStatus] = useState<MilestoneStatus>("todo");
  const [submissions, setSubmissions] = useState<MilestoneSubmission[]>([]);
  const [latestSubmission, setLatestSubmission] = useState<MilestoneSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await MilestoneService.getMilestoneDetail(milestoneId);
      const nextSubmissions = res.data.submissions ?? [];
      setMilestone(res.data.milestone);
      setStatus(res.data.status);
      setSubmissions(nextSubmissions);
      setLatestSubmission(
        res.data.latestSubmission ?? nextSubmissions[0] ?? nextSubmissions[nextSubmissions.length - 1] ?? null
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load milestone details"
      );
    } finally {
      setLoading(false);
    }
  }, [milestoneId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }

  if (!milestone) return null;

  const config = statusConfig[status] || statusConfig.todo;
  const paidAmount = parseFloat(
    submissions.reduce((sum, s) => sum + parseFloat(s.paidAmount || "0"), 0).toFixed(2)
  );
  const paymentProgress = milestone.amount > 0
    ? Math.min((paidAmount / milestone.amount) * 100, 100)
    : 0;

  const milestoneTarget = {
    reach: milestone.expectedReach,
    views: milestone.expectedViews,
    reactions: milestone.expectedLikes,
    comments: milestone.expectedComments,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <Image
                src={"/icons/milestone.svg"}
                height={24}
                width={24}
                alt="svg"
              />
            </div>
            <div>
              <p className="text-Primary">Milestone {milestone.order}</p>
              <h2 className="text-Primary text-xl font-semibold">
                {milestone.contentTitle}
              </h2>
            </div>
          </div>
          <div className="flex gap-6 items-center flex-1">
            <p className="text-sm font-semibold text-Primary">
              Partial Payment <br /> Progress
            </p>
            <div className=" flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">৳{paidAmount}</p>
                <p className="text-sm font-semibold text-Primary">৳{milestone.amount}</p>
              </div>

              <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-light-green rounded-full transition-all duration-300"
                  style={{ width: `${paymentProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="border border-light-green rounded-lg p-4 bg-linear-to-r bg-Secondary to-white items-center">
          <div className="flex flex-col gap-2 md:flex-row justify-between md:items-center">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Content Requirement
              </h2>
              <p className="text-Primary text-sm">{milestone.contentQuantity}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-Primary">
                Milestone Target
              </h2>
              <MilestoneTargetCard milestoneTarget={milestoneTarget} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Payout On Approval
              </h2>
              <p className="text-2xl font-bold text-light-green">
                ৳{milestone.amount}
              </p>
            </div>

            <div
              className={cn(
                "border p-2 w-50 bg-linear-to-r rounded-lg flex flex-col items-center justify-center gap-2",
                config.border
              )}
            >
              <p className={cn(config.text)}>Status</p>
              <Badge className={cn("px-10 py-1 text-lg", config.badge)}>
                {statusLabel[status] || status}
              </Badge>
              <div className={cn("flex items-center gap-1", config.text)}>
                <span>
                  <FaClock size={12} />
                </span>
                <span className="text-xs">
                  {new Date(milestone.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        {status === "todo" && (
          <SubmissionForm milestoneId={milestoneId} onSubmitted={fetchDetail} />
        )}

        {(status === "declined" || status === "in_review") && latestSubmission && (
          <SubmissionForm
            milestoneId={milestoneId}
            onSubmitted={fetchDetail}
            resubmitSubmissionId={latestSubmission.id}
            initialSubmission={latestSubmission}
          />
        )}

        {status === "declined" && !latestSubmission && (
          <SubmissionForm milestoneId={milestoneId} onSubmitted={fetchDetail} />
        )}

        {(status === "paid" || status === "approved" || status === "partial_paid") &&
          submissions.length > 0 && (
            <SubmissionHistory submissions={submissions} />
          )}
      </CardContent>
    </Card>
  );
};

export default MileStoneCard;
