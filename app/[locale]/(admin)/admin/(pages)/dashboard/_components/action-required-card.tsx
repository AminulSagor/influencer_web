"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TfiMenuAlt } from "react-icons/tfi";
import Link from "next/link";
import { useEffect, useState, type UIEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  DashboardActionsResponse,
  DashboardActionItem,
  DashboardActionTab,
} from "@/types/admin/dashboard/dashboard_actions_type";

import {
  FaCheckCircle,
  FaFileAlt,
  FaMoneyBillWave,
  FaUserCheck,
} from "react-icons/fa";
import { MdCampaign, MdOutlineCancel } from "react-icons/md";
import { HiMiniClock } from "react-icons/hi2";
import { RiUser3Fill } from "react-icons/ri";
import { BsDot } from "react-icons/bs";
import { getDashboardActionsClient } from "@/service/admin/dashboard/get-dashboard-actions-client";

type Props = {
  actionsData: DashboardActionsResponse;
  filters: {
    tab: DashboardActionTab;
    page: number;
    limit: number;
  };
};

const ACTION_TABS: {
  label: string;
  value: DashboardActionTab;
  badgeKey?: keyof DashboardActionsResponse["badges"];
}[] = [
  { label: "All", value: "all" },
  {
    label: "New Campaign Requests",
    value: "new_campaigns",
    badgeKey: "newCampaignRequests",
  },
  {
    label: "Pending Verification",
    value: "verifications",
    badgeKey: "pendingVerification",
  },
  {
    label: "Milestone Reviews",
    value: "milestone_reviews",
    badgeKey: "milestoneReviews",
  },
  {
    label: "Payout Requests",
    value: "payout_requests",
    badgeKey: "payoutRequests",
  },
  {
    label: "Cancellations",
    value: "cancellations",
    badgeKey: "cancellations",
  },
];

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const getMetaLine = (item: DashboardActionItem) => {
  const lower = item.description.toLowerCase();

  if (lower.includes("influencer")) return "Influencer";
  if (lower.includes("agency")) return "Agency";
  if (lower.includes("client")) return "Client";
  return "System";
};

const getSecondaryName = (item: DashboardActionItem) => {
  if (item.title.includes(" for ")) {
    return item.title.split(" for ")[1];
  }

  if (item.title.includes(": ")) {
    return item.title.split(": ")[1];
  }

  return "Record";
};

const getActionUi = (item: DashboardActionItem) => {
  switch (item.type) {
    case "campaign_approval":
      return {
        icon: MdCampaign,
        iconWrap: "bg-purple-100",
        iconColor: "text-purple-600",
        cardBg: "bg-[#F4EFFB]",
        subText: "text-purple-500",
        buttonText: "Create Quote",
        buttonClass: "bg-purple-500 hover:bg-purple-600 text-white",
      };

    case "verification":
      return {
        icon: FaUserCheck,
        iconWrap: "bg-orange-100",
        iconColor: "text-orange",
        cardBg: "bg-[#FAF0EA]",
        subText: "text-orange",
        buttonText: "Review",
        buttonClass: "bg-[#E79A32] hover:bg-[#d88b22] text-white",
      };

    case "payout":
      return {
        icon: FaMoneyBillWave,
        iconWrap: "bg-green-100",
        iconColor: "text-light-green",
        cardBg: "bg-[#EEF6E8]",
        subText: "text-light-green",
        buttonText: "Process Payment",
        buttonClass: "bg-light-green hover:brightness-95 text-white",
      };

    case "milestone_review":
      return {
        icon: FaFileAlt,
        iconWrap: "bg-blue-100",
        iconColor: "text-Blue",
        cardBg: "bg-[#EAF2FB]",
        subText: "text-Blue",
        buttonText: "Check Proof",
        buttonClass: "bg-Blue hover:brightness-95 text-white",
      };

    case "cancellation":
      return {
        icon: MdOutlineCancel,
        iconWrap: "bg-rose-100",
        iconColor: "text-rose-500",
        cardBg: "bg-rose-50",
        subText: "text-rose-500",
        buttonText: "Review",
        buttonClass: "bg-rose-500 hover:bg-rose-600 text-white",
      };

    default:
      return {
        icon: HiMiniClock,
        iconWrap: "bg-gray-100",
        iconColor: "text-dark-gray",
        cardBg: "bg-white",
        subText: "text-dark-gray",
        buttonText: "Open",
        buttonClass: "bg-Primary hover:brightness-95 text-white",
      };
  }
};

