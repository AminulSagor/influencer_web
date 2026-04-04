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
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
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

  // 👉 ADD THIS (optional handler)
  onAddMilestone?: () => void;
}

const PaymentMilestone: React.FC<PaymentMilestoneProps> = ({
  paid = 0,
  total = 4,
  paymentMilestoneData,
  onSelectMilestone,
  selectedMilestone,
  onAddMilestone,
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

        {/* RIGHT BUTTON ✅ */}
        <div>
          <Button
            onClick={onAddMilestone}
            className="bg-light-green text-white hover:bg-light-green/90"
          >
            + Add Milestone
          </Button>
        </div>
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
            {paymentMilestoneData.map((item) => (
              <CarouselItem
                key={item.milestoneId}
                className="basis-full md:basis-[34%]"
              >
                <div
                  onClick={() => onSelectMilestone(item)}
                  className={cn(
                    "border p-4 rounded-md space-y-2 cursor-pointer transition",
                    selectedMilestone?.milestoneId === item.milestoneId &&
                    "ring-2 ring-light-green",
                    item.status === TODO &&
                    "border-gray-200 bg-linear-to-r from-white to-light-gray",
                    (item.status === PAID ||
                      item.status === PARTIAL_PAID) &&
                    "border-light-green bg-linear-to-r from-Secondary to-white",
                    item.status === IN_REVIEW &&
                    "border-orange-400 bg-linear-to-r from-orange/20 to-white"
                  )}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-white",
                          item.status === TODO && "bg-dark-gray",
                          item.status === IN_REVIEW && "bg-orange",
                          (item.status === PAID ||
                            item.status === PARTIAL_PAID) &&
                          "bg-light-green"
                        )}
                      >
                        {item.id}
                      </div>

                      <h2 className="text-base font-medium text-Primary">
                        {item.title}
                      </h2>
                    </div>

                    <Badge
                      className={cn(
                        item.status === TODO && "bg-dark-gray",
                        item.status === IN_REVIEW && "bg-orange",
                        (item.status === PAID ||
                          item.status === PARTIAL_PAID) &&
                        "bg-light-green"
                      )}
                    >
                      {item.status === TODO ? "To Do" : item.status}
                      <ChevronRight />
                    </Badge>
                  </div>

                  <p className="text-gray-500 text-sm">
                    {item.contentRequirement.join(" + ")}
                  </p>

                  <div className="flex justify-between text-light-green">
                    <p className="text-xl font-semibold">৳ {item.payout}</p>
                    <p className="text-sm">DAY {item.day}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext variant="ghost" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default PaymentMilestone;