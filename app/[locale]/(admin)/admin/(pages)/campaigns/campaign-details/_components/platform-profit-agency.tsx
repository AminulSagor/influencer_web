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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { getAllAgencies } from "@/service/admin/campaign/agency/get-all-agencies";
import { getAgencyServiceFee } from "@/service/admin/campaign/agency/get-agency-service-fee";
import { assignAgencies } from "@/service/admin/campaign/agency/assign-agencies";
import { getInfluencerPayoutProfile } from "@/service/admin/campaign/get-influencer-payout";
import { getAdminCampaignById } from "@/service/admin/campaign/agency/get-campaign-agency-by-id";
import {
  getGeneralSettings,
  patchGeneralSettings,
} from "@/service/admin/campaign/general-settings";

import { clampPercent } from "@/utils/admin/campaign/platform_fee_util";
import { money as moneyFmt } from "@/utils/admin/campaign/campaign_calculation_util";

import type {
  AgencyOptionservice,
  DraftAssignedAgencyItem,
  PreferredAgency,
  Row,
  Statistics,
} from "@/types/admin/campaign/agency/platform_profit_agency_type";
import Image from "next/image";
import { toast } from "sonner";

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

  onChangePlatformFeePercent?: (v: number) => void;

  campaignStatusRaw?: string;
  selectedAgency?: {
    id: string;
    name: string;
    image?: string | null;
  };
  offeredAmount?: number;
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

const toNum = (v: any) => {
  const n = Number(String(v ?? "0").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
};

const normalizeText = (v: unknown) => String(v ?? "").trim();

type PaymentMethodBank = {
  type: "bank";
  bankName: string;
  accountNumber: string;
  accountHolderName?: string;
};

type PaymentMethodWallet = {
  type: "mobile_wallet";
  walletName: string;
  phoneNumber: string;
  accountHolderName?: string;
};

type PaymentMethod = PaymentMethodBank | PaymentMethodWallet;

function normalizePayoutMethods(raw: any): PaymentMethod[] {
  const payouts = raw?.data?.payouts ?? {};

  const bankList = Array.isArray(payouts?.bank) ? payouts.bank : [];
  const mobileList = Array.isArray(payouts?.mobileBanking)
    ? payouts.mobileBanking
    : [];

  const banks: PaymentMethodBank[] = bankList.map((item: any) => ({
    type: "bank",
    bankName: normalizeText(item?.bankName) || "Bank Account",
    accountNumber: normalizeText(item?.bankAccNo),
    accountHolderName: normalizeText(item?.bankAccHolderName),
  }));

  const wallets: PaymentMethodWallet[] = mobileList.map((item: any) => ({
    type: "mobile_wallet",
    walletName: normalizeText(item?.accountType) || "Mobile Banking",
    phoneNumber: normalizeText(item?.accountNo),
    accountHolderName: normalizeText(item?.accountHolderName),
  }));

  const unique = new Map<string, PaymentMethod>();

  [...banks, ...wallets].forEach((item) => {
    const uniqueKey =
      item.type === "bank"
        ? `bank:${item.accountNumber}`
        : `wallet:${item.phoneNumber}:${item.walletName.toLowerCase()}`;

    if (!unique.has(uniqueKey)) {
      unique.set(uniqueKey, item);
    }
  });

  return Array.from(unique.values()).filter((item) => {
    if (item.type === "bank") return !!item.accountNumber;
    return !!item.phoneNumber;
  });
}

export default function PlatformProfitAgency({
  campaignId,
  stats,
  quoteState,
  platformFeePercent: platformFeePercentProp = 2,

  preferredAgencies = [],
  loadingPreferredAgencies = false,

  draftAssignedAgencies = [],
  loadingDraftAssignedAgencies = false,
  onRefreshDraft,

  onChangePlatformFeePercent,
  campaignStatusRaw,
  selectedAgency,
  offeredAmount = 0,
}: Props) {
  const isAgencyAccepted = String(campaignStatusRaw ?? "").trim().toLowerCase() === "agency_accepted";
  const locked = !isAgencyAccepted && quoteState !== "confirmed";

  const finalQuotedBudget = Number(stats?.[0]?.value ?? 0);

  const [feeEdit, setFeeEdit] = useState(false);
  const [feeSaving, setFeeSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loadingBudget, setLoadingBudget] = useState(false);

  const [committedFeePercent, setCommittedFeePercent] = useState<number>(
    clampPercent(platformFeePercentProp)
  );
  const [feePercent, setFeePercent] = useState<number>(
    clampPercent(platformFeePercentProp)
  );

  const [availableForAgency, setAvailableForAgency] = useState<number>(0);
  const [platformFeeAmount, setPlatformFeeAmount] = useState<number>(0);

  useEffect(() => {
    if (locked) return;
    if (!campaignId) return;

    let alive = true;

    const loadBackendDrivenValues = async () => {
      try {
        setLoadingSettings(true);

        const sRes: any = await getGeneralSettings();

        const platformFee =
          sRes?.data?.data?.platformFee ??
          sRes?.data?.platformFee ??
          platformFeePercentProp;

        if (!alive) return;

        const nextPercent = clampPercent(toNum(platformFee));
        setCommittedFeePercent(nextPercent);
        setFeePercent(nextPercent);
      } catch (e) {
        console.error("❌ getGeneralSettings failed:", e);
      } finally {
        if (!alive) return;
        setLoadingSettings(false);
      }

      try {
        setLoadingBudget(true);

        const cRes: any = await getAdminCampaignById(campaignId);

        const campaign =
          cRes?.data?.data ??
          cRes?.data ??
          {};

        const available =
          campaign?.availableBudgetForExecution ??
          0;

        const backendPlatformFeeAmount =
          campaign?.platformFeeAmount ??
          campaign?.targetProfitAmount ??
          campaign?.platformProfitAmount ??
          0;

        if (!alive) return;

        setAvailableForAgency(Math.round(toNum(available)));
        setPlatformFeeAmount(Math.round(toNum(backendPlatformFeeAmount)));
      } catch (e) {
        console.error("❌ getAdminCampaignById failed:", e);
        if (!alive) return;
        setAvailableForAgency(0);
        setPlatformFeeAmount(0);
      } finally {
        if (!alive) return;
        setLoadingBudget(false);
      }
    };

    loadBackendDrivenValues();

    return () => {
      alive = false;
    };
  }, [locked, campaignId, platformFeePercentProp]);

  const effectiveFeePercent = feeEdit ? feePercent : committedFeePercent;

  const [agencyPaymentMethods, setAgencyPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingAgencyPaymentMethods, setLoadingAgencyPaymentMethods] = useState(false);

  useEffect(() => {
    if (!isAgencyAccepted || !selectedAgency?.id) {
      setAgencyPaymentMethods([]);
      return;
    }

    let alive = true;

    const loadAgencyPaymentMethods = async () => {
      try {
        setLoadingAgencyPaymentMethods(true);
        const res = await getInfluencerPayoutProfile(selectedAgency.id);
        if (!alive) return;
        setAgencyPaymentMethods(normalizePayoutMethods(res));
      } catch (error) {
        console.error("❌ getInfluencerPayoutProfile failed:", error);
        if (!alive) return;
        setAgencyPaymentMethods([]);
      } finally {
        if (!alive) return;
        setLoadingAgencyPaymentMethods(false);
      }
    };

    loadAgencyPaymentMethods();

    return () => {
      alive = false;
    };
  }, [isAgencyAccepted, selectedAgency?.id]);

  const [allAgenciesservice, setAllAgenciesservice] = useState<AgencyOptionservice[]>([]);
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
        setAllAgenciesservice(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("❌ getAllAgencies failed:", e);
        if (!alive) return;
        setAllAgenciesservice([]);
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
    return (allAgenciesservice ?? []).map((a) => ({
      id: String(a.id),
      name: String(a.agencyName || a.fullName || "Agency"),
      logo: a.logo ?? null,
    }));
  }, [allAgenciesservice]);

  const agencyInfoMap = useMemo(() => {
    const m = new Map<string, { name: string; logo?: string | null }>();
    dropdownAgencies.forEach((a) => m.set(a.id, { name: a.name, logo: a.logo }));
    return m;
  }, [dropdownAgencies]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);

  const [lastSavedSig, setLastSavedSig] = useState<string>("");

  const currentSig = useMemo(() => {
    const ids = uniq(selectedIds).sort();
    const map = new Map(rows.map((r) => [r.id, clampPercent(r.assignPercentage)]));
    return ids.map((id) => `${id}:${clampPercent(map.get(id) ?? 0)}`).join("|");
  }, [selectedIds, rows]);

  const hasUnsavedChanges = useMemo(() => currentSig !== lastSavedSig, [currentSig, lastSavedSig]);

  const [defaultFeeMap, setDefaultFeeMap] = useState<Record<string, number>>({});
  const [loadingFees, setLoadingFees] = useState(false);

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

  const draftSig = useMemo(() => {
    const list = Array.isArray(draftAssignedAgencies) ? draftAssignedAgencies : [];
    const ids = uniq(list.map(pickAgencyId).filter(Boolean)).sort();

    return ids
      .map((id) => {
        const found = list.find((x) => pickAgencyId(x) === id);
        return `${id}:${pickAssignedPercent(found)}`;
      })
      .join("|");
  }, [draftAssignedAgencies]);

  const [lastAppliedDraftSig, setLastAppliedDraftSig] = useState<string>("");

  useEffect(() => {
    if (locked) return;
    if (loadingDraftAssignedAgencies) return;

    const list = Array.isArray(draftAssignedAgencies) ? draftAssignedAgencies : [];
    const ids = uniq(list.map(pickAgencyId).filter(Boolean));

    if (ids.length === 0) return;
    if (draftSig === lastAppliedDraftSig) return;
    if (rows.length > 0 && hasUnsavedChanges) return;

    setSelectedIds(ids);

    setRows(
      ids.map((id) => {
        const found = list.find((x) => pickAgencyId(x) === id);
        const info = agencyInfoMap.get(id);

        const name = String(
          found?.agencyName ?? found?.name ?? found?.fullName ?? info?.name ?? "Agency"
        );
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

    setLastSavedSig(draftSig);
    setLastAppliedDraftSig(draftSig);
  }, [
    locked,
    loadingDraftAssignedAgencies,
    draftAssignedAgencies,
    draftSig,
    lastAppliedDraftSig,
    rows.length,
    hasUnsavedChanges,
    agencyInfoMap,
    availableForAgency,
  ]);

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
              const fee = Number(
                res?.data?.data?.defaultServiceFee ??
                  res?.data?.defaultServiceFee ??
                  0
              );
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
          results.forEach((r) => {
            next[r.id] = r.fee;
          });
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
  }, [locked, selectedIds, defaultFeeMap]);

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
          ? {
              ...r,
              assignPercentage: pct,
              profitAmount: Math.round((availableForAgency * pct) / 100),
            }
          : r
      )
    );
  };

  const removeRow = (id: string) => setSelectedIds((prev) => prev.filter((x) => x !== id));

  const totalPct = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.assignPercentage) || 0), 0),
    [rows]
  );

  const totalProfit = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.profitAmount) || 0), 0),
    [rows]
  );

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
      setLastAppliedDraftSig(currentSig);

      onRefreshDraft?.();
      window.dispatchEvent(new Event("agency-assigned"));
    } catch (e: any) {
      toast.error("Failed to assign agencies");
    } finally {
      setSaving(false);
    }
  }, [campaignId, rows, currentSig, onRefreshDraft]);

  const onSaveFee = async () => {
    try {
      setFeeSaving(true);

      const next = clampPercent(feePercent);

      await patchGeneralSettings({ platformFee: next });

      setCommittedFeePercent(next);
      setFeePercent(next);
      setFeeEdit(false);

      onChangePlatformFeePercent?.(next);
    } catch (e) {
      console.error("❌ patchGeneralSettings failed:", e);
    } finally {
      setFeeSaving(false);
    }
  };

  return (
    <CollapsibleCard heading="Platform Profit & Agency Management">
      <div>
        <div className="grid grid-cols-12 gap-4">
          <div
            className={cn(
              isAgencyAccepted ? "col-span-12 md:col-span-6" : "col-span-12 md:col-span-4",
              "rounded-lg border p-4 space-y-2",
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
              isAgencyAccepted ? "col-span-12 md:col-span-6" : "col-span-12 md:col-span-4",
              "rounded-lg border p-4",
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
                      onChange={(e) =>
                        setFeePercent(clampPercent(Number(e.target.value || 0)))
                      }
                      className="pr-8"
                      disabled={locked || feeSaving || isAgencyAccepted}
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
                    {clampPercent(effectiveFeePercent)}%
                  </p>
                )}

                <h3 className={cn("text-xl font-semibold", locked ? "text-gray-400" : "text-Primary")}>
                  Target Profit / Platform Fee
                </h3>

                <p className={cn("text-xs", locked ? "text-gray-400" : "text-gray-500")}>
                  ৳{moneyFmt(locked ? 0 : platformFeeAmount)}
                </p>
              </div>

              {!locked && !isAgencyAccepted && (
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "mt-1 text-[20px] font-semibold hover:bg-transparent",
                    feeSaving
                      ? "opacity-60 pointer-events-none"
                      : "text-light-green hover:opacity-80"
                  )}
                  onClick={() => {
                    if (!feeEdit) {
                      setFeePercent(clampPercent(committedFeePercent));
                      setFeeEdit(true);
                      return;
                    }

                    onSaveFee();
                  }}
                >
                  {feeEdit ? (feeSaving ? "Saving..." : "Save") : "Edit"}
                </Button>
              )}
            </div>
          </div>

          {!isAgencyAccepted && (
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
                {loadingBudget ? "Loading..." : "amount assigned"}
              </p>
            </div>
          )}
        </div>

        {locked ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Client needs to confirm the quote first
          </div>
        ) : isAgencyAccepted ? (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-Primary">
                Assigned Agency And Payment Methods Details
              </h2>
              <p className="text-xs font-medium text-orange">Campaign Ongoing</p>
            </div>

            <div className="grid grid-cols-12 gap-4 rounded-xl border border-slate-200 p-3 md:p-4">
              <div className="col-span-12 md:col-span-5 rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-Primary">Assigned Agency</p>

                <div className="mt-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedAgency?.image ?? ""} alt={selectedAgency?.name ?? "Agency"} />
                    <AvatarFallback>
                      {normalizeText(selectedAgency?.name).charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="text-[18px] font-semibold text-light-green truncate">
                      {selectedAgency?.name ?? "Assigned Agency"}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-sm font-semibold text-black">Offered Amount</p>
                  <p className="mt-2 text-[28px] font-semibold text-orange">
                    ৳ {moneyFmt(offeredAmount)}
                  </p>
                </div>
              </div>

              <div className="col-span-12 md:col-span-7 rounded-xl border border-slate-200 p-3 md:p-4">
                {loadingAgencyPaymentMethods ? (
                  <div className="py-10 text-center text-sm text-gray-400">
                    Loading payment methods...
                  </div>
                ) : agencyPaymentMethods.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-400">
                    No payment methods available.
                  </div>
                ) : (
                  <ul className="max-h-[240px] space-y-3 overflow-y-auto pr-1">
                    {agencyPaymentMethods.map((method, index) => (
                      <li
                        key={`${selectedAgency?.id ?? "agency"}-${index}`}
                        className="rounded-2xl border border-light-green/50 bg-linear-to-r from-white to-Secondary/70 p-3"
                      >
                        {method.type === "bank" ? (
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
                              <Image src="/icons/bank-icon.svg" alt="Bank Icon" fill />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-light-green">
                                {method.bankName}
                              </p>
                              <p className="text-sm font-medium text-Primary break-all">
                                Account No: {method.accountNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {method.accountHolderName || selectedAgency?.name}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                              <Image
                                src="/icons/bkash-icon.svg"
                                alt="Wallet Icon"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-light-green break-all">
                                {method.phoneNumber}
                              </p>
                              <p className="text-xs text-gray-500">{method.walletName}</p>
                              <p className="text-sm font-medium text-Primary">
                                {method.accountHolderName || selectedAgency?.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 mt-6">
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

            <div className="col-span-12 md:col-span-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-Primary mb-1 font-semibold">Assign Ad Agency</h2>
                  <p className="text-xs text-gray-500">
                    {saving
                      ? "Saving..."
                      : hasUnsavedChanges
                        ? "Unsaved changes"
                        : "All changes saved"}
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

              <div className="mt-3">
                <MultiSelect values={selectedIds} onValuesChange={(v) => setSelectedIds(uniq(v))}>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue
                      placeholder={loadingAgencies ? "Loading agencies..." : "Select Ad Agency"}
                    />
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
                    Total Percentage: {totalPct.toFixed(2)}%
                    {totalPct > 100 ? " (exceeds 100%)" : ""}
                  </p>

                  <p className="font-semibold text-Primary">
                    Total Profit: ৳{moneyFmt(totalProfit)}
                  </p>

                  {(loadingFees ||
                    loadingAgencies ||
                    loadingDraftAssignedAgencies ||
                    loadingSettings ||
                    loadingBudget) && (
                    <p className="text-xs text-gray-400">
                      Loading
                      {loadingAgencies ? " agencies" : ""}
                      {loadingFees ? " default fees" : ""}
                      {loadingDraftAssignedAgencies ? " draft assignments" : ""}
                      {loadingSettings ? " settings" : ""}
                      {loadingBudget ? " campaign budget" : ""}
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
  );
}