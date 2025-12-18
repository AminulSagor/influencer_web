import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";

import WorkInProgressCard from "./_components/work-in-progress-card";
import UpcomingDeadline from "./_components/upcoming-deadlines";
import NewJobOffers from "./_components/new-job-offers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EarningOverviewCard from "./_components/earning-overview-card";
import ActionRequiredCard from "./_components/action-required-card";

const dashboardCards = [
  {
    title: "Lifetime Earning",
    value: "৳ 3,000,000",
    icon: GoGoal,
  },
  {
    title: "Pending Earning",
    value: "৳ 120,000",
    icon: IoIosHourglass,
  },
  {
    title: "Active Jobs",
    value: "14",
    icon: BiSolidBriefcaseAlt,
    link: "/",
  },
  {
    title: "New Offers",
    value: "6",
    icon: FaHandHoldingHeart,
    link: "/",
  },
];

const page = () => {
  return (
    <div className="pb-20">
      <div className="pt-4 px-4">
        <div
          className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-4
        gap-4
      "
        >
          {dashboardCards.map(({ icon: Icon, link, title, value }, index) => (
            <div
              key={index}
              className="
              bg-linear-to-r
              from-[#405E2C]/90
              to-[#7A9B57]
              rounded-lg
              p-5
              space-y-8
              shadow-md
            "
            >
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <p className="text-white">{title}</p>
                <Icon size={35} className="text-white" />
              </div>

              {/* Value + Link Row */}
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-2xl">{value}</p>
                {link && (
                  <Button variant="link" className="text-white p-0">
                    <Link href={link} className="flex items-center">
                      View All <ChevronRight />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-6 px-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          {/* Left section */}
          <div className="space-y-4 lg:col-span-4">
            <EarningOverviewCard />
            <WorkInProgressCard />
          </div>

          {/* Right section */}
          <div className="space-y-4 lg:col-span-2">
            <ActionRequiredCard />
            <UpcomingDeadline />
            <NewJobOffers />
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2d5016]">Lifetime Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-4 gap-2">
              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <p className="text-sm font-medium">Top Client</p>
                <div>
                  <h2 className="text-3xl font-semibold text-[#7a9b57]">
                    TechGuru
                  </h2>
                  <p className="text-sm font-medium text-[#7a9b57]">
                    12 Jobs Completed
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  Last Job: 12 Dec 2025
                </p>
              </div>

              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <div className="flex flex-col justify-center gap-1  h-full">
                  <h2 className="text-3xl font-semibold text-[#7a9b57]">40</h2>
                  <div className="flex items-center justify-between ">
                    <p className="text-sm font-medium ">12 Jobs Completed</p>
                    <div>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <div className="flex flex-col justify-center gap-1  h-full">
                  <h2 className="text-3xl font-semibold text-yellow-700">40</h2>
                  <div className="flex items-center justify-between ">
                    <p className="text-sm font-medium ">4 Jobs Declined</p>
                    <div>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border bg-secondary px-4 py-2 rounded-lg space-y-2">
                <div className="flex flex-col justify-center gap-1  h-full">
                  <h2 className="text-3xl font-semibold text-[#7a9b57]">
                    Tiktok
                  </h2>
                  <div className="flex items-center justify-between ">
                    <p className="text-sm font-medium ">Most Used Platform</p>
                    <div>{/* <ChevronRight size={14} /> */}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
