"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Clock3, BadgeCheck } from "lucide-react";

type Status = "done" | "review" | "rejected" | "pending";
type Role = "client" | "agency" | "admin" | "influencer";

type TimelineEntry = {
  status: Status;
  title: string;
  sub: string;
};

export default function VerificationProgressCard({
  role,
}: {
  role?: Role;
}) {
  const timelineItems: TimelineEntry[] = [
    {
      status: "done",
      title: "Basic Informations",
      sub: "That's How We Are Going To Reach You",
    },
    {
      status: "done",
      title: "Social Portfolio",
      sub: "I Added You Can Always Add More",
    },
    {
      status: "review",
      title: "NID",
      sub: "In Review",
    },

    ...(role !== "influencer"
      ? [
        {
          status: "rejected" as Status,
          title: "Trade License",
          sub: "Declined, documents details don't match with the provided information",
        },
        {
          status: "pending" as Status,
          title: "TIN",
          sub: "Pending",
        },
        {
          status: "pending" as Status,
          title: "BIN",
          sub: "Pending",
        },
      ]
      : []),

    ...(role === "agency" || role === "influencer"
      ? [
        {
          status: role === "influencer" ? ("rejected" as Status) : ("pending" as Status),
          title: "Payment Setup",
          sub:
            role === "influencer"
              ? "Declined, documents details doesn't match"
              : "Pending",
        },
      ]
      : []),

    {
      status: "pending",
      title: "Verify Email",
      sub: "Pending",
    },
  ];

  return (
    <Card className="py-0 relative bg-white">
      <CardContent className="py-5 px-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="py-0 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full bg-light-green/15 grid place-items-center">
                    <BadgeCheck className="w-5 h-5 text-light-green stroke-[2.5]" />
                  </span>
                  <h1 className="font-semibold text-lg text-Primary">
                    Verification Progress
                  </h1>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-4 pb-2">
              <div className="h-3 rounded-full bg-light-green/15 overflow-hidden">
                <div className="h-full w-[38%] bg-light-green rounded-full" />
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gray-200 z-0" />

                  <div className="relative space-y-7 z-10">
                    {timelineItems.map((item, index) => (
                      <TimelineItem
                        key={`${item.title}-${index}`}
                        status={item.status}
                        title={item.title}
                        sub={item.sub}
                        isFirst={index === 0}
                        isLast={index === timelineItems.length - 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function TimelineItem({
  status,
  title,
  sub,
  isFirst = false,
  isLast = false,
}: {
  status: Status;
  title: string;
  sub: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const icon =
    status === "done" ? (
      <Check className="w-5 h-5 text-white stroke-[2.5]" />
    ) : status === "review" ? (
      <Clock3 className="w-5 h-5 text-[#B77900] stroke-[2.5]" />
    ) : status === "rejected" ? (
      <X className="w-5 h-5 text-[#E74C3C] stroke-[2.5]" />
    ) : (
      <Clock3 className="w-5 h-5 text-gray-400 stroke-[2.5]" />
    );

  const bubble =
    status === "done"
      ? "bg-light-green"
      : status === "review"
        ? "bg-[#FFF3C9]"
        : status === "rejected"
          ? "bg-[#F8B9B9]"
          : "bg-gray-200";

  const getLineColor = () => {
    if (status === "done") return "bg-light-green";
    if (status === "review") return "bg-[#FFF3C9]";
    if (status === "rejected") return "bg-[#F8B9B9]";
    return "bg-gray-200";
  };

  return (
    <div className="flex items-start gap-4 relative">
      <div className="relative flex flex-col items-center">
        <div
          className={`h-12 w-12 rounded-full grid place-items-center relative z-10 ${bubble} border-2 border-white`}
        >
          {icon}
        </div>

        {!isFirst && (
          <div
            className={`absolute w-[2px] top-[-28px] h-7 ${getLineColor()}`}
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}

        {!isLast && (
          <div
            className={`absolute w-[2px] bottom-[-28px] h-7 ${status === "done" ? "bg-light-green" : "bg-gray-200"
              }`}
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        )}
      </div>

      <div className="pt-3">
        <p className="text-[15px] font-semibold text-Primary">{title}</p>
        <p className="text-xs text-Primary/50 leading-snug mt-0.5">{sub}</p>
      </div>
    </div>
  );
}