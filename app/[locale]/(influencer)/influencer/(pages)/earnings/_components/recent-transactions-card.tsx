"use client";

import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useState } from "react";

const transactions = [
  {
    id: 1,
    title: "Payment For ‘Summer Sale’",
    time: "Today, 2:30 PM",
    amount: "৳20,000",
    type: "income",
  },
  {
    id: 2,
    title: "Withdrawal Request",
    time: "Today, 2:30 PM",
    amount: "৳20,000",
    type: "withdraw",
  },
  {
    id: 3,
    title: "Payment For ‘Summer Sale’",
    time: "Today, 2:30 PM",
    amount: "৳20,000",
    type: "income",
  },
  {
    id: 4,
    title: "Withdrawal Request",
    time: "Today, 2:30 PM",
    amount: "৳20,000",
    type: "withdraw",
  },
];

export default function RecentTransactionsCard() {
  const [search, setSearch] = useState("");

  return (
    <div className="rounded-2xl border bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-[#4B6B2A]">
          Recent Transactions
        </h3>
        <p className="text-sm text-gray-400">
          Browse and manage your earnings of each campaigns
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Job Name, Client Name"
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:border-[#7FA35A]"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Showing 4 Of 20 Results</span>

          <button className="flex items-center gap-1 px-3 py-1 rounded-md border bg-[#F7FAEC] text-[#4B6B2A]">
            ↓ Low To High
          </button>
        </div>
      </div>

      {/* List */}
      <div className="px-6 space-y-4">
        {transactions.map((item) => {
          const isIncome = item.type === "income";

          return (
            <div
              key={item.id}
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
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-400">{item.time}</p>
                  <p
                    className={`font-semibold ${
                      isIncome ? "text-[#4B6B2A]" : "text-[#C96A1B]"
                    }`}
                  >
                    {item.amount}
                  </p>
                </div>
              </div>

              <button
                className={`text-sm font-medium underline self-start md:self-center
                  ${isIncome ? "text-[#4B6B2A]" : "text-[#C96A1B]"}
                `}
              >
                View Campaign Details →
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="p-6 flex items-center justify-end gap-3 text-sm">
        <span className="text-gray-400">Page</span>
        <span className="px-3 py-1 rounded-md bg-[#F7FAEC] border text-[#4B6B2A]">
          1
        </span>
        <span className="text-gray-400">Of 5</span>

        <button className="px-4 py-1.5 rounded-lg bg-[#6E8F4A] text-white">
          Next
        </button>
      </div>
    </div>
  );
}
