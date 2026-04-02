"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { FaClock } from "react-icons/fa6";
import SubmissionForm from "./submission-form";
import {
  IN_REVIEW,
  PAID,
  PaymanetMilestoneDataType,
  TODO,
  PARTIAL_PAID,
} from "../[id]/consts";
import { cn } from "@/lib/utils";
import SubmissionHistory from "./submission-history";
import type { AgencyMilestoneSubmissionItem } from "@/types/agency/campaign/milestone-submission.types";

interface MileStoneCardProps {
  milestone: PaymanetMilestoneDataType | null;
}

const MileStoneCard = ({ milestone }: MileStoneCardProps) => {
  const [showNewSubmissionForm, setShowNewSubmissionForm] = useState(false);
  const [localSubmissions, setLocalSubmissions] = useState<
    AgencyMilestoneSubmissionItem[]
  >([]);

  const hasInitializedFromServer = useRef(false);

  const payout = milestone?.payout ?? 0;
  const isPartial = milestone?.status === PARTIAL_PAID;
  const partialPaidAmount = isPartial ? payout / 2 : 0;
  const progress = payout > 0 ? (partialPaidAmount / payout) * 100 : 0;

  const resolvedMilestoneId =
    (
      milestone as
      | (PaymanetMilestoneDataType & {
        milestoneId?: string;
        submissions?: AgencyMilestoneSubmissionItem[];
      })
      | null
    )?.milestoneId ?? "";

  const submissionsFromMilestone =
    (
      milestone as
      | (PaymanetMilestoneDataType & {
        submissions?: AgencyMilestoneSubmissionItem[];
      })
      | null
    )?.submissions ?? [];

  useEffect(() => {
    if (!hasInitializedFromServer.current) {
      setLocalSubmissions(submissionsFromMilestone);
      hasInitializedFromServer.current = true;
      return;
    }

    if (
      submissionsFromMilestone.length > 0 &&
      submissionsFromMilestone.length >= localSubmissions.length
    ) {
      setLocalSubmissions(submissionsFromMilestone);
    }
  }, [submissionsFromMilestone, localSubmissions.length]);

  const displaySubmissions = useMemo(() => localSubmissions, [localSubmissions]);

  const canShowHistory =
    milestone?.status === PAID ||
    milestone?.status === IN_REVIEW ||
    milestone?.status === PARTIAL_PAID ||
    displaySubmissions.length > 0;

  const canAddAnotherSubmission =
    canShowHistory && Boolean(resolvedMilestoneId);

  const handleSubmitted = (submission: AgencyMilestoneSubmissionItem) => {
    setLocalSubmissions((prev) => [submission, ...prev]);
    setShowNewSubmissionForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div>
              <Image
                src="/icons/milestone.svg"
                height={24}
                width={24}
                alt="svg"
              />
            </div>
            <div>
              <p className="text-Primary">Milestone {milestone?.id}</p>
              <h2 className="text-xl font-semibold text-Primary">
                {milestone?.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-6">
            <p className="text-sm font-semibold text-Primary">
              Partial Payment <br /> Progress
            </p>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">৳{partialPaidAmount}</p>
                <p className="text-sm font-semibold text-Primary">৳{payout}</p>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-light-green/30">
                <div
                  className="h-full rounded-full bg-light-green transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="rounded-lg border border-light-green bg-linear-to-r bg-Secondary p-4 to-white">
          <div className="flex justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Content Requirement
              </h2>
              <ul className="ml-5 list-disc text-sm text-Primary">
                {milestone?.contentRequirement.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="space-y-1">
                <h2 className="text-xl font-medium text-Primary">
                  Promotion Goal
                </h2>
                <p className="text-sm text-Primary">
                  {milestone?.promotionalGoal}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Promotion Target
              </h2>
              <p className="text-sm text-Primary">Reach / View Target</p>
              <p className="text-2xl font-bold text-Primary">
                {milestone?.promotionTarget}
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Payout On Approval
              </h2>
              <p className="text-2xl font-bold text-light-green">
                ৳{milestone?.payout}
              </p>
            </div>

            <div
              className={cn(
                "flex w-[200px] flex-col items-center justify-center gap-2 rounded-lg border bg-linear-to-r p-2",
                milestone?.status === TODO &&
                "from-off-white to-white border-gray-300",
                milestone?.status === IN_REVIEW &&
                "from-white to-orange/20 border-orange-400",
                (milestone?.status === PAID ||
                  milestone?.status === PARTIAL_PAID) &&
                "from-Secondary to-white border-light-green"
              )}
            >
              <p
                className={cn(
                  milestone?.status === TODO && "text-dark-gray",
                  milestone?.status === IN_REVIEW && "text-orange",
                  (milestone?.status === PAID ||
                    milestone?.status === PARTIAL_PAID) &&
                  "text-light-green"
                )}
              >
                Status
              </p>

              <Badge
                className={cn(
                  "px-10 py-1 text-lg",
                  milestone?.status === TODO && "bg-dark-gray",
                  milestone?.status === IN_REVIEW && "bg-orange",
                  milestone?.status === PAID && "bg-light-green",
                  milestone?.status === PARTIAL_PAID && "bg-light-green"
                )}
              >
                {displaySubmissions.length > 0 ? IN_REVIEW : milestone?.status}
              </Badge>

              <div
                className={cn(
                  "flex items-center gap-1",
                  milestone?.status === TODO && "text-gray-400",
                  milestone?.status === IN_REVIEW && "text-orange",
                  (milestone?.status === PAID ||
                    milestone?.status === PARTIAL_PAID) &&
                  "text-light-green"
                )}
              >
                <span>
                  <FaClock size={12} />
                </span>
                <span className="text-xs">Day {milestone?.day}</span>
              </div>
            </div>
          </div>
        </div>

        {!canShowHistory && resolvedMilestoneId && (
          <SubmissionForm
            milestoneId={resolvedMilestoneId}
            onSubmitted={handleSubmitted}
          />
        )}

        {canShowHistory && <SubmissionHistory submissions={displaySubmissions} />}

        {canAddAnotherSubmission && !showNewSubmissionForm && (
          <Button
            type="button"
            onClick={() => setShowNewSubmissionForm(true)}
            variant="outline"
            className="mt-4 h-auto w-full rounded-lg border border-dashed border-light-green py-6 text-base font-semibold text-light-green hover:bg-light-green hover:text-white"
          >
            + Add Another Submission
          </Button>
        )}

        {canAddAnotherSubmission && showNewSubmissionForm && (
          <div className="mt-4">
            <SubmissionForm
              milestoneId={resolvedMilestoneId}
              onSubmitted={handleSubmitted}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MileStoneCard;