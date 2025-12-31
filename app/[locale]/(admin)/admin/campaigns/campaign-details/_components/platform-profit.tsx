"use client";

import { cn } from "@/lib/utils";
import CollapsibleCard from "./collapsible-card";
import { useState } from "react";
import InfluencerBadges from "./influencers-badge";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";

type Statistics = {
  label: string;
  value: number;
};

type Influencer = {
  name: string;
  platform: string;
  profileUrl: string;
  amount: number; // always defined
  percentage: number; // always defined
};

type Props = {
  campaignStatus:
    | "needs-quote"
    | "pending-invitations"
    | "active"
    | "completed"
    | "paid";
  stats: Statistics[];
  invitationStatus?: "sent" | "accepted";
};

// Data
const prefferedInfluencers = [
  { name: "Hania Amir", platform: "Instagram", profileUrl: "#" },
  { name: "Shakib Al Hasan", platform: "YouTube", profileUrl: "#" },
  { name: "Virat Kohli", platform: "TikTok", profileUrl: "#" },
  { name: "Nusrat Faria", platform: "Instagram", profileUrl: "#" },
  { name: "Tamim Iqbal", platform: "Facebook", profileUrl: "#" },
  { name: "Alia Bhatt", platform: "Instagram", profileUrl: "#" },
  { name: "MrBeast", platform: "YouTube", profileUrl: "#" },
  { name: "Addison Rae", platform: "TikTok", profileUrl: "#" },
  { name: "Ayman Sadiq", platform: "YouTube", profileUrl: "#" },
  { name: "Irfan Junejo", platform: "Instagram", profileUrl: "#" },
];
const notPrefferedInfluencers = [
  { name: "Ali Zafar", platform: "Instagram", profileUrl: "#" },
  { name: "Mahira Khan", platform: "YouTube", profileUrl: "#" },
];

const allInfluencers: Influencer[] = [
  ...prefferedInfluencers,
  ...notPrefferedInfluencers,
].map((inf) => ({ ...inf, amount: 0, percentage: 0 }));

// Budget
const totalBudget = 100000;

// Converters
const percentageToAmount = (percentage: number) =>
  Math.round((percentage / 100) * totalBudget);

const amountToPercentage = (amount: number) =>
  Number(((amount / totalBudget) * 100).toFixed(2));

export default function PlatformProfit({
  campaignStatus,
  stats,
  invitationStatus,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [profit, setProfit] = useState(2);

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [assignedInfluencers, setAssignedInfluencers] = useState<Influencer[]>(
    []
  );

  const handleSelect = (values: string[]) => {
    setSelectedNames(values);

    const mapped = values.map((name) => {
      const existing = assignedInfluencers.find((i) => i.name === name);
      const influencer = allInfluencers.find((i) => i.name === name)!;

      return (
        existing ?? {
          ...influencer,
          amount: 0,
          percentage: 0,
        }
      );
    });

    setAssignedInfluencers(mapped);
  };

  // Calculate totals for UX display
  const totalPercentage = assignedInfluencers.reduce(
    (sum, i) => sum + i.percentage,
    0
  );
  const totalAmount = assignedInfluencers.reduce((sum, i) => sum + i.amount, 0);

  return (
    <CollapsibleCard heading="Platform Profit & Influencer Management">
      <div>
        {/* Stats grid */}
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

        {/* Needs quote message */}
        {campaignStatus === "needs-quote" && (
          <div className="py-20">
            <p className="text-center text-gray-400">
              Client needs to confirm the quote first
            </p>
          </div>
        )}

        {/* Influencers & Assignments */}
        {campaignStatus !== "needs-quote" && (
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-4 space-y-4">
              <InfluencerBadges
                title="Preffered"
                influencers={prefferedInfluencers}
              />
              <InfluencerBadges
                title="Not Preffered"
                influencers={notPrefferedInfluencers}
              />
            </div>

            <div className="col-span-8">
              <div className="flex items-center justify-between">
                <h2 className="text-Primary mb-2 font-semibold">
                  Assign Influencers
                </h2>
                <p className="text-sm text-orange">Invite Influencers First</p>
              </div>

              <MultiSelect values={selectedNames} onValuesChange={handleSelect}>
                <MultiSelectTrigger className="w-full">
                  <MultiSelectValue placeholder="Select Influencers" />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {allInfluencers.map((influencer) => (
                      <MultiSelectItem
                        key={influencer.name}
                        value={influencer.name}
                      >
                        {influencer.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>

              {/* Assigned influencers table */}
              {assignedInfluencers.length > 0 && (
                <>
                  <div className="mt-6 rounded-lg border overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-Secondary">
                        <tr className="text-Primary">
                          <th className="p-3">Influencer</th>
                          <th className="p-3">Percentage (%)</th>
                          <th className="p-3">Offer amount (৳)</th>
                        </tr>
                      </thead>

                      <tbody>
                        {assignedInfluencers.map((influencer) => (
                          <tr key={influencer.name} className="border-t">
                            <td className="p-3 font-medium">
                              {influencer.name}
                              <p className="text-xs text-gray-400">
                                {influencer.platform}
                              </p>
                            </td>

                            <td className="p-3">
                              {invitationStatus === "sent" && (
                                <input
                                  type="number"
                                  value={
                                    influencer.percentage === 0
                                      ? ""
                                      : influencer.percentage
                                  }
                                  min={0}
                                  max={100}
                                  onChange={(e) => {
                                    const percentage = Number(e.target.value);

                                    setAssignedInfluencers((prev) =>
                                      prev.map((item) =>
                                        item.name === influencer.name
                                          ? {
                                              ...item,
                                              percentage,
                                              amount:
                                                percentageToAmount(percentage),
                                            }
                                          : item
                                      )
                                    );
                                  }}
                                  className="w-24 rounded-md border px-3 py-1 text-right focus:ring-2 focus:ring-light-green"
                                  placeholder="%"
                                />
                              )}
                              {invitationStatus === "accepted" &&
                                `${influencer.percentage}%`}
                            </td>

                            <td className="p-3">
                              {invitationStatus === "sent" && (
                                <input
                                  type="number"
                                  value={
                                    influencer.amount === 0
                                      ? ""
                                      : influencer.amount
                                  }
                                  min={0}
                                  max={totalBudget}
                                  onChange={(e) => {
                                    const amount = Number(e.target.value);

                                    setAssignedInfluencers((prev) =>
                                      prev.map((item) =>
                                        item.name === influencer.name
                                          ? {
                                              ...item,
                                              amount,
                                              percentage:
                                                amountToPercentage(amount),
                                            }
                                          : item
                                      )
                                    );
                                  }}
                                  className="w-32 rounded-md border px-3 py-1 text-right focus:ring-2 focus:ring-light-green"
                                  placeholder="৳0"
                                />
                              )}
                              {invitationStatus === "accepted" &&
                                `৳${influencer.amount}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="mt-3 text-right space-y-1">
                    <p className="text-sm text-gray-500">
                      Total Percentage: {totalPercentage.toFixed(2)}%
                    </p>
                    <p className="font-semibold text-Primary">
                      Total Amount: ৳{totalAmount}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}
