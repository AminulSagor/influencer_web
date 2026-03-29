"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Flag, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  CampaignStatusType,
  InfluencerUI,
  CampaignMilestoneservice,
} from "@/types/admin/campaign/campaign_details_type";
import { money } from "@/utils/admin/campaign/campaign_calculation_util";
import { editMilestoneAmount } from "@/service/admin/campaign/agency/edit-milstone-amount";
import {
  getMilestoneStatusUi,
  isMilestoneDoneForProgress,
} from "@/utils/admin/campaign/campaign-milestone/milestone_status_util";

interface Props {
  influencers: InfluencerUI[];
  campaignStatus: CampaignStatusType;
  milestones: CampaignMilestoneservice[];
  activeMilestoneId: string | null;
  onSelectMilestone: (id: string) => void;
  offeredAmountPerInfluencer: number | string;
  readOnlyAmounts?: boolean;
}

const MONEY_EPSILON = 0.009;

function roundMoney(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

function parseBDT(raw: string) {
  const cleaned = String(raw ?? "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");

  const parts = cleaned.split(".");
  const normalized =
    parts.length <= 1
      ? parts[0] || ""
      : `${parts[0] || "0"}.${(parts[1] || "").slice(0, 2)}`;

  const num = Number(normalized);
  return Number.isFinite(num) ? roundMoney(num) : 0;
}

function parseLooseNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? roundMoney(v) : 0;

  const s = String(v ?? "").trim();
  if (!s) return 0;

  const cleaned = s.replace(/,/g, "").replace(/[^\d.]/g, "");
  const n = Number(cleaned);

  return Number.isFinite(n) ? roundMoney(n) : 0;
}

