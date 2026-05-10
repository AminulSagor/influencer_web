"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";

import { exportCompletedPayments } from "@/service/admin/finance/export-completed-payment";

import type {
  AmountSortType,
  CompletedPaymentResponse,
  CompletedPaymentType,
  FinanceTableTab,
} from "@/types/admin/finance/finance_pending_completed_type";

type Props = {
  tabsData: {
    agency: CompletedPaymentResponse;
    influencer: CompletedPaymentResponse;
    brand: CompletedPaymentResponse;
  };
};

const formatCurrency = (amount?: number) => {
  if (!amount) return "৳0";
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

const getStatusLabel = (item: CompletedPaymentResponse["data"][number]) => {
  if (
    typeof item.totalPaid === "number" &&
    typeof item.agreedAmount === "number" &&
    item.totalPaid >= item.agreedAmount
  ) {
    return "Full Paid";
  }

  if (
    typeof item.paidByClient === "number" &&
    typeof item.campaignBudget === "number" &&
    item.paidByClient >= item.campaignBudget
  ) {
    return "Full Paid";
  }

  return "Partial Paid";
};

const getTabApiValue = (tab: FinanceTableTab) => {
  if (tab === "agency") return "agencypayout";
  if (tab === "influencer") return "influencerpayout";
  return "brandpayment";
};

const downloadCsv = (
  rows: Record<string, string | number | null>[],
  fileName: string
) => {
  if (!rows.length) {
    toast.error("No data available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const escapeCsv = (value: string | number | null | undefined) => {
    const stringValue = value == null ? "" : String(value);
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ].join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const CompletedTab = ({ tabsData }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab =
    (searchParams.get("completedTab") as FinanceTableTab | null) ?? "agency";
  const querySearch = searchParams.get("completedSearch") ?? "";
  const paymentType =
    (searchParams.get("completedPaymentType") as CompletedPaymentType | null) ??
    "";
  const amountSort =
    (searchParams.get("completedAmountSort") as AmountSortType | null) ?? "";
  const dateRange = searchParams.get("completedDateRange") ?? "all";
  const dateFrom = searchParams.get("completedDateFrom") ?? undefined;
  const dateTo = searchParams.get("completedDateTo") ?? undefined;

  const [search, setSearch] = useState(querySearch);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  const setCompletedParams = (
    updates: Record<string, string | undefined>,
    resetPage = true
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (resetPage) {
      params.delete("completedPage");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== querySearch) {
        setCompletedParams({
          completedSearch: search || undefined,
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, querySearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentRes = tabsData[activeTab];
  const currentData = currentRes?.data ?? [];
  const currentMeta = currentRes?.meta;
  const currentPage = currentMeta?.page ?? Number(searchParams.get("completedPage") ?? "1");
  const totalPages = currentMeta?.totalPages ?? 1;
  const limit = currentMeta?.limit ?? 10;
  const total = currentMeta?.total ?? currentData.length;
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = total === 0 ? 0 : Math.min(currentPage * limit, total);

  const filteredData = useMemo(() => currentData, [currentData]);

  const paginationPages = useMemo(() => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, totalPages]);

  const goToCompletedPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCompletedParams({ completedPage: String(page) }, false);
  };

  const pagination = currentMeta && total > 0 && (
    <div className="flex flex-col items-center justify-between gap-3 border-t bg-white px-4 py-4 text-sm sm:flex-row sm:px-6 sm:py-5">
      <div className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem} - {endItem}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span> Payments
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 text-muted-foreground"
          disabled={currentPage <= 1}
          onClick={() => goToCompletedPage(currentPage - 1)}
        >
          Previous
        </Button>

        {paginationPages.map((pageNumber) => (
          <Button
            key={pageNumber}
            type="button"
            variant="ghost"
            onClick={() => goToCompletedPage(pageNumber)}
            className={[
              "h-8 min-w-8 px-0",
              currentPage === pageNumber
                ? "bg-light-green text-white hover:bg-light-green/90"
                : "text-Primary",
            ].join(" ")}
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 text-muted-foreground"
          disabled={currentPage >= totalPages}
          onClick={() => goToCompletedPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const currentIds = filteredData.map((item) => item.id);

  const allSelected =
    currentIds.length > 0 && currentIds.every((id) => selectedIds.includes(id));

  const someSelected =
    currentIds.some((id) => selectedIds.includes(id)) && !allSelected;

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab, querySearch, paymentType, amountSort, dateRange]);

  const handleExport = async () => {
    if (!selectedIds.length) {
      toast.error("Please select at least one completed payment to export.");
      return;
    }

    try {
      setIsExporting(true);

      const res = await exportCompletedPayments({
        search: querySearch || undefined,
        tab: getTabApiValue(activeTab),
        paymentType: paymentType || undefined,
        amountSort: amountSort || undefined,
        dateFrom,
        dateTo,
        exportIds: selectedIds,
      });

      const now = new Date().toISOString().slice(0, 10);
      downloadCsv(res.data, `completed-payments-${activeTab}-${now}.csv`);
      toast.success(res.message || "Completed payments exported successfully.");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to export completed payments.";

      toast.error(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
    } finally {
      setIsExporting(false);
    }
  };

  const tabLabelMap: Record<FinanceTableTab, string> = {
    agency: "Agency",
    influencer: "Influencer",
    brand: "Brand",
  };

  return (
    <TabsContent value="completed" className="mt-4">
      <Card className="overflow-hidden rounded-[18px] border border-[#d6d6d6] shadow-none">
        <CardHeader className="flex flex-col items-start gap-3 border-b px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div>
            <CardTitle className="text-[24px] font-semibold text-Primary sm:text-[28px]">
              Payment Completed
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-[#9b9b9b]">
              Analyze your profit & payments
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full bg-white px-3 py-2 sm:px-0 sm:py-0 sm:gap-2">
            {(["agency", "influencer", "brand"] as FinanceTableTab[]).map(
              (tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() =>
                      setCompletedParams({
                        completedTab: tab,
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
              placeholder="Search by campaign name, Agency/Influencer name, phone number, email..."
              className="h-11 rounded-[10px] border-[#cfcfcf] pl-10 text-sm placeholder:text-[#b1b1b1]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-[10px] border border-[#9eb56a] bg-[#eef2d9] px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="rounded-[8px] bg-light-green px-4 py-2 text-xs font-medium text-white">
                {selectedIds.length} Selected
              </div>

              <Button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="h-9 rounded-[8px] bg-light-green px-5 text-xs font-medium text-white hover:bg-light-green"
              >
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
              <Select
                value={paymentType || "all"}
                onValueChange={(value) =>
                  setCompletedParams({
                    completedPaymentType: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="h-9 w-full sm:w-[150px] rounded-[8px] border-[#cfcfcf] bg-white text-xs">
                  <SelectValue placeholder="Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Types</SelectItem>
                  <SelectItem value="partialpayment">Partial Payment</SelectItem>
                  <SelectItem value="milestonepayment">
                    Milestone Payment
                  </SelectItem>
                  <SelectItem value="finalpayment">Full Payment</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={amountSort || "all"}
                onValueChange={(value) =>
                  setCompletedParams({
                    completedAmountSort: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="h-9 w-full sm:w-[110px] rounded-[8px] border-[#cfcfcf] bg-white text-xs">
                  <SelectValue placeholder="Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Amount</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={dateRange}
                onValueChange={(value) =>
                  setCompletedParams({
                    completedDateRange: value === "all" ? undefined : value,
                    completedDateFrom:
                      value === "last30"
                        ? new Date(
                            Date.now() - 30 * 24 * 60 * 60 * 1000
                          ).toISOString()
                        : value === "thisMonth"
                        ? new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                          ).toISOString()
                        : undefined,
                    completedDateTo:
                      value === "all" ? undefined : new Date().toISOString(),
                  })
                }
              >
                <SelectTrigger className="h-9 w-full sm:w-[135px] rounded-[8px] border-[#cfcfcf] bg-white text-xs">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(activeTab === "agency" || activeTab === "influencer") && (
            <div className="overflow-x-auto rounded-[12px] border border-[#d9d9d9]">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[52px_1.6fr_1.8fr_1fr_1fr_1fr] items-center bg-light-green px-2 py-3 text-sm font-medium text-white">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        allSelected ? true : someSelected ? "indeterminate" : false
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </div>
                  <div>Payee Info</div>
                  <div>Campaign</div>
                  <div>Agreed Amount</div>
                  <div>Total Paid</div>
                  <div className="text-right pr-3">Status</div>
                </div>

                <div className="divide-y divide-[#e5e5e5]">
                {filteredData.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  const status = getStatusLabel(item);
                  const isFull = status === "Full Paid";

                  return (
                    <div
                      key={item.id}
                      className={[
                        "grid grid-cols-[52px_1.6fr_1.8fr_1fr_1fr_1fr] items-center px-2 py-3 transition",
                        selected ? "bg-[#f5f6eb]" : "bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleRow(item.id)}
                        />
                      </div>

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
                          Milestone Completed:
                        </p>
                        <p className="text-[10px] leading-4 text-[#a0a0a0]">
                          {formatDateTimeSmall(item.milestoneCompleted)}
                        </p>
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.agreedAmount ?? item.sortAmount)}
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.totalPaid ?? item.sortAmount)}
                      </div>

                      <div className="flex justify-end pr-2">
                        <Badge
                          className={[
                            "rounded-full border px-4 py-1.5 text-[11px] font-medium shadow-none",
                            isFull
                              ? "border-[#c7d89a] bg-[#eef4d9] text-[#7ea24d]"
                              : "border-[#d8c98f] bg-[#f8efc9] text-[#9d8b38]",
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
                    No completed {activeTab} payments found.
                  </div>
                )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "brand" && (
            <div className="overflow-x-auto rounded-[12px] border border-[#d9d9d9]">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[52px_1.4fr_1.7fr_1fr_1fr_1fr_0.9fr] items-center bg-light-green px-2 py-3 text-sm font-medium text-white">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        allSelected ? true : someSelected ? "indeterminate" : false
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </div>
                  <div>Payee Info</div>
                  <div>Campaign</div>
                  <div>Campaign Budget</div>
                  <div>Paid By Brand</div>
                  <div>Talent Fee</div>
                  <div className="text-right pr-3">Profit</div>
                </div>

                <div className="divide-y divide-[#e5e5e5]">
                {filteredData.map((item) => {
                  const selected = selectedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={[
                        "grid grid-cols-[52px_1.4fr_1.7fr_1fr_1fr_1fr_0.9fr] items-center px-2 py-3 transition",
                        selected ? "bg-[#f5f6eb]" : "bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleRow(item.id)}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={item.payeeInfo.image || "/"} />
                          <AvatarFallback className="bg-[#a7d08c] text-[11px] text-white">
                            {item.payeeInfo.name?.charAt(0) || "B"}
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
                          Milestone Completed:
                        </p>
                        <p className="text-[10px] leading-4 text-[#a0a0a0]">
                          {formatDateTimeSmall(item.milestoneCompleted)}
                        </p>
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        <p>{formatCurrency(item.campaignBudget)}</p>
                        <p className="text-[10px] font-normal text-[#8e8e8e]">
                          VAT ({item.vatPercent ?? 0}%)
                        </p>
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.paidByClient)}
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.talentFee)}
                      </div>

                      <div className="text-right text-[15px] font-semibold text-light-green pr-2">
                        {formatCurrency(item.profit)}
                      </div>
                    </div>
                  );
                })}

                {filteredData.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No completed brand payments found.
                  </div>
                )}
                </div>
              </div>
            </div>
          )}

          {pagination}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default CompletedTab;