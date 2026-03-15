"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Loader from "@/components/spin-loader";
import { formatBDT } from "./quote-utils";

type SharedQuoteLayoutProps = {
  title?: string;
  quoteStateLabel: string;
  displayBaseBudget: number;
  displayVatAmount: number;
  displayTotalCost: number;
  paidAmount: number;
  dueAmount: number;
  isPaid: boolean;
  showQuoteActions: boolean;
  isLoadingNegotiations: boolean;
  isNegotiating: boolean;
  actionSection: React.ReactNode;
};

export function SummaryRow({
  label,
  value,
  valueClassName = "font-semibold text-light-green",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm">{label}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

export function Divider() {
  return <div className="my-3 h-px w-full bg-black/15" />;
}

export function StatusButton({
  label,
  disabled = true,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-md border border-light-gray bg-[#EFEFEF] py-2 text-sm text-black disabled:cursor-not-allowed disabled:text-black/70 disabled:opacity-100"
    >
      {label}
    </button>
  );
}

export function ActionButton({
  label,
  onClick,
  disabled = false,
  loading = false,
  variant = "secondary",
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
}) {
  const baseClass =
    "w-full rounded-md py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-60";
  const variantClass =
    variant === "primary"
      ? "border border-light-green bg-light-green text-white"
      : "border border-light-gray bg-[#EFEFEF] text-black";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader className="h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Submitting...</span>
        </span>
      ) : (
        label
      )}
    </button>
  );
}

export function InfoBadge({ label }: { label: string }) {
  return (
    <div className="mb-3 inline-flex rounded-full border border-light-green/30 bg-white/80 px-3 py-1 text-xs text-light-green">
      {label}
    </div>
  );
}

export function SharedQuoteLayout({
  title = "Quote Details",
  quoteStateLabel,
  displayBaseBudget,
  displayVatAmount,
  displayTotalCost,
  paidAmount,
  dueAmount,
  isPaid,
  showQuoteActions,
  isLoadingNegotiations,
  isNegotiating,
  actionSection,
}: SharedQuoteLayoutProps) {
  return (
    <Card>
      <CardContent>
        <h2 className="text-base font-semibold text-Primary">{title}</h2>

        <div className="mt-2 overflow-x-auto rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white p-4 no-scrollbar">
          <div className="text-sm">
            <InfoBadge label={quoteStateLabel} />

            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <SummaryRow
                  label="Base Campaign Budget"
                  value={formatBDT(displayBaseBudget)}
                />

                <SummaryRow
                  label="VAT/Tax"
                  value={formatBDT(displayVatAmount)}
                />

                <Divider />

                <SummaryRow
                  label="Total Campaign Cost"
                  value={formatBDT(displayTotalCost)}
                  valueClassName="text-base font-semibold tracking-tight text-light-green"
                />

                {!showQuoteActions && (paidAmount > 0 || dueAmount > 0 || isPaid) && (
                  <>
                    <div className="mt-2" />
                    <SummaryRow label="Paid" value={formatBDT(paidAmount)} />

                    {dueAmount > 0 && (
                      <>
                        <Divider />
                        <SummaryRow
                          label="Due"
                          value={formatBDT(dueAmount)}
                          valueClassName="text-base font-semibold tracking-tight text-light-green"
                        />
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-Secondary">
                <span className="text-base font-semibold text-Primary">৳</span>
              </div>
            </div>

            <div className="mt-4">
              {isLoadingNegotiations && isNegotiating && (
                <div className="flex items-center justify-center py-2">
                  <Loader className="h-5 w-5 border-2 border-Primary border-t-transparent" />
                </div>
              )}

              {actionSection}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}