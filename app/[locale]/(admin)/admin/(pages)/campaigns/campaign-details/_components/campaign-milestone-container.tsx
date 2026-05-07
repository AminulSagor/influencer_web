"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChartColumnIncreasing,
  ChevronDown,
  Eye,
  Heart,
  MessageCircle,
  Play,
  MailCheck,
} from "lucide-react";
import { CgWebsite } from "react-icons/cg";
import { FaClock } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { HiMiniIdentification } from "react-icons/hi2";

import CampaignMilestone from "./campaign-milestone";
import CollapsibleCard, { type BadgeType } from "./collapsible-card";
import IconText from "./icon-text";
import MilestonePerformanceStats from "./milestone-performance-stat";
import InviteInfluencerBar from "./invite-influencer-bar";
import InviteAgencyBar from "./invite-agency-bar";
import InReviewActions from "./in-review-actions";
import MilestoneApproveModal from "./modals/milestone-approve-modal";
import MilestoneDeclineModal from "./modals/milestone-decline-modal";
import MilestonePartialPaidModal from "./modals/milestone-partial-paid-modal";
import MilestoneChangeStatusModal, { type MilestoneStatusValue } from "./modals/milestone-change-status-modal";
import MilestoneSubmittedReportModal from "./modals/milestone-submitted-report-modal";

import { updateMilestoneStatus } from "@/service/admin/campaign/update-milestone-status";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  CampaignStatusType,
  InfluencerUI,
  CampaignMilestoneservice,
} from "@/types/admin/campaign/campaign_details_type";

import { safeStr } from "@/utils/admin/campaign/number_util";
import {
  getMilestoneStatusUi,
  getSubmissionAccordionBadge,
  normalizeCampaignMilestoneStatus,
} from "@/utils/admin/campaign/campaign-milestone/milestone_status_util";
import {
  toAmount,
  toNullableNumber,
  moneyLabel,
  compactNum,
  roundMoney,
} from "@/utils/admin/campaign/campaign-milestone/number_helpers";
import {
  formatDateLabel,
  normalizeSubmissionStatus,
  normalizePaymentStatus,
  getSubmissionMetric,
  computeAveragePerformance,
  type SubmissionItem,
} from "@/utils/admin/campaign/campaign-milestone/submission_helpers";

import { useCampaignAssignments } from "@/hooks/campaign-milestone/use-campaign-assignments";
import { useInfluencerSelection } from "@/hooks/campaign-milestone/use-influencer-selection";
import { useMilestoneSubmissions } from "@/hooks/campaign-milestone/use-milestone-submissions";
import { useMilestoneProgress } from "@/hooks/campaign-milestone/use-milestone-progress";
import { useMilestoneActions } from "@/hooks/campaign-milestone/use-milestone-actions";

const CircularProgressChart = dynamic(() => import("./circular-progress"), {
  ssr: false,
});

interface Props {
  campaignId: string;
  campaignStatus: CampaignStatusType;
  isPaidAd: boolean;
  influencers: InfluencerUI[];
  dropdownInfluencers?: any[];
  milestones: CampaignMilestoneservice[];
  availableForInfluencers: number;
  availableForAgency?: number;
  assignedInfluencerOfferTotal?: number;
}

export default function CampaignMilestoneContainer({
  campaignId,
  campaignStatus,
  isPaidAd,
  influencers,
  dropdownInfluencers,
  milestones,
  availableForInfluencers,
  availableForAgency = 0,
  assignedInfluencerOfferTotal = 0,
}: Props) {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(
    null
  );

  const [changeStatusOpen, setChangeStatusOpen] = useState(false);
  const [viewReportOpen, setViewReportOpen] = useState(false);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  const isActiveInfluencerMode = !isPaidAd && campaignStatus === "active";
  const isEditableAssignmentMode =
    !isPaidAd && campaignStatus === "pending-invitations";

  const canInviteInfluencer =
    !isPaidAd &&
    (campaignStatus === "pending-invitations" || campaignStatus === "active");
  const canInviteAgency =
    isPaidAd && campaignStatus === "pending-invitations";

  // --- Assignments hook ---
  const { assignmentsLoading, assignmentRows } = useCampaignAssignments(
    campaignId,
    isEditableAssignmentMode
  );

  // --- Influencer selection hook ---
  const {
    selectedInfluencerId,
    setSelectedInfluencerId,
    activeInfluencerOptions,
    selectedInfluencerLabel,
    selectedAssignment,
    assignmentBasedMilestones,
  } = useInfluencerSelection(
    milestones,
    isEditableAssignmentMode,
    assignmentRows
  );

  // --- Base visible milestones ---
  const baseVisibleMilestones = useMemo(() => {
    if (isEditableAssignmentMode) {
      return assignmentBasedMilestones;
    }

    const base = [...(milestones ?? [])];

    if (isActiveInfluencerMode && selectedInfluencerId) {
      return base.filter(
        (m: any) => safeStr(m?.assignedToInfluencerId) === selectedInfluencerId
      );
    }

    return base;
  }, [
    milestones,
    isActiveInfluencerMode,
    selectedInfluencerId,
    isEditableAssignmentMode,
    assignmentBasedMilestones,
  ]);

  // --- Submissions hook ---
  const {
    submissionLoading,
    milestoneSubmissionMap,
    visibleMilestones,
    refreshMilestoneSubmissions,
    getActiveSubmissions,
  } = useMilestoneSubmissions(baseVisibleMilestones);

  // --- Active milestone selection ---
  useEffect(() => {
    const firstId =
      safeStr(visibleMilestones?.[0]?.id) ||
      safeStr(visibleMilestones?.[0]?.masterMilestoneId);

    setActiveMilestoneId((prev) => {
      const exists = (visibleMilestones ?? []).some(
        (m: any) => safeStr(m?.id || m?.masterMilestoneId) === safeStr(prev)
      );
      return exists ? prev ?? null : firstId || null;
    });
  }, [visibleMilestones]);

  const activeMilestone = useMemo(() => {
    const id = safeStr(activeMilestoneId);
    return (
      (visibleMilestones ?? []).find(
        (m: any) => safeStr(m?.id || m?.masterMilestoneId) === id
      ) ?? null
    );
  }, [visibleMilestones, activeMilestoneId]);

  const activeMilestoneIdSafe = safeStr((activeMilestone as any)?.id);

  const activeSubmissions = useMemo(() => {
    return getActiveSubmissions(activeMilestoneIdSafe);
  }, [getActiveSubmissions, activeMilestoneIdSafe]);

  // --- Progress hook ---
  const { progress, progressLoading } = useMilestoneProgress(
    campaignId,
    selectedInfluencerId,
    isActiveInfluencerMode,
    visibleMilestones
  );

  // --- Actions hook ---
  const {
    paymentActionMap,
    setPaymentActionMap,
    approveOpen,
    setApproveOpen,
    declineOpen,
    setDeclineOpen,
    partialPaidOpen,
    setPartialPaidOpen,
    declineReason,
    setDeclineReason,
    partialReason,
    setPartialReason,
    partialAmount,
    setPartialAmount,
    actionLoading,
    actionSubmission,
    getSubmissionRequestedAmount,
    getSubmissionPaidAmount,
    getSubmissionRemainingAmount,
    openApproveForSubmission,
    openDeclineForSubmission,
    openPayForSubmission,
    handleApproveConfirm,
    handleDeclineConfirm,
    handlePartialPaidSubmit,
    rollbackLoadingId,
    handleSubmissionStatusRollback,
  } = useMilestoneActions(
    isPaidAd,
    activeMilestone,
    activeMilestoneIdSafe,
    refreshMilestoneSubmissions
  );

  // --- Milestone influencers ---
  const milestoneInfluencers: InfluencerUI[] = useMemo(() => {
    const fallbackImg = "/avatar-fallback.png";

    if (Array.isArray(dropdownInfluencers) && dropdownInfluencers.length > 0) {
      return dropdownInfluencers
        .map((i: any, idx: number) => {
          const isString = typeof i === "string";
          const id =
            safeStr(isString ? `inf-${idx + 1}` : i?.id) ||
            safeStr(isString ? "" : i?._id) ||
            safeStr(isString ? "" : i?.profileId) ||
            `inf-${idx + 1}`;

          const name =
            safeStr(isString ? i : i?.name) ||
            `${safeStr(isString ? "" : i?.firstName)} ${safeStr(
              isString ? "" : i?.lastName
            )}`.trim() ||
            id;

          const imageUrl =
            safeStr(isString ? "" : i?.imageUrl) ||
            safeStr(isString ? "" : i?.profileImg) ||
            safeStr(isString ? "" : i?.profileImage) ||
            fallbackImg;

          return { id, name, imageUrl } as InfluencerUI;
        })
        .filter((x) => safeStr(x?.id).length > 0) as InfluencerUI[];
    }

    return (influencers ?? [])
      .map((x: any, idx: number) => {
        const id =
          safeStr(x?.id) || safeStr(x?.profileId) || `inf-${idx + 1}`;
        const name = safeStr(x?.name) || id;
        const imageUrl = safeStr(x?.imageUrl) || fallbackImg;

        return { id, name, imageUrl } as InfluencerUI;
      })
      .filter((x) => safeStr(x.id).length > 0);
  }, [dropdownInfluencers, influencers]);

  // --- Milestone budget max ---
  const milestoneBudgetMax = useMemo(() => {
    if (isPaidAd) return Math.max(0, Number(availableForAgency) || 0);

    if (isEditableAssignmentMode && selectedAssignment) {
      return roundMoney(Number(selectedAssignment?.totalAmount ?? 0));
    }

    if (campaignStatus === "active") {
      const fromVisibleMilestones = visibleMilestones.reduce(
        (sum: number, m: any) => sum + toAmount(m?.amount),
        0
      );
      if (fromVisibleMilestones > 0) return roundMoney(fromVisibleMilestones);
    }

    const assignedTotal = Math.max(0, Number(assignedInfluencerOfferTotal) || 0);
    if (assignedTotal > 0) return roundMoney(assignedTotal);

    return roundMoney(Math.max(0, Number(availableForInfluencers) || 0));
  }, [
    isPaidAd,
    availableForAgency,
    isEditableAssignmentMode,
    selectedAssignment,
    campaignStatus,
    visibleMilestones,
    assignedInfluencerOfferTotal,
    availableForInfluencers,
  ]);

  // --- Derived status values ---
  const activeMilestoneStatus = normalizeCampaignMilestoneStatus(
    (activeMilestone as any)?.status
  );
  const activeMilestoneStatusUi = getMilestoneStatusUi(
    (activeMilestone as any)?.status
  );

  const hasSubmission = activeSubmissions.length > 0;

  const statusBoxWrapClass =
    activeMilestoneStatus === "todo"
      ? "border-[#D4D4D8] bg-[#F3F3F3]"
      : activeMilestoneStatus === "in_review"
        ? "border-[#F0C998] bg-[#FFF9F2]"
        : activeMilestoneStatus === "declined"
          ? "border-[#FF8F8F] bg-[#FFF1F1]"
          : "border-[#B7C997] bg-[#F8F8EF]";

  const statusMetaTextClass =
    activeMilestoneStatus === "declined"
      ? "text-[#FF1E1E]"
      : activeMilestoneStatus === "todo"
        ? "text-[#8E8E8E]"
        : "text-[#7D8A61]";

  const changeStatusDisabled = !hasSubmission || activeMilestoneStatus === "todo";
  const submittedReportDisabled = !hasSubmission;

  const targetReach = toNullableNumber((activeMilestone as any)?.expectedReach);
  const targetViews = toNullableNumber((activeMilestone as any)?.expectedViews);
  const targetLikes = toNullableNumber((activeMilestone as any)?.expectedLikes);
  const targetComments = toNullableNumber(
    (activeMilestone as any)?.expectedComments
  );

  const targetItems = [
    targetReach !== null
      ? {
          label: "Reach",
          value: compactNum(targetReach),
          icon: <Eye className="h-4 w-4" />,
        }
      : null,
    targetViews !== null
      ? {
          label: "Views",
          value: compactNum(targetViews),
          icon: <Play className="h-4 w-4 fill-current" />,
        }
      : null,
    targetLikes !== null
      ? {
          label: "Reaction",
          value: compactNum(targetLikes),
          icon: <Heart className="h-4 w-4 fill-current" />,
        }
      : null,
    targetComments !== null
      ? {
          label: "Comment",
          value: compactNum(targetComments),
          icon: <MessageCircle className="h-4 w-4 fill-current" />,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    value: string;
    icon: ReactNode;
  }[];

  // --- Render submission content ---
  const renderSubmissionContent = useCallback(
    (submission: SubmissionItem, index: number) => {
      const submissionStatus = normalizeSubmissionStatus(submission?.status);
      const paymentStatus = normalizePaymentStatus(submission?.paymentStatus);
      const submissionBadge: BadgeType | undefined = isPaidAd
  ? getSubmissionAccordionBadge(submission?.status, submission?.paymentStatus)
  : getSubmissionAccordionBadge(submission?.status, submission?.paymentStatus);
      const metricReach = getSubmissionMetric(submission, "reach");
      const metricViews = getSubmissionMetric(submission, "views");
      const metricLikes = getSubmissionMetric(submission, "likes");
      const metricComments = getSubmissionMetric(submission, "comments");
      const averagePerformance = computeAveragePerformance(
        {
          reach: metricReach,
          views: metricViews,
          likes: metricLikes,
          comments: metricComments,
        },
        {
          reach: targetReach,
          views: targetViews,
          likes: targetLikes,
          comments: targetComments,
        }
      );

      const heading = isPaidAd
        ? `Submission ${index + 1}`
        : activeSubmissions.length > 1
          ? `Submission ${index + 1}`
          : "Submission Details";

      return (
        <CollapsibleCard
          key={submission.id || `${heading}-${index}`}
          heading={heading}
          badge={submissionBadge}
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <IconText
                    className="gap-2 text-base"
                    icon={<FaUserPen />}
                    text="Description / Update"
                  />

                  {isPaidAd && (
                    <span className="rounded-full bg-[#F7F1E7] px-3 py-1 text-xs font-medium text-[#D6852D]">
                      {submission?.influencerName || "Unknown Influencer"}
                    </span>
                  )}
                </div>

                <p>{submission?.description || "No description available."}</p>

                {submission?.rejectionReason ? (
                  <p className="text-sm font-medium text-[#FF1E1E]">
                    Reason: {submission.rejectionReason}
                  </p>
                ) : null}
              </div>

              <div className="lg:min-w-[340px]">
                <InReviewActions
                  submissionStatus={submissionStatus}
                  paymentStatus={paymentStatus}
                  selectedPaymentAction={paymentActionMap[submission.id] || ""}
                  onDecline={() => openDeclineForSubmission(submission)}
                  onApprove={() => openApproveForSubmission(submission)}
                  onPay={() => openPayForSubmission(submission)}
                  onPaymentActionChange={(value) =>
                    setPaymentActionMap((prev) => ({
                      ...prev,
                      [submission.id]: value,
                    }))
                  }
                  loading={actionLoading}
                  isPaidAd={isPaidAd}
                  rollbackLoading={rollbackLoadingId === submission.id}
                  onSubmissionStatusRollback={(status) =>
                    void handleSubmissionStatusRollback(submission, status)
                  }
                />
              </div>
            </div>

            <div className="mt-2 space-y-4 rounded-[12px] border border-[#DDDDDD] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="flex flex-wrap gap-4 text-[#4B5563]">
                  <span>
                    Requested: <strong>৳ {moneyLabel(submission?.requestedAmount)}</strong>
                  </span>
                  <span>
                    Paid: <strong>৳ {moneyLabel(submission?.paidAmount)}</strong>
                  </span>
                  <span>
                    Due: <strong>৳ {moneyLabel(getSubmissionRemainingAmount(submission))}</strong>
                  </span>
                </div>

                <span className="text-[#7D8A61]">
                  {formatDateLabel(submission?.submittedAt)}
                </span>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1">
                  <IconText
                    className="gap-2 font-semibold"
                    text="Platform / Live Link"
                    icon={<CgWebsite size={20} />}
                  />

                  {(submission?.liveLinks ?? []).length > 0 ? (
                    <div className="mt-2 flex flex-col gap-2">
                      {(submission?.liveLinks ?? []).map(
                        (liveLink: string, liveLinkIndex: number) => (
                          <Link
                            key={`${liveLink}-${liveLinkIndex}`}
                            href={
                              liveLink.startsWith("http")
                                ? liveLink
                                : `https://${liveLink}`
                            }
                            target="_blank"
                            className="text-sm text-primary underline"
                          >
                            {liveLink}
                          </Link>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[#6B7280]">
                      No live link submitted.
                    </p>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <IconText
                    icon={<HiMiniIdentification size={20} />}
                    className="gap-2 font-semibold"
                    text="Attached Proof"
                  />

                  <div className="flex flex-wrap gap-3">
                    {(submission?.attachments ?? []).length > 0 ? (
                      (submission?.attachments ?? []).map(
                        (fileUrl: string, attachmentIndex: number) => (
                          <Link
                            key={`${fileUrl}-${attachmentIndex}`}
                            href={fileUrl}
                            target="_blank"
                            className="flex h-[96px] w-[104px] items-center justify-center rounded-md border border-dashed border-gray-300 bg-white px-2 text-center text-xs text-[#232323]"
                          >
                            Proof {attachmentIndex + 1}
                          </Link>
                        )
                      )
                    ) : (
                      <p className="text-sm text-[#6B7280]">No proof attached.</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <IconText
                  className="gap-2 font-semibold"
                  text="Performance Metrics"
                  icon={<ChartColumnIncreasing size={18} />}
                />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 mt-4 p-2 lg:col-span-8">
                    <MilestonePerformanceStats
                      reach={metricReach}
                      views={metricViews}
                      likes={metricLikes}
                      comments={metricComments}
                      targetReach={targetReach ?? 0}
                      targetViews={targetViews ?? 0}
                      targetLikes={targetLikes ?? 0}
                      targetComments={targetComments ?? 0}
                    />
                  </div>

                  <div className="col-span-12 flex flex-col items-center justify-center gap-2 p-2 lg:col-span-4">
                    <h2 className="text-lg font-semibold">Average Performance</h2>
                    <CircularProgressChart
                      percentage={averagePerformance}
                      size={180}
                      strokeWidth={30}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleCard>
      );
    },
    [
      actionLoading,
      activeSubmissions.length,
      getSubmissionRemainingAmount,
      handleSubmissionStatusRollback,
      isPaidAd,
      openApproveForSubmission,
      openDeclineForSubmission,
      openPayForSubmission,
      paymentActionMap,
      rollbackLoadingId,
      setPaymentActionMap,
      targetComments,
      targetLikes,
      targetReach,
      targetViews,
    ]
  );

  // --- Modals Handlers ---
  const handleStatusChange = async (newStatus: MilestoneStatusValue) => {
    if (!activeMilestoneIdSafe) return;
    setStatusChangeLoading(true);
    try {
      await updateMilestoneStatus({
        milestoneId: activeMilestoneIdSafe,
        status: newStatus,
      });
      toast.success("Milestone status updated successfully");
      setChangeStatusOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update milestone status");
    } finally {
      setStatusChangeLoading(false);
    }
  };

  const isSelectedInfluencerInvited = useMemo(() => {
    if (!isEditableAssignmentMode) return false;
    if (!selectedAssignment) return false;
    const s = safeStr(selectedAssignment?.status).toLowerCase();
    return s !== "" && s !== "draft";
  }, [isEditableAssignmentMode, selectedAssignment]);

  return (
    <div className="space-y-4 p-2">
      {canInviteAgency && (
        <InviteAgencyBar
          campaignId={campaignId}
          availableForAgency={availableForAgency}
        />
      )}

      {canInviteInfluencer && (
        <InviteInfluencerBar
          campaignId={campaignId}
          selectedInfluencerId={selectedInfluencerId}
          onSelectedInfluencerChange={setSelectedInfluencerId}
        />
      )}

      {!isPaidAd && (isActiveInfluencerMode || isEditableAssignmentMode) && (
        <Card>
          <CardHeader className="flex gap-4">
            <CardTitle className="text-Primary flex flex-1 items-center gap-2 text-lg">
              <Image
                src={"/icons/person-multiple.svg"}
                width={20}
                height={20}
                alt="influencer"
              />
              <span>Influencer wise milestone progress</span>
            </CardTitle>

            {progressLoading ? (
              <div className="flex w-full max-w-md items-center gap-3">
                <p className="text-sm text-gray-500">Loading progress...</p>
              </div>
            ) : (
              <div className="flex w-full max-w-md flex-1 flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <p className="font-medium text-gray-700">
                    Partial Payment Progress
                  </p>
                  <p className="font-semibold text-light-green">{progress}%</p>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-light-green/20">
                  <div
                    className="h-full rounded-full bg-light-green transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="w-full md:w-[240px]">
              <Select
                value={selectedInfluencerId}
                onValueChange={setSelectedInfluencerId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      assignmentsLoading ? "Loading..." : "Select influencer"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {activeInfluencerOptions.map((inf) => (
                    <SelectItem key={inf.id} value={inf.id}>
                      {inf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedInfluencerLabel && (
                <p className="mt-1 text-xs text-gray-500">
                  {selectedInfluencerLabel}
                </p>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {isSelectedInfluencerInvited ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#B7C997] bg-[#F8F8EF] p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF0E1]">
            <MailCheck className="h-8 w-8 text-[#7D8A61]" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-Primary">
            Invitation Sent Successfully
          </h3>
          <p className="mx-auto max-w-sm text-sm text-[#5E6E57]">
            The campaign invitation has been sent to{" "}
            <span className="font-semibold text-[#7D8A61]">
              {selectedInfluencerLabel || "this influencer"}
            </span>
            . Please wait for their response to proceed with the milestones.
          </p>
        </div>
      ) : (
        <>
          <CampaignMilestone
            influencers={milestoneInfluencers}
            campaignStatus={campaignStatus}
            milestones={visibleMilestones}
            activeMilestoneId={activeMilestoneId}
            onSelectMilestone={(id) => setActiveMilestoneId(id)}
            offeredAmountPerInfluencer={milestoneBudgetMax}
            readOnlyAmounts={campaignStatus === "active"}
          />

      {activeMilestone && (
        <div className="space-y-4">
          <Card className="rounded-[20px] border border-[#D9E3D0] shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start justify-between gap-3 text-Primary">
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    <Image
                      src={"/icons/milestone.svg"}
                      height={22}
                      width={22}
                      alt="milestone"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#5E6E57]">
                      Milestone {(Number((activeMilestone as any).order ?? 0)) + 1}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-4">
                      <h2 className="text-[28px] font-semibold leading-none text-Primary">
                        {(activeMilestone as any).contentTitle ||
                          (activeMilestone as any).title}
                      </h2>

                      <p className="text-[24px] font-semibold leading-none text-light-green">
                        ৳ {moneyLabel((activeMilestone as any).amount)}
                      </p>

                      {!isPaidAd && (
                        <p className="text-lg font-medium text-[#6B7280]">
                          {safeStr((activeMilestone as any).influencerName)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <button type="button" className="mt-1 text-[#1F2A17]">
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="rounded-[16px] border border-[#B7C997] bg-[#F7F8E8] px-6 py-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 flex items-center lg:col-span-3">
                    <div className="w-full">
                      <ul className="list-disc pl-5 text-[15px] text-[#35571C]">
                        <li>
                          {(activeMilestone as any).contentQuantity ||
                            (activeMilestone as any).platform ||
                            "Milestone deliverable"}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4">
                    <div className="flex h-full flex-col items-center justify-center">
                      <h3 className="mb-4 text-center text-[18px] font-semibold text-Primary">
                        Milestone Target
                      </h3>

                      {targetItems.length > 0 ? (
                        <div
                          className={`grid gap-3 ${
                            targetItems.length === 1
                              ? "grid-cols-1"
                              : targetItems.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2"
                          }`}
                        >
                          {targetItems.map((item) => (
                            <div
                              key={item.label}
                              className="min-w-[124px] rounded-[14px] border border-[#7EA055] bg-[#F7F8E8] px-4 py-3"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-[14px] leading-none text-[#35571C]">
                                  {item.label}
                                </p>
                                <div className="text-[#4C5437]">{item.icon}</div>
                              </div>

                              <p className="mt-3 text-[22px] font-semibold leading-none text-Primary">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full rounded-[14px] border border-dashed border-[#B7C997] px-4 py-6 text-center text-[14px] text-[#6B7280]">
                          No milestone target available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_190px]">
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={() => setChangeStatusOpen(true)}
                          disabled={changeStatusDisabled}
                          className="h-12 w-full rounded-[12px] border-0 bg-[#7EA055] text-[15px] font-medium text-white hover:brightness-95 disabled:bg-[#F3F3F3] disabled:text-[#B8B8B8] disabled:opacity-100"
                        >
                          Change Status
                        </Button>

                        <Button
                          type="button"
                          onClick={() => setViewReportOpen(true)}
                          className="h-12 w-full rounded-[12px] border border-[#DADADA] bg-white text-[15px] font-medium text-[#232323] hover:bg-white disabled:bg-[#F8F8F8] disabled:text-[#C2C2C2] disabled:opacity-100"
                          variant="outline"
                          disabled={submittedReportDisabled}
                        >
                          View Submitted Report
                        </Button>
                      </div>

                      <div
                        className={`rounded-[14px] border px-4 py-4 ${statusBoxWrapClass}`}
                      >
                        <p className="text-center text-[14px] font-medium text-[#7D8A61]">
                          Status
                        </p>

                        <div className="mt-4 flex justify-center">
                          <div
                            className={`min-w-[126px] rounded-full px-6 py-2 text-center text-[15px] font-semibold text-white ${activeMilestoneStatusUi.statusBoxClass}`}
                          >
                            {activeMilestoneStatusUi.label}
                          </div>
                        </div>

                        <div
                          className={`mt-4 flex items-center justify-center gap-2 text-[13px] ${statusMetaTextClass}`}
                        >
                          <FaClock className="text-[11px]" />
                          <span>
                            {formatDateLabel(
                              activeSubmissions?.[0]?.submittedAt ||
                                (activeMilestone as any).createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                {submissionLoading ? (
                  <p className="text-sm text-[#6B7280]">Loading submission...</p>
                ) : !hasSubmission ? (
                  <div className="rounded-[12px] border border-dashed border-[#D9E3D0] bg-[#FAFBF7] p-6 text-sm text-[#6B7280]">
                    No submission available for this milestone yet.
                  </div>
                ) : (
                  activeSubmissions.map((submission, index) =>
                    renderSubmissionContent(submission, index)
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
        </>
      )}

      <MilestoneApproveModal
        open={approveOpen}
        milestoneTitle={
          safeStr((activeMilestone as any)?.contentTitle) ||
          safeStr((activeMilestone as any)?.title)
        }
        influencerName={safeStr(actionSubmission?.influencerName)}
        onClose={() => setApproveOpen(false)}
        onApprove={handleApproveConfirm}
        loading={actionLoading}
      />

      <MilestoneDeclineModal
        open={declineOpen}
        value={declineReason}
        onChange={setDeclineReason}
        onClose={() => setDeclineOpen(false)}
        onSubmit={handleDeclineConfirm}
        loading={actionLoading}
      />

      <MilestonePartialPaidModal
        open={partialPaidOpen}
        influencerName={safeStr(actionSubmission?.influencerName)}
        reason={partialReason}
        amount={partialAmount}
        maxAmount={
          actionSubmission
            ? getSubmissionRemainingAmount(actionSubmission) > 0
              ? getSubmissionRemainingAmount(actionSubmission)
              : getSubmissionRequestedAmount(actionSubmission)
            : 0
        }
        onReasonChange={setPartialReason}
        onAmountChange={setPartialAmount}
        onClose={() => setPartialPaidOpen(false)}
        onSubmit={handlePartialPaidSubmit}
        loading={actionLoading}
      />

      <MilestoneChangeStatusModal
        open={changeStatusOpen}
        onClose={() => setChangeStatusOpen(false)}
        onSubmit={handleStatusChange}
        loading={statusChangeLoading}
        currentStatus={activeMilestoneStatus}
      />

      <MilestoneSubmittedReportModal
        open={viewReportOpen}
        onClose={() => setViewReportOpen(false)}
        milestoneId={activeMilestoneIdSafe}
      />
    </div>
  );
}