"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChartColumnIncreasing,
  ChevronDown,
  Eye,
  Heart,
  MessageCircle,
  Play,
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
import { getInfluencerMilstoneProgress } from "@/service/admin/campaign/get-milstone-progress";
import { getCampaignAssignments } from "@/service/admin/campaign/get-campaign-assignments";
import { getMilestoneSubmissions } from "@/service/admin/campaign/get-milestone-submissions";
import { payInfluencerSubmission } from "@/service/admin/campaign/pay-influencer-submission";
import { updateInfluencerMilestoneStatus } from "@/service/admin/campaign/update-influencer-milestone-status";
import {
  getMilestoneStatusUi,
  getSubmissionAccordionBadge,
  normalizeCampaignMilestoneStatus,
} from "@/utils/admin/campaign/campaign-milestone/milestone_status_util";

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

function toAmount(v: unknown) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function toSafeNumber(value: unknown) {
  if (value === null || value === undefined) return 0;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function moneyLabel(v: unknown) {
  const n = Number(v ?? 0);
  return Number.isFinite(n)
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: n % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })
    : "0";
}

function compactNum(v: unknown) {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

function isCompletedStatus(status?: string | null) {
  const s = String(status ?? "").trim().toLowerCase();
  return ["approved", "partial_paid", "paid"].includes(s);
}

function extractProgressPercent(progressRes: any): number {
  const percent = Number(progressRes?.data?.progressPercentage ?? 0);
  return Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
}

function roundMoney(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

function getSubmissionMetric(submissionData: any, key: string) {
  return toSafeNumber(
    submissionData?.metrics?.[key] ??
      submissionData?.performanceMetrics?.[key] ??
      submissionData?.[key] ??
      0
  );
}

function computeAveragePerformance(
  metrics: {
    reach?: number;
    views?: number;
    likes?: number;
    comments?: number;
  },
  targets: {
    reach?: number | null;
    views?: number | null;
    likes?: number | null;
    comments?: number | null;
  }
) {
  const values = [
    {
      current: toSafeNumber(metrics?.reach),
      target: toSafeNumber(targets?.reach),
    },
    {
      current: toSafeNumber(metrics?.views),
      target: toSafeNumber(targets?.views),
    },
    {
      current: toSafeNumber(metrics?.likes),
      target: toSafeNumber(targets?.likes),
    },
    {
      current: toSafeNumber(metrics?.comments),
      target: toSafeNumber(targets?.comments),
    },
  ];

  const valid = values.filter((item) => item.target > 0);
  if (!valid.length) return 0;

  const totalPercent = valid.reduce((sum, item) => {
    const percent = (item.current / item.target) * 100;
    return sum + Math.max(0, Math.min(percent, 100));
  }, 0);

  return Math.round((totalPercent / valid.length) * 10) / 10;
}

function formatDateLabel(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return "—";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw.slice(0, 10);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string>("");
  const [remoteProgress, setRemoteProgress] = useState<number | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentRows, setAssignmentRows] = useState<any[]>([]);

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionData, setSubmissionData] = useState<any | null>(null);

  const [selectedPaymentAction, setSelectedPaymentAction] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [partialPaidOpen, setPartialPaidOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [partialReason, setPartialReason] = useState("");
  const [partialAmount, setPartialAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const isActiveInfluencerMode = !isPaidAd && campaignStatus === "active";
  const isEditableAssignmentMode =
    !isPaidAd && campaignStatus === "pending-invitations";

  const canInviteInfluencer =
    !isPaidAd && campaignStatus === "pending-invitations";
  const canInviteAgency =
    isPaidAd && campaignStatus === "pending-invitations";

  useEffect(() => {
    let cancelled = false;

    const loadAssignments = async () => {
      if (!isEditableAssignmentMode || !campaignId) {
        setAssignmentRows([]);
        return;
      }

      try {
        setAssignmentsLoading(true);
        const res = await getCampaignAssignments(campaignId);
        if (cancelled) return;

        const rows = Array.isArray(res?.data?.assignments)
          ? res.data.assignments
          : [];

        setAssignmentRows(rows);

        setSelectedInfluencerId((prev) => {
          if (prev && rows.some((x: any) => safeStr(x?.assigneeId) === prev)) {
            return prev;
          }
          return safeStr(rows?.[0]?.assigneeId);
        });
      } catch {
        if (!cancelled) setAssignmentRows([]);
      } finally {
        if (!cancelled) setAssignmentsLoading(false);
      }
    };

    loadAssignments();

    return () => {
      cancelled = true;
    };
  }, [campaignId, isEditableAssignmentMode]);

  const activeInfluencerOptions = useMemo(() => {
    if (isEditableAssignmentMode) {
      return assignmentRows.map((a: any) => ({
        id: safeStr(a?.assigneeId),
        name: safeStr(a?.assigneeName) || "Unknown Influencer",
        image: a?.assigneeImage ?? null,
        jobStatus: safeStr(a?.status),
      }));
    }

    const map = new Map<
      string,
      {
        id: string;
        name: string;
        image?: string | null;
        jobStatus?: string;
      }
    >();

    (milestones ?? []).forEach((m: any) => {
      const id = safeStr(m?.assignedToInfluencerId);
      if (!id) return;

      const prev = map.get(id);
      const nextJobStatus = safeStr(m?.jobStatus).toLowerCase();

      if (!prev) {
        map.set(id, {
          id,
          name: safeStr(m?.influencerName) || "Unknown Influencer",
          image: m?.influencerImage ?? null,
          jobStatus: nextJobStatus,
        });
        return;
      }

      if (prev.jobStatus !== "active" && nextJobStatus === "active") {
        map.set(id, {
          ...prev,
          jobStatus: nextJobStatus,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const aActive = a.jobStatus === "active" ? 0 : 1;
      const bActive = b.jobStatus === "active" ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return a.name.localeCompare(b.name);
    });
  }, [milestones, isEditableAssignmentMode, assignmentRows]);

  useEffect(() => {
    if (selectedInfluencerId) return;
    if (activeInfluencerOptions.length === 0) return;

    const activeOne =
      activeInfluencerOptions.find((x) => x.jobStatus === "active") ??
      activeInfluencerOptions[0];

    setSelectedInfluencerId(activeOne.id);
  }, [selectedInfluencerId, activeInfluencerOptions]);

  const selectedAssignment = useMemo(() => {
    if (!isEditableAssignmentMode) return null;

    return (
      assignmentRows.find(
        (x: any) => safeStr(x?.assigneeId) === safeStr(selectedInfluencerId)
      ) ?? null
    );
  }, [assignmentRows, selectedInfluencerId, isEditableAssignmentMode]);

  const assignmentBasedMilestones = useMemo(() => {
    if (!selectedAssignment) return [];

    return (selectedAssignment?.milestones ?? []).map((m: any, idx: number) => {
      const matchedCampaignMilestone =
        (milestones ?? []).find((cm) => {
          const sameMasterId =
            safeStr(cm?.id) &&
            safeStr(m?.masterMilestoneId) &&
            safeStr(cm?.id) === safeStr(m?.masterMilestoneId);

          const sameOwnId =
            safeStr(cm?.id) &&
            safeStr(m?.id) &&
            safeStr(cm?.id) === safeStr(m?.id);

          const sameOrderAndTitle =
            Number(cm?.order ?? -1) === Number(m?.order ?? -2) &&
            safeStr(cm?.contentTitle).toLowerCase() ===
              safeStr(m?.contentTitle || m?.title).toLowerCase();

          return sameMasterId || sameOwnId || sameOrderAndTitle;
        }) ?? null;

      return {
        id: safeStr(m?.id) || safeStr(m?.masterMilestoneId) || `m-${idx}`,
        masterMilestoneId:
          safeStr(m?.masterMilestoneId) || safeStr(matchedCampaignMilestone?.id),
        order: Number(m?.order ?? matchedCampaignMilestone?.order ?? idx),
        contentTitle: safeStr(
          m?.contentTitle ||
            m?.title ||
            matchedCampaignMilestone?.contentTitle
        ),
        title: safeStr(
          m?.contentTitle ||
            m?.title ||
            matchedCampaignMilestone?.contentTitle
        ),
        contentQuantity: safeStr(
          m?.contentQuantity || matchedCampaignMilestone?.contentQuantity
        ),
        platform: safeStr(m?.platform || matchedCampaignMilestone?.platform),
        amount: roundMoney(
          Number(m?.amount ?? matchedCampaignMilestone?.amount ?? 0)
        ),
        status: safeStr(m?.status),
        assignmentId: safeStr(selectedAssignment?.assigneeId),
        assignedToInfluencerId: safeStr(selectedAssignment?.assigneeId),
        influencerName: safeStr(selectedAssignment?.assigneeName),
        influencerImage: selectedAssignment?.assigneeImage ?? null,
        createdAt: m?.createdAt ?? selectedAssignment?.createdAt ?? null,
        updatedAt: m?.updatedAt ?? selectedAssignment?.updatedAt ?? null,
        jobStatus: safeStr(selectedAssignment?.status),
        promotionGoal:
          safeStr(m?.promotionGoal) ||
          safeStr(matchedCampaignMilestone?.promotionGoal) ||
          null,
        expectedReach: toNullableNumber(
          m?.expectedReach ?? matchedCampaignMilestone?.expectedReach
        ),
        expectedViews: toNullableNumber(
          m?.expectedViews ?? matchedCampaignMilestone?.expectedViews
        ),
        expectedLikes: toNullableNumber(
          m?.expectedLikes ?? matchedCampaignMilestone?.expectedLikes
        ),
        expectedComments: toNullableNumber(
          m?.expectedComments ?? matchedCampaignMilestone?.expectedComments
        ),
      };
    });
  }, [selectedAssignment, milestones]);

  const visibleMilestones = useMemo(() => {
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

  const localProgress = useMemo(() => {
    const total = visibleMilestones.length;
    if (total === 0) return 0;

    const completed = visibleMilestones.filter((m: any) =>
      isCompletedStatus(m?.status)
    ).length;

    return Math.round((completed / total) * 100);
  }, [visibleMilestones]);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!isActiveInfluencerMode || !campaignId || !selectedInfluencerId) {
        setRemoteProgress(null);
        return;
      }

      try {
        setProgressLoading(true);
        const res = await getInfluencerMilstoneProgress(
          campaignId,
          selectedInfluencerId
        );
        if (cancelled) return;
        setRemoteProgress(extractProgressPercent(res));
      } catch {
        if (cancelled) return;
        setRemoteProgress(null);
      } finally {
        if (!cancelled) setProgressLoading(false);
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [campaignId, selectedInfluencerId, isActiveInfluencerMode]);

  const progress = remoteProgress ?? localProgress;

  const selectedInfluencerLabel = useMemo(() => {
    if (!selectedInfluencerId) return "";
    return (
      activeInfluencerOptions.find((x) => x.id === selectedInfluencerId)?.name ??
      ""
    );
  }, [selectedInfluencerId, activeInfluencerOptions]);

  const activeMilestoneIdSafe = safeStr((activeMilestone as any)?.id);

  const loadSubmission = useCallback(async () => {
    if (!activeMilestoneIdSafe) {
      setSubmissionData(null);
      return;
    }

    try {
      setSubmissionLoading(true);
      const res = await getMilestoneSubmissions(activeMilestoneIdSafe);
      const firstSubmission = res?.data?.submissions?.[0] ?? null;
      setSubmissionData(firstSubmission);
    } catch {
      setSubmissionData(null);
    } finally {
      setSubmissionLoading(false);
    }
  }, [activeMilestoneIdSafe]);

  useEffect(() => {
    loadSubmission();
  }, [loadSubmission]);

  useEffect(() => {
    setSelectedPaymentAction("");
    setApproveOpen(false);
    setDeclineOpen(false);
    setPartialPaidOpen(false);
    setDeclineReason("");
    setPartialReason("");
    setPartialAmount("");
  }, [activeMilestoneIdSafe]);

  const activeMilestoneStatus = normalizeCampaignMilestoneStatus(
    (activeMilestone as any)?.status
  );
  const activeMilestoneStatusUi = getMilestoneStatusUi(
    (activeMilestone as any)?.status
  );

  const hasSubmission = !!submissionData;
  const submissionStatus = String(submissionData?.status ?? "")
    .trim()
    .toLowerCase();
  const paymentStatus = String(submissionData?.paymentStatus ?? "")
    .trim()
    .toLowerCase();

  const submissionBadge: BadgeType | undefined = hasSubmission
    ? getSubmissionAccordionBadge(submissionData?.status)
    : undefined;

  const requestedAmount = Number(submissionData?.requestedAmount ?? 0);
  const paidAmount = Number(submissionData?.paidAmount ?? 0);
  const remainingAmount = Math.max(0, requestedAmount - paidAmount);

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

  const changeStatusDisabled =
    !hasSubmission || activeMilestoneStatus === "todo" || actionLoading;
  const submittedReportDisabled = !hasSubmission;

  const metricReach = getSubmissionMetric(submissionData, "reach");
  const metricViews = getSubmissionMetric(submissionData, "views");
  const metricLikes = getSubmissionMetric(submissionData, "likes");
  const metricComments = getSubmissionMetric(submissionData, "comments");

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
    icon: React.ReactNode;
  }[];

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

  async function handleApproveConfirm() {
    const milestoneId = safeStr((activeMilestone as any)?.id);
    const assignmentId =
      safeStr((activeMilestone as any)?.assignmentId) ||
      safeStr(submissionData?.assignmentId);

    if (!milestoneId || !assignmentId) {
      toast.error("Milestone or assignment id is missing.");
      return;
    }

    try {
      setActionLoading(true);

      await updateInfluencerMilestoneStatus({
        milestoneId,
        assignmentId,
        status: "approved",
      });

      toast.success("Submission approved successfully.");
      setApproveOpen(false);
      await loadSubmission();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to approve submission."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeclineConfirm() {
    const milestoneId = safeStr((activeMilestone as any)?.id);
    const assignmentId =
      safeStr((activeMilestone as any)?.assignmentId) ||
      safeStr(submissionData?.assignmentId);

    if (!milestoneId || !assignmentId) {
      toast.error("Milestone or assignment id is missing.");
      return;
    }

    if (!declineReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }

    try {
      setActionLoading(true);

      await updateInfluencerMilestoneStatus({
        milestoneId,
        assignmentId,
        status: "declined",
        reason: declineReason.trim(),
      });

      toast.success("Submission declined successfully.");
      setDeclineOpen(false);
      setDeclineReason("");
      await loadSubmission();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to decline submission."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePay() {
    if (!submissionData?.id) return;

    if (!selectedPaymentAction) {
      toast.error("Select a payment type first.");
      return;
    }

    if (selectedPaymentAction === "partial_paid") {
      setPartialPaidOpen(true);
      return;
    }

    try {
      setActionLoading(true);

      await payInfluencerSubmission({
        submissionId: submissionData.id,
        amount: remainingAmount > 0 ? remainingAmount : requestedAmount,
        reason: "Full payment completed",
      });

      toast.success("Payment completed successfully.");
      setSelectedPaymentAction("");
      await loadSubmission();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to complete payment."
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePartialPaidSubmit() {
    if (!submissionData?.id) return;

    const amountNumber = Number(partialAmount || 0);

    if (!partialReason.trim()) {
      toast.error("Reason is required.");
      return;
    }

    if (!amountNumber || amountNumber <= 0) {
      toast.error("Enter a valid partial amount.");
      return;
    }

    if (amountNumber > remainingAmount) {
      toast.error("Partial amount cannot be greater than remaining due.");
      return;
    }

    try {
      setActionLoading(true);

      await payInfluencerSubmission({
        submissionId: submissionData.id,
        amount: amountNumber,
        reason: partialReason.trim(),
      });

      toast.success("Partial payment updated successfully.");
      setPartialPaidOpen(false);
      setPartialAmount("");
      setPartialReason("");
      setSelectedPaymentAction("");
      await loadSubmission();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update partial payment."
      );
    } finally {
      setActionLoading(false);
    }
  }

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
            <CardTitle className="text-Primary flex flex-1 items-center gap-2 text-base font-semibold">
              <Image
                src={"/icons/milestone.svg"}
                height={20}
                width={20}
                alt="milestone"
              />
              Campaign Milestones
            </CardTitle>

            {isActiveInfluencerMode && (
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Overall Progress</p>
                  <p className="text-light-green text-sm font-semibold">
                    {progressLoading ? "Loading..." : `${progress}% Completed`}
                  </p>
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
                          {safeStr(
                            submissionData?.influencerName ||
                              (activeMilestone as any).influencerName
                          )}
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
                                <div className="text-[#4C5437]">
                                  {item.icon}
                                </div>
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
                          disabled={changeStatusDisabled}
                          className="h-12 w-full rounded-[12px] border-0 bg-[#7EA055] text-[15px] font-medium text-white hover:brightness-95 disabled:bg-[#F3F3F3] disabled:text-[#B8B8B8] disabled:opacity-100"
                        >
                          Change Status
                        </Button>

                        <Button
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
                              submissionData?.submittedAt ||
                                (activeMilestone as any).createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <CollapsibleCard
                  heading="Submission Details"
                  badge={submissionBadge}
                >
                  {submissionLoading ? (
                    <p className="text-sm text-[#6B7280]">Loading submission...</p>
                  ) : !hasSubmission ? (
                    <div className="rounded-[12px] border border-dashed border-[#D9E3D0] bg-[#FAFBF7] p-6 text-sm text-[#6B7280]">
                      No submission available for this milestone yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                          <IconText
                            className="gap-2 text-base"
                            icon={<FaUserPen />}
                            text="Description / Update"
                          />
                          <p>
                            {submissionData?.description ||
                              "No description available."}
                          </p>
                        </div>

                        <div className="lg:min-w-[340px]">
                          <InReviewActions
                            submissionStatus={submissionStatus}
                            paymentStatus={paymentStatus}
                            selectedPaymentAction={selectedPaymentAction}
                            onDecline={() => setDeclineOpen(true)}
                            onApprove={() => setApproveOpen(true)}
                            onPay={handlePay}
                            onPaymentActionChange={setSelectedPaymentAction}
                            loading={actionLoading}
                          />
                        </div>
                      </div>

                      <div className="mt-2 space-y-4 rounded-[12px] border border-[#DDDDDD] p-4">
                        <div className="flex flex-col gap-6 lg:flex-row">
                          <div className="flex-1">
                            <IconText
                              className="gap-2 font-semibold"
                              text="Platform / Live Link"
                              icon={<CgWebsite size={20} />}
                            />

                            {(submissionData?.liveLinks ?? []).length > 0 ? (
                              <div className="mt-2 flex flex-col gap-2">
                                {submissionData.liveLinks.map(
                                  (liveLink: string, index: number) => (
                                    <Link
                                      key={`${liveLink}-${index}`}
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
                              {(submissionData?.attachments ?? []).length > 0 ? (
                                submissionData.attachments.map(
                                  (fileUrl: string, index: number) => (
                                    <Link
                                      key={`${fileUrl}-${index}`}
                                      href={fileUrl}
                                      target="_blank"
                                      className="flex h-[96px] w-[104px] items-center justify-center rounded-md border border-dashed border-gray-300 bg-white px-2 text-center text-xs text-[#232323]"
                                    >
                                      Proof {index + 1}
                                    </Link>
                                  )
                                )
                              ) : (
                                <p className="text-sm text-[#6B7280]">
                                  No proof attached.
                                </p>
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
                              <h2 className="text-lg font-semibold">
                                Average Performance
                              </h2>
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
                  )}
                </CollapsibleCard>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <MilestoneApproveModal
        open={approveOpen}
        milestoneTitle={
          safeStr((activeMilestone as any)?.contentTitle) ||
          safeStr((activeMilestone as any)?.title)
        }
        influencerName={safeStr(submissionData?.influencerName)}
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
        influencerName={safeStr(submissionData?.influencerName)}
        reason={partialReason}
        amount={partialAmount}
        maxAmount={remainingAmount > 0 ? remainingAmount : requestedAmount}
        onReasonChange={setPartialReason}
        onAmountChange={setPartialAmount}
        onClose={() => setPartialPaidOpen(false)}
        onSubmit={handlePartialPaidSubmit}
        loading={actionLoading}
      />
    </div>
  );
}