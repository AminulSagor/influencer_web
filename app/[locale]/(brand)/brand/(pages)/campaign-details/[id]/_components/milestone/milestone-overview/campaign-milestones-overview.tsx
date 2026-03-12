"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CampaignDetails,
  CampaignMilestone,
} from "@/types/client/campaigns/campaign-details";
import InfluencerSelector from "./influencer-selector";
import MilestonesCarousel from "./milestones-carousel";

type Props = {
  campaign: CampaignDetails;
  expandedMilestoneId: string;
  onSelectMilestone: (milestoneId: string) => void;
};

export type InfluencerOption = {
  id: string;
  name: string;
  image: string | null;
};

const normalizeStatus = (status?: string) =>
  String(status ?? "")
    .trim()
    .toLowerCase();

const getInfluencerOptions = (milestones: CampaignMilestone[]) => {
  const map = new Map<string, InfluencerOption>();

  for (const milestone of milestones) {
    const id = milestone.assignedToInfluencerId?.trim();
    const name = milestone.influencerName?.trim();

    if (!id || !name) continue;

    if (!map.has(id)) {
      map.set(id, {
        id,
        name,
        image: milestone.influencerImage ?? null,
      });
    }
  }

  return Array.from(map.values());
};

export default function CampaignMilestonesOverview({
  campaign,
  expandedMilestoneId,
  onSelectMilestone,
}: Props) {
  const allMilestones = useMemo(
    () => campaign.milestones ?? [],
    [campaign.milestones],
  );

  const showInfluencerDropdown =
    campaign.campaignType === "influencer_promotion";

  const influencerOptions = useMemo(
    () => getInfluencerOptions(allMilestones),
    [allMilestones],
  );

  const initialInfluencerId = useMemo(() => {
    const expandedMilestone = allMilestones.find(
      (m) => m.id === expandedMilestoneId,
    );
    const expandedInfluencerId =
      expandedMilestone?.assignedToInfluencerId?.trim();

    if (
      expandedInfluencerId &&
      influencerOptions.some((item) => item.id === expandedInfluencerId)
    ) {
      return expandedInfluencerId;
    }

    return influencerOptions[0]?.id ?? "";
  }, [allMilestones, expandedMilestoneId, influencerOptions]);

  const [selectedInfluencerId, setSelectedInfluencerId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const effectiveSelectedInfluencerId = useMemo(() => {
    if (!showInfluencerDropdown) return "";

    if (
      selectedInfluencerId &&
      influencerOptions.some((item) => item.id === selectedInfluencerId)
    ) {
      return selectedInfluencerId;
    }

    return initialInfluencerId;
  }, [
    showInfluencerDropdown,
    selectedInfluencerId,
    influencerOptions,
    initialInfluencerId,
  ]);

  const selectedInfluencer = useMemo(() => {
    if (!showInfluencerDropdown) return null;

    return (
      influencerOptions.find(
        (item) => item.id === effectiveSelectedInfluencerId,
      ) ?? null
    );
  }, [
    showInfluencerDropdown,
    influencerOptions,
    effectiveSelectedInfluencerId,
  ]);

  const milestones = useMemo(() => {
    if (!showInfluencerDropdown) return allMilestones;
    if (!effectiveSelectedInfluencerId) return [];

    return allMilestones.filter(
      (milestone) =>
        milestone.assignedToInfluencerId?.trim() ===
        effectiveSelectedInfluencerId,
    );
  }, [allMilestones, showInfluencerDropdown, effectiveSelectedInfluencerId]);

  const completedCount = useMemo(
    () =>
      milestones.filter((m) => normalizeStatus(m.status) === "completed")
        .length,
    [milestones],
  );

  const totalCount = milestones.length;

  const percent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleInfluencerSelect = (influencerId: string) => {
    setSelectedInfluencerId(influencerId);
    setIsDropdownOpen(false);

    if (expandedMilestoneId) {
      onSelectMilestone("");
    }
  };

  return (
    <Card className="rounded-[24px] border border-black/10 shadow-none">
      <CardHeader className="space-y-5 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/milestone.svg"
                width={20}
                height={20}
                alt="Milestone"
              />
              <h2 className="text-[16px] font-semibold text-Primary">
                Campaign Milestones
              </h2>
            </div>

            {showInfluencerDropdown ? (
              <div>
                <p className="text-sm text-black/70">Overall Progress</p>
                <p className="text-[16px] font-semibold leading-none text-orange">
                  {percent}% Completed
                </p>
              </div>
            ) : null}
          </div>

          {showInfluencerDropdown ? (
            <div ref={dropdownRef} className="w-full max-w-[320px]">
              <InfluencerSelector
                influencerOptions={influencerOptions}
                selectedInfluencer={selectedInfluencer}
                selectedInfluencerId={effectiveSelectedInfluencerId}
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen((prev) => !prev)}
                onSelect={handleInfluencerSelect}
              />
            </div>
          ) : (
            <div className="w-full max-w-[710px] space-y-2">
              <div className="flex items-center justify-between text-sm text-black/70">
                <span>Progress</span>
                <span className="font-semibold text-light-green">
                  {completedCount} Of {totalCount} Completed
                </span>
              </div>
              <Progress
                value={percent}
                className="h-2 [&>div]:bg-Primary/70"
              />
            </div>
          )}
        </div>

        {showInfluencerDropdown ? (
          <div>
            <p className="mb-2 text-sm text-black/70">Progress</p>
            <div className="flex items-center justify-between text-sm font-semibold text-light-green">
              <span />
              <span>
                {completedCount} Of {totalCount} Completed
              </span>
            </div>
            <Progress value={percent} className="mt-2 h-2 [&>div]:bg-Primary/70" />
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="pt-0">
        <MilestonesCarousel
          milestones={milestones}
          expandedMilestoneId={expandedMilestoneId}
          onSelectMilestone={onSelectMilestone}
        />
      </CardContent>
    </Card>
  );
}
