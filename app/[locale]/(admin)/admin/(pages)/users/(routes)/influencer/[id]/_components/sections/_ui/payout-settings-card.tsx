"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import SectionHeader from "./section-header";
import { Bell, ChevronUp, Landmark, Smartphone } from "lucide-react";
import {
  updateBankPayoutStatus,
  updateMobilePayoutStatus,
  type VerificationUpdateStatus,
} from "@/api/admin/users/influencers/payout-verification";

/** backend structure */
type BankPayout = {
  bankName: string;
  accStatus: string; // pending/approved/rejected
  bankAccNo: string;
  bankRoutingNo: string;
  bankBranchName: string;
  bankAccHolderName: string;
};

type MobilePayout = {
  accStatus: string;
  accountNo: string;
  accountType: string; // Bkash
  accountHolderName: string;
};

type BackendPayouts = {
  bank?: BankPayout[];
  mobileBanking?: MobilePayout[];
} | null;

type NormalizedPayout =
  | {
      key: string;
      kind: "bank";
      status: string;
      title: string;
      subtitle1: string;
      subtitle2?: string;
      accountNo: string;
      bank: BankPayout;
    }
  | {
      key: string;
      kind: "mobile";
      status: string;
      title: string;
      subtitle1: string;
      subtitle2?: string;
      accountNo: string;
      mobile: MobilePayout;
    };

type Props = {
  payouts: BackendPayouts;
  onChanged?: () => void; // ✅ call parent refetch
};

function normalizePayouts(payouts: BackendPayouts): NormalizedPayout[] {
  const bank = payouts?.bank ?? [];
  const mobile = payouts?.mobileBanking ?? [];

  const bankItems: NormalizedPayout[] = bank.map((b, idx) => ({
    key: `bank-${idx}-${b.bankAccNo}`,
    kind: "bank",
    status: String(b.accStatus ?? "pending").toLowerCase(),
    title: `Bank Account No.${idx + 1}`,
    subtitle1: b.bankName ? `${b.bankName}` : "—",
    subtitle2: b.bankAccNo ? `Account No: ${maskAcc(b.bankAccNo)}` : "",
    accountNo: b.bankAccNo,
    bank: b,
  }));

  const mobileItems: NormalizedPayout[] = mobile.map((m, idx) => ({
    key: `mobile-${idx}-${m.accountNo}`,
    kind: "mobile",
    status: String(m.accStatus ?? "pending").toLowerCase(),
    title: `${m.accountType || "Mobile Banking"}`,
    subtitle1: m.accountNo ? `+${m.accountNo}` : "—",
    subtitle2: m.accountHolderName ? `${m.accountHolderName}` : "",
    accountNo: m.accountNo,
    mobile: m,
  }));

  return [...bankItems, ...mobileItems];
}

function maskAcc(acc: string) {
  const s = String(acc ?? "");
  if (s.length <= 6) return s;
  return `${s.slice(0, 3)}****${s.slice(-3)}`;
}

function StatusPill({ status }: { status: string }) {
  const s = String(status ?? "pending").toLowerCase();
  const approved = s === "approved";
  const rejected = s === "rejected";
  const pending = s === "pending" || s === "unverified";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold border",
        approved
          ? "bg-light-green/15 text-light-green border-light-green/30"
          : rejected
          ? "bg-red/10 text-red border-red/25"
          : pending
          ? "bg-orange/15 text-orange border-orange/30"
          : "bg-Primary/10 text-Primary border-Primary/20"
      )}
    >
      {approved ? "Approved" : rejected ? "Rejected" : pending ? "Pending" : s}
    </span>
  );
}

function LeftIcon({ kind }: { kind: "bank" | "mobile" }) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-md text-white",
        kind === "bank" ? "bg-light-green" : "bg-orange"
      )}
    >
      {kind === "bank" ? <Landmark className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
    </div>
  );
}