export default function CampaignMilestone({
  influencers,
  campaignStatus,
  milestones,
  activeMilestoneId,
  onSelectMilestone,
  offeredAmountPerInfluencer,
  readOnlyAmounts = false,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [amounts, setAmounts] = useState<number[]>([]);

  const serverAmountsRef = useRef<number[]>([]);
  const initializedRef = useRef(false);

  const sortedMilestones = useMemo(() => {
    const list = [...(milestones ?? [])];

    list.sort(
      (a: any, b: any) => Number(a?.order ?? 0) - Number(b?.order ?? 0)
    );

    return list.map((m: any, idx: number) => {
      const id =
        String(m?.id ?? "").trim() ||
        String(m?.masterMilestoneId ?? "").trim() ||
        `m-${idx}`;

      const order = Number(m?.order ?? idx);

      const title =
        String(m?.contentTitle ?? "").trim() ||
        String(m?.title ?? "").trim() ||
        "Milestone Title";

      const subtitle =
        String(m?.contentQuantity ?? "").trim() ||
        String(m?.platform ?? "").trim() ||
        "";

      const day =
        String(m?.dayLabel ?? "").trim() ||
        (Number.isFinite(Number(m?.deliveryDays))
          ? `DAY ${Number(m?.deliveryDays)}`
          : `DAY ${order + 1}`);

      const amount = Math.max(0, roundMoney(parseLooseNumber(m?.amount ?? 0)));

      const statusUi = getMilestoneStatusUi(m?.status);
      const isDoneForProgress = isMilestoneDoneForProgress(m?.status);

      return {
        id,
        order,
        title,
        subtitle,
        day,
        amount,
        milestoneStatusLabel: statusUi.label,
        isDoneForProgress,
        ...statusUi,
      };
    });
  }, [milestones]);

  const totalBudget = useMemo(() => {
    return Math.max(0, roundMoney(parseLooseNumber(offeredAmountPerInfluencer)));
  }, [offeredAmountPerInfluencer]);

  const activeId = String(activeMilestoneId ?? "").trim();

  useEffect(() => {
    const fromBackend = sortedMilestones.map((m) => roundMoney(m.amount));
    setAmounts(fromBackend);
    serverAmountsRef.current = fromBackend;
    initializedRef.current = true;
  }, [sortedMilestones]);

  useEffect(() => {
    if (readOnlyAmounts && editing) {
      setEditing(false);
    }
  }, [readOnlyAmounts, editing]);

  const milestoneInputs = useMemo(() => {
    return sortedMilestones.map((m, idx) => ({
      key: m.id,
      label: `Milestone ${idx + 1}`,
      idx,
    }));
  }, [sortedMilestones]);

  const sum = useMemo(() => {
    return roundMoney(amounts.reduce((a, b) => a + (Number(b) || 0), 0));
  }, [amounts]);

  const completedCount = useMemo(() => {
    return sortedMilestones.filter((m) => m.isDoneForProgress).length;
  }, [sortedMilestones]);

  const progressPercentage = useMemo(() => {
    if (!sortedMilestones.length) return 0;
    return Math.round((completedCount / sortedMilestones.length) * 100);
  }, [completedCount, sortedMilestones.length]);

  const isGreaterThanTotal = sum - totalBudget > MONEY_EPSILON;
  const isLessThanTotal = totalBudget - sum > MONEY_EPSILON;
  const isTotalMismatch = Math.abs(sum - totalBudget) > MONEY_EPSILON;

  function onAmountChange(idx: number, raw: string) {
    if (readOnlyAmounts) return;

    const nextVal = Math.max(0, roundMoney(parseBDT(raw)));

    setAmounts((prev) => {
      const next = [...prev];
      next[idx] = nextVal;
      return next.map((v) => roundMoney(v));
    });
  }

  async function saveChangedAmounts() {
    if (!initializedRef.current) return;
    if (readOnlyAmounts) return;
    if (isTotalMismatch) return;

    const ids = sortedMilestones.map((m) => m.id);
    const server = serverAmountsRef.current;
    const next = amounts;

    const changes = ids
      .map((id, idx) => {
        const nextVal = roundMoney(Number(next[idx] ?? 0));
        const serverVal = roundMoney(Number(server[idx] ?? 0));

        if (Math.abs(nextVal - serverVal) <= MONEY_EPSILON) return null;

        return { milestoneId: id, amount: nextVal };
      })
      .filter(Boolean) as Array<{ milestoneId: string; amount: number }>;

    if (changes.length === 0) return;

    setSaving(true);
    try {
      await Promise.all(
        changes.map((c) =>
          editMilestoneAmount({
            milestoneId: c.milestoneId,
            amount: c.amount,
          })
        )
      );

      serverAmountsRef.current = [...amounts];
    } catch {
      setAmounts(serverAmountsRef.current);
      throw new Error("Failed");
    } finally {
      setSaving(false);
    }
  }

  async function onToggleEdit() {
    if (saving || readOnlyAmounts) return;

    if (editing) {
      try {
        await saveChangedAmounts();
        if (!isTotalMismatch) setEditing(false);
      } catch {}
      return;
    }

    setEditing(true);
  }

  const doneDisabled = saving || (editing && isTotalMismatch);

  return (
    <div className="rounded-[22px] border border-[#D9D9D9] bg-white">
      {!readOnlyAmounts && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-Primary">
              Milestone Amounts
            </div>

            <Button
              type="button"
              size="sm"
              className="h-8 rounded-md bg-orange px-5 text-white hover:brightness-95 disabled:opacity-60"
              onClick={onToggleEdit}
              disabled={doneDisabled}
              title={
                editing && isTotalMismatch
                  ? "Total milestone amount must be exactly equal to offered amount"
                  : undefined
              }
            >
              {saving ? "Saving..." : editing ? "Done" : "Edit"}
            </Button>
          </div>

          <div className="mt-3 rounded-lg border p-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {milestoneInputs.map((m) => (
                <div key={m.key} className="space-y-1">
                  <div className="text-xs text-Primary">{m.label}</div>

                  <div
                    className={cn(
                      "flex items-center rounded-md border px-3 py-2",
                      editing ? "bg-white" : "bg-[rgba(248,250,252,1)]",
                      isTotalMismatch && "border-red"
                    )}
                  >
                    <span className="text-sm text-gray-500">৳</span>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={money(amounts[m.idx] ?? 0)}
                      readOnly={!editing || saving}
                      onChange={(e) => onAmountChange(m.idx, e.target.value)}
                      className={cn(
                        "ml-2 w-full bg-transparent text-right text-sm outline-none",
                        (!editing || saving) && "text-gray-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Entered total:</span>
              <span className={cn("font-semibold", isTotalMismatch && "text-red")}>
                ৳ {money(sum)}
              </span>
            </div>

            {totalBudget > 0 && (
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>Required total:</span>
                <span className="font-semibold">৳ {money(totalBudget)}</span>
              </div>
            )}

            {isGreaterThanTotal && (
              <div className="mt-2 text-xs text-red">
                Total milestone amount cannot exceed offered amount.
              </div>
            )}

            {isLessThanTotal && (
              <div className="mt-2 text-xs text-red">
                Total milestone amount cannot be less than offered amount.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-5 pb-5 pt-5">
        <div className="rounded-[22px] border border-[#D9D9D9] bg-[#FCFCFA] px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4E6] text-[#35571C]">
                <Flag className="h-5 w-5" />
              </div>
              <div className="text-[16px] font-semibold text-[#2F4F1E]">
                Campaign Milestones
              </div>
            </div>

            <div className="w-full lg:max-w-[66%]">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[13px] font-medium text-[#232323]">Progress</p>
                <p className="text-[13px] font-semibold text-[#587B3A]">
                  {completedCount} Of {sortedMilestones.length} Completed
                </p>
              </div>

              <div className="h-[10px] overflow-hidden rounded-full bg-[#D9E3CC]">
                <div
                  className="h-full rounded-full bg-[#7EA055] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative mt-5">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {sortedMilestones.map((milestone, idx) => {
                const isActive = milestone.id === activeId;

                return (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => onSelectMilestone(milestone.id)}
                    className={cn(
                      "min-w-[310px] max-w-[310px] shrink-0 rounded-[14px] border px-4 py-3 text-left transition-all",
                      milestone.borderClass,
                      milestone.bgClass,
                      isActive && "ring-1 ring-offset-0",
                      isActive && milestone.ringClass
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                              milestone.numberClass
                            )}
                          >
                            {idx + 1}
                          </div>

                          <p
                            className={cn(
                              "truncate text-[14px] font-semibold",
                              milestone.titleClass
                            )}
                          >
                            {milestone.title}
                          </p>

                          <span
                            className={cn(
                              "ml-auto shrink-0 rounded-full px-3 py-1 text-[11px] font-medium",
                              milestone.pillClass
                            )}
                          >
                            {milestone.milestoneStatusLabel}
                          </span>
                        </div>

                        <p className="mt-2 text-[12px] text-[#7C7C7C]">
                          {milestone.subtitle || "\u00A0"}
                        </p>

                        <div className="mt-3 flex items-end justify-between gap-3">
                          <p
                            className={cn(
                              "text-[22px] font-semibold leading-none",
                              milestone.amountClass
                            )}
                          >
                            ৳ {money(amounts[idx] ?? 0)}
                          </p>

                          <p className="text-[12px] font-medium uppercase text-[#8AA05A]">
                            {milestone.day}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {sortedMilestones.length > 0 && (
                <div className="flex h-auto shrink-0 items-center pr-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#A9C27A] bg-[#EEF4E6] text-[#7EA055]">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              )}
            </div>

            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#FCFCFA] to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}