"use client";

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
import Image from "next/image";

import {
  COMPLETED,
  COMPLETED_PLUS_PLUS,
  IN_REVIEW,
  PAID,
  PARTIAL_PAID,
  PaymanetMilestoneDataType,
  TODO,
} from "../[id]/consts";

interface PaymentMilestoneProps {
  paid?: number;
  total?: number;
  paymentMilestoneData: PaymanetMilestoneDataType[];
  selectedMilestone: PaymanetMilestoneDataType | null;
  onSelectMilestone: (m: PaymanetMilestoneDataType) => void;
}

function normalizeStatus(status?: string) {
  return String(status ?? "")
    .trim()
    .toLowerCase();
}

function isDeclinedStatus(status?: string) {
  return ["declined", "decline", "rejected"].includes(normalizeStatus(status));
}

function getStatusLabel(status?: string) {
  if (isDeclinedStatus(status)) return "Declined";
  if (status === TODO) return "To Do";
  return status || "To Do";
}

function getStatusStyle(status?: string) {
  const isDeclined = isDeclinedStatus(status);

  if (status === COMPLETED_PLUS_PLUS) {
    return {
      card: "border-[#7F9B54] bg-[#7F9B54]",
      activeRing: "ring-[#7F9B54] border-[#7F9B54]",
      badge: "bg-[#E8F0DB] text-[#7F9B54] hover:bg-[#E8F0DB]",
      circle: "bg-[#93AE69]",
      title: "text-white",
      meta: "text-white/90",
      amount: "text-white",
    };
  }

  if (status === COMPLETED || status === PAID || status === PARTIAL_PAID) {
    return {
      card: "border-light-green bg-linear-to-r from-Secondary to-white",
      activeRing: "ring-light-green border-light-green",
      badge: "bg-light-green text-white",
      circle: "bg-light-green",
      title: "text-Primary",
      meta: "text-gray-500",
      amount: "text-light-green",
    };
  }

  if (status === IN_REVIEW) {
    return {
      card: "border-orange-400 bg-linear-to-r from-orange/20 to-white",
      activeRing: "ring-orange border-orange-400",
      badge: "bg-orange text-white",
      circle: "bg-orange",
      title: "text-orange",
      meta: "text-gray-500",
      amount: "text-orange",
    };
  }

  if (isDeclined) {
    return {
      card: "border-red-500 bg-linear-to-r from-white to-red-500/10",
      activeRing: "ring-red-500 border-red-500",
      badge: "bg-red-500 text-white",
      circle: "bg-red-500",
      title: "text-red-500",
      meta: "text-gray-500",
      amount: "text-red-500",
    };
  }

  return {
    card: "border-gray-300 bg-linear-to-r from-white to-dark-gray/20",
    activeRing: "ring-gray-400 border-gray-400",
    badge: "bg-dark-gray text-white",
    circle: "bg-dark-gray",
    title: "text-Primary",
    meta: "text-gray-500",
    amount: "text-dark-gray",
  };
}

const PaymentMilestone: React.FC<PaymentMilestoneProps> = ({
  paid = 0,
  total = 4,
  paymentMilestoneData,
  onSelectMilestone,
  selectedMilestone,
}) => {
  const progress = total ? Math.min((paid / total) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader className="flex gap-4 items-center">
        {/* LEFT */}
        <CardTitle className="flex flex-1 items-center gap-2 text-Primary text-base font-semibold">
          <Image src={"/icons/milestone.svg"} height={24} width={24} alt="svg" />
          Campaign Milestones
        </CardTitle>
      </CardHeader>

      {/* PROGRESS */}
      <div className="px-6 pb-2">
        <div className="space-y-2">
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
      </div>

      <CardContent>
        <Carousel className="overflow-visible">
          <CarouselContent className="p-2 -ml-4 pr-24">
            {paymentMilestoneData.map((item) => {
              const style = getStatusStyle(item.status);

              return (
                <CarouselItem
                  key={item.milestoneId}
                  className="basis-full md:basis-[34%]"
                >
                  <div
                    onClick={() => onSelectMilestone(item)}
                    className={cn(
                      "space-y-2 rounded-md border p-4 cursor-pointer transition",
                      style.card,
                      selectedMilestone?.milestoneId === item.milestoneId &&
                        `ring-2 ring-offset-0 border-[1.5px] ${style.activeRing}`
                    )}
                  >
                    <div className="flex justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-white",
                            style.circle
                          )}
                        >
                          {item.id}
                        </div>

                        <h2 className={cn("text-base font-medium", style.title)}>
                          {item.title}
                        </h2>
                      </div>

                      <Badge className={cn(style.badge)}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    </div>

                    <p className={cn("text-sm", style.meta)}>
                      {item.contentRequirement.join(" + ")}
                    </p>

                    <div className={cn("flex justify-between", style.amount)}>
                      <p className="text-xl font-semibold">৳ {item.payout}</p>
                      <p className="text-sm">DAY {item.day}</p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext variant="ghost" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default PaymentMilestone;