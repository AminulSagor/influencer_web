"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { FaClock } from "react-icons/fa6";
import SubmissionForm from "./submission-form";
import {
  IN_REVIEW,
  PAID,
  PaymanetMilestoneDataType,
  TODO,
} from "../[id]/consts";
import { cn } from "@/lib/utils";
import SubmissionHistory from "./submission-history";

interface MileStoneCardProps {
  milestone: PaymanetMilestoneDataType | null;
}

const MileStoneCard = ({ milestone }: MileStoneCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <Image
                src={"/icons/milestone.svg"}
                height={24}
                width={24}
                alt="svg"
              />
            </div>
            <div>
              <p className="text-Primary">Milestone {milestone?.id}</p>
              <h2 className="text-Primary text-xl font-semibold">
                {milestone?.title}
              </h2>
            </div>
          </div>
          <div className="flex gap-6 items-center flex-1">
            <p className="text-sm font-semibold text-Primary">
              Pertial Payment <br /> Progress
            </p>
            <div className=" flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">৳0</p>
                <p className="text-sm font-semibold text-Primary">৳3000</p>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-light-green/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-light-green rounded-full transition-all duration-300"
                  style={{ width: `${10}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="border border-light-green rounded-lg p-4 bg-linear-to-r bg-Secondary to-white">
          <div className="flex  justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Content Requirement
              </h2>
              <ul className="list-disc text-Primary ml-5 text-sm">
                <li>{milestone?.contentRequirement.map((item) => item)}</li>
              </ul>
              <div className="space-y-1">
                <h2 className="text-xl font-medium text-Primary">
                  Promotion Goal
                </h2>

                <p className="text-Primary  text-sm">
                  {milestone?.promotionalGoal}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {" "}
              <h2 className="text-xl font-medium text-Primary">
                Promotion Target
              </h2>
              <p className="text-sm text-Primary">Facebook Reach</p>
              <p className="text-2xl font-bold text-Primary">
                {milestone?.promotionTarget}
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Payout On Approval
              </h2>
              <p className="text-2xl font-bold text-light-green">
                ৳{milestone?.payout}
              </p>
            </div>

            <div
              className={cn(
                "border p-2 w-[200px] bg-linear-to-r  rounded-lg  flex flex-col items-center justify-center gap-2",
                milestone?.status === TODO &&
                  "from-off-white to-white border-gray-300",
                milestone?.status === IN_REVIEW &&
                  "from-white to-orange/20 border-orange-400",
                milestone?.status === PAID &&
                  "from-Secondary to-white border-light-green"
              )}
            >
              <p
                className={cn(
                  milestone?.status === TODO && "text-dark-gray",
                  milestone?.status === IN_REVIEW && "text-orange",
                  milestone?.status === PAID && "text-light-green"
                )}
              >
                Status
              </p>
              <Badge
                className={cn(
                  "px-10 py-1 text-lg",
                  milestone?.status === TODO && "bg-dark-gray ",
                  milestone?.status === IN_REVIEW && "bg-orange",
                  milestone?.status === PAID && "bg-light-green"
                )}
              >
                {milestone?.status}
              </Badge>
              <div
                className={cn(
                  "flex items-center gap-1",
                  milestone?.status === TODO && "text-gray-400",
                  milestone?.status === IN_REVIEW && "text-orange",
                  milestone?.status === PAID && "text-light-green"
                )}
              >
                <span>
                  <FaClock size={12} />
                </span>
                <span className="text-xs ">12 Dec, 2024</span>
              </div>
            </div>
          </div>
        </div>
        {milestone?.status === TODO && <SubmissionForm />}

        {(milestone?.status === PAID || milestone?.status === IN_REVIEW) && (
          <SubmissionHistory />
        )}
      </CardContent>
    </Card>
  );
};

export default MileStoneCard;
