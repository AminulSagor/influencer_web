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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { getAllAgencies } from "@/api/admin/campaign/agency/get-all-agencies";
import { getAgencyServiceFee } from "@/api/admin/campaign/agency/get-agency-service-fee";
import { assignAgencies } from "@/api/admin/campaign/agency/assign-agencies";

import { calcPlatformFee, clampPercent } from "@/utils/admin/campaign/platform_fee_util";
import { money as moneyFmt } from "@/utils/admin/campaign/campaign_calculation_util";
import InviteAgencyBar from "./invite-agency-bar";
import { AgencyOptionApi, DraftAssignedAgencyItem, PreferredAgency, Row, Statistics } from "@/types/admin/campaign/agency/platform_profit_agency_type";

type Props = {
  campaignId: string;
  stats: Statistics[];
  quoteState: "none" | "sent" | "confirmed";
  platformFeePercent?: number;

  preferredAgencies?: PreferredAgency[];
  loadingPreferredAgencies?: boolean;

  draftAssignedAgencies?: DraftAssignedAgencyItem[];
  loadingDraftAssignedAgencies?: boolean;
  onRefreshDraft?: () => void;

  // ✅ optional callback if you want to persist platform fee to backend
  onChangePlatformFeePercent?: (v: number) => void;
};

const uniq = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean);
const pickAgencyId = (x: any) => String(x?.agencyId ?? x?.id ?? "").trim();

const pickAssignedPercent = (x: any) => {
  const v =
    x?.assignPercentage ??
    x?.assignedServiceFeePercent ??
    x?.assignedPercentage ??
    x?.serviceFeePercent ??
    0;

  return clampPercent(Number(v) || 0);
};

