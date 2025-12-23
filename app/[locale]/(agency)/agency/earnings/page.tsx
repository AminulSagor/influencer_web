import EarningOverviewCard from "./_components/earning-overview-card";

import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ca } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FaExclamation } from "react-icons/fa";
import EarningCard from "./_components/earning-card";
import { Card } from "@/components/ui/card";
import RecentTransactionsCard from "./_components/recent-transactions-card";

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
    link: "/",
    campaign: 2,
    linkTitle: "View Pending Campaings",
  },
  {
    title: "Recent Earning",
    value: "৳ 30,000",
    icon: FaExclamation,
    date: "Dec 12, 2025",
  },
];
const page = () => {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <EarningOverviewCard />
          </div>
          <div className="col-span-4">
            <div className="space-y-2">
              {dashboardCards.map(
                (
                  { icon: Icon, link, title, value, campaign, linkTitle, date },
                  index
                ) => (
                  <EarningCard
                    Icon={Icon}
                    link={link}
                    key={index}
                    title={title}
                    value={value}
                    campaign={campaign}
                    linkTitle={linkTitle}
                    date={date}
                  />
                )
              )}
            </div>
          </div>
        </div>
        <div>
          <RecentTransactionsCard />
        </div>
      </div>
    </div>
  );
};

export default page;
