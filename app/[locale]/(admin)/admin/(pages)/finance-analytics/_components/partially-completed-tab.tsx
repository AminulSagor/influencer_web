"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

import type {
  PartiallyCompletedItem,
  PartiallyCompletedResponse,
  PartiallyCompletedTab,
} from "@/types/admin/finance/finance_partially_completed_type";

type Props = {
  tabsData: {
    agency: PartiallyCompletedResponse;
    influencer: PartiallyCompletedResponse;
    brand: PartiallyCompletedResponse;
  };
};

const formatCurrency = (amount?: number) => {
  if (amount == null) return "৳0";
  return `৳${new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const formatDateTimeSmall = (date?: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const getStatusBadgeClasses = (status?: string) => {
  const s = (status ?? "").toLowerCase();
  const isCancelled = s.includes("cancel");
  const isPartial = s.includes("partial");

  if (isCancelled || isPartial) {
    return "border-[#d8c98f] bg-[#f8efc9] text-[#9d8b38]";
  }

  return "border-[#c7d89a] bg-[#eef4d9] text-[#7ea24d]";
};

const PartiallyCompletedTab = ({ tabsData }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab =
    (searchParams.get("partialTab") as PartiallyCompletedTab | null) ??
    "influencerpayout";

  const activeKey: "agency" | "influencer" | "brand" =
    activeTab === "agencypayout"
      ? "agency"
      : activeTab === "influencerpayout"
        ? "influencer"
        : "brand";

  const querySearch = searchParams.get("partialSearch") ?? "";

  const [search, setSearch] = useState(querySearch);

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  const setPartialParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== querySearch) {
        setPartialParams({
          partialSearch: search || undefined,
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, querySearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentRes = tabsData[activeKey];
  const currentData = currentRes?.data ?? [];

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return currentData;

    return (currentData as PartiallyCompletedItem[]).filter((item) => {
      return (
        item.payeeInfo?.name?.toLowerCase().includes(q) ||
        item.campaign?.toLowerCase().includes(q)
      );
    });
  }, [currentData, search]);

  const tabLabelMap: Record<PartiallyCompletedTab, string> = {
    agencypayout: "Agency",
    influencerpayout: "Influencer",
    brandpayment: "Brand",
  };

  return (
    <TabsContent value="partially" className="mt-4">
      <Card className="overflow-hidden rounded-[18px] border border-[#d6d6d6] shadow-none">
        <CardHeader className="flex flex-col items-start gap-3 border-b px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <CardTitle className="text-[24px] font-semibold text-Primary sm:text-[28px]">
              Partially Completed
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-[#9b9b9b]">
              Review partially completed payments
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full bg-white px-3 py-2 sm:px-0 sm:py-0 sm:gap-2">
            {(
              [
                "agencypayout",
                "influencerpayout",
                "brandpayment",
              ] as PartiallyCompletedTab[]
            ).map(
              (tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() =>
                      setPartialParams({
                        partialTab: tab,
                      })
                    }
                    className={[
                      "whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition sm:px-5",
                      active
                        ? "bg-light-green text-white shadow-sm"
                        : "bg-transparent text-[#2b2b2b] hover:bg-[#f3f6ea]",
                    ].join(" ")}
                  >
                    {tabLabelMap[tab]}
                  </button>
                );
              }
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a7a7a7]" />
            <Input
              placeholder="Search by payee name or campaign..."
              className="h-11 rounded-[10px] border-[#cfcfcf] pl-10 text-sm placeholder:text-[#b1b1b1]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-[12px] border border-[#d9d9d9]">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-[1.6fr_2fr_1fr_1fr_1.2fr] items-center bg-light-green px-2 py-3 text-sm font-medium text-white">
                <div>Payee Info</div>
                <div>Campaign</div>
                <div>Agreed Amount</div>
                <div>Total Paid</div>
                <div className="text-right pr-3">Status</div>
              </div>

              <div className="divide-y divide-[#e5e5e5]">
                {filteredData.map((item) => {
                  const status = item.status ?? "-";
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.6fr_2fr_1fr_1fr_1.2fr] items-center px-2 py-3 transition bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={item.payeeInfo.image || "/"} />
                          <AvatarFallback className="bg-[#a7d08c] text-[11px] text-white">
                            {item.payeeInfo.name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-[#222]">
                            {item.payeeInfo.name}
                          </p>
                          <p className="text-[10px] capitalize leading-4 text-[#9a9a9a]">
                            {item.payeeInfo.role}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[#222]">
                          {item.campaign}
                        </p>
                        <p className="text-[10px] leading-4 text-[#a0a0a0]">
                          Milestone Completed:{" "}
                          {formatDateTimeSmall(item.milestoneCompleted)}
                        </p>
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.agreedAmount)}
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.totalPaid)}
                      </div>

                      <div className="flex justify-end pr-2">
                        <Badge
                          className={[
                            "rounded-full border px-4 py-1.5 text-[11px] font-medium shadow-none",
                            getStatusBadgeClasses(status),
                          ].join(" ")}
                        >
                          {status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}

                {filteredData.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No partially completed payments found.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end text-sm text-muted-foreground">
            Page {currentRes?.meta?.page ?? 1} of{" "}
            {currentRes?.meta?.totalPages ?? 1}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PartiallyCompletedTab;

