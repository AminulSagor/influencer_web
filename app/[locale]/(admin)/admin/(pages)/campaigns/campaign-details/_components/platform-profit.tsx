"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";

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

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { getAllInfluencer } from "@/service/admin/campaign/get-campaign";
import { money as moneyFmt } from "@/utils/admin/campaign/campaign_calculation_util";
import { clampPercent } from "@/utils/admin/campaign/platform_fee_util";

import type {
  AssignedRow,
  AllInfluencerserviceItem,
  CampaignInfluencer,
  InfluencerBadgeItem,
  QuoteState,
  Statistics,
} from "@/types/admin/campaign/platform_profit_type";

import {
  getDraftAssignments,
  deleteAssignment,
  patchAssignment,
  postAssignInfluencer,
} from "@/service/admin/campaign/influencer-assignments";

import {
  getGeneralSettings,
  patchGeneralSettings,
} from "@/service/admin/campaign/general-settings";
import { getCampaignByIdFromAdmin } from "@/service/admin/campaign/get-campaign";
import type { CampaignStatusType } from "@/types/admin/campaign/campaign_details_type";


type Props = {
  campaignId: string;
  stats: Statistics[];
  quoteState: QuoteState;
  campaignStatus: CampaignStatusType;

  preferredInfluencers?: string[];
  notPreferableInfluencers?: string[];

  onAssignedOfferTotalChange?: (value: number) => void;
};

const uniq = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean);

const fullName = (i: {
  firstName?: string;
  lastName?: string;
  name?: string;
}) => {
  if (i?.name && i.name.trim()) return i.name.trim();
  return `${i?.firstName ?? ""} ${i?.lastName ?? ""}`.trim();
};