const getComputedActionLink = (item: DashboardActionItem, metaType: string) => {
  if (item.type === "campaign_approval") {
    return "/admin/campaigns?tab=needs-quote";
  }
  if (item.type === "verification") {
    const tabName = metaType === "Client" ? "brand" : metaType.toLowerCase();
    return `/admin/verification-center?tab=${tabName}`;
  }
  if (item.type === "payout") {
    return "/admin/finance-analytics";
  }
  if (item.type === "milestone_review") {
    return "/admin/campaigns?tab=active";
  }
  if (item.type === "cancellation") {
    return "/admin/campaigns?tab=canceled";
  }
  
  return item.actionLink || "#";
};

const ActionRequiredCard = ({ actionsData, filters }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = ({
    tab,
    page,
  }: {
    tab?: DashboardActionTab;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tab ?? filters.tab);
    params.set("page", String(page ?? filters.page));
    params.set("limit", String(filters.limit));

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTabChange = (tab: DashboardActionTab) => {
    updateQuery({ tab, page: 1 });
  };

  const [items, setItems] = useState<DashboardActionItem[]>(actionsData.data);
  const [currentPage, setCurrentPage] = useState(filters.page);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(actionsData.data.length >= filters.limit);

  useEffect(() => {
    setItems(actionsData.data);
    setCurrentPage(filters.page);
    setHasMore(actionsData.data.length >= filters.limit);
  }, [actionsData.data, filters.page, filters.limit, filters.tab]);

  const loadMoreActions = async () => {
    if (isLoadingMore || !hasMore) return;

    const nextPage = currentPage + 1;

    try {
      setIsLoadingMore(true);
      const response = await getDashboardActionsClient({
        tab: filters.tab,
        page: nextPage,
        limit: filters.limit,
      });

      setItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const nextItems = response.data.filter(
          (item) => !existingIds.has(item.id)
        );

        return [...prev, ...nextItems];
      });
      setCurrentPage(nextPage);
      setHasMore(response.data.length >= filters.limit);
    } catch (error) {
      console.error("Failed to load more dashboard actions", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleActionsScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;

    if (remaining < 120) {
      void loadMoreActions();
    }
  };

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-[#DADADA] p-0 shadow-none">
      <CardHeader className="border-b bg-gradient-to-br from-white to-Secondary px-4 py-3">
        <div className="space-y-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-Primary">
            <TfiMenuAlt className="text-base" />
            Action Required
          </CardTitle>

          <div className="flex flex-wrap gap-2">
            {ACTION_TABS.map((tab) => {
              const isActive = filters.tab === tab.value;
              const count = tab.badgeKey
                ? actionsData.badges[tab.badgeKey]
                : null;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition",
                    isActive
                      ? "border-light-green bg-light-green text-white"
                      : "border-[#D8D8D8] bg-white text-black hover:bg-off-white"
                  )}
                >
                  <span className="whitespace-nowrap">{tab.label}</span>

                  {typeof count === "number" && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                        isActive
                          ? "bg-white text-red-500"
                          : "bg-red-500 text-white"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div
          className="h-[520px] overflow-y-auto pr-2"
          onScroll={handleActionsScroll}
        >
          <div className="space-y-3">
            {items.map((item) => {
              const ui = getActionUi(item);
              const Icon = ui.icon;
              const metaType = getMetaLine(item);
              const secondaryName = getSecondaryName(item);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border border-transparent px-4 py-4",
                    ui.cardBg
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={cn(
                          "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          ui.iconWrap,
                          ui.iconColor
                        )}
                      >
                        <Icon className="text-base" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-black">
                          {item.title}
                        </h3>

                        <p className={cn("mt-1 text-xs", ui.subText)}>
                          {item.description}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-dark-gray">
                          <span className="flex items-center gap-1">
                            <RiUser3Fill className="text-[11px]" />
                            {secondaryName}
                          </span>

                          <span className="flex items-center">
                            <BsDot className="text-base" />
                          </span>

                          <span className="flex items-center gap-1">
                            <HiMiniClock className="text-[11px]" />
                            {formatRelativeTime(item.date)}
                          </span>

                          <span className="flex items-center">
                            <BsDot className="text-base" />
                          </span>

                          <span>{metaType}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={getComputedActionLink(item, metaType)}
                      className={cn(
                        "w-full sm:w-auto text-center shrink-0 rounded-lg px-4 py-2 text-xs font-medium transition",
                        ui.buttonClass
                      )}
                    >
                      {ui.buttonText}
                    </Link>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="py-10 text-center text-sm text-dark-gray">
                No actions found
              </div>
            )}

            {isLoadingMore && (
              <div className="py-3 text-center text-xs text-dark-gray">
                Loading more actions...
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionRequiredCard;