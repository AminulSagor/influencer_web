"use client";

import SectionHeader from "./section-header";
import ActionButtons from "./action-buttons";
import { cn } from "@/lib/utils";

type Props = {
  payouts: unknown | null;
};

type AnyPayout = {
  type?: string;
  status?: string;
  bankName?: string;
  accountNumber?: string;
  phoneNumber?: string;
  accountHolder?: string;
};

function asArray(v: unknown): AnyPayout[] {
  return Array.isArray(v) ? (v as AnyPayout[]) : [];
}

export default function PayoutSettingsCard({ payouts }: Props) {
  const list = asArray(payouts);

  return (
    <div className="rounded-xl border border-primary/15 bg-white p-6">
      <SectionHeader title="Payout Settings" />

      <div className="mt-5 space-y-4">
        {list.length === 0 ? (
          <div className="text-sm text-light-gray">
            No payout methods found (API returned null/empty).
          </div>
        ) : (
          list.map((p, idx) => {
            const status = String(p.status ?? "pending").toLowerCase();
            const approved = status === "approved";
            const pending = status === "pending";

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border p-4",
                  approved
                    ? "border-light-green/30 bg-light-green/5"
                    : pending
                      ? "border-orange/30 bg-orange/5"
                      : "border-primary/15 bg-off-white"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-black">
                      {p.type || `Payout Method ${idx + 1}`}
                    </div>
                    <div className="mt-1 text-sm text-light-gray">
                      {p.bankName ? `Bank: ${p.bankName}` : null}
                      {p.phoneNumber ? `Phone: ${p.phoneNumber}` : null}
                      {!p.bankName && !p.phoneNumber ? "—" : null}
                    </div>
                    <div className="mt-1 text-xs text-light-gray">
                      {p.accountHolder ? `Holder: ${p.accountHolder}` : ""}
                      {p.accountNumber ? ` • Acc: ${p.accountNumber}` : ""}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "rounded-full px-4 py-2 text-xs font-semibold",
                      approved
                        ? "bg-light-green/15 text-light-green"
                        : pending
                          ? "bg-orange/15 text-orange"
                          : "bg-Primary/10 text-Primary"
                    )}
                  >
                    {approved ? "Approved" : pending ? "Pending" : status}
                  </div>
                </div>

                <div className="mt-4">
                  <ActionButtons />
                </div>
              </div>
            );
          })
        )}

        <button
          type="button"
          className="mt-2 w-full rounded-lg border border-dashed border-primary/40 bg-off-white py-3 text-sm font-medium text-Primary hover:bg-Primary/5"
        >
          + Add Another Payout Method
        </button>
      </div>
    </div>
  );
}