function toNum(v: any) {
  const n = Number(String(v ?? "0").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

export default function PlatformProfitInfluencerAssign({
  campaignId,
  stats,
  quoteState,
  campaignStatus,
  preferredInfluencers = [],
  notPreferableInfluencers = [],
  onAssignedOfferTotalChange,
}: Props) {
  const isQuoteConfirmed =
    quoteState === "confirmed" ||
    quoteState === "accepted" ||
    campaignStatus === "active" ||
    campaignStatus === "completed" ||
    campaignStatus === "paid";

  const locked = !isQuoteConfirmed;

  const [platformFeePercent, setPlatformFeePercent] = useState<number>(2);
  const [feeEdit, setFeeEdit] = useState(false);
  const [feeSaving, setFeeSaving] = useState(false);

  const [availableForInfluencers, setAvailableForInfluencers] = useState<number>(0);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  const finalQuotedBudget = Number(stats?.[0]?.value ?? 0);

  useEffect(() => {
    if (locked) return;
    if (!campaignId) return;

    (async () => {
      try {
        setLoadingSettings(true);
        const sRes: any = await getGeneralSettings();

        const platformFee =
          sRes?.data?.data?.platformFee ??
          sRes?.data?.platformFee ??
          sRes?.data?.data?.platformFee ??
          "2";

        setPlatformFeePercent(clampPercent(toNum(platformFee)));
      } catch {
      } finally {
        setLoadingSettings(false);
      }

      try {
        setLoadingBudget(true);
        const cRes: any = await getCampaignByIdFromAdmin(campaignId);

        const available = cRes?.data?.availableBudgetForExecution;
        setAvailableForInfluencers(Math.round(toNum(available)));
      } catch {
      } finally {
        setLoadingBudget(false);
      }
    })();
  }, [locked, campaignId]);

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

  const [allInfluencersservice, setAllInfluencersservice] = useState<
    AllInfluencerserviceItem[]
  >([]);
  const [loadingInfluencers, setLoadingInfluencers] = useState(false);

  useEffect(() => {
    if (locked) return;
    if (!campaignId) return;

    (async () => {
      try {
        setLoadingInfluencers(true);
        const res: any = await getAllInfluencer();
        const list = res?.data?.data ?? res?.data ?? [];
        setAllInfluencersservice(Array.isArray(list) ? list : []);
      } catch {
        setAllInfluencersservice([]);
      } finally {
        setLoadingInfluencers(false);
      }
    })();
  }, [locked, campaignId]);

  const dropdownInfluencers = useMemo(() => {
    return (allInfluencersservice ?? []).map((i) => ({
      id: String(i.profileId || i.id),
      name: fullName(i) || "Unknown Influencer",
      profileImg: i.profileImg ?? null,
    }));
  }, [allInfluencersservice]);

  const influencerInfoById = useMemo(() => {
    const m = new Map<string, { name: string; profileImg?: string | null }>();
    dropdownInfluencers.forEach((x) =>
      m.set(x.id, { name: x.name, profileImg: x.profileImg })
    );
    return m;
  }, [dropdownInfluencers]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rows, setRows] = useState<AssignedRow[]>([]);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const lastAutoSplitKeyRef = useRef<string>("");

  const loadDraftAssignments = useCallback(async () => {
    if (!campaignId) return;

    try {
      setLoadingDraft(true);

      const res: any = await getDraftAssignments(campaignId);
      const list = res?.data?.data?.assignments ?? [];

      const mapped: AssignedRow[] = (Array.isArray(list) ? list : []).map(
        (a: any) => ({
          influencerId: String(a.assigneeId ?? ""),
          name: String(a.assigneeName ?? "Unknown Influencer"),
          profileImg: a.assigneeImage ?? null,

          percentage: clampPercent(toNum(a.percentage)),
          offerAmount: Math.max(0, Math.round(toNum(a.offeredAmount))),

          assignmentId: a.assignmentId ?? null,
          isAssigned: true,

          committedPercentage: clampPercent(toNum(a.percentage)),
          committedOfferAmount: Math.max(0, Math.round(toNum(a.offeredAmount))),
        })
      );

      setRows(mapped);
      setSelectedIds(mapped.map((x) => x.influencerId));
      lastAutoSplitKeyRef.current = "";
    } catch {
    } finally {
      setLoadingDraft(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (locked) return;
    loadDraftAssignments();
  }, [locked, loadDraftAssignments]);

  useEffect(() => {
    if (locked) {
      onAssignedOfferTotalChange?.(0);
      return;
    }

    const committedTotal = rows
      .filter((r) => r.isAssigned)
      .reduce(
        (sum, r) =>
          sum + Math.max(0, Math.round(Number(r.committedOfferAmount) || 0)),
        0
      );

    onAssignedOfferTotalChange?.(committedTotal);
  }, [rows, locked, onAssignedOfferTotalChange]);

  useEffect(() => {
    if (locked) return;

    const ids = uniq(selectedIds);

    setRows((prev) => {
      const prevMap = new Map(prev.map((r) => [r.influencerId, r]));

      return ids.map((id) => {
        const prevRow = prevMap.get(id);
        const info = influencerInfoById.get(id);

        if (prevRow) {
          return {
            ...prevRow,
            name: info?.name ?? prevRow.name,
            profileImg: info?.profileImg ?? prevRow.profileImg,
          };
        }

        return {
          influencerId: id,
          name: info?.name ?? "Unknown Influencer",
          profileImg: info?.profileImg ?? null,

          percentage: 0,
          offerAmount: 0,

          assignmentId: null,
          isAssigned: false,

          committedPercentage: 0,
          committedOfferAmount: 0,
        };
      });
    });
  }, [locked, selectedIds, influencerInfoById]);

  useEffect(() => {
    if (locked) return;
    if (!availableForInfluencers) return;

    const assignedRows = rows.filter((r) => r.isAssigned);
    const unassignedRows = rows.filter((r) => !r.isAssigned);

    if (unassignedRows.length === 0) return;

    const allUnassignedUntouched = unassignedRows.every(
      (r) => Number(r.percentage ?? 0) === 0 && Number(r.offerAmount ?? 0) === 0
    );

    if (!allUnassignedUntouched) return;

    const assignedPct = assignedRows.reduce(
      (sum, r) => sum + clampPercent(r.percentage),
      0
    );

    const remainingPct = Math.max(0, 100 - assignedPct);
    const eachPct = clampPercent(remainingPct / unassignedRows.length);
    const eachAmount = Math.round((availableForInfluencers * eachPct) / 100);

    setRows((prev) =>
      prev.map((r) => {
        if (r.isAssigned) return r;
        if (Number(r.percentage ?? 0) !== 0 || Number(r.offerAmount ?? 0) !== 0) {
          return r;
        }

        return {
          ...r,
          percentage: eachPct,
          offerAmount: eachAmount,
        };
      })
    );
  }, [locked, rows, availableForInfluencers]);

  const totalPct = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.percentage) || 0), 0),
    [rows]
  );

  const totalAmount = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.offerAmount) || 0), 0),
    [rows]
  );

  const exceeds100 = totalPct > 100;

  const rowIsDirty = useCallback((r: AssignedRow) => {
    const p = clampPercent(r.percentage);
    const a = Math.round(Number(r.offerAmount) || 0);

    return (
      p !== clampPercent(r.committedPercentage) ||
      a !== Math.round(Number(r.committedOfferAmount) || 0)
    );
  }, []);

  const updatePercent = (id: string, nextPctRaw: number) => {
    const pct = clampPercent(nextPctRaw);
    const amount = Math.round((availableForInfluencers * pct) / 100);

    setRows((prev) =>
      prev.map((r) =>
        r.influencerId === id ? { ...r, percentage: pct, offerAmount: amount } : r
      )
    );
  };

  const updateAmount = (id: string, nextAmountRaw: number) => {
    const amt = Math.max(0, Math.round(Number(nextAmountRaw) || 0));
    const pct =
      availableForInfluencers > 0
        ? clampPercent((amt / availableForInfluencers) * 100)
        : 0;

    setRows((prev) =>
      prev.map((r) =>
        r.influencerId === id ? { ...r, offerAmount: amt, percentage: pct } : r
      )
    );
  };

  const dismissRow = (influencerId: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== influencerId));
    setRows((prev) => prev.filter((r) => r.influencerId !== influencerId));
  };

  const confirmRow = async (r: AssignedRow) => {
    if (!campaignId || exceeds100) return;

    const payloadPost = {
      campaignId,
      influencerId: r.influencerId,
      percentage: clampPercent(r.percentage),
      offerAmount: Math.round(Number(r.offerAmount) || 0),
    };

    try {
      setRows((prev) =>
        prev.map((x) =>
          x.influencerId === r.influencerId ? { ...x, saving: true } : x
        )
      );

      if (!r.isAssigned) {
        const res: any = await postAssignInfluencer(payloadPost);

        const assignmentId =
          res?.data?.data?.id ??
          res?.data?.id ??
          res?.data?.data?.assignmentId ??
          res?.data?.assignmentId ??
          null;

        setRows((prev) =>
          prev.map((x) =>
            x.influencerId === r.influencerId
              ? {
                  ...x,
                  saving: false,
                  isAssigned: true,
                  assignmentId,
                  committedPercentage: payloadPost.percentage,
                  committedOfferAmount: payloadPost.offerAmount,
                }
              : x
          )
        );

        return;
      }

      if (!r.assignmentId) {
        setRows((prev) =>
          prev.map((x) =>
            x.influencerId === r.influencerId ? { ...x, saving: false } : x
          )
        );
        return;
      }

      const payloadPatch = {
        offerAmount: payloadPost.offerAmount,
        percentage: payloadPost.percentage,
      };

      await patchAssignment(r.assignmentId, payloadPatch);

      setRows((prev) =>
        prev.map((x) =>
          x.influencerId === r.influencerId
            ? {
                ...x,
                saving: false,
                committedPercentage: payloadPatch.percentage,
                committedOfferAmount: payloadPatch.offerAmount,
              }
            : x
        )
      );
    } catch {
      setRows((prev) =>
        prev.map((x) =>
          x.influencerId === r.influencerId ? { ...x, saving: false } : x
        )
      );
    }
  };

  const removeAssigned = async (r: AssignedRow) => {
    if (!r.assignmentId) {
      dismissRow(r.influencerId);
      return;
    }

    try {
      setRows((prev) =>
        prev.map((x) =>
          x.influencerId === r.influencerId ? { ...x, deleting: true } : x
        )
      );

      await deleteAssignment(r.assignmentId);
      await loadDraftAssignments();
    } catch {
      setRows((prev) =>
        prev.map((x) =>
          x.influencerId === r.influencerId ? { ...x, deleting: false } : x
        )
      );
    }
  };

  const handleSelect = (values: string[]) => {
    setSelectedIds(uniq(values));
  };

  const onSaveFee = async () => {
    try {
      setFeeSaving(true);
      const next = clampPercent(platformFeePercent);

      await patchGeneralSettings({ platformFee: next });

      setFeeEdit(false);

      const sRes: any = await getGeneralSettings();
      const fee =
        sRes?.data?.data?.platformFee ?? sRes?.data?.platformFee ?? "2";
      setPlatformFeePercent(clampPercent(toNum(fee)));
    } finally {
      setFeeSaving(false);
    }
  };

  const platformFeeAmount = useMemo(() => {
    return Math.round(
      (finalQuotedBudget * clampPercent(platformFeePercent)) / 100
    );
  }, [finalQuotedBudget, platformFeePercent]);

  return (
    <CollapsibleCard heading="Platform Profit & Influencer Management">
      <div>
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

          <div
            className={cn(
              "col-span-12 md:col-span-4 rounded-lg border p-4 space-y-2",
              locked
                ? "border-[rgba(100,116,139,0.14)] bg-[rgba(248,250,252,1)]"
                : "border-light-green/40 bg-linear-to-r from-white to-Secondary"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {feeEdit ? (
                  <div className="relative max-w-[140px]">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={platformFeePercent}
                      onChange={(e) => setPlatformFeePercent(toNum(e.target.value))}
                      className="pr-8"
                      disabled={feeSaving}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                ) : (
                  <p className={cn("text-2xl font-semibold", locked ? "text-gray-400" : "text-light-green")}>
                    {clampPercent(platformFeePercent)}%
                  </p>
                )}

                <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-Primary")}>
                  Target Profit / Platform Fee
                </h3>

                <p className={cn("text-xs", locked ? "text-gray-400" : "text-gray-500")}>
                  ৳{moneyFmt(locked ? 0 : platformFeeAmount)}
                </p>
              </div>

              {!locked && (
                <button
                  type="button"
                  className={cn(
                    "text-sm font-medium text-Primary px-3 py-2 rounded-lg hover:bg-black/5",
                    feeSaving ? "opacity-60 pointer-events-none" : ""
                  )}
                  onClick={() => {
                    if (!feeEdit) return setFeeEdit(true);
                    onSaveFee();
                  }}
                >
                  {feeEdit ? (feeSaving ? "Saving..." : "Save") : "Edit"}
                </button>
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
              {loadingBudget ? "Loading..." : "amount assigned"}
            </p>
          </div>
        </div>

        {locked ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Client needs to confirm the quote first
          </div>
        ) : (
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
                    {loadingInfluencers || loadingDraft || loadingSettings || loadingBudget
                      ? "Loading..."
                      : " "}
                  </p>
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
                <div className="bg-linear-to-r from-white to-Secondary px-4 py-3">
                  <div className="grid grid-cols-12 items-center text-[15px] font-medium text-Primary">
                    <div className="col-span-5">Influencers ({rows.length})</div>
                    <div className="col-span-3 text-center">Percentage</div>
                    <div className="col-span-3 text-center">Offer Amount</div>
                    <div className="col-span-1 text-right"> </div>
                  </div>
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {rows.length === 0 ? (
                    <div className="p-5 text-sm text-gray-400">
                      Select influencers to assign percentage/amount.
                    </div>
                  ) : (
                    rows.map((r) => {
                      const dirty = r.isAssigned ? rowIsDirty(r) : true;
                      const showTick = dirty;
                      const canConfirm = !exceeds100 && !r.saving && !r.deleting;

                      return (
                        <div
                          key={r.influencerId}
                          className="grid grid-cols-12 items-center px-4 py-3 border-t"
                        >
                          <div className="col-span-5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden" />
                              <div>
                                <p className="font-medium text-black">{r.name}</p>
                                <p className="text-xs text-gray-400">
                                  {r.isAssigned ? "Assigned" : "Not assigned"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-3 flex justify-center">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              step="0.01"
                              value={Number.isFinite(r.percentage) ? String(r.percentage) : "0"}
                              onChange={(e) => updatePercent(r.influencerId, toNum(e.target.value))}
                              className={cn(
                                "h-10 w-[140px] rounded-full border text-center text-Primary",
                                exceeds100 ? "border-red-600" : ""
                              )}
                              disabled={!!r.saving || !!r.deleting}
                            />
                          </div>

                          <div className="col-span-3 flex justify-center">
                            <Input
                              type="number"
                              min={0}
                              step="1"
                              value={Number.isFinite(r.offerAmount) ? String(r.offerAmount) : "0"}
                              onChange={(e) => updateAmount(r.influencerId, toNum(e.target.value))}
                              className={cn(
                                "h-10 w-[170px] rounded-full border text-center text-black",
                                exceeds100 ? "border-red-600" : ""
                              )}
                              disabled={!!r.saving || !!r.deleting}
                            />
                          </div>

                          <div className="col-span-1 flex justify-end items-center gap-2">
                            {showTick && (
                              <button
                                type="button"
                                className={cn(
                                  "h-9 w-9 rounded-full border grid place-items-center",
                                  canConfirm
                                    ? "border-light-green text-light-green hover:bg-light-green/10"
                                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                                )}
                                onClick={() => confirmRow(r)}
                                disabled={!canConfirm}
                                aria-label="Confirm"
                                title={exceeds100 ? "Total percentage exceeds 100%" : "Confirm"}
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            )}

                            <button
                              type="button"
                              className={cn(
                                "h-9 w-9 rounded-full border grid place-items-center",
                                "border-gray-300 text-gray-500 hover:bg-black/5"
                              )}
                              onClick={() =>
                                r.isAssigned ? removeAssigned(r) : dismissRow(r.influencerId)
                              }
                              disabled={!!r.saving || !!r.deleting}
                              aria-label="Remove"
                              title={r.isAssigned ? "Delete assignment" : "Dismiss"}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {rows.length > 0 && (
                <div className="mt-3 text-right space-y-1">
                  <p className={cn("text-sm", totalPct > 100 ? "text-red-600" : "text-gray-500")}>
                    Total Percentage: {totalPct.toFixed(2)}%
                    {totalPct > 100 ? " (exceeds 100%)" : ""}
                  </p>

                  {exceeds100 && (
                    <p className="text-sm text-red-600 font-medium">
                      Total percentage exceeds 100%. Please adjust before assigning.
                    </p>
                  )}

                  <p className="font-semibold text-Primary">
                    Total Amount: ৳{moneyFmt(totalAmount)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}