"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import { FaArrowDownLong } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getRecentTransactions } from "@/service/agency/recent-transactions";
import type {
  RecentTransactionItem,
  RecentTransactionsMeta,
  TransactionSortOrder,
} from "@/types/agency/recent-transactions";

const LIMIT = 4;

const defaultMeta: RecentTransactionsMeta = {
  total: 0,
  page: 1,
  limit: LIMIT,
  totalPages: 1,
};

const formatAmount = (amount: number) => {
  return `৳${amount.toLocaleString("en-BD")}`;
};

const formatTransactionTitle = (
  transactionType: string,
  campaignName: string
) => {
  return `${transactionType} for ‘${campaignName}’`;
};

const formatTransactionDate = (value: string) => {
  const date = new Date(value);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffInMs = today.getTime() - target.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  const timeText = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (diffInDays === 0) {
    return `Today, ${timeText}`;
  }

  if (diffInDays === 1) {
    return `Yesterday, ${timeText}`;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const RecentTransactionsCard = () => {
  const [transactions, setTransactions] = useState<RecentTransactionItem[]>([]);
  const [meta, setMeta] = useState<RecentTransactionsMeta>(defaultMeta);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<TransactionSortOrder>("ASC");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;

    const fetchRecentTransactions = async () => {
      try {
        setIsLoading(true);

        const response = await getRecentTransactions({
          page,
          limit: LIMIT,
          search: debouncedSearch,
          sort,
        });

        if (!isMounted) return;

        if (response.success) {
          setTransactions(response.data);
          setMeta(response.meta);
        } else {
          setTransactions([]);
          setMeta(defaultMeta);
        }
      } catch (error) {
        console.error("Failed to load recent transactions:", error);

        if (!isMounted) return;

        setTransactions([]);
        setMeta(defaultMeta);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecentTransactions();

    return () => {
      isMounted = false;
    };
  }, [page, debouncedSearch, sort]);

  const isPreviousDisabled = page <= 1 || isLoading;
  const isNextDisabled = page >= meta.totalPages || isLoading;

  const sortLabel = useMemo(() => {
    return sort === "ASC" ? "Low To High" : "High To Low";
  }, [sort]);

  const toggleSort = () => {
    setSort((previous) => (previous === "ASC" ? "DESC" : "ASC"));
    setPage(1);
  };

  const handlePrevious = () => {
    if (isPreviousDisabled) return;
    setPage((previous) => previous - 1);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    setPage((previous) => previous + 1);
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-Primary">Recent Transactions</CardTitle>
        <CardDescription>
          Browse and manage your earnings of each campaigns
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="relative w-full lg:w-[40%]">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                className="pl-10"
                placeholder="Search By Job name, client name"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>

            <p className="text-sm text-gray-400">
              Showing {transactions.length} of {meta.total} Results
            </p>
          </div>

          <div>
            <Button
              size="sm"
              type="button"
              onClick={toggleSort}
              className="cursor-pointer border border-light-green bg-Secondary text-xs text-light-green hover:bg-Secondary/70"
            >
              {sort === "ASC" ? (
                <ArrowDown className="mr-1 h-4 w-4" />
              ) : (
                <ArrowUp className="mr-1 h-4 w-4" />
              )}
              {sortLabel}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center text-sm text-gray-400">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-light-green text-sm text-gray-400">
              No transactions found.
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div
                key={`${transaction.campaignId}-${transaction.date}-${index}`}
                className="rounded-lg border border-light-green bg-linear-to-r from-white to-Secondary p-2"
              >
                <div className="flex gap-4 items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-light-green bg-linear-to-r from-Secondary to-white text-light-green">
                    <FaArrowDownLong />
                  </div>

                  <div className="flex-1 grow">
                    <h2 className="text-base text-Primary">
                      {formatTransactionTitle(
                        transaction.transactionType,
                        transaction.campaignName
                      )}
                    </h2>

                    <p className="text-xs text-gray-400">
                      {formatTransactionDate(transaction.date)}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className="text-light-green">
                        {formatAmount(transaction.amount)}
                      </p>

                      <Button
                        asChild
                        variant="link"
                        className="px-0 text-light-green"
                      >
                        <Link
                          href={`/agency/campaign-details/${transaction.campaignId}`}
                        >
                          View Campaign Details <ChevronRight />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2 text-gray-500">
            <span>Page</span>
            <div className="flex h-9 min-w-10 items-center justify-center rounded-2xl border border-light-green bg-Secondary px-3 text-Primary">
              {meta.page}
            </div>
            <span>Of {meta.totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={isPreviousDisabled}
              className="bg-[#7A9B57] text-white hover:bg-[#6d8e4d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              className="bg-[#7A9B57] text-white hover:bg-[#6d8e4d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;