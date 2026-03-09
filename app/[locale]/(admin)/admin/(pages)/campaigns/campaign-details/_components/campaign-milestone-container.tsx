"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import CampaignMilestone from "./campaign-milestone";
import CollapsibleCard from "./collapsible-card";
import IconText from "./icon-text";
import MilestonePerformanceStats from "./milestone-performance-stat";

import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import { HiMiniIdentification } from "react-icons/hi2";
import {
  ChartColumnIncreasing,
  ChevronDown,
  Eye,
  Heart,
  MessageCircle,
  Play,
} from "lucide-react";
import Link from "next/link";

import InviteInfluencerBar from "./invite-influencer-bar";
import InviteAgencyBar from "./invite-agency-bar";

import type {
  CampaignStatusType,
  InfluencerUI,
  CampaignMilestoneservice,
} from "@/types/admin/campaign/campaign_details_type";

import { safeStr } from "@/utils/admin/campaign/number_util";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInfluencerMilstoneProgress } from "@/service/admin/campaign/get-milstone-progress";
import { getCampaignAssignments } from "@/service/admin/campaign/get-campaign-assignments";

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
  return ["completed", "approved", "paid"].includes(s);
}

function extractProgressPercent(progressRes: any): number {
  const percent = Number(progressRes?.data?.progressPercentage ?? 0);
  return Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
}

