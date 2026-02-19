"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronRight } from "lucide-react";

import type {
  CampaignStatusType,
  InfluencerUI,
  CampaignMilestoneApi,
} from "@/types/admin/campaign/campaign-details_type";

/** -------------------- local status theme (optional) -------------------- **/
const TODO = "To Do";
const PAID = "Paid";
const PARTIAL_PAID = "Partial Paid";
const DECLINED = "Declined";
const IN_REVIEW = "In Review";
const COMPLETED = "Completed";

type MilestoneStatus =
  | typeof TODO
  | typeof IN_REVIEW
  | typeof DECLINED
  | typeof PAID
  | typeof COMPLETED
  | typeof PARTIAL_PAID;

const milestoneStatusStyles: Record<
  MilestoneStatus,
  {
    card: string;
    circle: string;
    title: string;
    badge: string;
    amount: string;
    ring: string;
  }
> = {
  [TODO]: {
    card: "border-gray-200 bg-linear-to-r from-white to-light-gray",
    circle: "bg-dark-gray",
    title: "text-dark-gray",
    badge: "bg-dark-gray",
    amount: "text-gray-600",
    ring: "ring-gray-300",
  },
  [IN_REVIEW]: {
    card: "border-orange-400 bg-linear-to-r from-orange/20 to-white",
    circle: "bg-orange",
    title: "text-orange",
    badge: "bg-orange",
    amount: "text-orange",
    ring: "ring-orange",
  },
  [DECLINED]: {
    card: "border-red-400 bg-linear-to-r from-red-200 to-white",
    circle: "bg-red-600",
    title: "text-red-600",
    badge: "bg-red-600",
    amount: "text-red-600",
    ring: "ring-red-600",
  },
  [PAID]: {
    card: "border-light-green bg-linear-to-r from-Secondary to-white",
    circle: "bg-light-green",
    title: "text-Primary",
    badge: "bg-light-green",
    amount: "text-light-green",
    ring: "ring-light-green",
  },
  [COMPLETED]: {
    card: "border-light-green bg-linear-to-r from-Secondary to-white",
    circle: "bg-light-green",
    title: "text-Primary",
    badge: "bg-light-green",
    amount: "text-light-green",
    ring: "ring-light-green",
  },
  [PARTIAL_PAID]: {
    card: "border-light-green bg-linear-to-r from-Secondary to-white",
    circle: "bg-light-green",
    title: "text-Primary",
    badge: "bg-light-green",
    amount: "text-light-green",
    ring: "ring-light-green",
  },
};

interface Props {
  campaignStatus: CampaignStatusType;
  influencers: InfluencerUI[];

  /** API milestones */
  milestones: CampaignMilestoneApi[];

  /** selection controlled by container */
  activeMilestoneId: string | null;
  onSelectMilestone: (id: string) => void;
}

