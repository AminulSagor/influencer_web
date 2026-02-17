"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  campaignMilestoneData,
  CampaignMilestoneDataType,
  COMPLETED,
  DECLINED,
  IN_REVIEW,
  PAID,
  TODO,
} from "./campaign-milestone-data";
import {
  CampaignStatusType,
  Influencer,
  InvitationStatusType,
} from "../../[id]/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ProgressBar from "./progress-bar";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  invitationStatus: InvitationStatusType;
  campaignStatus: CampaignStatusType;
  influencers: Influencer[];
}

type MilestoneStatus =
  | typeof TODO
  | typeof IN_REVIEW
  | typeof DECLINED
  | typeof PAID
  | typeof COMPLETED;

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
};

const CampaignMilestone = ({
  invitationStatus,
  campaignStatus,
  influencers,
}: Props) => {
  const [disabled, setDisabled] = useState(true);

  const [selectedCampaignMilestone, setSelectedCampaignMilestone] =
    useState<CampaignMilestoneDataType | null>(null);

  const isActiveAccepted =
    campaignStatus === "active" && invitationStatus === "accepted";
  const isActiveSent =
    campaignStatus === "active" && invitationStatus === "sent";

  return (
    <Card>
      <CardHeader className="flex  gap-4">
        {/* Title */}
        <CardTitle className="flex flex-1 items-center gap-2 text-Primary text-base font-semibold">
          <div>
            <Image
              src={"/icons/milestone.svg"}
              height={24}
              width={24}
              alt="svg"
            />
          </div>
          Campaign Milestone
        </CardTitle>

        {/* Progress section */}
        {campaignStatus === "needs-quote" && (
          <div className=" flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">Progress</p>
              <p className="text-sm font-semibold text-Primary">1 of 4 Paid</p>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-light-green rounded-full transition-all duration-300"
                style={{ width: `${70}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isActiveSent && (
          <div className="px-2">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-2">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Influencer" />
                  </SelectTrigger>
                  <SelectContent>
                    {influencers.map((influencer) => (
                      <SelectItem key={influencer.name} value={influencer.name}>
                        {influencer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <h2 className="text-Primary text-lg font-semibold">
                  Offered Amout
                </h2>
                <p className="text-Primary text-lg font-medium">৳ 30,000</p>
              </div>
              <div className="flex-1 text-orange">
                <h2 className=" text-lg">Remaining amount to distribute</h2>
                <p className=" text-lg font-medium">৳ 0</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <h2 className="text-Primary text-lg font-semibold">
                  Invitation remains: 03
                </h2>
                <Button variant={"PrimaryGradient"} size={"lg"}>
                  Send Invitation
                </Button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-Primary font-semibold">
                  Milestone amounts
                </h2>
                <Button
                  onClick={() => setDisabled(false)}
                  className="text-white bg-orange"
                  size={"sm"}
                >
                  Edit
                </Button>
              </div>
              <Card>
                <div className="px-4">
                  <div className="grid grid-cols-12 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="col-span-3 space-y-2">
                        <Label>Milestone {item}</Label>

                        <div className="relative">
                          {/* Currency Symbol */}
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            ৳
                          </span>

                          <Input
                            disabled={disabled}
                            type="number"
                            placeholder="7500"
                            className="pl-8 text-right"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {isActiveAccepted && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between px-2">
              <div className="flex-1">
                <h2>Overall Progress</h2>
                <p className="text-orange font-semibold text-lg">
                  46% Completed
                </p>
              </div>
              <div className="flex-1">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Influencer" />
                  </SelectTrigger>
                  <SelectContent>
                    {influencers.map((influencer) => (
                      <SelectItem key={influencer.name} value={influencer.name}>
                        {influencer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ProgressBar
              maxPaid={4}
              minPaid={1}
              progressPercent={20}
              title="Progress"
            />
          </div>
        )}

        <Carousel className="overflow-visible">
          <CarouselContent className="p-2 mr-1 -ml-4 pr-24">
            {campaignMilestoneData.map((item) => {
              const styles =
                milestoneStatusStyles[item.status as MilestoneStatus];
              return (
                <CarouselItem
                  key={item.id}
                  className="basis-full md:basis-[34%]"
                >
                  <div
                    onClick={() => {
                      if (campaignStatus !== "needs-quote") {
                        setSelectedCampaignMilestone(item);
                      }
                    }}
                    className={cn(
                      "border border-light-green p-4 rounded-md space-y-2 cursor-pointer transition",
                      isActiveAccepted && styles?.card,
                      selectedCampaignMilestone?.id === item.id &&
                        cn(
                          "ring-2 ring-offset-1 ring-light-green",
                          isActiveAccepted && styles?.ring
                        )
                    )}
                  >
                    {/* HEADER */}
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white bg-light-green",
                            isActiveAccepted && styles?.circle
                          )}
                        >
                          {item.id}
                        </div>

                        <h2
                          className={cn(
                            "text-base font-medium text-light-green",
                            isActiveAccepted && styles?.title
                          )}
                        >
                          {item.title}
                        </h2>
                      </div>

                      {item.status && isActiveAccepted && (
                        <Badge className={styles?.badge}>
                          {item.status} <ChevronRight />
                        </Badge>
                      )}
                    </div>

                    {/* CONTENT REQUIREMENTS */}
                    <p className="text-gray-500 text-sm">
                      {item.contentRequirement.map((i, index) => (
                        <span key={i}>
                          {i}
                          {index !== item.contentRequirement.length - 1 &&
                            " + "}
                        </span>
                      ))}
                    </p>

                    {/* FOOTER */}
                    <div
                      className={cn(
                        "flex items-center justify-between",
                        isActiveAccepted && styles?.amount
                      )}
                    >
                      {(isActiveAccepted || isActiveSent) && (
                        <p
                          className={cn(
                            "text-xl font-semibold text-light-green",
                            isActiveAccepted && styles?.amount
                          )}
                        >
                          ৳ 7500
                        </p>
                      )}
                      {campaignStatus === "needs-quote" && (
                        <p className="text-xl font-semibold text-gray-600"></p>
                      )}
                      <p
                        className={cn(
                          "text-sm text-light-green",
                          isActiveAccepted && styles?.amount
                        )}
                      >
                        DAY {item.day}
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
};

export default CampaignMilestone;
