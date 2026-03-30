"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, ArrowDown } from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export type Transaction = {
  id: string;
  title: string;
  timeLabel: string;
  amountLabel: string;
  onViewDetails?: () => void;
};

type RecentTransactionsCardProps = {
  title?: string;
  subtitle?: string;
  totalResults: number;
  pageSize?: number;
  pageCount: number;
  page: number;
  items: Transaction[];
  searchValue: string;
  onSearchChange: (v: string) => void;
  sort: "lowToHigh" | "highToLow";
  onSortChange: (v: "lowToHigh" | "highToLow") => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  isLoading?: boolean;
  className?: string;
};

export default function RecentTransactionsCard({
  title,
  subtitle,
  totalResults,
  pageSize = 10,
  pageCount,
  page,
  items,
  searchValue,
  onSearchChange,
  sort,
  onSortChange,
  onNextPage,
  onPrevPage,
  canGoNext = false,
  canGoPrev = false,
  isLoading = false,
  className,
}: RecentTransactionsCardProps) {
  const t = useTranslations("brand.analytics");
  const showingCount = items.length;
  const showingText = t("showingResults", {
    showing: showingCount,
    total: totalResults,
  });

  return (
    <Card className={clsx("rounded-2xl border bg-white", className)}>
      <CardContent className="p-0">
        <div className="px-8 pt-6">
          <h3 className="text-primary text-lg font-semibold leading-none">
            {title || t("recentTransactions")}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {subtitle || t("recentTransactionsSubtitle")}
          </p>
        </div>

        <div className="mt-5 h-px w-full bg-light-gray" />

        <div className="px-8 py-5">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative w-[360px] max-w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="h-10 rounded-lg pl-9"
                />
              </div>

              <div className="text-xs text-muted-foreground">{showingText}</div>
            </div>

            <div className="ml-auto">
              <Select
                value={sort}
                onValueChange={(v) => onSortChange(v as "lowToHigh" | "highToLow")}
              >
                <SelectTrigger className="h-8 w-[140px] rounded-full border border-light-green/30 bg-light-green/10 text-xs text-primary shadow-none">
                  <SelectValue placeholder={t("sort")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lowToHigh">{t("lowToHigh")}</SelectItem>
                  <SelectItem value="highToLow">{t("highToLow")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
                {t("loading")}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
                {t("noTransactionsFound")}
              </div>
            ) : (
              items.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-2xl border border-light-green/30 bg-light-green/10 px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-light-green/30 bg-white">
                      <ArrowDown className="h-4 w-4 text-light-green" />
                    </div>

                    <div className="leading-tight">
                      <div className="text-primary text-sm font-medium">
                        {tx.title}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {tx.timeLabel}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-light-green">
                        {tx.amountLabel}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={tx.onViewDetails}
                    className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    <span>{t("viewCampaignDetails")}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
            <span className="text-xs text-muted-foreground">{t("page")}</span>

            <span className="flex h-7 min-w-[34px] items-center justify-center rounded-full border border-light-green/30 bg-light-green/10 px-3 text-xs text-primary">
              {page}
            </span>

            <span className="text-xs text-muted-foreground">
              {t("of")} {pageCount}
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={onPrevPage}
              disabled={!canGoPrev}
              className="h-8 rounded-full px-4 text-xs"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("prev")}
            </Button>

            <Button
              type="button"
              onClick={onNextPage}
              disabled={!canGoNext}
              className="h-8 rounded-full bg-light-green px-4 text-xs text-white hover:bg-light-green/90"
            >
              {t("next")}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}