export default function CampaignMilestone({
  campaignStatus,
  influencers,
  milestones,
  activeMilestoneId,
  onSelectMilestone,
}: Props) {
  const [disabled, setDisabled] = useState(true);

  // ✅ invitationStatus removed
  const isActive = campaignStatus === "active";

  const normalizedMilestones = useMemo(() => {
    return (milestones ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [milestones]);

  // ✅ Ensure SelectItem never receives empty string value
  const selectInfluencers = useMemo(() => {
    return (influencers ?? [])
      .map((inf, idx) => {
        const name = String((inf as any)?.name ?? "").trim();
        const id = String((inf as any)?.id ?? "").trim();

        const value = id || name;

        return {
          _key: `${value || "inf"}-${idx}`,
          value: value,
          label: name || value || `Influencer ${idx + 1}`,
        };
      })
      .filter((x) => String(x.value ?? "").trim().length > 0);
  }, [influencers]);

  return (
    <Card>
      <CardHeader className="flex gap-4">
        <CardTitle className="flex flex-1 items-center gap-2 text-Primary text-base font-semibold">
          <div>
            <Image src={"/icons/milestone.svg"} height={24} width={24} alt="svg" />
          </div>
          Campaign Milestone
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* ✅ Show this top bar whenever campaign is active (no invitationStatus) */}
        {isActive && (
          <div className="px-2">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-2">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Influencer" />
                  </SelectTrigger>

                  <SelectContent>
                    {selectInfluencers.map((inf) => (
                      <SelectItem key={inf._key} value={inf.value}>
                        {inf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <h2 className="text-Primary text-lg font-semibold">Offered Amount</h2>
                <p className="text-Primary text-lg font-medium">৳ 30,000</p>
              </div>

              <div className="flex-1 text-orange">
                <h2 className=" text-lg">Remaining amount to distribute</h2>
                <p className=" text-lg font-medium">৳ 0</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <h2 className="text-Primary text-lg font-semibold">Invitation remains: 03</h2>
                <Button variant={"PrimaryGradient"} size={"lg"}>
                  Send Invitation
                </Button>
              </div>
            </div>

            {/* milestone amounts */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-Primary font-semibold">Milestone amounts</h2>
                <Button
                  onClick={() => setDisabled(false)}
                  className="text-white bg-orange"
                  size={"sm"}
                >
                  Edit
                </Button>
              </div>

              <Card>
                <div className="px-4 py-4">
                  <div className="grid grid-cols-12 gap-4">
                    {normalizedMilestones.map((m, idx) => {
                      const key = `${String(m?.id ?? "").trim() || "milestone"}-${idx}`;
                      return (
                        <div key={key} className="col-span-3 space-y-2">
                          <Label>Milestone {idx + 1}</Label>

                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              ৳
                            </span>

                            <Input
                              disabled={disabled}
                              type="number"
                              value={Number(m.amount ?? 0)}
                              className="pl-8 text-right"
                              readOnly
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ------------------------ MILESTONE CARDS ------------------------ */}
        <Carousel className="overflow-visible">
          <CarouselContent className="p-2 mr-1 -ml-4 pr-24">
            {normalizedMilestones.map((m, index) => {
              const uiStatus = (m.status ?? TODO) as MilestoneStatus;
              const styles = milestoneStatusStyles[uiStatus] ?? milestoneStatusStyles[TODO];

              const id = String(m?.id ?? "").trim();
              const safeId = id || `milestone-${index}`;
              const isSelected = activeMilestoneId === safeId;

              return (
                <CarouselItem key={safeId} className="basis-full md:basis-[34%]">
                  <div
                    onClick={() => {
                      if (campaignStatus !== "needs-quote") onSelectMilestone(safeId);
                    }}
                    className={cn(
                      "border border-light-green p-4 rounded-md space-y-2 cursor-pointer transition",
                      // keep your accepted-style theme applied whenever active (optional)
                      isActive && styles.card,
                      isSelected &&
                        cn(
                          "ring-2 ring-offset-1 ring-light-green",
                          isActive && styles.ring
                        )
                    )}
                  >
                    {/* HEADER */}
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white bg-light-green",
                            isActive && styles.circle
                          )}
                        >
                          {index + 1}
                        </div>

                        <h2
                          className={cn(
                            "text-base font-medium text-light-green",
                            isActive && styles.title
                          )}
                        >
                          {m.contentTitle}
                        </h2>
                      </div>

                      {isActive && (
                        <Badge className={styles.badge}>
                          {uiStatus} <ChevronRight />
                        </Badge>
                      )}
                    </div>

                    {/* CONTENT REQUIREMENTS */}
                    <p className="text-gray-500 text-sm">{m.contentQuantity}</p>

                    {/* FOOTER */}
                    <div className={cn("flex items-center justify-between", isActive && styles.amount)}>
                      {isActive && (
                        <p className={cn("text-xl font-semibold text-light-green", isActive && styles.amount)}>
                          ৳ {Number(m.amount ?? 0)}
                        </p>
                      )}

                      <p className={cn("text-sm text-light-green", isActive && styles.amount)}>
                        DAY {m.deliveryDays ?? 0}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious variant={"ghost"} />
          <CarouselNext variant={"ghost"} />
        </Carousel>
      </CardContent>
    </Card>
  );
}