export default function PayoutSettingsCard({ payouts, onChanged }: Props) {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const list = useMemo(() => normalizePayouts(payouts), [payouts]);

  const initialExpanded = useMemo(() => {
    const idx = list.findIndex((x) => x.status !== "approved");
    return idx >= 0 ? idx : -1;
  }, [list]);

  const [expandedIndex, setExpandedIndex] = useState<number>(-1);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  useEffect(() => {
    setExpandedIndex(initialExpanded);
  }, [initialExpanded]);

  // ✅ debug logs to confirm data
  useEffect(() => {
    console.log("✅ payouts raw:", payouts);
    console.log("✅ payouts normalized list:", list);
  }, [payouts, list]);

  async function updatePayout(p: NormalizedPayout, status: VerificationUpdateStatus) {
    if (!userId) {
      console.error("❌ userId missing from route params");
      return;
    }

    try {
      setLoadingKey(p.key);

      console.log("🚀 payout update request:", {
        userId,
        endpoint: p.kind === "bank" ? "payout/bank" : "payout/mobile",
        body: { accountNo: p.accountNo, status },
      });

      const res =
        p.kind === "bank"
          ? await updateBankPayoutStatus(userId, { accountNo: p.accountNo, status })
          : await updateMobilePayoutStatus(userId, { accountNo: p.accountNo, status });

      console.log("✅ payout update response:", res?.data ?? res);

      onChanged?.(); // ✅ refetch profile after update
    } catch (e) {
      console.error("❌ payout update error:", e);
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div className="rounded-xl border border-Primary/15 bg-white p-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Payout Settings" showNotify={false} />
        <button
          type="button"
          onClick={() => setExpandedIndex(expandedIndex === -1 ? 0 : -1)}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-off-white active:scale-[0.98]"
          aria-label="Toggle"
        >
          <ChevronUp className={cn("h-5 w-5 transition-transform", expandedIndex === -1 ? "rotate-180" : "rotate-0")} />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <div className="text-sm text-light-gray">No payout methods found.</div>
        ) : (
          <>
            {/* compact list */}
            {list.map((p, idx) => {
              const active = idx === expandedIndex;

              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setExpandedIndex(active ? -1 : idx)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left transition",
                    active ? "border-light-green/40 bg-light-green/5" : "border-Primary/15 bg-white hover:bg-off-white"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <LeftIcon kind={p.kind} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-black">{p.title}</div>
                        <div className="text-xs text-light-gray truncate">
                          {p.subtitle1}
                          {p.subtitle2 ? (
                            <>
                              {" "}
                              <span className="text-light-gray/80">—</span> {p.subtitle2}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <StatusPill status={p.status} />
                  </div>
                </button>
              );
            })}

            {/* expanded details */}
            {expandedIndex >= 0 && list[expandedIndex] ? (
              <div className="rounded-xl border border-Primary/15 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <LeftIcon kind={list[expandedIndex].kind} />
                    <div>
                      <div className="text-sm font-semibold text-black">{list[expandedIndex].title}</div>
                      <div className="text-xs text-light-gray">{list[expandedIndex].subtitle1}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md bg-orange px-4 py-2 text-sm font-medium text-white hover:brightness-95 active:scale-[0.98]"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("🔔 Notify clicked for payout:", list[expandedIndex]);
                    }}
                  >
                    <Bell className="h-4 w-4" />
                    Notify
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {list[expandedIndex].kind === "bank" ? (
                    <div className="space-y-4">
                      <DetailRow label="Bank Name" value={list[expandedIndex].bank.bankName} />
                      <DetailRow label="Bank Account Holder Name" value={list[expandedIndex].bank.bankAccHolderName} />
                      <DetailRow label="Bank Account No." value={list[expandedIndex].bank.bankAccNo} />
                      <DetailRow label="Routing Number" value={list[expandedIndex].bank.bankRoutingNo} />
                      <DetailRow label="Branch Name" value={list[expandedIndex].bank.bankBranchName} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <DetailRow label="Account Type" value={list[expandedIndex].mobile.accountType} />
                      <DetailRow label="Account Holder Name" value={list[expandedIndex].mobile.accountHolderName} />
                      <DetailRow label="Account No." value={list[expandedIndex].mobile.accountNo} />
                    </div>
                  )}

                  {/* buttons */}
                  <div className="mt-6 flex items-center justify-between">
                    {(() => {
                      const s = String(list[expandedIndex].status).toLowerCase();
                      const isApproved = s === "approved";
                      const isRejected = s === "rejected";
                      const isLoading = loadingKey === list[expandedIndex].key;

                      if (isApproved) {
                        return <div className="text-sm font-semibold text-light-green">Approved</div>;
                      }
                      if (isRejected) {
                        return <div className="text-sm font-semibold text-red">Rejected</div>;
                      }

                      return (
                        <>
                          <button
                            type="button"
                            disabled={isLoading || !userId}
                            className={cn(
                              "h-10 w-[120px] rounded-lg border text-sm font-medium active:scale-[0.98]",
                              isLoading || !userId
                                ? "border-dark-gray/30 bg-white text-dark-gray cursor-not-allowed"
                                : "border-dark-gray/40 bg-white text-black hover:bg-off-white"
                            )}
                            onClick={() => updatePayout(list[expandedIndex], "rejected")}
                          >
                            {isLoading ? "..." : "Reject"}
                          </button>

                          <button
                            type="button"
                            disabled={isLoading || !userId}
                            className={cn(
                              "h-10 w-[120px] rounded-lg text-sm font-medium text-white",
                              isLoading || !userId
                                ? "bg-light-green/60 cursor-not-allowed"
                                : "bg-light-green hover:brightness-95 active:scale-[0.98]"
                            )}
                            onClick={() => updatePayout(list[expandedIndex], "approved")}
                          >
                            {isLoading ? "..." : "Approve"}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              className="mt-2 w-full rounded-lg border border-dashed border-Primary/40 bg-off-white py-3 text-sm font-medium text-Primary hover:bg-Primary/5"
            >
              + Add Another Payout Method
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-light-gray">{label}</div>
      <div className="mt-1 text-sm font-semibold text-black">{value || "—"}</div>
    </div>
  );
}