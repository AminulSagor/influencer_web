"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { UpcomingDeadlineItem } from "@/types/client/dashboard/dashboard-types";
import type { PaginationMeta, ServiceResponse } from "@/types/service-response";
import { getUpcomingDeadlinesClient } from "@/service/client/dashboard/upcomming-dateline";

type Props = {
  initialResponse: ServiceResponse<UpcomingDeadlineItem[], PaginationMeta>;
};

const LIMIT = 5;

const UpcomingDeadline = ({ initialResponse }: Props) => {
  const t = useTranslations("brand.dashboard.upcommingDateline");
  const [response, setResponse] = useState(initialResponse);
  const [currentPage, setCurrentPage] = useState(
    initialResponse.meta?.page ?? 1,
  );
  const [isPending, startTransition] = useTransition();

  const totalPages = response.meta?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    if (page === currentPage || isPending) return;

    startTransition(async () => {
      const result = await getUpcomingDeadlinesClient(page, LIMIT);
      setResponse(result);
      setCurrentPage(page);
    });
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);

    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      day: date.getDate(),
      year: date.getFullYear(),
    };
  };

  const getSubtitle = (item: UpcomingDeadlineItem) => {
    if (item.daysLeft <= 0) return t("dueNow");

    if (item.daysLeft === 1) {
      return `1 ${t("dayLeft")}`;
    }

    return `${item.daysLeft} ${t("daysLeft")}`;
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-[18px] font-semibold text-[#2D5B16]">
          {t("title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {response.data.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-xl bg-[#F6F6F6] px-4 py-6 text-center">
            <p className="text-sm text-[#A3A3A3]">{t("emptyMessage")}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {response.data.map((item) => {
                const { month, day, year } = formatDeadline(item.deadline);
                const showYear = year !== new Date().getFullYear();

                return (
                  <div
                    key={item.id}
                    className="flex overflow-hidden rounded-r-xl"
                  >
                    <div className="w-[15px] shrink-0 bg-[#2D5B16]" />

                    <div className="flex min-h-[70px] w-full items-center gap-4 bg-[#F6F6F6] px-4 py-3">
                      <div className="w-[54px] shrink-0 text-center text-[#2D5B16]">
                        <p className="text-[14px] font-semibold leading-[18px]">
                          {month}
                        </p>
                        <p className="text-[14px] font-semibold leading-[18px]">
                          {day}
                        </p>
                        {showYear && (
                          <p className="text-[14px] font-semibold leading-[18px]">
                            {year}
                          </p>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[14px] font-semibold text-[#2D5B16] lg:text-[15px]">
                          {item.campaignName}
                        </h3>

                        <p className="mt-1 truncate text-[12px] text-[#A3A3A3] lg:text-[13px]">
                          {getSubtitle(item)}
                        </p>
                      </div>

                      <Link
                        href={`/brand/campaign-details/${item.id}`}
                        className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-[#2D5B16]"
                      >
                        {t("view")}
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-5">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === currentPage;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      disabled={isPending}
                      aria-label={`Go to page ${page}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${
                        isActive ? "bg-[#86A85D]" : "bg-[#D9D9D9]"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadline;
