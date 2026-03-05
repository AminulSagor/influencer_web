"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

import CampaignMilestone from "./campaign-milestone";
import CollapsibleCard from "./collapsible-card";
import IconText from "./icon-text";
import MilestonePerformanceStats from "./milestone-performance-stat";
import MilestoneTarget from "./milestone-target";

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
  CampaignMilestoneApi,
} from "@/types/admin/campaign/campaign_details_type";

import { safeStr } from "@/utils/admin/campaign/number_util";

const CircularProgressChart = dynamic(() => import("./circular-progress"), { ssr: false });

interface Props {
  campaignId: string;
  campaignStatus: CampaignStatusType;

  isPaidAd: boolean;

  influencers: InfluencerUI[];
  dropdownInfluencers?: any[];
  milestones: CampaignMilestoneApi[];

  availableForInfluencers: number;
  availableForAgency?: number;
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
}: Props) {
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  useEffect(() => {
    const firstId = safeStr(milestones?.[0]?.id);
    setActiveMilestoneId((prev) => prev ?? (firstId || null));
  }, [milestones]);

  const activeMilestone = useMemo(() => {
    const id = safeStr(activeMilestoneId);
    return (milestones ?? []).find((m) => safeStr(m.id) === id) ?? null;
  }, [milestones, activeMilestoneId]);

  const milestoneInfluencers: InfluencerUI[] = useMemo(() => {
    const fallbackImg = "/avatar-fallback.png";

    if (Array.isArray(dropdownInfluencers) && dropdownInfluencers.length > 0) {
      return dropdownInfluencers
        .map((i: any, idx: number) => {
          // supports object or string
          const isString = typeof i === "string";
          const id =
            safeStr(isString ? `inf-${idx + 1}` : i?.id) ||
            safeStr(isString ? "" : i?._id) ||
            `inf-${idx + 1}`;

          const name =
            safeStr(isString ? i : i?.name) ||
            `${safeStr(isString ? "" : i?.firstName)} ${safeStr(isString ? "" : i?.lastName)}`.trim() ||
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
        const id = safeStr(x?.id) || `inf-${idx + 1}`;
        const name = safeStr(x?.name) || id;
        const imageUrl = safeStr(x?.imageUrl) || fallbackImg;
        return { id, name, imageUrl } as InfluencerUI;
      })
      .filter((x) => safeStr(x.id).length > 0);
  }, [dropdownInfluencers, influencers]);

  const canInvite = campaignStatus === "pending-invitations" || campaignStatus === "active";

  // ✅ FIX: milestone budget "max" should be the budget for this flow
  // - Agency flow: availableForAgency
  // - Influencer flow: availableForInfluencers
  const milestoneBudgetMax = useMemo(() => {
    return isPaidAd ? availableForAgency : availableForInfluencers;
  }, [isPaidAd, availableForAgency, availableForInfluencers]);

  return (
    <div className="space-y-4 p-2">
      {canInvite && (
        <>
          {isPaidAd ? (
            <InviteAgencyBar campaignId={campaignId} availableForAgency={availableForAgency} />
          ) : (
            <InviteInfluencerBar
              campaignId={campaignId}
              milestoneCount={(milestones ?? []).length}
            />
          )}
        </>
      )}

      <CampaignMilestone
        influencers={milestoneInfluencers}
        campaignStatus={campaignStatus}
        milestones={milestones}
        activeMilestoneId={activeMilestoneId}
        onSelectMilestone={(id) => setActiveMilestoneId(id)}
        offeredAmountPerInfluencer={milestoneBudgetMax} // ✅ FIX
      />

      {/* rest unchanged */}
      {activeMilestone && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex gap-4">
              <CardTitle className="flex flex-1 items-center gap-6 text-Primary text-base font-semibold">
                <div>
                  <Image src={"/icons/milestone.svg"} height={24} width={24} alt="svg" />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-normal">
                    Milestone - {(activeMilestone.order ?? 0) + 1}
                  </p>

                  <div className="flex items-center gap-8">
                    <h2>{activeMilestone.contentTitle}</h2>
                    <p className="text-light-green">
                      ৳ {Number(activeMilestone.amount ?? 0)}
                    </p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="border p-4 rounded-lg border-light-green grid grid-cols-12 gap-4 items-center bg-linear-to-r from-Secondary to-white">
                <div className="col-span-6 md:ml-10 flex gap-6">
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
                        {activeMilestone.status ?? "To Do"}
                      </div>

                      <div className="text-[#8E8E8E] text-sm">
                        <IconText
                          icon={<FaClock />}
                          text={(activeMilestone.createdAt ?? "").slice(0, 10)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CollapsibleCard heading="Submission Details" badge="Completed">
                <div className="space-y-2">
                  <IconText className="text-base gap-2" icon={<FaUserPen />} text="Description / Update" />
                  <p>Description of the proof will be visible here</p>

                  <div className="border rounded-md p-4 space-y-4 mt-6">
                    <div className="flex">
                      <div className="flex-1">
                        <IconText className="gap-2 font-semibold" text="Platform 1" icon={<CgWebsite size={20} />} />
                        <Button asChild className="p-0" variant={"link"}>
                          <Link href={"#"}>platform link</Link>
                        </Button>
                      </div>

                      <div className="flex-2 space-y-2">
                        <IconText icon={<HiMiniIdentification size={20} />} className="gap-2 font-semibold" text="Attach Proof" />
                        <div className="flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="border-dashed bg-gray-100 border-gray-200 h-[150px] aspect-square rounded-md border-2 "
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <IconText className="gap-2 font-semibold" text="Performance Metrics" icon={<ChartColumnIncreasing size={18} />} />

                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8 p-2 mt-4">
                          <MilestonePerformanceStats />
                        </div>

                        <div className="p-2 col-span-4 flex items-center flex-col gap-2 justify-center">
                          <h2 className="text-lg font-semibold">Average Performance</h2>
                          <CircularProgressChart percentage={80} size={180} strokeWidth={30} />
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