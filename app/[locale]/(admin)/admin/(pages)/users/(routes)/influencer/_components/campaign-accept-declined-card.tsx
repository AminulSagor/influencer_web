"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getUserChartStats,
  UserChartDateRange,
} from "@/service/admin/users/get-user-chart-stats";

interface Props {
  userId: string;
}

type ChartItem = {
  label: string;
  value: number;
  color: string;
};

const BrandCampaignStatusCard = ({ userId }: Props) => {
  const [dateRange, setDateRange] = useState<UserChartDateRange>("today");
  const [loading, setLoading] = useState(true);
  const [positiveLabel, setPositiveLabel] = useState("Placed");
  const [negativeLabel, setNegativeLabel] = useState("Declined");
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        const res = await getUserChartStats(userId, dateRange);

        setPositiveLabel(res?.data?.positiveLabel ?? "Placed");
        setNegativeLabel(res?.data?.negativeLabel ?? "Declined");
        setChartData(
          (res?.data?.chartData ?? []).map((item) => ({
            label: item.label ?? "",
            value: Number(item.value ?? 0),
            color: item.color ?? "#81BA44",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch brand chart stats:", error);
        setChartData([]);
        setPositiveLabel("Placed");
        setNegativeLabel("Declined");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [userId, dateRange]);

  const maxValue = useMemo(() => {
    const highest = Math.max(...chartData.map((item) => item.value), 0);
    if (highest <= 10) return 10;
    return Math.ceil(highest / 5) * 5;
  }, [chartData]);

  const normalizedData = useMemo(() => {
    return chartData.map((item, index) => {
      const isPositive = index === 0;

      return {
        ...item,
        heightPercent: maxValue > 0 ? (item.value / maxValue) * 100 : 0,
        borderColor: isPositive ? "border-light-green" : "border-red",
        legendColor: isPositive ? "bg-light-green" : "bg-red",
        gradient: isPositive
          ? "linear-gradient(to bottom, rgba(129,186,68,0.45), rgba(255,255,255,0.95))"
          : "linear-gradient(to bottom, rgba(239,68,68,0.18), rgba(255,255,255,0.95))",
      };
    });
  }, [chartData, maxValue]);

  return (
    <Card className="h-full rounded-[28px] border border-black/10 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <CardTitle className="text-Primary text-[18px] font-semibold">
              Campaigns - {positiveLabel} vs {negativeLabel}
            </CardTitle>

            <p className="max-w-[240px] text-sm leading-6 text-Primary">
              Get a glimpse how brands are interacting
            </p>
          </div>

          <Select
            value={dateRange}
            onValueChange={(value) => setDateRange(value as UserChartDateRange)}
          >
            <SelectTrigger className="h-11 w-[128px] rounded-2xl border-0 bg-[#F5F7FB] px-4 text-base text-black shadow-none">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="relative h-[240px] w-full px-4 pb-8 pt-2">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading chart...
            </div>
          ) : (
            <div className="absolute inset-x-4 top-2 bottom-8">
              <div className="relative h-full w-full border-l border-b border-dashed border-gray-300">
                <div className="absolute inset-0 grid grid-rows-2">
                  <div className="border-b border-dashed border-gray-300" />
                  <div />
                </div>

                <div className="absolute left-[-28px] top-0 text-sm text-gray-600">
                  {maxValue}
                </div>
                <div className="absolute left-[-28px] top-1/2 -translate-y-1/2 text-sm text-gray-600">
                  {Math.floor(maxValue / 2)}
                </div>
                <div className="absolute left-[-18px] bottom-0 translate-y-1/2 text-sm text-gray-600">
                  0
                </div>

                <div className="absolute inset-0 flex items-end justify-around px-6 pb-0">
                  {normalizedData.map((item) => (
                    <div
                      key={item.label}
                      className="flex h-full w-[110px] flex-col items-center justify-end"
                    >
                      <div
                        className={`relative w-full rounded-t-sm border-t-4 ${item.borderColor}`}
                        style={{
                          height: `${item.heightPercent}%`,
                          backgroundImage: item.gradient,
                        }}
                      >
                        <span className="absolute left-1/2 top-4 -translate-x-1/2 text-sm text-gray-600 [writing-mode:vertical-rl] rotate-180">
                          {item.value}
                        </span>
                      </div>

                      <p className="mt-3 text-base text-gray-700">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs">
          {normalizedData.map((item) => (
            <div className="flex items-center gap-2" key={item.label}>
              <span className={`h-3 w-3 rounded-sm ${item.legendColor}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCampaignStatusCard;