"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import CollapsibleCard from "./collapsible-card";
import InfluencerBadges from "./influencers-badge";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";

type Statistics = {
  label: string;
  value: number;
};

type Influencer = {
  name: string;
  platform: string;
  profileUrl: string;
  amount: number;
  percentage: number;
};

type Props = {
  // keep same signature (your page already passes these)
  campaignStatus:
    | "needs-quote"
    | "pending-invitations"
    | "active"
    | "completed"
    | "paid";
  stats: Statistics[];
  invitationStatus?: "sent" | "accepted";
};

/* ---------------- demo lists (until backend provides influencers) ---------------- */
const prefferedInfluencers = [
  { name: "Hania Amir", platform: "Instagram", profileUrl: "#" },
  { name: "Shakib Al Hasan", platform: "YouTube", profileUrl: "#" },
  { name: "Virat Kohli", platform: "TikTok", profileUrl: "#" },
  { name: "Nusrat Faria", platform: "Instagram", profileUrl: "#" },
  { name: "Tamim Iqbal", platform: "Facebook", profileUrl: "#" },
];

const notPrefferedInfluencers = [
  { name: "Ali Zafar", platform: "Instagram", profileUrl: "#" },
  { name: "Mahira Khan", platform: "YouTube", profileUrl: "#" },
];

const allInfluencers: Influencer[] = [...prefferedInfluencers, ...notPrefferedInfluencers].map(
  (inf) => ({ ...inf, amount: 0, percentage: 0 })
);

/* ---------------- helpers ---------------- */
const money = (n: number) => {
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("en-US");
};

