import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";
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
    <div>
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
      <div className="pt-6 px-4">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4 space-y-4">
            <EarningOverviewCard />
          </div>
          <div className="col-span-2 space-y-4">
            <ActionRequiredCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
