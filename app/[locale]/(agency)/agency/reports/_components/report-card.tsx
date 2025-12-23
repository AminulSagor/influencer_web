"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { FaFlag, FaClock } from "react-icons/fa";
import { RiUser2Fill } from "react-icons/ri";
import { FiClock, FiCheckCircle, FiSearch } from "react-icons/fi";

type ReportStatus = "Flagged" | "Pending" | "Resolved";
const STATUS_CONFIG: Record<
  ReportStatus,
  {
    Icon: React.ElementType;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    cardBg: string;
    cardBorder: string;
  }
> = {
  Flagged: {
    Icon: FaFlag,
    badgeBg: "bg-rose-600",
    badgeBorder: "border-rose-600",
    badgeText: "text-white",
    cardBg: "bg-rose-100",
    cardBorder: "border-rose-300",
  },
  Pending: {
    Icon: FiClock,
    badgeBg: "bg-yellow-500",
    badgeBorder: "border-yellow-500",
    badgeText: "text-white",
    cardBg: "bg-yellow-100/40",
    cardBorder: "border-yellow-300",
  },
  Resolved: {
    Icon: FiCheckCircle,
    badgeBg: "bg-green-600",
    badgeBorder: "border-green-600",
    badgeText: "text-white",
    cardBg: "bg-green-100",
    cardBorder: "border-green-300",
  },
};

const reportsData = [
  { id: 1, tag: "Flagged", count: 3 },
  { id: 2, tag: "Pending", count: 20 },
  { id: 3, tag: "Resolved", count: 10 },
];

interface ReportItem {
  id: number;
  status: ReportStatus;
  campaign: string;
  milestone: string;
  time: string;
  description: string;
  company: string;
  date: string;
}

const reportItems: ReportItem[] = [
  {
    id: 1,
    status: "Flagged",
    campaign: "Summer Fashion Campaign",
    milestone: "Milestone 1",
    time: "2 hours ago",
    description: "Audio Quality does not meet requirements...",
    company: "StyleCo.",
    date: "Dec 15, 2025",
  },
  {
    id: 2,
    status: "Pending",
    campaign: "Winter Fest",
    milestone: "Milestone 2",
    time: "Yesterday",
    description: "Pending review for visual content",
    company: "StyleCo.",
    date: "Dec 10, 2025",
  },
  {
    id: 3,
    status: "Resolved",
    campaign: "Spring Launch",
    milestone: "Milestone 3",
    time: "Last week",
    description: "Issue resolved successfully",
    company: "StyleCo.",
    date: "Dec 1, 2025",
  },

  // ➕ New items
  {
    id: 4,
    status: "Flagged",
    campaign: "Autumn Collection",
    milestone: "Milestone 1",
    time: "3 hours ago",
    description: "Video resolution is below required standard",
    company: "UrbanWear",
    date: "Dec 16, 2025",
  },
  {
    id: 5,
    status: "Pending",
    campaign: "Black Friday Deals",
    milestone: "Milestone 2",
    time: "5 hours ago",
    description: "Awaiting brand approval",
    company: "DealMart",
    date: "Dec 16, 2025",
  },
  {
    id: 6,
    status: "Resolved",
    campaign: "New Year Blast",
    milestone: "Milestone 1",
    time: "2 days ago",
    description: "Copyright issue resolved",
    company: "PromoHub",
    date: "Dec 14, 2025",
  },
  {
    id: 7,
    status: "Flagged",
    campaign: "Fitness Gear Launch",
    milestone: "Milestone 3",
    time: "1 day ago",
    description: "Incorrect product placement detected",
    company: "FitPro",
    date: "Dec 14, 2025",
  },
  {
    id: 8,
    status: "Pending",
    campaign: "Tech Gadget Review",
    milestone: "Milestone 1",
    time: "2 days ago",
    description: "Waiting for technical validation",
    company: "TechZone",
    date: "Dec 13, 2025",
  },
  {
    id: 9,
    status: "Resolved",
    campaign: "Beauty Essentials",
    milestone: "Milestone 2",
    time: "3 days ago",
    description: "Content updated as requested",
    company: "GlowUp",
    date: "Dec 12, 2025",
  },
  {
    id: 10,
    status: "Flagged",
    campaign: "Travel Vlog Series",
    milestone: "Milestone 1",
    time: "4 days ago",
    description: "Missing brand mention in video",
    company: "Travelio",
    date: "Dec 11, 2025",
  },
  {
    id: 11,
    status: "Pending",
    campaign: "Gaming Marathon",
    milestone: "Milestone 2",
    time: "5 days ago",
    description: "Review in progress",
    company: "GameX",
    date: "Dec 10, 2025",
  },
  {
    id: 12,
    status: "Resolved",
    campaign: "Eco Products Promo",
    milestone: "Milestone 1",
    time: "6 days ago",
    description: "All compliance checks passed",
    company: "GreenLife",
    date: "Dec 9, 2025",
  },
  {
    id: 13,
    status: "Flagged",
    campaign: "Luxury Watches",
    milestone: "Milestone 2",
    time: "1 week ago",
    description: "Brand logo not visible clearly",
    company: "TimeLux",
    date: "Dec 8, 2025",
  },
  {
    id: 14,
    status: "Resolved",
    campaign: "Food Festival",
    milestone: "Milestone 3",
    time: "1 week ago",
    description: "Issue fixed and approved",
    company: "Foodies",
    date: "Dec 7, 2025",
  },
];

