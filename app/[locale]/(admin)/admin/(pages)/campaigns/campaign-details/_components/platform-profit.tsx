"use client";

import React, { useMemo, useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";
import { getAllInfluencer } from "@/api/admin/campaign/get-campaign";

type Statistics = { label: string; value: number };

type CampaignInfluencer = {
  id: string;
  firstName: string;
  lastName: string;
  profileImg: string | null;
};

type AllInfluencerApiItem = {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImg?: string | null;
  name?: string;
};

type InfluencerBadgeItem = {
  name: string;
  platform: string;
  profileUrl: string;
};

type Influencer = {
  id: string;
  name: string;
  platform: string;
  profileUrl: string;
  amount: number;
  percentage: number;
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

  // ✅ none = quote not sent, sent = waiting client, confirmed = client confirmed
  quoteState: "none" | "sent" | "confirmed";

  preferredInfluencers?: CampaignInfluencer[];
  notPreferableInfluencers?: CampaignInfluencer[];
};

const money = (n: number) => {
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("en-US");
};

const fullName = (i: { firstName?: string; lastName?: string; name?: string }) => {
  if (i?.name) return i.name;
  return `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim();
};

export default function PlatformProfit({
  stats,
  invitationStatus,
  preferredInfluencers = [],
  notPreferableInfluencers = [],
  quoteState,
}: Props) {
  // ✅ lock until client confirms quote
  const locked = quoteState !== "confirmed";

  const [allInfluencersApi, setAllInfluencersApi] = useState<AllInfluencerApiItem[]>([]);

  useEffect(() => {
    if (locked) return;

    const loadAll = async () => {
      try {
        const res = await getAllInfluencer();
        setAllInfluencersApi(res?.data ?? []);
      } catch (e) {
        console.error("❌ getAllInfluencer failed:", e);
      }
    };

    loadAll();
  }, [locked]);

  const finalQuotedBudget = Number(stats?.[0]?.value ?? 0);
  const PLATFORM_FEE_PERCENT = 2;

  const platformFeeAmount = useMemo(
    () => Math.round((finalQuotedBudget * PLATFORM_FEE_PERCENT) / 100),
    [finalQuotedBudget]
  );

  const availableForInfluencers = useMemo(() => {
    const v = finalQuotedBudget - platformFeeAmount;
    return v < 0 ? 0 : v;
  }, [finalQuotedBudget, platformFeeAmount]);

  const preferredList: InfluencerBadgeItem[] = useMemo(() => {
    return (preferredInfluencers ?? []).map((i) => ({
      name: fullName(i) || i.id,
      platform: "—",
      profileUrl: "#",
    }));
  }, [preferredInfluencers]);

  const notPreferredList: InfluencerBadgeItem[] = useMemo(() => {
    return (notPreferableInfluencers ?? []).map((i) => ({
      name: fullName(i) || i.id,
      platform: "—",
      profileUrl: "#",
    }));
  }, [notPreferableInfluencers]);

  const dropdownInfluencers: Influencer[] = useMemo(() => {
    return (allInfluencersApi ?? []).map((i) => ({
      id: i.id,
      name: fullName(i) || i.id,
      platform: "—",
      profileUrl: "#",
      amount: 0,
      percentage: 0,
    }));
  }, [allInfluencersApi]);

  // ---------------- assignment logic ----------------
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assignedInfluencers, setAssignedInfluencers] = useState<Influencer[]>([]);

  const handleSelect = (values: string[]) => {
    setSelectedIds(values);

    const mapped = values.map((id) => {
      const existing = assignedInfluencers.find((i) => i.id === id);
      const base = dropdownInfluencers.find((i) => i.id === id);

      return (
        existing ??
        base ?? {
          id,
          name: id,
          platform: "—",
          profileUrl: "#",
          amount: 0,
          percentage: 0,
        }
      );
    });

    setAssignedInfluencers(mapped);
  };

  const percentageToAmount = (percentage: number) =>
    Math.round((percentage / 100) * availableForInfluencers);

  const amountToPercentage = (amount: number) =>
    availableForInfluencers === 0
      ? 0
      : Number(((amount / availableForInfluencers) * 100).toFixed(2));

  const totalPercentage = assignedInfluencers.reduce((sum, i) => sum + (i.percentage || 0), 0);
  const totalAmount = assignedInfluencers.reduce((sum, i) => sum + (i.amount || 0), 0);

  const isReadOnly = invitationStatus === "accepted";

  return (
    <CollapsibleCard heading="Platform Profit & Influencer Management">
      <div>
        {/* top stats */}
        <div className="grid grid-cols-12 gap-4">
          <div
            className={cn(
              "col-span-12 md:col-span-4 rounded-lg border p-4 space-y-2",
              locked
                ? "border-[rgba(100,116,139,0.14)] bg-[rgba(248,250,252,1)]"
                : "border-light-green/40 bg-linear-to-r from-white to-Secondary"
            )}
          >
            <p className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-light-green")}>
              ৳{money(locked ? 0 : finalQuotedBudget)}
            </p>
            <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-Primary")}>
              Final Quoted Budget
            </h3>
          </div>

          <div
            className={cn(
              "col-span-12 md:col-span-4 rounded-lg border p-4 space-y-2",
              locked
                ? "border-[rgba(100,116,139,0.14)] bg-[rgba(248,250,252,1)]"
                : "border-light-green/40 bg-linear-to-r from-white to-Secondary"
            )}
          >
            <p
              className={cn("text-2xl font-semibold", locked ? "text-gray-400" : "text-light-green")}
            >
              {PLATFORM_FEE_PERCENT}%
            </p>
            <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-Primary")}>
              Target Profit / Platform Fee
            </h3>
            <p className={cn("text-xs", locked ? "text-gray-400" : "text-gray-500")}>
              ৳{money(locked ? 0 : platformFeeAmount)}
            </p>
          </div>

          <div
            className={cn(
              "col-span-12 md:col-span-4 rounded-lg border p-4 space-y-2",
              locked
                ? "border-[rgba(100,116,139,0.14)] bg-[rgba(248,250,252,1)]"
                : "border-light-green/40 bg-linear-to-r from-white to-Secondary"
            )}
          >
            <p className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-light-green")}>
              ৳{money(locked ? 0 : availableForInfluencers)}
            </p>
            <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-orange")}>
              Available For Influencers
            </h3>
            <p className={cn("text-sm font-normal", locked ? "text-gray-400" : "text-orange")}>
              amount assigned
            </p>
          </div>
        </div>

        {/* locked UI (quote sent but not accepted) */}
        {locked ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Client needs to confirm the quote first
          </div>
        ) : (
          <>
            {/* unlocked UI (after confirmation) */}
            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 md:col-span-4 space-y-4">
                <InfluencerBadges title="Preffered" influencers={preferredList} />
                <InfluencerBadges title="Not Preferable" influencers={notPreferredList} />
              </div>

              <div className="col-span-12 md:col-span-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-Primary mb-2 font-semibold">Assign Influencers</h2>
                  <p className="text-sm text-orange">Campaign Ongoing</p>
                </div>

                <MultiSelect values={selectedIds} onValuesChange={handleSelect}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select Influencers" />
                  </MultiSelectTrigger>

                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {dropdownInfluencers.map((inf) => (
                        <MultiSelectItem key={inf.id} value={inf.id}>
                          {inf.name}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>

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
                          <tr key={inf.id} className="border-t">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gray-200" />
                                <div>
                                  <p className="font-medium">{inf.name}</p>
                                  <p className="text-xs text-gray-400">{inf.platform}</p>
                                </div>
                              </div>
                            </td>

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
                                        x.id === inf.id
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
                                        x.id === inf.id
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

                {assignedInfluencers.length > 0 && (
                  <div className="mt-3 text-right space-y-1">
                    <p className="text-sm text-gray-500">
                      Total Percentage: {totalPercentage.toFixed(2)}%
                    </p>
                    <p className="font-semibold text-Primary">Total Amount: ৳{money(totalAmount)}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </CollapsibleCard>
  );
}
