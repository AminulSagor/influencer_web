"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Image from "next/image";
import { FaClock } from "react-icons/fa6";

import SubmissionForm from "./submission-form";

const MileStoneCard = () => {
  const todo = true;
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
              <p className="text-Primary">Milestone 1</p>
              <h2 className="text-Primary text-xl font-semibold">
                Initial Brand Awarness
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
                <li>2 instagram Posts + 3 Stories</li>
              </ul>
              <div className="space-y-1">
                <h2 className="text-xl font-medium text-Primary">
                  Promotion Goal
                </h2>

                <p className="text-Primary  text-sm">
                  Gain page like as much as possible
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {" "}
              <h2 className="text-xl font-medium text-Primary">
                Promotion Target
              </h2>
              <p className="text-sm text-Primary">Facebook Reach</p>
              <p className="text-2xl font-bold text-Primary">300k</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-Primary">
                Payout On Approval
              </h2>
              <p className="text-2xl font-bold text-light-green">৳3,000</p>
            </div>
            <div className="border p-2 w-[200px] bg-linear-to-r from-off-white to-white rounded-lg border-gray-300 flex flex-col items-center justify-center gap-2">
              <p className="text-dark-gray">Status</p>
              <Badge className="bg-dark-gray px-10 py-1 text-lg">To Do</Badge>
              <div className="flex items-center gap-1">
                <span>
                  <FaClock size={12} className="fill-gray-400" />
                </span>
                <span className="text-xs text-gray-400">12 Dec, 2024</span>
              </div>
            </div>
          </div>
        </div>
        {todo && <SubmissionForm />}
      </CardContent>
    </Card>
  );
};

export default MileStoneCard;
