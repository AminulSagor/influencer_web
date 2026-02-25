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

import { splitEqual } from "@/utils/admin/campaign/campaign-calculation";

import type {
  CampaignStatusType,
  InfluencerUI,
  CampaignMilestoneApi,
} from "@/types/admin/campaign/campaign-details_type";

const CircularProgressChart = dynamic(() => import("./circular-progress"), { ssr: false });

interface Props {
  campaignId: string;
  campaignStatus: CampaignStatusType;

  influencers: InfluencerUI[];
  dropdownInfluencers?: any[];
  milestones: CampaignMilestoneApi[];

  // ✅ MUST exist because page.tsx passes it
  availableForInfluencers: number;
}

function safeStr(v: any) {
  return String(v ?? "").trim();
}

export default function CampaignMilestoneContainer({
  campaignId,
  campaignStatus,
  influencers,
  dropdownInfluencers,
  milestones,
  availableForInfluencers, // ✅ RECEIVE IT
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
          const id = safeStr(i?.id) || safeStr(i?._id) || `inf-${idx + 1}`;

          const name =
            safeStr(i?.name) ||
            `${safeStr(i?.firstName)} ${safeStr(i?.lastName)}`.trim() ||
            id;

          const imageUrl =
            safeStr(i?.imageUrl) ||
            safeStr(i?.profileImg) ||
            safeStr(i?.profileImage) ||
            fallbackImg;

          if (!safeStr(id)) return null;

          return { id, name, imageUrl } as InfluencerUI;
        })
        .filter(Boolean) as InfluencerUI[];
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

  // ✅ CALCULATE OFFERED AMOUNT PER INFLUENCER (your rule)
  const offeredAmountPerInfluencer = useMemo(() => {
    const count = milestoneInfluencers.length;
    return splitEqual(availableForInfluencers, count).per;
  }, [availableForInfluencers, milestoneInfluencers.length]);

  return (
    <div className="space-y-4 p-2">
      {/* ✅ ALWAYS VISIBLE TOP INVITE BAR */}
      <InviteInfluencerBar
        campaignId={campaignId}
        availableForInfluencers={availableForInfluencers}
        milestoneCount={milestones.length}
      />

      <CampaignMilestone
        influencers={milestoneInfluencers}
        campaignStatus={campaignStatus}
        milestones={milestones}
        activeMilestoneId={activeMilestoneId}
        onSelectMilestone={(id) => setActiveMilestoneId(id)}
        offeredAmountPerInfluencer={offeredAmountPerInfluencer} // ✅ NOW EXISTS
      />

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
                    <p className="text-light-green">৳ {Number(activeMilestone.amount ?? 0)}</p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="border p-4 rounded-lg border-light-green grid grid-cols-12 gap-4 items-center bg-linear-to-r from-Secondary to-white">
                <div className="col-span-3">
                  <ul className="list-disc text-Primary">
                    <li className="ml-6 text-sm">{activeMilestone.contentQuantity}</li>
                  </ul>
                </div>

                <div className="col-span-3 space-y-2 text-Primary">
                  <h2 className="font-semibold">Milestone Target</h2>
                  <MilestoneTarget
                    reach={activeMilestone.expectedReach ?? 0}
                    views={activeMilestone.expectedViews ?? 0}
                    reaction={activeMilestone.expectedLikes ?? 0}
                    comment={activeMilestone.expectedComments ?? 0}
                  />
                </div>

                <div className="col-span-6 md:ml-10 flex gap-6">
                  <div className="space-y-2">
                    <div className="flex-1">
                      <Button className="w-full" variant={"outline"} disabled>
                        Change Status
                      </Button>
                    </div>
                    <div>
                      <Button className="w-full" variant={"outline"} disabled>
                        View Submitted Report
                      </Button>
                    </div>
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
                          <Link href={"#"}>platform link</Link>
                        </Button>
                      </div>

                      <div className="flex-2 space-y-2">
                        <IconText
                          icon={<HiMiniIdentification size={20} />}
                          className="gap-2 font-semibold"
                          text="Attach Proof"
                        />
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
                      <IconText
                        className="gap-2 font-semibold"
                        text="Performance Metrics"
                        icon={<ChartColumnIncreasing size={18} />}
                      />

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