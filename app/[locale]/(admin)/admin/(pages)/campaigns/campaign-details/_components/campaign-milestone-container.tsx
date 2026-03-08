"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

import CampaignMilestone from "./campaign-milestone";
import CollapsibleCard from "./collapsible-card";
import IconText from "./icon-text";
import MilestonePerformanceStats from "./milestone-performance-stat";

import { Button } from "@/components/ui/button";
import { FaClock } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import { HiMiniIdentification } from "react-icons/hi2";
import { ChartColumnIncreasing } from "lucide-react";
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

function isCompletedStatus(status?: string | null) {
  const s = String(status ?? "").trim().toLowerCase();
  return ["completed", "approved", "paid"].includes(s);
}

function extractProgressPercent(progressRes: any): number {
  const percent = Number(progressRes?.data?.progressPercentage ?? 0);
  return Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
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
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string>("");
  const [remoteProgress, setRemoteProgress] = useState<number | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const isActiveInfluencerMode = !isPaidAd && campaignStatus === "active";
  const canInvite = campaignStatus === "pending-invitations";

  const activeInfluencerOptions = useMemo(() => {
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
  }, [milestones]);

  useEffect(() => {
    if (!isActiveInfluencerMode) return;
    if (selectedInfluencerId) return;
    if (activeInfluencerOptions.length === 0) return;

    const activeOne =
      activeInfluencerOptions.find((x) => x.jobStatus === "active") ??
      activeInfluencerOptions[0];

    setSelectedInfluencerId(activeOne.id);
  }, [isActiveInfluencerMode, selectedInfluencerId, activeInfluencerOptions]);

  const visibleMilestones = useMemo(() => {
    const base = [...(milestones ?? [])];

    if (!isActiveInfluencerMode) return base;
    if (!selectedInfluencerId) return base;

    return base.filter(
      (m: any) => safeStr(m?.assignedToInfluencerId) === selectedInfluencerId
    );
  }, [milestones, isActiveInfluencerMode, selectedInfluencerId]);

  useEffect(() => {
    const firstId = safeStr(visibleMilestones?.[0]?.id);
    setActiveMilestoneId((prev) => {
      const exists = (visibleMilestones ?? []).some(
        (m) => safeStr(m?.id) === safeStr(prev)
      );
      return exists ? prev ?? null : firstId || null;
    });
  }, [visibleMilestones]);

  const activeMilestone = useMemo(() => {
    const id = safeStr(activeMilestoneId);
    return (visibleMilestones ?? []).find((m) => safeStr(m.id) === id) ?? null;
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
    if (isPaidAd) {
      return Math.max(0, Number(availableForAgency) || 0);
    }

    if (campaignStatus === "active") {
      const fromVisibleMilestones = visibleMilestones.reduce(
        (sum, m) => sum + toAmount((m as any)?.amount),
        0
      );
      if (fromVisibleMilestones > 0) return fromVisibleMilestones;
    }

    const assignedTotal = Math.max(0, Number(assignedInfluencerOfferTotal) || 0);
    if (assignedTotal > 0) return assignedTotal;

    return Math.max(0, Number(availableForInfluencers) || 0);
  }, [
    isPaidAd,
    availableForAgency,
    availableForInfluencers,
    assignedInfluencerOfferTotal,
    campaignStatus,
    visibleMilestones,
  ]);

  const localProgress = useMemo(() => {
    const total = visibleMilestones.length;
    if (total === 0) return 0;

    const completed = visibleMilestones.filter((m) =>
      isCompletedStatus((m as any)?.status)
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
        console.log(res);
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
            />
          )}
        </>
      )}

      {isActiveInfluencerMode && (
        <Card>
          <CardHeader className="flex gap-4">
            <CardTitle className="flex flex-1 items-center gap-2 text-Primary text-base font-semibold">
              <Image
                src={"/icons/milestone.svg"}
                height={20}
                width={20}
                alt="milestone"
              />
              Campaign Milestones
            </CardTitle>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">Overall Progress</p>
                <p className="text-sm font-semibold text-light-green">
                  {progressLoading ? "Loading..." : `${progress}% Completed`}
                </p>
              </div>

              <div className="h-2 w-full bg-light-green/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-light-green rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="w-full md:w-[240px]">
              <Select
                value={selectedInfluencerId}
                onValueChange={setSelectedInfluencerId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select influencer" />
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
          <Card>
            <CardHeader className="flex gap-4">
              <CardTitle className="flex flex-1 items-center gap-6 text-Primary text-base font-semibold">
                <div>
                  <Image
                    src={"/icons/milestone.svg"}
                    height={24}
                    width={24}
                    alt="svg"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-normal">
                    Milestone - {(Number((activeMilestone as any).order ?? 0)) + 1}
                  </p>

                  <div className="flex flex-wrap items-center gap-5">
                    <h2>{(activeMilestone as any).contentTitle}</h2>
                    <p className="text-light-green">
                      ৳ {toAmount((activeMilestone as any).amount)}
                    </p>

                    {isActiveInfluencerMode && (
                      <p className="text-sm text-gray-500">
                        {safeStr((activeMilestone as any).influencerName)}
                      </p>
                    )}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="border p-4 rounded-lg border-light-green grid grid-cols-12 gap-4 items-center bg-linear-to-r from-Secondary to-white">
                <div className="col-span-12 md:col-span-6 md:ml-10 flex gap-6">
                  <div className="space-y-2">
                    <Button className="w-full" variant={"outline"} disabled>
                      Change Status
                    </Button>
                    <Button className="w-full" variant={"outline"} disabled>
                      View Submitted Report
                    </Button>
                  </div>

                  <div className="flex-1 mr-10">
                    <div className="border p-2 rounded-md bg-linear-to-r from-white to-[#8E8E8E]/40 border-gray-300 flex items-center flex-col gap-2">
                      <p className="text-sm text-[#8E8E8E]">Status</p>

                      <div className="bg-[#8E8E8E] text-white px-20 py-1 rounded-full">
                        {(activeMilestone as any).status ?? "To Do"}
                      </div>

                      <div className="text-[#8E8E8E] text-sm">
                        <IconText
                          icon={<FaClock />}
                          text={String((activeMilestone as any).createdAt ?? "").slice(
                            0,
                            10
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CollapsibleCard heading="Submission Details" badge="In Review">
                <div className="space-y-2">
                  <IconText
                    className="text-base gap-2"
                    icon={<FaUserPen />}
                    text="Description / Update"
                  />
                  <p>Description of the proof will be visible here</p>

                  <div className="border rounded-md p-4 space-y-4 mt-6">
                    <div className="flex">
                      <div className="flex-1">
                        <IconText
                          className="gap-2 font-semibold"
                          text="Platform 1"
                          icon={<CgWebsite size={20} />}
                        />
                        <Button asChild className="p-0" variant={"link"}>
                          <Link href={"#"}>facebook.com/abid/video</Link>
                        </Button>
                      </div>

                      <div className="flex-2 space-y-2">
                        <IconText
                          icon={<HiMiniIdentification size={20} />}
                          className="gap-2 font-semibold"
                          text="Attached Proof"
                        />
                        <div className="flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="border-dashed bg-gray-100 border-gray-200 h-[150px] aspect-square rounded-md border-2"
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
                        <div className="col-span-12 lg:col-span-8 p-2 mt-4">
                          <MilestonePerformanceStats />
                        </div>

                        <div className="p-2 col-span-12 lg:col-span-4 flex items-center flex-col gap-2 justify-center">
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}