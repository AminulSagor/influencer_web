"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { getAllInfluencer } from "@/api/admin/campaign/get-campaign";
import {
  assignCampaignInfluencers,
  fetchCampaignInvitations,
} from "@/api/admin/campaign/assign-influencer";

import { money as moneyFmt } from "@/utils/admin/campaign/campaign_calculation_util";
import { calcPlatformFee, clampPercent } from "@/utils/admin/campaign/platform_fee_util";

type Statistics = { label: string; value: number };

type CampaignInfluencer = {
  id: string;
  firstName: string;
  lastName: string;
  profileImg: string | null;
};

type AllInfluencerApiItem = {
  id: string;
  profileId?: string;
  firstName?: string;
  lastName?: string;
  profileImg?: string | null;
  name?: string;
};

type InvitationApiItem = {
  jobId: string;
  influencerName: string;
  status?: string;
  sentAt?: string;
  respondedAt?: string | null;
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
  campaignId: string;
  campaignStatus:
    | "needs-quote"
    | "pending-invitations"
    | "active"
    | "completed"
    | "paid";

  stats: Statistics[];
  quoteState: "none" | "sent" | "confirmed";

  preferredInfluencers?: CampaignInfluencer[];
  notPreferableInfluencers?: CampaignInfluencer[];

  // ✅ NEW: editable platform fee %
  platformFeePercent?: number; // default 2
  onChangePlatformFeePercent?: (next: number) => void;

  onRefresh?: () => void;
};