const ReportCard = () => {
  const [activeFilter, setActiveFilter] = useState<ReportStatus | null>(null);

  // Filter reports by activeFilter
  const filteredReports = activeFilter
    ? reportItems.filter((item) => item.status === activeFilter)
    : reportItems;
  return (
    <Card>
      <CardHeader className="border-b space-y-4">
        <div className="space-y-2">
          <CardTitle>Report Log</CardTitle>
          <CardDescription>
            View reports on your works, manage and resolve them
          </CardDescription>
        </div>

        <div className="flex justify-between gap-4">
          {reportsData.map((report) => {
            const isActive = report.tag === activeFilter;
            return (
              <div
                key={report.id}
                onClick={() => setActiveFilter(report.tag as ReportStatus)}
                className={cn(
                  "cursor-pointer border flex-1 rounded-lg p-2 space-y-4 select-none transition-colors duration-200",

                  report.tag === "Flagged" &&
                    "bg-rose-100 border-rose-300 text-rose-600",
                  report.tag === "Pending" &&
                    "bg-yellow-100 border-yellow-300 text-yellow-600",
                  report.tag === "Resolved" &&
                    "bg-green-100 border-green-300 text-green-600",
                  isActive &&
                    cn(
                      "ring-2 ring-offset-1",
                      report.tag === "Flagged" &&
                        "ring-rose-400 bg-rose-500 text-white",
                      report.tag === "Pending" &&
                        "ring-yellow-400 bg-yellow-600/80 text-white",
                      report.tag === "Resolved" &&
                        "ring-green-400 bg-green-600 text-white"
                    )
                )}
              >
                <h2 className="text-xl">{report.tag}</h2>
                <p className="text-2xl font-medium">{report.count}</p>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="w-[40%] relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input className="pl-10" placeholder="Search By Campaign Name" />
          </div>

          {filteredReports.length === 0 && (
            <p className="text-center text-gray-500">No reports found</p>
          )}

          <div className="space-y-4">
            {filteredReports.map((item) => {
              const {
                Icon,
                badgeBg,
                badgeBorder,
                badgeText,
                cardBg,
                cardBorder,
              } = STATUS_CONFIG[item.status];

              return (
                <div
                  key={item.id}
                  className={cn(
                    "border p-2 rounded-lg space-y-2",
                    cardBg,
                    cardBorder
                  )}
                >
                  <div>
                    <h2 className="text-Primary text-lg font-semibold">
                      {item.campaign}
                    </h2>
                    <p className="text-light-green text-sm font-medium">
                      {item.milestone}
                    </p>
                    <p className="text-xs text-gray-400 font-light">
                      {item.time}
                    </p>
                  </div>

                  <div className="border bg-white p-4 rounded-lg">
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-2 text-orange">
                      <p className="flex items-center gap-1 text-sm">
                        <RiUser2Fill />
                        {item.company}
                      </p>
                      <p className="flex items-center gap-1 text-sm">
                        <FaClock />
                        {item.date}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "border flex items-center gap-2 px-4 rounded-full text-sm py-1",
                        badgeBg,
                        badgeBorder,
                        badgeText
                      )}
                    >
                      <Icon />
                      {item.status} <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
