"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { FaClock } from "react-icons/fa6";
import SubmissionForm from "./submission-form";
import {
  COMPLETED,
  COMPLETED_PLUS_PLUS,
  IN_REVIEW,
  PAID,
  PaymanetMilestoneDataType,
  PARTIAL_PAID,
  TODO,
} from "../[id]/consts";
import { cn } from "@/lib/utils";
import SubmissionHistory from "./submission-history";
import { milestoneSubmissionService } from "@/service/agency/campaign/milestone-submission.service";
import type {
  AgencyMilestoneDetails,
  AgencyMilestoneSubmissionItem,
} from "@/types/agency/campaign/milestone-submission.types";

interface MileStoneCardProps {
  milestone: PaymanetMilestoneDataType | null;
  canSubmit?: boolean;
  onMilestoneDetailsLoaded?: (details: AgencyMilestoneDetails) => void;
}

const EDITABLE_SUBMISSION_STATUSES = [
  "in_review",
  "in-review",
  "declined",
  "decline",
  "rejected",
];

function isEditableSubmissionStatus(status?: string | null) {
  return EDITABLE_SUBMISSION_STATUSES.includes(
    String(status ?? "").trim().toLowerCase()
  );
}

function isCompletedMilestoneStatus(status?: string | null) {
  return status === COMPLETED || status === COMPLETED_PLUS_PLUS;
}

function isPendingMilestoneStatus(status?: string | null) {
  const normalized = String(status ?? "").trim().toLowerCase();
  return ["todo", "to do", "pending"].includes(normalized);
}

function formatMilestoneUpdatedDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const MileStoneCard = ({
  milestone,
  canSubmit = true,
  onMilestoneDetailsLoaded,
}: MileStoneCardProps) => {
  const router = useRouter();
  const [showNewSubmissionForm, setShowNewSubmissionForm] = useState(false);
  const [localSubmissions, setLocalSubmissions] = useState<
    AgencyMilestoneSubmissionItem[]
  >([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

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

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!resolvedMilestoneId) return;

      try {
        setIsLoadingSubmissions(true);

        const response = await milestoneSubmissionService.getMilestoneDetails(
          resolvedMilestoneId
        );

        if (response.data) {
          onMilestoneDetailsLoaded?.(response.data);
        }

        const milestoneSubmissions = (response.data?.submissions ?? []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setLocalSubmissions(milestoneSubmissions);
      } catch (error) {
        console.error("Failed to load milestone details submissions:", error);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    void fetchSubmissions();
  }, [resolvedMilestoneId, onMilestoneDetailsLoaded, milestone?.status]);

  const displaySubmissions = useMemo(() => localSubmissions, [localSubmissions]);

  const requestedAmountTotal = useMemo(
    () =>
      displaySubmissions.reduce((sum, submission) => {
        const amount = Number(submission.requestedAmount ?? 0);
        return sum + (Number.isFinite(amount) ? amount : 0);
      }, 0),
    [displaySubmissions]
  );

  const remainingRequestAmount = Math.max(payout - requestedAmountTotal, 0);
  const hasRequestableAmount = remainingRequestAmount > 0.009;
  const hasSubmissions = displaySubmissions.length > 0;
  const normalizedMilestoneStatus = String(milestone?.status ?? "").toLowerCase();
  const isDeclinedMilestone = ["declined", "decline", "rejected"].includes(
    normalizedMilestoneStatus
  );
  const isCompletedMilestone = isCompletedMilestoneStatus(milestone?.status);
  const milestoneBadgeLabel = isDeclinedMilestone
    ? "Declined"
    : isCompletedMilestone
      ? milestone?.status
      : hasSubmissions
        ? IN_REVIEW
        : milestone?.status;
  const detailStatusLabel =
    milestone?.status === COMPLETED_PLUS_PLUS ? "Completed++" : milestoneBadgeLabel;
  const statusDateLabel = isPendingMilestoneStatus(milestone?.status)
    ? `Day ${milestone?.day ?? "—"}`
    : formatMilestoneUpdatedDate(milestone?.updatedAt);
  const canShowHistory = hasSubmissions;
  const canSubmitForMilestone =
    canSubmit &&
    milestone?.status !== PAID &&
    milestone?.status !== PARTIAL_PAID &&
    !isCompletedMilestone;
  const editableSubmissions = displaySubmissions.filter((submission) =>
    isEditableSubmissionStatus(submission.status)
  );
  const readOnlySubmissions = displaySubmissions.filter(
    (submission) => !isEditableSubmissionStatus(submission.status)
  );
  const shouldShowEditableSubmissionForm =
    canSubmitForMilestone && Boolean(resolvedMilestoneId) && editableSubmissions.length > 0;
  const canAddAnotherSubmission =
    canSubmitForMilestone &&
    Boolean(resolvedMilestoneId) &&
    hasRequestableAmount &&
    !shouldShowEditableSubmissionForm;

  const handleSubmitted = async (submission: AgencyMilestoneSubmissionItem) => {
    setLocalSubmissions((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === submission.id);

      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = submission;
        return next;
      }

      return [submission, ...prev];
    });
    setShowNewSubmissionForm(false);

    try {
      const response = await milestoneSubmissionService.getMilestoneDetails(
        resolvedMilestoneId
      );

      if (response.data) {
        onMilestoneDetailsLoaded?.(response.data);
      }

      const milestoneSubmissions = (response.data?.submissions ?? []).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (milestoneSubmissions.length > 0) {
        setLocalSubmissions(milestoneSubmissions);
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to refresh submissions after submit:", error);
      router.refresh();
    }
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
              <p className="text-sm text-Primary">
                {milestone?.targetTitle ? `${milestone.targetTitle} Target` : "Target"}
              </p>
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
                  milestone?.status === PARTIAL_PAID ||
                  milestone?.status === COMPLETED ||
                  milestone?.status === COMPLETED_PLUS_PLUS) &&
                "from-Secondary to-white border-light-green",
                isDeclinedMilestone && "from-[#FFF8F8] to-[#FFF8F8] border-[#FF5A5A]"
              )}
            >
              <p
                className={cn(
                  milestone?.status === TODO && "text-dark-gray",
                  milestone?.status === IN_REVIEW && "text-orange",
                  (milestone?.status === PAID ||
                    milestone?.status === PARTIAL_PAID ||
                    milestone?.status === COMPLETED ||
                    milestone?.status === COMPLETED_PLUS_PLUS) &&
                  "text-light-green",
                  isDeclinedMilestone && "text-[#FF1616]"
                )}
              >
                Status
              </p>

              <Badge
                className={cn(
                  "py-1 text-lg",
                  milestone?.status === COMPLETED_PLUS_PLUS
                    ? "mx-3 max-w-[calc(100%-24px)] px-6"
                    : "px-10",
                  milestone?.status === TODO && "bg-dark-gray",
                  milestone?.status === IN_REVIEW && "bg-orange",
                  milestone?.status === PAID && "bg-light-green",
                  milestone?.status === PARTIAL_PAID && "bg-light-green",
                  milestone?.status === COMPLETED && "bg-light-green",
                  milestone?.status === COMPLETED_PLUS_PLUS && "bg-light-green",
                  isDeclinedMilestone && "bg-[#FF1616] text-white"
                )}
              >
                {detailStatusLabel}
              </Badge>

              <div
                className={cn(
                  "flex items-center gap-1",
                  milestone?.status === TODO && "text-gray-400",
                  milestone?.status === IN_REVIEW && "text-orange",
                  (milestone?.status === PAID ||
                    milestone?.status === PARTIAL_PAID ||
                    milestone?.status === COMPLETED ||
                    milestone?.status === COMPLETED_PLUS_PLUS) &&
                  "text-light-green",
                  isDeclinedMilestone && "text-[#FF1616]"
                )}
              >
                <span>
                  <FaClock size={12} />
                </span>
                <span className="text-xs">{statusDateLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {canSubmitForMilestone &&
          !hasSubmissions &&
          resolvedMilestoneId &&
          hasRequestableAmount &&
          !showNewSubmissionForm && (
            <SubmissionForm
              milestoneId={resolvedMilestoneId}
              initialSubmissionCount={displaySubmissions.length}
              maxRequestAmount={remainingRequestAmount}
              onSubmitted={handleSubmitted}
            />
          )}

        {shouldShowEditableSubmissionForm && (
          <SubmissionForm
            milestoneId={resolvedMilestoneId}
            initialSubmissions={editableSubmissions}
            maxRequestAmount={remainingRequestAmount}
            onSubmitted={handleSubmitted}
            canAddNewSubmission={hasRequestableAmount}
          />
        )}

        {canShowHistory && (!shouldShowEditableSubmissionForm || readOnlySubmissions.length > 0) && (
          <SubmissionHistory
            submissions={shouldShowEditableSubmissionForm ? readOnlySubmissions : displaySubmissions}
            targetTitle={milestone?.targetTitle}
            milestoneStatus={milestone?.status}
          />
        )}

        {canSubmitForMilestone &&
          hasSubmissions &&
          !hasRequestableAmount &&
          !shouldShowEditableSubmissionForm && (
            <p className="mt-4 rounded-lg border border-light-green/40 bg-light-green/5 p-3 text-center text-sm font-medium text-Primary">
              Full payout amount has already been requested.
            </p>
          )}

        {hasSubmissions && canAddAnotherSubmission && !showNewSubmissionForm && (
          <Button
            type="button"
            onClick={() => setShowNewSubmissionForm(true)}
            variant="outline"
            className="mt-4 h-auto w-full rounded-lg border border-dashed border-light-green py-6 text-base font-semibold text-light-green hover:bg-light-green hover:text-white"
            disabled={isLoadingSubmissions}
          >
            + Add Another Submission
          </Button>
        )}

        {canAddAnotherSubmission && showNewSubmissionForm && (
          <div className="mt-4">
            <SubmissionForm
              milestoneId={resolvedMilestoneId}
              initialSubmissionCount={displaySubmissions.length}
              maxRequestAmount={remainingRequestAmount}
              onSubmitted={handleSubmitted}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MileStoneCard;
