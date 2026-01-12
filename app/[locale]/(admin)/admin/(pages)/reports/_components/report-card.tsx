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
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { RiUser2Fill } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";

/* ================= TYPES ================= */

type ReportStatus = "Pending" | "Resolved";

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

/* ================= CONFIG ================= */

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
  Pending: {
    Icon: FaClock,
    badgeBg: "bg-yellow-500",
    badgeBorder: "border-yellow-500",
    badgeText: "text-white",
    cardBg: "bg-yellow-100/40",
    cardBorder: "border-yellow-300",
  },
  Resolved: {
    Icon: FaCheckCircle,
    badgeBg: "bg-green-600",
    badgeBorder: "border-green-600",
    badgeText: "text-white",
    cardBg: "bg-green-100",
    cardBorder: "border-green-300",
  },
};

/* ================= SUMMARY ================= */

const reportsData = [
  { id: 1, tag: "Pending" as ReportStatus, count: 20 },
  { id: 2, tag: "Resolved" as ReportStatus, count: 10 },
];

/* ================= DATA ================= */

const reportItems: ReportItem[] = [
  {
    id: 1,
    status: "Pending",
    campaign: "Winter Fest",
    milestone: "Milestone 2",
    time: "Yesterday",
    description: "Pending review for visual content",
    company: "StyleCo.",
    date: "Dec 10, 2025",
  },
  {
    id: 2,
    status: "Resolved",
    campaign: "Spring Launch",
    milestone: "Milestone 3",
    time: "Last week",
    description: "Issue resolved successfully",
    company: "StyleCo.",
    date: "Dec 1, 2025",
  },
  {
    id: 3,
    status: "Pending",
    campaign: "Black Friday Deals",
    milestone: "Milestone 2",
    time: "5 hours ago",
    description: "Awaiting brand approval",
    company: "DealMart",
    date: "Dec 16, 2025",
  },
  {
    id: 4,
    status: "Resolved",
    campaign: "New Year Blast",
    milestone: "Milestone 1",
    time: "2 days ago",
    description: "Copyright issue resolved",
    company: "PromoHub",
    date: "Dec 14, 2025",
  },
];

/* ================= COMPONENT ================= */

const ReportCard = () => {
  const [activeFilter, setActiveFilter] = useState<ReportStatus | null>(null);

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

        {/* FILTER CARDS */}
        <div className="flex gap-4">
          {reportsData.map((report) => {
            const isActive = report.tag === activeFilter;

            return (
              <div
                key={report.id}
                onClick={() => setActiveFilter(report.tag)}
                className={cn(
                  "cursor-pointer flex-1 rounded-lg border p-3 transition-all select-none",
                  report.tag === "Pending" &&
                    "bg-yellow-100 border-yellow-300 text-yellow-700",
                  report.tag === "Resolved" &&
                    "bg-green-100 border-green-300 text-green-700",
                  isActive &&
                    cn(
                      "ring-2 ring-offset-1",
                      report.tag === "Pending" &&
                        "ring-yellow-400 bg-yellow-500 text-white",
                      report.tag === "Resolved" &&
                        "ring-green-400 bg-green-600 text-white"
                    )
                )}
              >
                <p className="text-lg">{report.tag}</p>
                <p className="text-2xl font-semibold">{report.count}</p>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SEARCH */}
        <div className="relative w-[40%]">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input placeholder="Search by campaign name" className="pl-10" />
        </div>

        {filteredReports.length === 0 && (
          <p className="text-center text-gray-500">No reports found</p>
        )}

        {/* REPORT LIST */}
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
                  "rounded-lg border p-3 space-y-2",
                  cardBg,
                  cardBorder
                )}
              >
                <div>
                  <h3 className="text-Primary font-semibold">
                    {item.campaign}
                  </h3>
                  <p className="text-light-green text-sm">{item.milestone}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>

                <div className="bg-white border rounded-lg p-3">
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-orange text-sm space-y-1">
                    <p className="flex items-center gap-1">
                      <RiUser2Fill /> {item.company}
                    </p>
                    <p className="flex items-center gap-1">
                      <FaClock /> {item.date}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-2 px-4 py-1 rounded-full border text-sm",
                      badgeBg,
                      badgeBorder,
                      badgeText
                    )}
                  >
                    <Icon />
                    {item.status}
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
