"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  CampaignStatusType,
  InfluencerUI,
  CampaignMilestoneservice,
} from "@/types/admin/campaign/campaign_details_type";
import { money } from "@/utils/admin/campaign/campaign_calculation_util";
import { editMilestoneAmount } from "@/service/admin/campaign/agency/edit-milstone-amount";

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

function safeStr(v: any) {
  return String(v ?? "").trim();
}

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
      const id = safeStr(m?.id) || safeStr(m?.masterMilestoneId) || `m-${idx}`;
      const order = Number(m?.order ?? idx);
      const title =
        safeStr(m?.contentTitle) ||
        safeStr(m?.title) ||
        "Milestone Title";

      const subtitle =
        safeStr(m?.contentQuantity) ||
        safeStr(m?.platform) ||
        "";

      const day =
        safeStr(m?.dayLabel) ||
        (Number.isFinite(Number(m?.deliveryDays))
          ? `DAY ${Number(m?.deliveryDays)}`
          : `DAY ${order + 1}`);

      const amount = Math.max(0, roundMoney(parseLooseNumber(m?.amount ?? 0)));

      return { id, order, title, subtitle, day, amount };
    });
  }, [milestones]);

  const totalBudget = useMemo(() => {
    return Math.max(0, roundMoney(parseLooseNumber(offeredAmountPerInfluencer)));
  }, [offeredAmountPerInfluencer]);

  const activeId = safeStr(activeMilestoneId);

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
    <div className="rounded-xl border bg-white">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-Primary">
            Milestone Amounts
          </div>

          {!readOnlyAmounts && (
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
          )}
        </div>

        <div className="mt-3 rounded-lg border p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {milestoneInputs.map((m) => (
              <div key={m.key} className="space-y-1">
                <div className="text-xs text-Primary">{m.label}</div>

                <div
                  className={cn(
                    "flex items-center rounded-md border px-3 py-2",
                    editing && !readOnlyAmounts
                      ? "bg-white"
                      : "bg-[rgba(248,250,252,1)]",
                    isTotalMismatch && "border-red"
                  )}
                >
                  <span className="text-sm text-gray-500">৳</span>

                  <input
                    type="text"
                    inputMode="decimal"
                    value={money(amounts[m.idx] ?? 0)}
                    readOnly={readOnlyAmounts || !editing || saving}
                    onChange={(e) => onAmountChange(m.idx, e.target.value)}
                    className={cn(
                      "ml-2 w-full bg-transparent text-right text-sm outline-none",
                      (readOnlyAmounts || !editing || saving) && "text-gray-500"
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

          {isGreaterThanTotal && !readOnlyAmounts && (
            <div className="mt-2 text-xs text-red">
              Total milestone amount cannot exceed offered amount.
            </div>
          )}

          {isLessThanTotal && !readOnlyAmounts && (
            <div className="mt-2 text-xs text-red">
              Total milestone amount cannot be less than offered amount.
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-4">
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {sortedMilestones.map((c, idx) => {
              const isActive = c.id === activeId;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectMilestone(c.id)}
                  className={cn(
                    "min-w-[280px] max-w-[320px] flex-1 rounded-lg border px-4 py-3 text-left",
                    isActive
                      ? "border-light-green"
                      : "border-[rgba(100,116,139,0.25)]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                        isActive
                          ? "bg-light-green text-white"
                          : "bg-[rgba(100,116,139,0.12)] text-Primary"
                      )}
                    >
                      {c.order + 1}
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-semibold text-Primary">
                        {c.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {c.subtitle || "\u00A0"}
                      </div>

                      <div className="mt-2 text-lg font-semibold text-light-green">
                        ৳ {money(amounts[idx] ?? 0)}
                      </div>
                    </div>

                    <div className="mt-1 text-xs text-light-green">{c.day}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}