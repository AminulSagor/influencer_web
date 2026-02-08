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
import type {
  CampaignApi,
  CampaignMilestoneApi,
} from "@/app/[locale]/(brand)/brand/types/client-types";
import { statusStyle } from "./milestone-ui-helpers";

export default function CampaignMilestonesOverview({
  campaign,
  expandedMilestoneId,
  onSelectMilestone,
}: {
  campaign: CampaignApi;
  expandedMilestoneId: string;
  onSelectMilestone: (milestoneId: string) => void;
}) {
  const milestones: CampaignMilestoneApi[] = campaign.milestones ?? [];

  const completedCount = milestones.filter(
    (m) => String(m.status).toLowerCase() === "completed",
  ).length;

  const totalCount = milestones.length;

  const percent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="space-y-3">
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

          {/* paid_ad screenshot has dropdown (optional: agency/influencer) — we’ll plug later if API gives it */}
          {campaign.campaignType === "paid_ad" ? (
            <div className="text-xs text-black/50"> </div>
          ) : (
            <div className="text-xs text-black/50"> </div>
          )}
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
                      "w-full text-left rounded-lg p-5 transition",
                      s.badge,
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
                            {m.contentTitle}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-black/50 truncate">
                          {m.contentQuantity || "—"}
                        </p>
                      </div>

                      <Badge
                        variant={"secondary"}
                        className={["shrink-0", s.badge].join(" ")}
                      >
                        {String(s.badge)}
                      </Badge>
                    </div>

                    <p
                      className={[
                        "mt-6 text-right text-xs font-semibold",
                        s.badge,
                      ].join(" ")}
                    >
                      {`DAY ${m.deliveryDays ?? idx + 1}`}
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
