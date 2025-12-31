"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { campaignMocksData } from "@/app/[locale]/(brand)/brand/dummy-data-campaign/data";

type CampaignDetails = (typeof campaignMocksData)[number];
type InfluencerCampaign = CampaignDetails["influencerCampaigns"][number];

const statusStyle = (status?: string) => {
  const s = String(status ?? "").toLowerCase();
  if (s === "completed")
    return {
      card: "border-light-green bg-light-green/10",
      badge: "bg-light-green/20 text-light-green border-light-green/30",
      text: "text-light-green",
    };
  if (s === "inreview" || s === "in review")
    return {
      card: "border-orange-400/50 bg-orange-50",
      badge: "bg-orange-100 text-orange-600 border-orange-200",
      text: "text-orange-600",
    };
  if (s === "declined" || s === "rejected")
    return {
      card: "border-red-400/50 bg-red-50",
      badge: "bg-red-100 text-red-600 border-red-200",
      text: "text-red-600",
    };
  return {
    card: "border-black/10 bg-[#F7F7F7]",
    badge: "bg-white text-black/60 border-black/10",
    text: "text-black/60",
  };
};

export default function CampaignMilestonesOverview({
  campaign,
  selectedInfluencerId,
  onChangeInfluencer,
  expandedMilestoneId,
  onSelectMilestone,
}: {
  campaign: CampaignDetails;
  selectedInfluencerId: string;
  onChangeInfluencer: (id: string) => void;
  expandedMilestoneId: string;
  onSelectMilestone: (milestoneId: string) => void;
}) {
  const influencers = campaign.influencerCampaigns ?? [];

  const selected: InfluencerCampaign | undefined =
    influencers.find((x) => x.influencer.id === selectedInfluencerId) ??
    influencers[0];

  const milestones = selected?.milestones ?? [];

  const completedCount =
    selected?.progress?.completedCount ??
    milestones.filter((m) => String(m.status).toLowerCase() === "completed")
      .length;

  const totalCount = selected?.progress?.totalCount ?? milestones.length;

  const percent =
    selected?.progress?.percentCompleted ??
    (totalCount ? Math.round((completedCount / totalCount) * 100) : 0);

  return (
    <Card className="">
      <CardHeader className="space-y-1">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={"/icons/milestone.svg"}
              height={18}
              width={18}
              alt="icon"
            />
            <h2 className="text-Primary font-semibold">Campaign Milestones</h2>
          </div>

          <Select
            value={selectedInfluencerId}
            onValueChange={onChangeInfluencer}
          >
            <SelectTrigger className="w-full md:w-[260px] bg-white text-Primary">
              <SelectValue
                placeholder="Select influencer"
                className="text-Primary"
              />
            </SelectTrigger>
            <SelectContent>
              {influencers.map((inf) => (
                <SelectItem key={inf.influencer.id} value={inf.influencer.id}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        inf.influencer.avatarUrl
                          ? inf.influencer.avatarUrl
                          : "/avatar/avatar.png"
                      }
                      height={16}
                      width={25}
                      alt="profile-image"
                    />
                    <span className="truncate">{inf.influencer.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-black/60">Overall Progress</p>
            <p className="text-lg font-semibold text-orange pt-2">
              {percent}% Completed
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-light-green text-xs font-semibold">
          <h2>Progress</h2>
          <p>
            {completedCount} of {totalCount} Completed
          </p>
        </div>

        <Progress value={percent} className="h-2" />
      </CardHeader>

      <CardContent>
        <Carousel>
          <CarouselContent>
            {milestones.map((m, idx) => {
              const s = statusStyle(m.status);
              const active = m.id === expandedMilestoneId;

              return (
                <CarouselItem
                  key={m.id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/3"
                >
                  <button
                    type="button"
                    onClick={() => onSelectMilestone(m.id)}
                    className={[
                      "w-full text-left rounded-lg  p-5 transition",
                      s.card,
                      active ? "border-2" : "border",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-light-green text-white text-xs">
                            {idx + 1}
                          </span>
                          <p className="text-sm font-semibold text-Primary truncate">
                            {m.title}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-black/50 truncate">
                          {(m.contentRequirements ?? []).join(" + ") || "—"}
                        </p>
                      </div>

                      <Badge
                        variant={"secondary"}
                        className={["shrink-0", s.badge].join(" ")}
                      >
                        {String(m.status)}
                      </Badge>
                    </div>

                    <p
                      className={[
                        "mt-6 text-right text-xs font-semibold",
                        s.text,
                      ].join(" ")}
                    >
                      {m.dayLabel ?? `DAY ${idx + 1}`}
                    </p>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="left-1 border-none" />
          <CarouselNext className="right-1 border-none" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
