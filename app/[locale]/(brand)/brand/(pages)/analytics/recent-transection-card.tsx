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
import { ChevronRight, Search, ArrowDown } from "lucide-react";
import clsx from "clsx";

export type Transaction = {
  id: string;
  title: string; // e.g. Payment For "Summer Sale"
  timeLabel: string; // e.g. Today, 2:30 PM
  amountLabel: string; // e.g. ৳20,000
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
  className?: string;
};

export default function RecentTransactionsCard({
  title = "Recent Transactions",
  subtitle = "Browse and manage your earnings of each campaigns",

  totalResults,
  pageSize = 4,
  pageCount,
  page,

  items,

  searchValue,
  onSearchChange,

  sort,
  onSortChange,

  onNextPage,
  className,
}: RecentTransactionsCardProps) {
  const showingCount = Math.min(pageSize, items.length);
  const showingText = `Showing ${showingCount} of ${totalResults} Results`;

  return (
    <Card className={clsx("rounded-2xl border bg-white", className)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-8 pt-6">
          <h3 className="text-primary text-lg font-semibold leading-none">
            {title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-5 h-px w-full bg-light-gray" />

        {/* Top controls */}
        <div className="px-8 py-5">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">

            {/* Search */}
            <div className="relative w-[360px] max-w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search By Job Name, Client Name"
                className="h-10 rounded-lg pl-9"
              />
            </div>

            {/* Showing */}
            <div className="text-xs text-muted-foreground">{showingText}</div>
            </div>

            <div className="ml-auto">
              {/* Sort pill */}
              <Select
                value={sort}
                onValueChange={(v) => onSortChange(v as any)}
              >
                <SelectTrigger className="h-8 w-[120px] rounded-full border border-light-green/30 bg-light-green/10 text-xs text-primary shadow-none">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lowToHigh">Low To High</SelectItem>
                  <SelectItem value="highToLow">High To Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* List */}
          <div className="mt-5 space-y-3">
            {items.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-2xl border border-light-green/30 bg-light-green/10 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  {/* Left icon circle */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-light-green/30 bg-white">
                    <ArrowDown className="h-4 w-4 text-light-green" />
                  </div>

                  {/* Text */}
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

                {/* Right link */}
                <button
                  type="button"
                  onClick={tx.onViewDetails}
                  className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
                >
                  <span>View Campaign Details</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-7 flex items-center justify-end gap-3">
            <span className="text-xs text-muted-foreground">Page</span>

            <span className="flex h-7 min-w-[34px] items-center justify-center rounded-full border border-light-green/30 bg-light-green/10 px-3 text-xs text-primary">
              {page}
            </span>

            <span className="text-xs text-muted-foreground">of {pageCount}</span>

            <Button
              type="button"
              onClick={onNextPage}
              className="h-8 rounded-full bg-light-green px-6 text-xs text-white hover:bg-light-green/90"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