function roundMoney(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

function normalizeStatus(status?: string | null) {
  return String(status ?? "").trim().toLowerCase();
}

function statusLabel(status?: string | null) {
  const s = normalizeStatus(status);
  if (s === "in_review") return "In Review";
  if (s === "todo") return "To Do";
  if (s === "completed") return "Completed";
  if (s === "partial_paid") return "Partial Paid";
  if (s === "approved") return "Approved";
  return s || "To Do";
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
  const [selectedInfluencerId, setSelectedInfluencerId] =
    useState<string>("");
  const [remoteProgress, setRemoteProgress] = useState<number | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [assignmentRows, setAssignmentRows] = useState<any[]>([]);

  const isActiveInfluencerMode = !isPaidAd && campaignStatus === "active";
  const isEditableAssignmentMode =
    !isPaidAd && campaignStatus === "pending-invitations";
  const canInvite = campaignStatus === "pending-invitations";

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
        if (!cancelled) {
          setAssignmentRows([]);
        }
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

    return (selectedAssignment?.milestones ?? []).map((m: any, idx: number) => ({
      id: safeStr(m?.id) || safeStr(m?.masterMilestoneId) || `m-${idx}`,
      masterMilestoneId: safeStr(m?.masterMilestoneId),
      order: idx,

      contentTitle: safeStr(m?.title),
      title: safeStr(m?.title),

      contentQuantity: safeStr(m?.contentQuantity),
      platform: safeStr(m?.platform),

      amount: roundMoney(Number(m?.amount ?? 0)),
      status: safeStr(m?.status),

      assignedToInfluencerId: safeStr(selectedAssignment?.assigneeId),
      influencerName: safeStr(selectedAssignment?.assigneeName),
      influencerImage: selectedAssignment?.assigneeImage ?? null,

      createdAt: selectedAssignment?.createdAt ?? null,
      jobStatus: safeStr(selectedAssignment?.status),

      expectedReach: Number(m?.expectedReach ?? 300000),
      expectedViews: Number(m?.expectedViews ?? 250000),
      expectedLikes: Number(m?.expectedLikes ?? 300000),
      expectedComments: Number(m?.expectedComments ?? 300000),
    }));
  }, [selectedAssignment]);

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
      activeInfluencerOptions.find((x) => x.id === selectedInfluencerId)?.name ?? ""
    );
  }, [selectedInfluencerId, activeInfluencerOptions]);

  const activeStatus = normalizeStatus((activeMilestone as any)?.status);
  const isInReview = activeStatus === "in_review";

  const submissionBadge =
    activeStatus === "in_review"
      ? "In Review"
      : activeStatus === "completed"
      ? "Completed"
      : undefined;

  return (
    <div className="space-y-4 p-2">
      {canInvite && (
        <>
          {isPaidAd ? (
            <InviteAgencyBar
              campaignId={campaignId}
              availableForAgency={availableForAgency}
            />
          ) : (
            <InviteInfluencerBar
              campaignId={campaignId}
              milestoneCount={(milestones ?? []).length}
              milestones={(milestones ?? []).map((m: any) => ({
                id: String(m?.id ?? ""),
                order: Number(m?.order ?? 0),
              }))}
              selectedInfluencerId={selectedInfluencerId}
              onSelectedInfluencerChange={setSelectedInfluencerId}
            />
          )}
        </>
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
                          {safeStr((activeMilestone as any).influencerName)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button type="button" className="mt-1 text-[#1F2A17]">
                  <ChevronDown className="h-5 w-5" />
                </button>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="rounded-[16px] border border-[#B7C997] bg-[#F7F8E8] px-5 py-4">
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-12 flex items-center lg:col-span-3">
                    <div className="w-full">
                      <ul className="list-disc pl-5 text-[15px] text-[#4B5563]">
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
                      <h3 className="mb-3 text-center text-[18px] font-semibold text-Primary">
                        Milestone Target
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            label: "Reach",
                            value: compactNum((activeMilestone as any).expectedReach ?? 300000),
                            icon: <Eye className="h-3.5 w-3.5" />,
                          },
                          {
                            label: "Views",
                            value: compactNum((activeMilestone as any).expectedViews ?? 250000),
                            icon: <Play className="h-3.5 w-3.5 fill-current" />,
                          },
                          {
                            label: "Reaction",
                            value: compactNum((activeMilestone as any).expectedLikes ?? 300000),
                            icon: <Heart className="h-3.5 w-3.5 fill-current" />,
                          },
                          {
                            label: "Comment",
                            value: compactNum((activeMilestone as any).expectedComments ?? 300000),
                            icon: <MessageCircle className="h-3.5 w-3.5 fill-current" />,
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="min-w-[78px] rounded-[10px] border border-[#8AA05A] bg-[#F8F8EC] px-3 py-2"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] leading-none text-[#5E6E57]">
                                {item.label}
                              </p>
                              <div className="text-[#495336]">{item.icon}</div>
                            </div>
                            <p className="mt-1 text-[16px] font-semibold leading-none text-Primary">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_160px]">
                      <div className="space-y-3">
                        <Button
                          className="h-11 w-full rounded-[10px] border-0 bg-[#7EA055] text-[14px] font-medium text-white hover:brightness-95"
                        >
                          Change Status
                        </Button>

                        <Button
                          className="h-11 w-full rounded-[10px] border border-[#DADADA] bg-white text-[14px] font-medium text-[#232323] hover:bg-white"
                          variant="outline"
                        >
                          View Submitted Report
                        </Button>
                      </div>

                      <div className="rounded-[12px] border border-[#F0C998] bg-[#FFF9F2] px-4 py-3">
                        <p className="text-center text-[13px] font-medium text-[#D4872D]">
                          Status
                        </p>

                        <div className="mt-3 flex justify-center">
                          <div
                            className={`min-w-[118px] rounded-full px-6 py-1.5 text-center text-[14px] font-semibold text-white ${
                              isInReview ? "bg-[#D6852D]" : "bg-[#8E8E8E]"
                            }`}
                          >
                            {statusLabel((activeMilestone as any).status)}
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-[#D4872D]">
                          <FaClock className="text-[11px]" />
                          <span>
                            {String(
                              (activeMilestone as any).createdAt ?? ""
                            ).slice(0, 10) || "Dec 15, 2025"}
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
                  <div className="space-y-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <IconText
                          className="gap-2 text-base"
                          icon={<FaUserPen />}
                          text="Description / Update"
                        />
                        <p>Description of the proof will be visible here</p>
                      </div>

                      {isInReview && (
                        <div className="flex flex-col gap-3 lg:min-w-[340px]">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              className="h-10 min-w-[108px] rounded-[10px] border-[#D4D4D8] bg-white text-[#3F3F46] hover:bg-white"
                            >
                              Decline
                            </Button>

                            <Button className="h-10 min-w-[108px] rounded-[10px] border-0 bg-[#7EA055] text-white hover:brightness-95">
                              Approve
                            </Button>

                            <div className="flex h-10 min-w-[150px] items-center justify-between rounded-[10px] border border-[#D4D4D8] bg-white px-3 text-[13px] text-[#232323]">
                              <span>Completed</span>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="absolute right-0 top-[42px] hidden" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 space-y-4 rounded-[12px] border border-[#DDDDDD] p-4">
                      <div className="flex flex-col gap-6 lg:flex-row">
                        <div className="flex-1">
                          <IconText
                            className="gap-2 font-semibold"
                            text="Platform 1"
                            icon={<CgWebsite size={20} />}
                          />
                          <Button asChild className="mt-2 p-0" variant={"link"}>
                            <Link href={"#"}>facebook.com/hania/live</Link>
                          </Button>
                        </div>

                        <div className="flex-1 space-y-2">
                          <IconText
                            icon={<HiMiniIdentification size={20} />}
                            className="gap-2 font-semibold"
                            text="Attached Proof"
                          />
                          <div className="flex gap-3">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-[96px] w-[104px] rounded-md border border-dashed border-gray-300 bg-white"
                              />
                            ))}
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
                            <MilestonePerformanceStats />
                          </div>

                          <div className="col-span-12 flex flex-col items-center justify-center gap-2 p-2 lg:col-span-4">
                            <h2 className="text-lg font-semibold">
                              Average Performance
                            </h2>
                            <CircularProgressChart
                              percentage={65.4}
                              size={180}
                              strokeWidth={30}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleCard>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}