export default function PlatformProfit({ stats, invitationStatus }: Props) {
  // ✅ Final Quoted Budget comes from stats[0] (your page sends totalBudget there)
  const finalQuotedBudget = Number(stats?.[0]?.value ?? 0);

  // ✅ fixed platform fee percent
  const PLATFORM_FEE_PERCENT = 2;

  const platformFeeAmount = useMemo(() => {
    return Math.round((finalQuotedBudget * PLATFORM_FEE_PERCENT) / 100);
  }, [finalQuotedBudget]);

  const availableForInfluencers = useMemo(() => {
    const v = finalQuotedBudget - platformFeeAmount;
    return v < 0 ? 0 : v;
  }, [finalQuotedBudget, platformFeeAmount]);

  // ✅ selection/assignment
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [assignedInfluencers, setAssignedInfluencers] = useState<Influencer[]>([]);

  const handleSelect = (values: string[]) => {
    setSelectedNames(values);

    const mapped = values.map((name) => {
      const existing = assignedInfluencers.find((i) => i.name === name);
      const base = allInfluencers.find((i) => i.name === name)!;
      return existing ?? { ...base, amount: 0, percentage: 0 };
    });

    setAssignedInfluencers(mapped);
  };

  // conversions should be based on availableForInfluencers (NOT a hardcoded 100000)
  const percentageToAmount = (percentage: number) =>
    Math.round((percentage / 100) * availableForInfluencers);

  const amountToPercentage = (amount: number) =>
    availableForInfluencers === 0 ? 0 : Number(((amount / availableForInfluencers) * 100).toFixed(2));

  const totalPercentage = assignedInfluencers.reduce((sum, i) => sum + (i.percentage || 0), 0);
  const totalAmount = assignedInfluencers.reduce((sum, i) => sum + (i.amount || 0), 0);

  // UI should NOT depend on “client approval”
  const isReadOnly = invitationStatus === "accepted";

  return (
    <CollapsibleCard heading="Platform Profit & Influencer Management">
      <div>
        {/* ---------------- top stats (match UI) ---------------- */}
        <div className="grid grid-cols-12 gap-4">
          {/* Final Quoted Budget */}
          <div className="col-span-12 md:col-span-4 rounded-lg border border-light-green/40 bg-linear-to-r from-white to-Secondary p-4 space-y-2">
            <p className="text-xl font-semibold text-light-green">৳{money(finalQuotedBudget)}</p>
            <h3 className="text-xl font-semibold text-Primary">Final Quoted Budget</h3>
          </div>

          {/* Fixed 2% */}
          <div className="col-span-12 md:col-span-4 rounded-lg border border-light-green/40 bg-linear-to-r from-white to-Secondary p-4 space-y-2">
            <p className="text-2xl font-semibold text-light-green">{PLATFORM_FEE_PERCENT}%</p>
            <h3 className="text-xl font-semibold text-Primary">Target Profit / Platform Fee</h3>
            <p className="text-xs text-gray-500">৳{money(platformFeeAmount)}</p>
          </div>

          {/* Available For Influencers */}
          <div className="col-span-12 md:col-span-4 rounded-lg border border-light-green/40 bg-linear-to-r from-white to-Secondary p-4 space-y-2">
            <p className="text-xl font-semibold text-light-green">৳{money(availableForInfluencers)}</p>
            <h3 className="text-xl font-semibold text-orange">Available For Influencers</h3>
            <p className="text-sm font-normal text-orange">amount assigned</p>
          </div>
        </div>

        {/* ---------------- bottom section (match screenshot) ---------------- */}
        <div className="grid grid-cols-12 gap-4 mt-6">
          {/* Left lists */}
          <div className="col-span-12 md:col-span-4 space-y-4">
            <InfluencerBadges title="Preffered" influencers={prefferedInfluencers} />
            <InfluencerBadges title="Not Preferable" influencers={notPrefferedInfluencers} />
          </div>

          {/* Right assign area */}
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="text-Primary mb-2 font-semibold">Assign Influencers</h2>
              <p className="text-sm text-orange">Campaign Ongoing</p>
            </div>

            <MultiSelect values={selectedNames} onValuesChange={handleSelect}>
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="Select Influencers" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {allInfluencers.map((influencer) => (
                    <MultiSelectItem key={influencer.name} value={influencer.name}>
                      {influencer.name}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>

            {/* Assigned influencers table */}
            <div className="mt-4 rounded-lg border overflow-hidden">
              <div className="bg-linear-to-r from-white to-Secondary px-4 py-3 flex items-center justify-between">
                <p className="text-sm font-medium text-Primary">
                  Influencers ({assignedInfluencers.length})
                </p>

                <div className="flex items-center gap-3">
                  <Badge variant="lightGreen">Percentage</Badge>
                  <Badge variant="lightGreen">Offer Amount</Badge>
                </div>
              </div>

              <table className="w-full text-left">
                <tbody>
                  {assignedInfluencers.length === 0 ? (
                    <tr>
                      <td className="p-4 text-sm text-gray-400">
                        Select influencers to assign percentage/amount.
                      </td>
                    </tr>
                  ) : (
                    assignedInfluencers.map((inf) => (
                      <tr key={inf.name} className="border-t">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gray-200" />
                            <div>
                              <p className="font-medium">{inf.name}</p>
                              <p className="text-xs text-gray-400">{inf.platform}</p>
                            </div>
                          </div>
                        </td>

                        {/* Percentage */}
                        <td className="p-3 w-[160px]">
                          {isReadOnly ? (
                            <p className="text-right">{inf.percentage || 0}%</p>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={inf.percentage === 0 ? "" : inf.percentage}
                              onChange={(e) => {
                                const percentage = Number(e.target.value);
                                setAssignedInfluencers((prev) =>
                                  prev.map((x) =>
                                    x.name === inf.name
                                      ? {
                                          ...x,
                                          percentage,
                                          amount: percentageToAmount(percentage),
                                        }
                                      : x
                                  )
                                );
                              }}
                              className="w-full rounded-md border px-3 py-2 text-right focus:ring-2 focus:ring-light-green"
                              placeholder="0%"
                            />
                          )}
                        </td>

                        {/* Amount */}
                        <td className="p-3 w-[180px]">
                          {isReadOnly ? (
                            <p className="text-right font-semibold">৳ {money(inf.amount || 0)}</p>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={availableForInfluencers}
                              value={inf.amount === 0 ? "" : inf.amount}
                              onChange={(e) => {
                                const amount = Number(e.target.value);
                                setAssignedInfluencers((prev) =>
                                  prev.map((x) =>
                                    x.name === inf.name
                                      ? {
                                          ...x,
                                          amount,
                                          percentage: amountToPercentage(amount),
                                        }
                                      : x
                                  )
                                );
                              }}
                              className="w-full rounded-md border px-3 py-2 text-right focus:ring-2 focus:ring-light-green"
                              placeholder="৳0"
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* totals (optional, safe) */}
            {assignedInfluencers.length > 0 && (
              <div className="mt-3 text-right space-y-1">
                <p className="text-sm text-gray-500">
                  Total Percentage: {totalPercentage.toFixed(2)}%
                </p>
                <p className="font-semibold text-Primary">
                  Total Amount: ৳{money(totalAmount)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}