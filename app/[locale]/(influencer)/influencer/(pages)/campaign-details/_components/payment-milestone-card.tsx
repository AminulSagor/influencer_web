import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

import { MilestoneListItem, MilestoneStatus } from "@/types/influencer/milestone_types";

interface PaymentMilestoneProps {
  paid?: number;
  total?: number;
  milestones: MilestoneListItem[];
  selectedMilestone: MilestoneListItem | null;
  onSelectMilestone: (m: MilestoneListItem) => void;
}

const statusStyles: Record<
  MilestoneStatus,
  {
    border: string;
    bg: string;
    text: string;
    badge: string;
    circle: string;
    activeRing: string;
  }
> = {
  todo: {
    border: "border-gray-200",
    bg: "bg-linear-to-r from-white to-light-gray",
    text: "text-dark-gray",
    badge: "bg-dark-gray",
    circle: "bg-dark-gray",
    activeRing: "ring-light-green",
  },
  in_review: {
    border: "border-orange-400",
    bg: "bg-linear-to-r from-orange/20 to-white",
    text: "text-orange",
    badge: "bg-orange",
    circle: "bg-orange",
    activeRing: "ring-orange",
  },
  approved: {
    border: "border-light-green",
    bg: "bg-linear-to-r from-Secondary to-white",
    text: "text-light-green",
    badge: "bg-light-green",
    circle: "bg-light-green",
    activeRing: "ring-light-green",
  },
  completed: {
    border: "border-light-green",
    bg: "bg-linear-to-r from-Secondary to-white",
    text: "text-light-green",
    badge: "bg-light-green",
    circle: "bg-light-green",
    activeRing: "ring-light-green",
  },
  completed_plus_plus: {
    border: "border-[#7F9B54]",
    bg: "bg-[#7F9B54]",
    text: "text-white",
    badge: "bg-[#E8F0DB] text-[#7F9B54] hover:bg-[#E8F0DB]",
    circle: "bg-[#93AE69]",
    activeRing: "ring-[#7F9B54]",
  },
  paid: {
    border: "border-light-green",
    bg: "bg-linear-to-r from-Secondary to-white",
    text: "text-light-green",
    badge: "bg-light-green",
    circle: "bg-light-green",
    activeRing: "ring-light-green",
  },
  partial_paid: {
    border: "border-light-green",
    bg: "bg-linear-to-r from-Secondary to-white",
    text: "text-light-green",
    badge: "bg-light-green",
    circle: "bg-light-green",
    activeRing: "ring-light-green",
  },
  declined: {
    border: "border-red-500",
    bg: "bg-linear-to-r from-white to-red-500/10",
    text: "text-red-500",
    badge: "bg-red-500 text-white",
    circle: "bg-red-500",
    activeRing: "ring-red-500",
  },
};

const statusLabel: Record<MilestoneStatus, string> = {
  todo: "To Do",
  in_review: "In Review",
  approved: "Approved",
  completed: "Completed",
  completed_plus_plus: "Completed++",
  paid: "Paid",
  partial_paid: "Partial Paid",
  declined: "Declined",
};

function resolveMilestoneStatus(item: MilestoneListItem): MilestoneStatus {
  const normalizedStatus = String(item.status ?? "").trim().toLowerCase();
  const completedStatuses = ["complete", "completed", "approved", "accepted", "completed_plus_plus"];

  if (item.isMetrixOverflowed && completedStatuses.includes(normalizedStatus)) {
    return "completed_plus_plus";
  }

  if (normalizedStatus === "completed_plus_plus") return "completed_plus_plus";
  if (normalizedStatus === "complete" || normalizedStatus === "completed" || normalizedStatus === "accepted") {
    return "completed";
  }
  if (normalizedStatus === "in-review") return "in_review";
  if (normalizedStatus === "partial-paid") return "partial_paid";
  if (normalizedStatus === "decline" || normalizedStatus === "rejected") return "declined";

  return (normalizedStatus as MilestoneStatus) || "todo";
}

const PaymentMilestone: React.FC<PaymentMilestoneProps> = ({
  paid = 0,
  total = 4,
  milestones,
  onSelectMilestone,
  selectedMilestone,
}) => {
  const progress = total ? Math.min((paid / total) * 100, 100) : 0;
  return (
    <Card>
      <CardHeader className="flex  gap-4">
        <CardTitle className="flex flex-1 items-center gap-2 text-Primary text-base font-semibold">
          <div>
            <Image
              src={"/icons/milestone.svg"}
              height={24}
              width={24}
              alt="svg"
            />
          </div>
          Payment Milestone
        </CardTitle>

        <div className=" flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Progress</p>
            <p className="text-sm font-semibold text-Primary">
              {paid} of {total} Paid
            </p>
          </div>

          <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-light-green rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div></div>
        <Carousel className="overflow-visible">
          <CarouselContent className="p-2">
            {milestones.map((item) => {
              const resolvedStatus = resolveMilestoneStatus(item);
              const style = statusStyles[resolvedStatus] || statusStyles.todo;
              return (
                <CarouselItem key={item.id} className="basis-full lg:basis-[44%] xl:basis-[28%]">
                  <div
                    onClick={() => onSelectMilestone(item)}
                    className={cn(
                      "border p-4 rounded-md space-y-2 cursor-pointer transition",
                      selectedMilestone?.id === item.id &&
                        `ring-2 ring-offset-0 ${style.activeRing}`,
                      style.border,
                      style.bg
                    )}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs",
                            style.circle
                          )}
                        >
                          {item.order}
                        </div>
                        <h2
                          className={cn(
                            "text-base font-medium",
                            style.text
                          )}
                        >
                          {item.title}
                        </h2>
                      </div>
                      <div>
                        <Badge className={cn(style.badge)}>
                          {statusLabel[resolvedStatus] || resolvedStatus} <ChevronRight />
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm">
                      {item.contentQuantity}
                    </p>

                    <div
                      className={cn(
                        "flex items-center justify-between",
                        style.text
                      )}
                    >
                      <p className="text-xl font-semibold">৳ {item.amount}</p>
                      <p className="text-sm">DAY {item.deliveryDays}</p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext variant={"ghost"} />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default PaymentMilestone;