export default function PlatformProfitAgency({
  campaignId,
  stats,
  quoteState,
  platformFeePercent = 2,

  preferredAgencies = [],
  loadingPreferredAgencies = false,

  draftAssignedAgencies = [],
  loadingDraftAssignedAgencies = false,
  onRefreshDraft,

  onChangePlatformFeePercent,
}: Props) {
  const locked = quoteState !== "confirmed";

  // ---------------- budget ----------------
  const finalQuotedBudget = Number(stats?.[0]?.value ?? 0);

  // ✅ platform fee state (UI like screenshot)
  const [feeEdit, setFeeEdit] = useState(false);
  const [feePercent, setFeePercent] = useState<number>(clampPercent(platformFeePercent));

  // keep in sync if prop changes
  useEffect(() => {
    if (feeEdit) return;
    setFeePercent(clampPercent(platformFeePercent));
  }, [platformFeePercent, feeEdit]);

  const { platformFeeAmount, availableBudget: availableForAgency } = useMemo(() => {
    return calcPlatformFee(finalQuotedBudget, clampPercent(feePercent));
  }, [finalQuotedBudget, feePercent]);

  // ---------------- agencies list ----------------
  const [allAgenciesApi, setAllAgenciesApi] = useState<AgencyOptionApi[]>([]);
  const [loadingAgencies, setLoadingAgencies] = useState(false);

  useEffect(() => {
    if (locked) return;

    let alive = true;

    const load = async () => {
      try {
        setLoadingAgencies(true);
        const res: any = await getAllAgencies();
        const list = res?.data?.data ?? res?.data ?? res ?? [];
        if (!alive) return;
        setAllAgenciesApi(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("❌ getAllAgencies failed:", e);
        if (!alive) return;
        setAllAgenciesApi([]);
      } finally {
        if (!alive) return;
        setLoadingAgencies(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [locked]);

  const dropdownAgencies = useMemo(() => {
    return (allAgenciesApi ?? []).map((a) => ({
      id: String(a.id),
      name: String(a.agencyName || a.fullName || "Agency"),
      logo: a.logo ?? null,
    }));
  }, [allAgenciesApi]);

  const agencyInfoMap = useMemo(() => {
    const m = new Map<string, { name: string; logo?: string | null }>();
    dropdownAgencies.forEach((a) => m.set(a.id, { name: a.name, logo: a.logo }));
    return m;
  }, [dropdownAgencies]);

  // ---------------- selection / rows / save ----------------
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);

  // signature based on id + assignPercentage
  const [lastSavedSig, setLastSavedSig] = useState<string>("");

  const currentSig = useMemo(() => {
    const ids = uniq(selectedIds).sort();
    const map = new Map(rows.map((r) => [r.id, clampPercent(r.assignPercentage)]));
    return ids.map((id) => `${id}:${clampPercent(map.get(id) ?? 0)}`).join("|");
  }, [selectedIds, rows]);

  const hasUnsavedChanges = useMemo(() => currentSig !== lastSavedSig, [currentSig, lastSavedSig]);

  // ---------------- default fee cache ----------------
  const [defaultFeeMap, setDefaultFeeMap] = useState<Record<string, number>>({});
  const [loadingFees, setLoadingFees] = useState(false);

  // ✅ Seed default fee map from draft response so "Default Percentage" shows immediately
  useEffect(() => {
    if (locked) return;
    if (loadingDraftAssignedAgencies) return;

    const list = Array.isArray(draftAssignedAgencies) ? draftAssignedAgencies : [];
    if (list.length === 0) return;

    const next: Record<string, number> = {};
    for (const x of list) {
      const id = pickAgencyId(x);
      if (!id) continue;

      if (x?.defaultPercentage != null) {
        next[id] = clampPercent(Number(x.defaultPercentage) || 0);
      }
    }

    if (Object.keys(next).length === 0) return;
    setDefaultFeeMap((prev) => ({ ...next, ...prev }));
  }, [locked, loadingDraftAssignedAgencies, draftAssignedAgencies]);

  // ---------------- init from draft (ONLY ONCE) ----------------
  const [didInitFromDraft, setDidInitFromDraft] = useState(false);

  useEffect(() => {
    if (locked) return;
    if (didInitFromDraft) return;
    if (loadingDraftAssignedAgencies) return;

    const list = Array.isArray(draftAssignedAgencies) ? draftAssignedAgencies : [];
    if (list.length === 0) {
      setDidInitFromDraft(true);
      return;
    }

    const ids = uniq(list.map(pickAgencyId).filter(Boolean));
    if (ids.length === 0) {
      setDidInitFromDraft(true);
      return;
    }

    setSelectedIds(ids);

    setRows(
      ids.map((id) => {
        const found = list.find((x) => pickAgencyId(x) === id);
        const info = agencyInfoMap.get(id);

        const name = String(found?.agencyName ?? found?.name ?? found?.fullName ?? info?.name ?? "Agency");
        const logo = (found?.logo ?? info?.logo ?? null) as string | null;

        const assignedPct = pickAssignedPercent(found);
        const defaultPct = clampPercent(Number(found?.defaultPercentage ?? 0));

        return {
          id,
          name,
          logo,
          defaultPercentage: defaultPct,
          assignPercentage: assignedPct,
          profitAmount: Math.round((availableForAgency * assignedPct) / 100),
        };
      })
    );

    const sig = ids
      .sort()
      .map((id) => {
        const found = list.find((x) => pickAgencyId(x) === id);
        return `${id}:${pickAssignedPercent(found)}`;
      })
      .join("|");

    setLastSavedSig(sig);
    setDidInitFromDraft(true);
  }, [
    locked,
    didInitFromDraft,
    loadingDraftAssignedAgencies,
    draftAssignedAgencies,
    agencyInfoMap,
    availableForAgency,
  ]);

  // ---------------- fetch missing default fees ----------------
  useEffect(() => {
    if (locked) return;

    const ids = uniq(selectedIds);
    if (ids.length === 0) return;

    const missing = ids.filter((id) => defaultFeeMap[id] == null);
    if (missing.length === 0) return;

    let alive = true;

    const loadFees = async () => {
      try {
        setLoadingFees(true);

        const results = await Promise.all(
          missing.map(async (id) => {
            try {
              const res: any = await getAgencyServiceFee(id);
              const fee = Number(res?.data?.data?.defaultServiceFee ?? res?.data?.defaultServiceFee ?? 0);
              return { id, fee: clampPercent(fee) };
            } catch (e) {
              console.error("❌ getAgencyServiceFee failed for:", id, e);
              return { id, fee: 0 };
            }
          })
        );

        if (!alive) return;

        setDefaultFeeMap((prev) => {
          const next = { ...prev };
          results.forEach((r) => (next[r.id] = r.fee));
          return next;
        });
      } finally {
        if (!alive) return;
        setLoadingFees(false);
      }
    };

    loadFees();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, selectedIds]);

  // ---------------- keep rows synced with selection + defaults ----------------
  useEffect(() => {
    if (locked) return;

    const ids = uniq(selectedIds);

    if (ids.length === 0) {
      setRows([]);
      return;
    }

    setRows((prev) => {
      const prevMap = new Map(prev.map((r) => [r.id, r]));

      return ids.map((id) => {
        const info = agencyInfoMap.get(id);
        const prevRow = prevMap.get(id);

        const name = info?.name ?? prevRow?.name ?? "Agency";
        const logo = info?.logo ?? prevRow?.logo ?? null;

        const defaultPct = clampPercent(defaultFeeMap[id] ?? prevRow?.defaultPercentage ?? 0);
        const assignPct = clampPercent(prevRow?.assignPercentage ?? defaultPct);

        return {
          id,
          name,
          logo,
          defaultPercentage: defaultPct,
          assignPercentage: assignPct,
          profitAmount: Math.round((availableForAgency * assignPct) / 100),
        };
      });
    });
  }, [locked, selectedIds, defaultFeeMap, agencyInfoMap, availableForAgency]);

  const updateAssignPercent = (id: string, nextPct: number) => {
    const pct = clampPercent(nextPct);
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, assignPercentage: pct, profitAmount: Math.round((availableForAgency * pct) / 100) }
          : r
      )
    );
  };

  const removeRow = (id: string) => setSelectedIds((prev) => prev.filter((x) => x !== id));

  const totalPct = useMemo(() => rows.reduce((s, r) => s + (Number(r.assignPercentage) || 0), 0), [rows]);
  const totalProfit = useMemo(() => rows.reduce((s, r) => s + (Number(r.profitAmount) || 0), 0), [rows]);

  const handleClear = () => setSelectedIds([]);

  const handleSave = useCallback(async () => {
    if (!campaignId) return;

    try {
      setSaving(true);

      const payload = {
        campaignId,
        assignments: rows.map((r) => ({
          agencyId: r.id,
          assignedServiceFeePercent: clampPercent(r.assignPercentage),
        })),
      };

      await assignAgencies(payload);

      setLastSavedSig(currentSig);
      onRefreshDraft?.();
    } catch (e: any) {
      console.error("❌ assignAgencies failed:", e);
      console.log("Backend message:", e?.response?.data);
    } finally {
      setSaving(false);
    }
  }, [campaignId, rows, currentSig, onRefreshDraft]);

  return (
    <>
    <CollapsibleCard heading="Platform Profit & Agency Management">
      <div>
        {/* top stats */}
        <div className="grid grid-cols-12 gap-4">
          {/* card 1 */}
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

          {/* card 2 ✅ UI like your provided snippet + screenshot */}
          <div
            className={cn(
              "col-span-12 md:col-span-4 rounded-lg border p-4",
              locked
                ? "border-[rgba(100,116,139,0.14)] bg-[rgba(248,250,252,1)]"
                : "border-light-green/40 bg-linear-to-r from-white to-Secondary"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="relative w-full max-w-[520px]">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={String(feeEdit ? feePercent : clampPercent(feePercent))}
                    onChange={(e) => setFeePercent(clampPercent(Number(e.target.value || 0)))}
                    disabled={locked}
                    readOnly={!feeEdit}
                    className={cn(
                      "h-16 w-full rounded-xl border bg-white px-6 pr-14 text-[46px] font-bold leading-none",
                      locked ? "text-gray-400" : "text-light-green",
                      !feeEdit ? "cursor-default" : ""
                    )}
                  />

                  <span
                    className={cn(
                      "absolute right-5 top-1/2 -translate-y-1/2 text-[46px] font-bold leading-none",
                      locked ? "text-gray-400" : "text-light-green"
                    )}
                  >
                    %
                  </span>
                </div>

                <h3 className={cn("mt-3 text-xl font-semibold", locked ? "text-gray-400" : "text-Primary")}>
                  Set Platform Charge
                </h3>

                <p className={cn("mt-1 text-xs", locked ? "text-gray-400" : "text-gray-500")}>
                  ৳{moneyFmt(locked ? 0 : platformFeeAmount)}
                </p>
              </div>

              {!locked && (
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "mt-3 text-[20px] font-semibold hover:bg-transparent",
                    locked ? "text-gray-400" : "text-light-green hover:opacity-80"
                  )}
                  onClick={() => {
                    if (!feeEdit) return setFeeEdit(true);

                    setFeeEdit(false);

                    // ✅ notify parent/backend if you wired it
                    onChangePlatformFeePercent?.(clampPercent(feePercent));
                  }}
                >
                  {feeEdit ? "Save" : "Edit"}
                </Button>
              )}
            </div>
          </div>

          {/* card 3 */}
          <div
            className={cn(
              "col-span-12 md:col-span-4 rounded-lg border p-4 space-y-2",
              locked
                ? "border-[rgba(100,116,139,0.14)] bg-[rgba(248,250,252,1)]"
                : "border-light-green/40 bg-linear-to-r from-white to-Secondary"
            )}
          >
            <p className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-light-green")}>
              ৳{moneyFmt(locked ? 0 : availableForAgency)}
            </p>
            <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-orange")}>
              Available For Agency
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
          <div className="grid grid-cols-12 gap-4 mt-6">
            {/* left */}
            <div className="col-span-12 md:col-span-4 space-y-4">
              <InfluencerBadges
                title="Preferred Agency"
                influencers={
                  loadingPreferredAgencies
                    ? [{ name: "Loading...", platform: "—", profileUrl: "#" }]
                    : (preferredAgencies.map((a) => ({
                        name: a.name,
                        platform: "—",
                        profileUrl: "#",
                        imageUrl: a.image ?? undefined,
                      })) as any)
                }
              />
            </div>

            {/* right */}
            <div className="col-span-12 md:col-span-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-Primary mb-1 font-semibold">Assign Ad Agency</h2>
                  <p className="text-xs text-gray-500">
                    {saving ? "Saving..." : hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleClear} disabled={saving}>
                    Clear
                  </Button>

                  <Button
                    className="bg-Primary"
                    onClick={handleSave}
                    disabled={saving || rows.length === 0 || !hasUnsavedChanges}
                  >
                    Save Assignments
                  </Button>
                </div>
              </div>

              {/* multiselect */}
              <div className="mt-3">
                <MultiSelect values={selectedIds} onValuesChange={(v) => setSelectedIds(uniq(v))}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder={loadingAgencies ? "Loading agencies..." : "Select Ad Agency"} />
                  </MultiSelectTrigger>

                  <MultiSelectContent>
                    <MultiSelectGroup>
                      {dropdownAgencies.map((a) => (
                        <MultiSelectItem key={a.id} value={a.id}>
                          {a.name}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
              </div>

              {/* table (UNCHANGED UI) */}
              <div className="mt-4 rounded-xl border overflow-hidden">
                <div className="bg-linear-to-r from-white to-Secondary px-5 py-3">
                  <div className="grid grid-cols-12 items-center text-[15px] font-medium text-Primary">
                    <div className="col-span-5">Ad Agency ({rows.length})</div>
                    <div className="col-span-2 text-center">Default Percentage</div>
                    <div className="col-span-2 text-center">Assign Percentage</div>
                    <div className="col-span-3 text-center">Profit</div>
                  </div>
                </div>

                <div className="max-h-[260px] overflow-y-auto">
                  {rows.length === 0 ? (
                    <div className="p-5 text-sm text-gray-400">
                      Select agencies to assign percentage/profit.
                    </div>
                  ) : (
                    <div>
                      {rows.map((r) => (
                        <div key={r.id} className="grid grid-cols-12 items-center px-5 py-4 border-t">
                          <div className="col-span-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden" />
                            <div className="text-[18px] font-medium text-black">{r.name}</div>
                          </div>

                          <div className="col-span-2 text-center text-[16px] text-Primary">
                            {Number(r.defaultPercentage || 0).toFixed(0)}%
                          </div>

                          <div className="col-span-2 flex justify-center">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              step="0.01"
                              value={Number.isFinite(r.assignPercentage) ? String(r.assignPercentage) : "0"}
                              onChange={(e) => updateAssignPercent(r.id, Number(e.target.value || 0))}
                              disabled={saving}
                              className="h-11 w-[120px] rounded-full border text-center text-Primary"
                            />
                          </div>

                          <div className="col-span-3 flex items-center justify-center gap-3">
                            <div className="h-11 w-11 rounded-full border bg-white grid place-items-center text-black text-lg">
                              ৳
                            </div>

                            <div className="h-11 w-[170px] rounded-full border bg-white px-6 flex items-center justify-end font-semibold text-black text-[18px]">
                              {moneyFmt(r.profitAmount)}
                            </div>

                            <button
                              type="button"
                              className="ml-2 text-Primary/70 hover:text-Primary text-xl leading-none"
                              onClick={() => removeRow(r.id)}
                              aria-label="Remove"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="border-t" />
                    </div>
                  )}
                </div>
              </div>

              {rows.length > 0 && (
                <div className="mt-3 text-right space-y-1">
                  <p className={cn("text-sm", totalPct > 100 ? "text-red" : "text-gray-500")}>
                    Total Percentage: {totalPct.toFixed(2)}%{totalPct > 100 ? " (exceeds 100%)" : ""}
                  </p>
                  <p className="font-semibold text-Primary">Total Profit: ৳{moneyFmt(totalProfit)}</p>

                  {(loadingFees || loadingAgencies || loadingDraftAssignedAgencies) && (
                    <p className="text-xs text-gray-400">
                      Loading{" "}
                      {loadingAgencies ? "agencies" : ""}
                      {loadingAgencies && (loadingFees || loadingDraftAssignedAgencies) ? " & " : ""}
                      {loadingFees ? "default fees" : ""}
                      {loadingFees && loadingDraftAssignedAgencies ? " & " : ""}
                      {loadingDraftAssignedAgencies ? "draft assignments" : ""}
                      ...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
</>
  );
}