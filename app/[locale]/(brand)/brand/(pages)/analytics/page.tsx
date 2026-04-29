"use client";

import React, { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import RecentTransactionsCard, {
  Transaction,
} from "@/app/[locale]/(brand)/brand/(pages)/analytics/_components/recent-transection-card";
import AnalyticsHighlightCards from "@/app/[locale]/(brand)/brand/(pages)/analytics/_components/analytics-highlight-cards";
import {
  formatCurrencyBDT,
  formatDateTimeLabel,
} from "@/app/[locale]/(brand)/brand/(pages)/analytics/_utils/analytics-formatters";
import { useClientAnalytics } from "@/hooks/use-client-analytics";

const AnalyticsPage = () => {
  const t = useTranslations("brand.analytics");
  const locale = useLocale();
  const router = useRouter();

  const {
    data,
    meta,
    loading,
    error,
    search,
    sortOrder,
    page,
    canGoNext,
    canGoPrev,
    setSearch,
    setSortOrder,
    goNext,
    goPrev,
    goToPage,
  } = useClientAnalytics();

  const items: Transaction[] = useMemo(() => {
    return (
      data?.transactions.data.map((item) => ({
        id: item.transactionId,
        title: t("paymentForCampaign", { campaignName: item.campaignName }),
        timeLabel: formatDateTimeLabel(item.date, locale),
        amountLabel: formatCurrencyBDT(item.amount),
        onViewDetails: () => {
          router.push(`/${locale}/brand/campaign-details/${item.campaignId}`);
        },
      })) ?? []
    );
  }, [data?.transactions.data, locale, router, t]);

  return (
    <div className="space-y-4">
      <AnalyticsHighlightCards highlights={data?.highlights} />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <RecentTransactionsCard
        totalResults={meta.total ?? 0}
        pageSize={meta.limit ?? 10}
        pageCount={meta.totalPages ?? 1}
        page={page}
        items={items}
        searchValue={search}
        onSearchChange={setSearch}
        sort={sortOrder === "high_to_low" ? "highToLow" : "lowToHigh"}
        onSortChange={(value) =>
          setSortOrder(value === "highToLow" ? "high_to_low" : "low_to_high")
        }
        onNextPage={goNext}
        onPrevPage={goPrev}
        onPageChange={goToPage}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        isLoading={loading}
        className="w-full"
      />
    </div>
  );
};

export default AnalyticsPage;
