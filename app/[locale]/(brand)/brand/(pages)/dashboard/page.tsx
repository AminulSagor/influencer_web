// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import DashboardStatsCards from "./_components/dashboard-stats-cards";
import DashboardMainGrid from "./_components/dashboard-main-grid";
import LifetimeSummary from "./_components/lifetime-summary";
import { notifyError } from "@/utils/toast_util";
import {
  LifetimeSummaryData,
  ActionRequiredItem,
  UpcomingDeadlineItem,
} from "@/types/client/dashboard/dashboard-types";
import { Campaign } from "@/types/client/campaigns/campaign";
import { PaginationMeta, ServiceResponse } from "@/types/service-response";

import {
  getActiveJobsTotal,
  getLifetimeSummary,
  getPendingCampaigns,
  getActionRequired,
  getUpcomingDeadlines,
} from "@/service/client/dashboard";
import { getActiveCampaigns } from "@/service/client/campaigns/active-campaigns";
import DashboardShell from "@/app/[locale]/(brand)/brand/(pages)/dashboard/_components/dashboard-main-grid-shell";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [activeJobsTotal, setActiveJobsTotal] = useState<number>(0);
  const [lifetimeSummary, setLifetimeSummary] =
    useState<LifetimeSummaryData | null>(null);
  const [pendingCampaigns, setPendingCampaigns] = useState<number>(0);

  // Main grid data states
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [actionRequiredItems, setActionRequiredItems] = useState<
    ActionRequiredItem[]
  >([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<
    ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>
  >({
    success: false,
    data: [],
    meta: {
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 1,
    },
    message: "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        getActiveJobsTotal(),
        getLifetimeSummary(),
        getPendingCampaigns(),
        getActiveCampaigns(),
        getActionRequired(),
        getUpcomingDeadlines(1, 5),
      ]);

      // Handle active jobs
      if (results[0].status === "fulfilled") {
        setActiveJobsTotal(results[0].value);
      } else {
        console.error("Failed to fetch active jobs:", results[0].reason);
        notifyError("Failed to load active jobs");
      }

      // Handle lifetime summary
      if (results[1].status === "fulfilled") {
        setLifetimeSummary(results[1].value);
      } else {
        console.error("Failed to fetch lifetime summary:", results[1].reason);
        notifyError("Failed to load lifetime summary");
      }

      // Handle pending campaigns
      if (results[2].status === "fulfilled") {
        setPendingCampaigns(results[2].value.data || 0);
      } else {
        console.error("Failed to fetch pending campaigns:", results[2].reason);
        notifyError("Failed to load pending campaigns");
      }

      // Handle active campaigns (for WorkInProgressCard)
      if (results[3].status === "fulfilled") {
        setCampaigns(results[3].value);
      } else {
        console.error("Failed to fetch active campaigns:", results[3].reason);
        notifyError("Failed to load active campaigns");
      }

      // Handle action required items
      if (results[4].status === "fulfilled") {
        setActionRequiredItems(results[4].value);
      } else {
        console.error("Failed to fetch action required:", results[4].reason);
        notifyError("Failed to load action required items");
      }

      // Handle upcoming deadlines
      if (results[5].status === "fulfilled") {
        setUpcomingDeadlines(results[5].value);
      } else {
        console.error("Failed to fetch upcoming deadlines:", results[5].reason);
        notifyError("Failed to load upcoming deadlines");
      }
    } catch (error) {
      console.error("Dashboard data fetching failed:", error);
      setError("Failed to load dashboard data. Please refresh the page.");
      notifyError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardShell />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-Primary text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <DashboardStatsCards
        activeJobsTotal={activeJobsTotal}
        pendingCampaings={pendingCampaigns}
        pendingCampaignsError={null}
      />

      <DashboardMainGrid
        campaigns={campaigns}
        actionRequiredItems={actionRequiredItems}
        upcomingDeadlines={upcomingDeadlines}
      />

      <div className="pt-6 px-4">
        {lifetimeSummary && <LifetimeSummary data={lifetimeSummary} />}
      </div>
    </div>
  );
}