const fullName = (i: { firstName?: string; lastName?: string; name?: string }) => {
  if (i?.name && i.name.trim()) return i.name.trim();
  return `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim();
};

const uniq = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean);

export default function PlatformProfit({
  campaignId,
  campaignStatus,
  stats,
  preferredInfluencers = [],
  notPreferableInfluencers = [],
  quoteState,

  platformFeePercent = 2,
  onChangePlatformFeePercent,
}: Props) {
  const locked = quoteState !== "confirmed";

  const [allInfluencersApi, setAllInfluencersApi] = useState<AllInfluencerApiItem[]>([]);
  const [savingDraft, setSavingDraft] = useState(false);
  const [loadingInvitations, setLoadingInvitations] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assignedInfluencers, setAssignedInfluencers] = useState<Influencer[]>([]);
  const [lastSavedIds, setLastSavedIds] = useState<string[]>([]);

  // ✅ editable platform fee %
  const [feeEdit, setFeeEdit] = useState(false);
  const [feePercent, setFeePercent] = useState<number>(platformFeePercent);

  useEffect(() => setFeePercent(platformFeePercent), [platformFeePercent]);

  // --------- budget math ----------
  const finalQuotedBudget = Number(stats?.[0]?.value ?? 0);

  const { platformFeeAmount, availableBudget: availableForInfluencers } = useMemo(() => {
    return calcPlatformFee(finalQuotedBudget, feePercent);
  }, [finalQuotedBudget, feePercent]);

  // --------- badges (display only) ----------
  const preferredList: InfluencerBadgeItem[] = useMemo(() => {
    return (preferredInfluencers ?? []).map((i) => ({
      name: fullName(i) || "Unknown Influencer",
      platform: "—",
      profileUrl: "#",
    }));
  }, [preferredInfluencers]);

  const notPreferredList: InfluencerBadgeItem[] = useMemo(() => {
    return (notPreferableInfluencers ?? []).map((i) => ({
      name: fullName(i) || "Unknown Influencer",
      platform: "—",
      profileUrl: "#",
    }));
  }, [notPreferableInfluencers]);

  // dropdown list
  const dropdownInfluencers: Influencer[] = useMemo(() => {
    return (allInfluencersApi ?? []).map((i) => ({
      id: i.profileId || i.id,
      name: fullName(i) || "Unknown Influencer",
      platform: "—",
      profileUrl: "#",
      amount: 0,
      percentage: 0,
    }));
  }, [allInfluencersApi]);

  const resolveNameById = useCallback(
    (id: string) => dropdownInfluencers.find((x) => x.id === id)?.name || "Unknown Influencer",
    [dropdownInfluencers]
  );

  // load all influencers
  useEffect(() => {
    if (locked) return;
    if (!campaignId) return;

    const loadAllInfluencers = async () => {
      try {
        const res: any = await getAllInfluencer();
        const list = res?.data?.data ?? res?.data ?? [];
        setAllInfluencersApi(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("❌ getAllInfluencer failed:", e);
      }
    };

    loadAllInfluencers();
  }, [locked, campaignId]);

  // fetch invitations -> build selectedIds (best effort)
  const fetchAndSyncInvitations = useCallback(async () => {
    if (locked) return;
    if (!campaignId) return;

    setLoadingInvitations(true);
    try {
      const res: any = await fetchCampaignInvitations(campaignId);
      const list: InvitationApiItem[] = res?.data?.data ?? [];

      const names = uniq(
        (Array.isArray(list) ? list : [])
          .filter((x) => String(x?.status ?? "").toLowerCase() === "draft")
          .map((x) => String(x?.influencerName ?? "").trim())
          .filter(Boolean)
      );

      const idsFromNames = uniq(
        names.map((name) => {
          const found = dropdownInfluencers.find(
            (d) => d.name.trim().toLowerCase() === name.toLowerCase()
          );
          return found?.id ?? "";
        })
      );

      setSelectedIds(idsFromNames);
      setLastSavedIds(idsFromNames);
    } catch (e) {
      console.error("❌ fetchCampaignInvitations failed:", e);
    } finally {
      setLoadingInvitations(false);
    }
  }, [locked, campaignId, dropdownInfluencers]);

  useEffect(() => {
    fetchAndSyncInvitations();
  }, [fetchAndSyncInvitations]);

  // ✅ initialize equal percentages on selection change
  useEffect(() => {
    if (locked) return;

    const ids = uniq(selectedIds);
    if (ids.length === 0) {
      setAssignedInfluencers([]);
      return;
    }

    const equalPct = clampPercent(100 / ids.length);

    setAssignedInfluencers(
      ids.map((id) => ({
        id,
        name: resolveNameById(id),
        platform: "—",
        profileUrl: "#",
        percentage: equalPct,
        amount: Math.round((availableForInfluencers * equalPct) / 100),
      }))
    );
  }, [locked, selectedIds, availableForInfluencers, resolveNameById]);

  // ✅ editable percentage -> amount recalculates
  const updateInfluencerPercent = (id: string, nextPct: number) => {
    const pct = clampPercent(nextPct);

    setAssignedInfluencers((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, percentage: pct, amount: Math.round((availableForInfluencers * pct) / 100) }
          : x
      )
    );
  };

  const totalPercentage = assignedInfluencers.reduce((sum, i) => sum + (i.percentage || 0), 0);
  const totalAmount = assignedInfluencers.reduce((sum, i) => sum + (i.amount || 0), 0);

  const handleSelect = (values: string[]) => {
    setSelectedIds(uniq(values));
  };

  const hasUnsavedChanges = useMemo(() => {
    const a = uniq(selectedIds).sort().join("|");
    const b = uniq(lastSavedIds).sort().join("|");
    return a !== b;
  }, [selectedIds, lastSavedIds]);

  const handleSaveAssignments = async () => {
    const ids = uniq(selectedIds);
    if (!campaignId) return;

    try {
      setSavingDraft(true);

      await assignCampaignInfluencers({
        campaignId,
        influencerIds: ids,
      });

      await fetchAndSyncInvitations();
    } catch (e: any) {
      console.error("❌ assignCampaignInfluencers failed:", e);
      console.log("Backend message:", e?.response?.data);
    } finally {
      setSavingDraft(false);
    }
  };

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
              ৳{moneyFmt(locked ? 0 : finalQuotedBudget)}
            </p>
            <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-Primary")}>
              Final Quoted Budget
            </h3>
          </div>

          {/* ✅ editable fee percent */}
          <div
            className={cn(
              "col-span-12 md:col-span-4 rounded-lg border p-4 space-y-2",
              locked
                ? "border-[rgba(100,116,139,0.14)] bg-[rgba(248,250,252,1)]"
                : "border-light-green/40 bg-linear-to-r from-white to-Secondary"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                {feeEdit ? (
                  <div className="relative max-w-[140px]">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={feePercent}
                      onChange={(e) => setFeePercent(Number(e.target.value || 0))}
                      className="pr-8"
                      disabled={locked}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                ) : (
                  <p
                    className={cn(
                      "text-2xl font-semibold",
                      locked ? "text-gray-400" : "text-light-green"
                    )}
                  >
                    {clampPercent(feePercent)}%
                  </p>
                )}

                <h3
                  className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-Primary")}
                >
                  Target Profit / Platform Fee
                </h3>
                <p className={cn("text-xs", locked ? "text-gray-400" : "text-gray-500")}>
                  ৳{moneyFmt(locked ? 0 : platformFeeAmount)}
                </p>
              </div>

              {!locked && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-Primary hover:bg-black/5"
                  onClick={() => {
                    if (!feeEdit) return setFeeEdit(true);
                    setFeeEdit(false);
                    onChangePlatformFeePercent?.(clampPercent(feePercent));
                  }}
                >
                  {feeEdit ? "Save" : "Edit"}
                </Button>
              )}
            </div>
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
              ৳{moneyFmt(locked ? 0 : availableForInfluencers)}
            </p>
            <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-orange")}>
              Available For Influencers
            </h3>
            <p className={cn("text-sm font-normal", locked ? "text-gray-400" : "text-orange")}>
              amount assigned
            </p>
          </div>
        </div>

        {locked ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Client needs to confirm the quote first
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 md:col-span-4 space-y-4">
                <InfluencerBadges title="Preffered" influencers={preferredList} />
                <InfluencerBadges title="Not Preferable" influencers={notPreferredList} />
              </div>

              <div className="col-span-12 md:col-span-8">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-Primary mb-1 font-semibold">Assign Influencers</h2>
                    <p className="text-xs text-gray-500">
                      {loadingInvitations
                        ? "Loading invitations..."
                        : hasUnsavedChanges
                        ? "Unsaved changes"
                        : "All changes saved"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setSelectedIds([])}
                      variant="outline"
                      disabled={savingDraft || loadingInvitations}
                    >
                      Clear
                    </Button>

                    <Button
                      className="bg-Primary"
                      onClick={handleSaveAssignments}
                      disabled={savingDraft || loadingInvitations || !hasUnsavedChanges}
                    >
                      {savingDraft ? "Saving..." : "Save Assignments"}
                    </Button>
                  </div>
                </div>

                <div className="mt-3">
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
                </div>

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

                            {/* ✅ editable percentage input */}
                            <td className="p-3 w-[160px]">
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={Number.isFinite(inf.percentage) ? inf.percentage : 0}
                                onChange={(e) =>
                                  updateInfluencerPercent(inf.id, Number(e.target.value || 0))
                                }
                                className="text-right"
                              />
                            </td>

                            {/* calculated amount */}
                            <td className="p-3 w-[180px]">
                              <Input
                                type="text"
                                value={`৳ ${moneyFmt(inf.amount)}`}
                                readOnly
                                className="text-right bg-[rgba(248,250,252,1)] text-gray-600"
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {assignedInfluencers.length > 0 && (
                  <div className="mt-3 text-right space-y-1">
                    <p className={cn("text-sm", totalPercentage > 100 ? "text-red" : "text-gray-500")}>
                      Total Percentage: {totalPercentage.toFixed(2)}%
                      {totalPercentage > 100 ? " (exceeds 100%)" : ""}
                    </p>
                    <p className="font-semibold text-Primary">
                      Total Amount: ৳{moneyFmt(totalAmount)}
                    </p>
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