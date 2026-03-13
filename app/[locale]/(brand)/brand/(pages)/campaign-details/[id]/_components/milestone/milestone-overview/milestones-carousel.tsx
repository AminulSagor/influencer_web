"use client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CampaignMilestone } from "@/types/client/campaigns/campaign-details";

type Props = {
  milestones: CampaignMilestone[];
  expandedMilestoneId: string;
  onSelectMilestone: (milestoneId: string) => void;
};

const normalizeStatus = (status?: string) =>
  String(status ?? "")
    .trim()
    .toLowerCase();

const getStatusLabel = (status?: string) => {
  const value = normalizeStatus(status);

  if (value === "completed") return "Completed";
  if (value === "in_review") return "In Review";
  if (value === "declined") return "Declined";
  if (value === "accepted") return "Accepted";
  if (value === "pending") return "Pending";

  if (!value) return "Pending";

  return value
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const getStatusClasses = (status?: string) => {
  const value = normalizeStatus(status);

  if (value === "completed") {
    return {
      card: "border-light-green bg-linear-to-r from-white to-light-green/20",
      activeBorder: "ring-light-green border-[3px] border-light-green",
      badge: "border-light-green/20 bg-light-green text-white",
      index: "bg-light-green text-white",
      title: "text-Primary",
      meta: "text-black/45",
      day: "text-light-green",
    };
  }

  if (value === "in_review") {
    return {
      card: "border-orange bg-linear-to-r from-white to-orange/10",
      activeBorder: "ring-orange border-[3px] border-orange",
      badge: "border-orange/20 bg-[#FCE9D7] text-orange",
      index: "bg-orange text-white",
      title: "text-orange",
      meta: "text-black/45",
      day: "text-orange",
    };
  }

  if (value === "declined") {
    return {
      card: "border-red-500 bg-linear-to-r from-white to-red-500/10",
      activeBorder: "ring-red-500 border-[3px] border-red-500",
      badge: "border-red-200 bg-red-500 text-white",
      index: "bg-red-500 text-white",
      title: "text-red-500",
      meta: "text-black/45",
      day: "text-red-500",
    };
  }

  return {
    card: "border-black/20 bg-linear-to-r from-white to-dark-gray/20",
    activeBorder: "ring-black/30 border-[3px] border-black/30",
    badge: "border-black/10 bg-black/5 text-black/70",
    index: "bg-black/40 text-white",
    title: "text-Primary",
    meta: "text-black/45",
    day: "text-black/50",
  };
};

export default function MilestonesCarousel({
  milestones,
  expandedMilestoneId,
  onSelectMilestone,
}: Props) {
  if (!milestones.length) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-black/10 bg-black/[0.02] text-sm text-black/50">
        No milestones found for this influencer.
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: false,
      }}
      className="relative"
    >
      <CarouselContent className="-ml-3">
        {milestones.map((milestone, idx) => {
          const isActive = milestone.id === expandedMilestoneId;
          const statusClasses = getStatusClasses(milestone.status);

          return (
            <CarouselItem
              key={milestone.id}
              className="pl-3 md:basis-1/2 lg:basis-1/3"
            >
              <button
                type="button"
                onClick={() => onSelectMilestone(milestone.id)}
                className={[
                  "w-full rounded-[16px] border p-4 text-left transition-all",
                  statusClasses.card,
                  isActive ? statusClasses.activeBorder : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                          statusClasses.index,
                        ].join(" ")}
                      >
                        {idx + 1}
                      </span>

                      <p
                        className={[
                          "truncate text-sm font-semibold",
                          statusClasses.title,
                        ].join(" ")}
                      >
                        {milestone.contentTitle}
                      </p>
                    </div>

                    <p
                      className={[
                        "mt-2 truncate text-xs",
                        statusClasses.meta,
                      ].join(" ")}
                    >
                      {milestone.contentQuantity || "—"}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={[
                      "rounded-full border px-3 py-1 text-xs font-medium shadow-none",
                      statusClasses.badge,
                    ].join(" ")}
                  >
                    {getStatusLabel(milestone.status)}
                  </Badge>
                </div>

                <p
                  className={[
                    "mt-8 text-right text-xs font-semibold",
                    statusClasses.day,
                  ].join(" ")}
                >
                  DAY {milestone.deliveryDays || idx + 1}
                </p>
              </button>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious className="left-[-8px] h-9 w-9" />
      <CarouselNext className="right-[-8px] h-9 w-9" />
    </Carousel>
  );
}
