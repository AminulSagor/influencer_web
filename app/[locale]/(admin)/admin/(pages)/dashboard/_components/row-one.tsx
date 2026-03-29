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
      value: `৳ ${summaryData.totalRevenue.toLocaleString()}`,
      icon: GoGoal,
    },
    {
      title: "Pending Payouts",
      value: `৳ ${summaryData.pendingPayouts.toLocaleString()}`,
      icon: IoIosHourglass,
    },
    {
      title: "Active Campaigns",
      value: String(summaryData.activeCampaigns),
      icon: BiSolidBriefcaseAlt,
      link: "/admin/campaigns?tab=active",
    },
  ];

  const secondaryCards = [
    {
      label: "Influencers",
      value: summaryData.influencers,
    },
    {
      label: "Agencies",
      value: summaryData.agencies,
    },
    {
      label: "Client",
      value: summaryData.clients,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-stretch">
      {/* Primary Dashboard Cards (Green) */}
      <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {dashboardCards.map(({ icon: Icon, link, title, value }, index) => (
          <div key={index} className="h-full">
            <div className="h-full min-h-[140px] flex flex-col justify-between bg-linear-to-br from-[#5D7B45] to-[#364D23] rounded-2xl p-4 lg:p-5 shadow-sm hover:brightness-105 transition-all">
              <div className="flex items-start justify-between">
                <p className="text-white font-medium text-sm lg:text-base opacity-95">{title}</p>
                <Icon size={32} className="text-white opacity-90" />
              </div>

              <div className="flex items-end justify-between gap-2 mt-4">
                <p className="text-white font-bold text-2xl lg:text-3xl tracking-tight">{value}</p>

                {link && (
                  <Link href={link} className="flex items-center text-[10px] lg:text-xs text-white/90 hover:text-white mb-1 whitespace-nowrap">
                    View All <ChevronRight size={10} className="ml-0.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Cards (White) */}
      <div className="md:col-span-12 lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {secondaryCards.map((item, i) => (
          <div key={i} className="h-full">
            <div className="h-full min-h-[140px] border border-[#DADADA] rounded-2xl p-4 lg:p-5 bg-linear-to-b from-white to-[#F9FAF8] flex flex-col justify-between hover:shadow-md transition-all">
              <p className="text-[#364D23] font-medium text-sm lg:text-base">{item.label}</p>
              <div className="mt-auto">
                <p className="text-[#5D7B45] text-3xl lg:text-4xl font-bold tracking-tight">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowOne;