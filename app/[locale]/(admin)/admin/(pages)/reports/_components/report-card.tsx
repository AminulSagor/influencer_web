"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronRight, Search, CheckCircle2 } from "lucide-react";
import { FaClock } from "react-icons/fa";
import { RiUser2Fill } from "react-icons/ri";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ReportsResponse,
  ReportStatus,
  ReportUserType,
} from "@/types/admin/reports/reports_type";

type Props = {
  reports: ReportsResponse;
  filters: {
    page: number;
    limit: number;
    userType: ReportUserType;
    status: ReportStatus | null;
    search: string;
  };
};

const USER_TYPE_OPTIONS: { label: string; value: ReportUserType }[] = [
  { label: "Agency", value: "AGENCY" },
  { label: "Influencer", value: "INFLUENCER" },
  { label: "Brand", value: "CLIENT" },
];

const STATUS_CONFIG: Record<
  ReportStatus,
  {
    badgeClass: string;
    cardClass: string;
    statCardClass: string;
    statActiveClass: string;
    statInactiveTextClass: string;
  }
> = {
  Pending: {
    badgeClass: "bg-orange text-white",
    cardClass: "bg-Secondary border-[#E5DEC1]",
    statCardClass: "bg-Secondary border-orange",
    statActiveClass: "bg-orange border-orange text-white",
    statInactiveTextClass: "text-orange",
  },
  Resolved: {
    badgeClass: "bg-Primary text-white",
    cardClass: "bg-[#EEF7F1] border-[#D5E6D9]",
    statCardClass: "bg-[#EEF7F1] border-light-green",
    statActiveClass: "bg-Primary border-Primary text-white",
    statInactiveTextClass: "text-Primary",
  },
};

const ReportCard = ({ reports, filters }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedCurrent = searchValue.trim();
      const trimmedInitial = filters.search.trim();

      if (trimmedCurrent === trimmedInitial) return;

      const params = new URLSearchParams(searchParams.toString());

      if (trimmedCurrent) {
        params.set("search", trimmedCurrent);
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      params.set("limit", String(filters.limit));
      params.set("userType", filters.userType);

      if (filters.status) {
        params.set("status", filters.status);
      } else {
        params.delete("status");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    searchValue,
    filters.search,
    filters.limit,
    filters.userType,
    filters.status,
    pathname,
    router,
    searchParams,
  ]);

  const updateQuery = (updates: {
    page?: number;
    userType?: ReportUserType;
    status?: ReportStatus | null;
    search?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    const nextPage = updates.page ?? filters.page;
    const nextUserType = updates.userType ?? filters.userType;
    const nextStatus =
      updates.status !== undefined ? updates.status : filters.status;
    const nextSearch = updates.search ?? filters.search;

    params.set("page", String(nextPage));
    params.set("limit", String(filters.limit));
    params.set("userType", nextUserType);

    if (nextStatus) {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusClick = (value: ReportStatus) => {
    updateQuery({
      page: 1,
      status: filters.status === value ? null : value,
    });
  };

  const handleUserTypeClick = (value: ReportUserType) => {
    updateQuery({
      page: 1,
      userType: value,
    });
  };

  const handlePrevPage = () => {
    if (filters.page <= 1) return;
    updateQuery({ page: filters.page - 1 });
  };

  const handleNextPage = () => {
    if (filters.page >= reports.meta.totalPages) return;
    updateQuery({ page: filters.page + 1 });
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-[#D9D9D9] shadow-none">
      <CardHeader className="space-y-5 border-b px-6 py-5">
        <div>
          <CardTitle className="text-base font-semibold text-Primary">
            Report Log
          </CardTitle>
          <CardDescription className="text-xs text-dark-gray">
            View reports on your works, manage and resolve them
          </CardDescription>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleStatusClick("Pending")}
            className={cn(
              "rounded-lg border px-5 py-4 text-left transition-colors",
              STATUS_CONFIG.Pending.statCardClass,
              filters.status === "Pending"
                ? STATUS_CONFIG.Pending.statActiveClass
                : STATUS_CONFIG.Pending.statInactiveTextClass
            )}
          >
            <p className="text-sm font-medium">Pending</p>
            <p className="mt-1 text-[2rem] font-semibold">
              {reports.stats.pending}
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleStatusClick("Resolved")}
            className={cn(
              "rounded-lg border px-5 py-4 text-left transition-colors",
              STATUS_CONFIG.Resolved.statCardClass,
              filters.status === "Resolved"
                ? STATUS_CONFIG.Resolved.statActiveClass
                : STATUS_CONFIG.Resolved.statInactiveTextClass
            )}
          >
            <p className="text-sm font-medium">Resolved</p>
            <p className="mt-1 text-[2rem] font-semibold">
              {reports.stats.resolved}
            </p>
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[270px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray"
            />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search By Campaign Name"
              className="h-10 rounded-lg border-[#D9D9D9] pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {USER_TYPE_OPTIONS.map((item) => {
              const isActive = filters.userType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleUserTypeClick(item.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs transition-colors",
                    isActive ? "bg-Primary text-white" : "text-black"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {reports.data.length === 0 ? (
          <div className="py-10 text-center text-sm text-dark-gray">
            No reports found
          </div>
        ) : (
          <div className="space-y-4">
            {reports.data.map((item) => {
              const isPending = item.status === "Pending";
              const config = STATUS_CONFIG[item.status];

              return (
                <div
                  key={item.reportId}
                  className={cn("rounded-lg border p-4", config.cardClass)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-Primary">
                        {item.campaignName}
                      </h3>
                      <p className="text-xs font-medium text-Primary">
                        {item.milestone}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-Primary">
                        Reported By
                      </p>
                      <p className="text-xs text-light-gray">
                        {item.relatedEntity.type}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3">
                    <p className="text-xs text-light-gray">{item.milestone}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="text-orange text-xs">
                      <p className="flex items-center gap-1">
                        <RiUser2Fill className="shrink-0" />
                        {item.relatedEntity.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-medium",
                        config.badgeClass
                      )}
                    >
                      {isPending ? (
                        <FaClock className="text-[10px]" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      {item.status}
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-6">
          <span className="text-xs text-dark-gray">Page</span>

          <div className="flex h-6 min-w-6 items-center justify-center rounded-md bg-Secondary px-2 text-xs text-Primary">
            {reports.meta.page}
          </div>

          <span className="text-xs text-dark-gray">
            Of {reports.meta.totalPages}
          </span>

          <button
            type="button"
            onClick={handlePrevPage}
            disabled={filters.page <= 1}
            className="rounded-md border border-Primary px-3 py-1 text-xs text-Primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={filters.page >= reports.meta.totalPages}
            className="rounded-md bg-Primary px-4 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;