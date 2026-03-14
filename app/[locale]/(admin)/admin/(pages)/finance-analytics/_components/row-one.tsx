import { FinanceAnalyticsData } from "@/types/admin/finance/finance_analytic_type";
import React from "react";

type Props = {
  data: FinanceAnalyticsData;
};

const formatCurrency = (amount: number) => {
  return `৳${new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const formatPercentage = (value: number) => {
  return `${Number(value).toFixed(2)}%`;
};

const RowOne = ({ data }: Props) => {
  return (
    <>
      <div className="col-span-12 md:col-span-6 space-y-2">
        <div className="bg-linear-to-r from-Primary to-light-green rounded-md p-2">
          <div className="text-white-two space-y-2">
            <p>Gross Revenue</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">
                {formatCurrency(data.grossRevenue)}
              </p>
              <p>{formatPercentage(data.revenueGrowthRate)} from last month</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="bg-linear-to-r from-Primary to-light-green rounded-md p-2 flex-1">
            <div className="text-white-two space-y-2">
              <p>Net Profit</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">
                  {formatCurrency(data.netProfit)}
                </p>
                <p></p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-white to-Secondary rounded-md p-2 flex-1 border border-light-green">
            <div className="text-light-green space-y-2">
              <p>Total Pending Profit</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">
                  {formatCurrency(data.totalPendingBudget)}
                </p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6">
        <div className="shadow bg-linear-to-r from-white to-Secondary rounded-md p-2 flex-1">
          <div className="text-light-green space-y-2">
            <p>Total Pending Payout</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-semibold">
                {formatCurrency(data.totalPendingPayout.total)}
              </p>
              <p></p>
            </div>

            <div className="flex justify-between">
              <p>
                Agency: {formatCurrency(data.totalPendingPayout.agency.amount)}
              </p>
              <p className="text-orange">
                Influencer:{" "}
                {formatCurrency(data.totalPendingPayout.influencer.amount)}
              </p>
            </div>

            <div>
              <div className="w-full h-3 rounded-full bg-gray-700 overflow-hidden flex">
                <div
                  className="h-full bg-light-green"
                  style={{
                    width: `${data.totalPendingPayout.agency.percentage}%`,
                  }}
                />
                <div
                  className="h-full bg-orange"
                  style={{
                    width: `${data.totalPendingPayout.influencer.percentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="w-4 aspect-square bg-light-green rounded-full"></div>
                <p className="text-sm font-semibold">
                  {formatPercentage(data.totalPendingPayout.agency.percentage)}{" "}
                  Agency
                </p>
              </div>

              <div className="flex items-center gap-1">
                <p className="text-orange text-sm font-semibold">
                  {formatPercentage(
                    data.totalPendingPayout.influencer.percentage
                  )}{" "}
                  Influencer
                </p>
                <div className="w-4 aspect-square bg-orange rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RowOne;