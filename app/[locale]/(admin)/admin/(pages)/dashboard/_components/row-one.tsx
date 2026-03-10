import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { BiSolidBriefcaseAlt } from "react-icons/bi";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";

import { DashboardSummaryCardsData } from "@/types/admin/dashboard/dashboard_type";

type Props = {
  summaryData: DashboardSummaryCardsData;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
};

const RowOne = ({ summaryData }: Props) => {
  const dashboardCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(summaryData.totalRevenue),
      icon: GoGoal,
    },
    {
      title: "Pending Payouts",
      value: formatCurrency(summaryData.pendingPayouts),
      icon: IoIosHourglass,
    },
    {
      title: "Active Campaigns",
      value: String(summaryData.activeCampaigns),
      icon: BiSolidBriefcaseAlt,
      link: "/",
    },
  ];

  const secondaryCards = [
    {
      label: "Influencer",
      value: summaryData.influencers,
    },
    {
      label: "Agency",
      value: summaryData.agencies,
    },
    {
      label: "Brands",
      value: summaryData.clients,
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-2 items-stretch">
      <div className="col-span-8 grid grid-cols-3 gap-2">
        {dashboardCards.map(({ icon: Icon, link, title, value }, index) => (
          <div key={index} className="h-full">
            <div className="h-full flex flex-col justify-between bg-linear-to-r from-[#405E2C]/90 to-[#7A9B57] rounded-lg p-4 shadow-md gap-6">
              <div className="flex items-center justify-between">
                <p className="text-white">{title}</p>
                <Icon size={35} className="text-white" />
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-white font-bold text-2xl">{value}</p>

                {link && (
                  <Button variant="link" className="p-0 text-white">
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

      <div className="col-span-4 grid grid-cols-3 gap-2">
        {secondaryCards.map((item, i) => (
          <div key={i} className="h-full">
            <div className="h-full border border-light-green rounded-lg p-3 text-light-green bg-linear-to-r from-white to-Secondary flex flex-col justify-between">
              <p className="text-sm">{item.label}</p>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowOne;