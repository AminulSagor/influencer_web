import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";

const RowOne = () => {
  const dashboardCards = [
    {
      title: "Total Revenue",
      value: "৳ 3,000,000",
      icon: GoGoal,
    },
    {
      title: "Pending Payouts",
      value: "৳ 120,000",
      icon: IoIosHourglass,
    },
    {
      title: "Active Campaigns",
      value: "14",
      icon: BiSolidBriefcaseAlt,
      link: "/",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-2 items-stretch">
      {/* Primary cards */}
      <div className="col-span-8 grid grid-cols-3 gap-2">
        {dashboardCards.map(({ icon: Icon, link, title, value }, index) => (
          <div key={index} className="h-full">
            <div className="h-full flex flex-col justify-between bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-4 shadow-md gap-6">
              <div className="flex items-center justify-between">
                <p className="text-white">{title}</p>
                <Icon size={35} className="text-white" />
              </div>

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
          </div>
        ))}
      </div>

      {/* Secondary cards */}
      <div className="col-span-4 grid grid-cols-3 gap-2">
        {["Influencer", "Brands", "Campaigns"].map((label, i) => (
          <div key={i} className="h-full">
            <div className="h-full border border-light-green rounded-lg p-3 text-light-green bg-linear-to-r from-white to-Secondary flex flex-col justify-between">
              <p className="text-sm">{label}</p>
              <p className="text-2xl font-semibold">30</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowOne;
