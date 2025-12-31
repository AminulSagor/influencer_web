"use client";
import { cn } from "@/lib/utils";
import CollapsibleCard from "./collapsible-card";
import { useState } from "react";
import { Pencil } from "lucide-react";

type Statistics = {
  label: string;
  value: number;
};

type Props = {
  campaignStatus:
    | "needs-quote"
    | "pending-invitations"
    | "active"
    | "completed"
    | "paid";
  stats: Statistics[];
};

const PlatformProfit = ({ campaignStatus, stats }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profit, setProfit] = useState(2);
  return (
    <CollapsibleCard heading="Platform Profit & Influencer Management">
      <div>
        <div className="grid grid-cols-12 gap-4">
          {stats.map((item, index) => {
            const isNeedsQuote = campaignStatus === "needs-quote";
            const isLast = index === stats.length - 1;
            const isFirst = index === 0;
            const isMiddle = !isFirst && !isLast;

            return (
              <div
                key={item.label}
                className={cn(
                  "col-span-4 rounded-lg border p-4 space-y-2 transition-all",

                  // background
                  isNeedsQuote
                    ? "bg-linear-to-r from-white to-[#E8E8E8]"
                    : "bg-linear-to-r from-white to-Secondary"
                )}
              >
                <p
                  className={cn(
                    "text-xl font-semibold flex items-center gap-2",
                    isNeedsQuote
                      ? "text-gray-400"
                      : isMiddle
                      ? "text-orange"
                      : "text-light-green"
                  )}
                >
                  {isNeedsQuote ? (
                    `৳${item.value}`
                  ) : isMiddle ? (
                    isEditing ? (
                      <input
                        type="number"
                        value={profit}
                        onChange={(e) => setProfit(Number(e.target.value))}
                        onBlur={() => setIsEditing(false)}
                        className="w-16 rounded-md border border-light-green bg-white px-2 py-1 text-light-green focus:outline-none focus:ring-2 focus:ring-light-green"
                      />
                    ) : (
                      <>
                        <span className="text-light-green border px-10 rounded-md bg-white">
                          {profit}%
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="text-light-green text-sm font-normal hover:opacity-80"
                        >
                          Edit
                        </button>
                      </>
                    )
                  ) : (
                    `৳${item.value}`
                  )}
                </p>

                <h3
                  className={cn(
                    "text-xl font-semibold",
                    isNeedsQuote
                      ? "text-gray-400"
                      : isLast
                      ? "text-orange"
                      : "text-Primary"
                  )}
                >
                  {item.label}
                  {isLast && (
                    <p className="text-sm font-normal"> amount assigned</p>
                  )}
                </h3>
              </div>
            );
          })}
        </div>

        {campaignStatus === "needs-quote" && (
          <div className="py-20">
            <p className="text-center text-gray-400">
              Client needs to confirm the quote first
            </p>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export default PlatformProfit;
