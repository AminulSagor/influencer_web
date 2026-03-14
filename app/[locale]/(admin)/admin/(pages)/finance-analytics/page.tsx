import { ArrowLeftCircle } from "lucide-react";
import React from "react";

import RowOne from "./_components/row-one";
import RowTwo from "./_components/row-two";

import { getFinanceAnalytics } from "@/service/admin/finance/get-finance-analytics";
import { getPendingClearance } from "@/service/admin/finance/get-pending-clearance";
import { getCompletedPayments } from "@/service/admin/finance/get-completed-payment";
import { getBrandPendingPayments } from "@/service/admin/finance/get-brand-pending-payments";

import type {
  AmountSortType,
  CompletedPaymentType,
  PendingPaymentType,
} from "@/types/admin/finance/finance_pending_completed_type";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const getSingleValue = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const getDateRange = (range?: string) => {
  const now = new Date();

  if (range === "last30") {
    const to = new Date(now);
    const from = new Date(now);
    from.setDate(from.getDate() - 30);

    return {
      dateFrom: from.toISOString(),
      dateTo: to.toISOString(),
    };
  }

  if (range === "thisMonth") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date();

    return {
      dateFrom: from.toISOString(),
      dateTo: to.toISOString(),
    };
  }

  return {
    dateFrom: undefined,
    dateTo: undefined,
  };
};

const page = async ({ searchParams }: PageProps) => {
  const params = (await searchParams) ?? {};

  const pendingSearch = getSingleValue(params.pendingSearch) ?? "";
  const pendingPaymentType =
    (getSingleValue(params.pendingPaymentType) as PendingPaymentType | undefined) ??
    undefined;
  const pendingAmountSort =
    (getSingleValue(params.pendingAmountSort) as AmountSortType | undefined) ??
    undefined;
  const pendingDateRange = getSingleValue(params.pendingDateRange) ?? "all";

  const completedSearch = getSingleValue(params.completedSearch) ?? "";
  const completedPaymentType =
    (getSingleValue(
      params.completedPaymentType
    ) as CompletedPaymentType | undefined) ?? undefined;
  const completedAmountSort =
    (getSingleValue(params.completedAmountSort) as AmountSortType | undefined) ??
    undefined;
  const completedDateRange = getSingleValue(params.completedDateRange) ?? "all";

  const pendingDates = getDateRange(pendingDateRange);
  const completedDates = getDateRange(completedDateRange);

  const [
    financeAnalytics,
    pendingAgency,
    pendingInfluencer,
    pendingBrand,
    completedAgency,
    completedInfluencer,
    completedBrand,
  ] = await Promise.all([
    getFinanceAnalytics(),

    getPendingClearance({
      page: 1,
      limit: 10,
      tab: "agencypayout",
      search: pendingSearch || undefined,
      paymentType: pendingPaymentType,
      amountSort: pendingAmountSort,
      dateFrom: pendingDates.dateFrom,
      dateTo: pendingDates.dateTo,
    }),

    getPendingClearance({
      page: 1,
      limit: 10,
      tab: "influencerpayout",
      search: pendingSearch || undefined,
      paymentType: pendingPaymentType,
      amountSort: pendingAmountSort,
      dateFrom: pendingDates.dateFrom,
      dateTo: pendingDates.dateTo,
    }),

    getBrandPendingPayments({
      page: 1,
      limit: 10,
      search: pendingSearch || undefined,
      amountSort: pendingAmountSort,
      dateFrom: pendingDates.dateFrom,
      dateTo: pendingDates.dateTo,
    }),

    getCompletedPayments({
      page: 1,
      limit: 10,
      tab: "agencypayout",
      search: completedSearch || undefined,
      paymentType: completedPaymentType,
      amountSort: completedAmountSort,
      dateFrom: completedDates.dateFrom,
      dateTo: completedDates.dateTo,
    }),

    getCompletedPayments({
      page: 1,
      limit: 10,
      tab: "influencerpayout",
      search: completedSearch || undefined,
      paymentType: completedPaymentType,
      amountSort: completedAmountSort,
      dateFrom: completedDates.dateFrom,
      dateTo: completedDates.dateTo,
    }),

    getCompletedPayments({
      page: 1,
      limit: 10,
      tab: "brandpayment",
      search: completedSearch || undefined,
      paymentType: completedPaymentType,
      amountSort: completedAmountSort,
      dateFrom: completedDates.dateFrom,
      dateTo: completedDates.dateTo,
    }),
  ]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-Primary">
        <ArrowLeftCircle />
        <p className="text-xl font-semibold">Finance and Analytics</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <RowOne data={financeAnalytics} />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <RowTwo
            pendingTabs={{
              agency: pendingAgency,
              influencer: pendingInfluencer,
              brand: pendingBrand,
            }}
            completedTabs={{
              agency: completedAgency,
              influencer: completedInfluencer,
              brand: completedBrand,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default page;