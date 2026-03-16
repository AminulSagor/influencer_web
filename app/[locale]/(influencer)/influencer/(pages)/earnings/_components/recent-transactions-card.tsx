"use client";

import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { getTransactions } from "@/service/influencer/earnings/transactions";
import { TransactionItem } from "@/types/influencer/earnings/transactions";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentTransactionsCard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("influencer.earning");
  const locale = useLocale();
  const limit = 10;

  const fetchTransactions = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await getTransactions(page, limit, search || undefined);
      setTransactions(res.data);
      setTotal(res.meta.total);
      setTotalPages(res.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setError("Failed to load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const debounce = setTimeout(fetchTransactions, 300);
    return () => clearTimeout(debounce);
  }, [fetchTransactions]);

  return (
    <div className="rounded-2xl border bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-[#4B6B2A]">
          {t("Recent Transactions")}
        </h3>
        <p className="text-sm text-gray-400">
          {t("Browse and manage your earnings of each campaigns")}
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={t("Search By Job name, client name")}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-[#7FA35A]"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Showing {transactions.length} Of {total} Results</span>
        </div>
      </div>

      {/* List */}
      <div className="px-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-xl border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="h-4 w-36 self-start md:self-center" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={fetchTransactions}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#6E8F4A] text-white text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">No transactions found</p>
          </div>
        ) : (
          transactions.map((item) => {
            const isIncome = item.status !== "Withdrawal";
            const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={item.transactionId}
                className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-xl border
                  ${
                    isIncome
                      ? "border-[#B8D29A] bg-[#F7FAEC]"
                      : "border-[#FFC48A] bg-[#FFF7ED]"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full
                      ${
                        isIncome
                          ? "bg-[#E3EACD] text-[#4B6B2A]"
                          : "bg-[#FFE5CC] text-[#C96A1B]"
                      }
                    `}
                  >
                    {isIncome ? (
                      <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUp className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <p
                      className={`font-medium ${
                        isIncome ? "text-[#4B6B2A]" : "text-[#C96A1B]"
                      }`}
                    >
                      {item.jobName}
                    </p>
                    <p className="text-sm text-gray-400">{formattedDate} &middot; {item.clientName}</p>
                    <p
                      className={`font-semibold ${
                        isIncome ? "text-[#4B6B2A]" : "text-[#C96A1B]"
                      }`}
                    >
                      ৳{item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{item.status} &middot; {item.paymentMethod}</p>
                  </div>
                </div>

                <Link
                  href={`/${locale}/influencer/campaign-details/${item.jobId}`}
                  className={`text-sm font-medium underline self-start md:self-center
                    ${isIncome ? "text-[#4B6B2A]" : "text-[#C96A1B]"}
                  `}
                >
                  {t("View Campaign Details")} →
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="p-6 flex items-center justify-end gap-3 text-sm">
        <span className="text-gray-400">Page</span>
        <span className="px-3 py-1 rounded-md bg-[#F7FAEC] border text-[#4B6B2A]">
          {page}
        </span>
        <span className="text-gray-400">Of {totalPages}</span>

        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className={`px-4 py-1.5 rounded-lg ${page > 1 ? "bg-[#6E8F4A] text-white" : "bg-gray-300 text-white cursor-not-allowed"}`}
        >
          {t("Previous")}
        </button>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className={`px-4 py-1.5 rounded-lg ${page < totalPages ? "bg-[#6E8F4A] text-white" : "bg-gray-300 text-white cursor-not-allowed"}`}
        >
          {t("Next")}
        </button>
      </div>
    </div>
  );
}