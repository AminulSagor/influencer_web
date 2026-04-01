"use client";

import { Target, Hourglass, AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getDashboardSummary } from "@/service/influencer/dashboard/summary";
import { DashboardSummary } from "@/types/influencer/dashboard/summary";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatCards() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const summary = await getDashboardSummary();
      setData(summary);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setError("Failed to load earnings stats.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const stats = [
    {
      title: "Lifetime Earnings",
      amount: `৳ ${(data?.lifetimeEarnings ?? 0).toLocaleString()}`,
      icon: Target,
      gradient: "from-[#5A7D3B] to-[#7FA35A]",
    },
    {
      title: "Pending Earnings",
      amount: `৳ ${(data?.pendingEarnings ?? 0).toLocaleString()}`,
      subtitle: `${data?.activeJobs ?? 0} Campaigns`,
      action: "View Pending Campaigns",
      icon: Hourglass,
      gradient: "from-[#5A7D3B] to-[#7FA35A]",
    },
    {
      title: "Active Jobs",
      amount: (data?.activeJobs ?? 0).toString(),
      icon: AlertCircle,
      light: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 lg:gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6 flex justify-between items-start gap-4"
          >
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-36" />
              {i === 1 && <Skeleton className="h-4 w-24" />}
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchStats}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`rounded-2xl p-6 items-start gap-4 flex justify-between
            ${
              item.light
                ? "bg-[#F7FAEC] border border-[#E3EACD]"
                : `bg-linear-to-r ${item.gradient} text-white`
            }
          `}
        >
          <div className="space-y-2">
            <p
              className={`text-sm ${
                item.light ? "text-[#6B7A4C]" : "text-white/80"
              }`}
            >
              {item.title}
            </p>

            <h3 className="text-2xl font-semibold">{item.amount}</h3>

            {item.subtitle && (
              <p
                className={`text-sm ${
                  item.light ? "text-[#7A8A57]" : "text-white/80"
                }`}
              >
                {item.subtitle}
              </p>
            )}

            {item.action && (
              <Link
                href={`/${locale}/influencer/jobs/pending`}
                className="text-sm underline text-white/90 mt-1 inline-block"
              >
                {item.action} →
              </Link>
            )}
          </div>

          <item.icon
            className={`w-6 h-6 ${
              item.light ? "text-[#7A8A57]" : "text-white"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
