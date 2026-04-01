"use client";

import { useEffect, useMemo, useState } from "react";
import { GoGoal } from "react-icons/go";
import { IoIosHourglass } from "react-icons/io";
import { FaExclamation } from "react-icons/fa";

import EarningOverviewCard from "./_components/earning-overview-card";
import EarningCard from "./_components/earning-card";
import RecentTransactionsCard from "./_components/recent-transactions-card";

import { getEarningSummary } from "@/service/agency/earning-summary";
import type { EarningSummaryData } from "@/types/agency/earning-summary";

const defaultSummary: EarningSummaryData = {
  lifetimeEarnings: 0,
  pendingEarnings: {
    amount: 0,
    campaignCount: 0,
  },
  recentEarning: {
    amount: 0,
    date: "",
  },
};

const formatCurrency = (amount: number) => {
  return `৳ ${amount.toLocaleString("en-BD")}`;
};

const formatDate = (value: string) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const page = () => {
  const [summary, setSummary] = useState<EarningSummaryData>(defaultSummary);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        const response = await getEarningSummary();

        if (!isMounted) return;

        if (response.success) {
          setSummary(response.data);
        } else {
          setSummary(defaultSummary);
        }
      } catch (error) {
        console.error("Failed to load earning sidecards:", error);

        if (!isMounted) return;

        setSummary(defaultSummary);
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const dashboardCards = useMemo(
    () => [
      {
        title: "Lifetime Earnings",
        value: formatCurrency(summary.lifetimeEarnings),
        icon: GoGoal,
      },
      {
        title: "Pending Earnings",
        value: formatCurrency(summary.pendingEarnings.amount),
        icon: IoIosHourglass,
        link: "/agency/jobs/pending",
        campaign: summary.pendingEarnings.campaignCount,
        linkTitle: "View Pending Campaigns",
      },
      {
        title: "Recent Earning",
        value: formatCurrency(summary.recentEarning.amount),
        icon: FaExclamation,
        date: formatDate(summary.recentEarning.date),
      },
    ],
    [summary]
  );

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
                    key={index}
                    Icon={Icon}
                    link={link}
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