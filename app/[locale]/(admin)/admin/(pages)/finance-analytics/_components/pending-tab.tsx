"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Search } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { notifyDueClient } from "@/service/admin/finance/notify-due-client";
import {
  exportBrandPendingPayments,
  exportPendingClearance,
} from "@/service/admin/finance/export-pending-clearance";

import type {
  AmountSortType,
  BrandPendingPaymentItem,
  BrandPendingPaymentResponse,
  PendingClearanceItem,
  PendingClearanceResponse,
  PendingPaymentType,
} from "@/types/admin/finance/finance_pending_completed_type";

type PendingTabKey = "agency" | "influencer" | "brand";

type Props = {
  tabsData: {
    agency: PendingClearanceResponse;
    influencer: PendingClearanceResponse;
    brand: BrandPendingPaymentResponse;
  };
};

const formatCurrency = (amount?: number) => {
  if (!amount) return "৳0";
  return `৳${new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date));
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

const formatPaymentType = (value?: string) => {
  if (!value) return "-";

  const map: Record<string, string> = {
    partialpayment: "Partial Payment",
    milestonepayment: "Milestone Payment",
  };

  return map[value.toLowerCase()] || value;
};

const getTabApiValue = (tab: Exclude<PendingTabKey, "brand">) => {
  if (tab === "agency") return "agencypayout";
  return "influencerpayout";
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

  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const PendingTab = ({ tabsData }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab =
    (searchParams.get("pendingTab") as PendingTabKey | null) ?? "agency";
  const querySearch = searchParams.get("pendingSearch") ?? "";
  const paymentType =
    (searchParams.get("pendingPaymentType") as PendingPaymentType | null) ?? "";
  const amountSort =
    (searchParams.get("pendingAmountSort") as AmountSortType | null) ?? "";
  const dateRange = searchParams.get("pendingDateRange") ?? "all";

  const [search, setSearch] = useState(querySearch);
  const [notifyingKey, setNotifyingKey] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  const setPendingParams = (
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
      params.delete("pendingPage");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== querySearch) {
        setPendingParams({
          pendingSearch: search || undefined,
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, querySearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentRes = tabsData[activeTab];
  const currentData = currentRes?.data ?? [];
  const currentMeta = currentRes?.meta;

  const filteredData = useMemo(() => currentData, [currentData]);

  const currentRowIds = useMemo(() => {
    if (activeTab === "brand") {
      return (filteredData as BrandPendingPaymentItem[]).map(
        (item) => item.campaignId
      );
    }

    return (filteredData as PendingClearanceItem[]).map((item) => item.id);
  }, [activeTab, filteredData]);

  const allSelected =
    currentRowIds.length > 0 &&
    currentRowIds.every((id) => selectedIds.includes(id));

  const someSelected =
    currentRowIds.some((id) => selectedIds.includes(id)) && !allSelected;

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentRowIds.includes(id))
      );
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...currentRowIds])));
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab, querySearch, paymentType, amountSort, dateRange]);

  const handleNotifyClient = async (
    clientId: string,
    campaignId: string
  ) => {
    const key = `${clientId}-${campaignId}`;

    try {
      setNotifyingKey(key);

      const res = await notifyDueClient({
        clientId,
        campaignId,
      });

      toast.success(res.message || "Notification sent successfully.");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send notification.";

      toast.error(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
    } finally {
      setNotifyingKey(null);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const now = new Date().toISOString().slice(0, 10);

      if (activeTab === "brand") {
        const res = await exportBrandPendingPayments({
          search: querySearch || undefined,
          amountSort: amountSort || undefined,
          dateFrom: searchParams.get("pendingDateFrom") || undefined,
          dateTo: searchParams.get("pendingDateTo") || undefined,
        });

        downloadCsv(res.data, `brand-pending-payments-${now}.csv`);
        toast.success(res.message || "Brand pending export ready.");
        return;
      }

      const res = await exportPendingClearance({
        search: querySearch || undefined,
        tab: getTabApiValue(activeTab),
        paymentType: paymentType || undefined,
        amountSort: amountSort || undefined,
        dateFrom: searchParams.get("pendingDateFrom") || undefined,
        dateTo: searchParams.get("pendingDateTo") || undefined,
      });

      downloadCsv(res.data, `${activeTab}-pending-clearance-${now}.csv`);
      toast.success(res.message || "Pending clearance export ready.");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to export data.";

      toast.error(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage
      );
    } finally {
      setIsExporting(false);
    }
  };

  const tabLabelMap: Record<PendingTabKey, string> = {
    agency: "Agency Payout",
    influencer: "Influencer Payouts",
    brand: "Brand Payments",
  };

  return (
    <TabsContent value="pending" className="mt-4">
      <Card className="overflow-hidden rounded-[18px] border border-[#d6d6d6] shadow-none">
        <CardHeader className="flex flex-row items-start justify-between border-b px-8 py-5">
          <div>
            <CardTitle className="text-[28px] font-semibold text-Primary">
              Pending Payment Approval
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-[#9b9b9b]">
              Process different types of payment
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white">
            {(["agency", "influencer", "brand"] as PendingTabKey[]).map(
              (tab) => {
                const active = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() =>
                      setPendingParams({
                        pendingTab: tab,
                        pendingPaymentType:
                          tab === "brand" ? undefined : paymentType || undefined,
                      })
                    }
                    className={[
                      "rounded-full px-5 py-2 text-xs font-medium transition",
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

          <div className="flex items-center justify-between rounded-[10px] border border-[#9eb56a] bg-[#eef2d9] px-3 py-2">
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

            <div className="flex items-center gap-2">
              {activeTab !== "brand" && (
                <Select
                  value={paymentType || "all"}
                  onValueChange={(value) =>
                    setPendingParams({
                      pendingPaymentType:
                        value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger className="h-9 w-[150px] rounded-[8px] border-[#cfcfcf] bg-white text-xs">
                    <SelectValue placeholder="Payment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Types</SelectItem>
                    <SelectItem value="partialpayment">
                      Partial Payment
                    </SelectItem>
                    <SelectItem value="milestonepayment">
                      Milestone Payment
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select
                value={amountSort || "all"}
                onValueChange={(value) =>
                  setPendingParams({
                    pendingAmountSort:
                      value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="h-9 w-[110px] rounded-[8px] border-[#cfcfcf] bg-white text-xs">
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
                  setPendingParams({
                    pendingDateRange: value === "all" ? undefined : value,
                    pendingDateFrom:
                      value === "last30"
                        ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                        : value === "thisMonth"
                        ? new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                          ).toISOString()
                        : undefined,
                    pendingDateTo:
                      value === "all" ? undefined : new Date().toISOString(),
                  })
                }
              >
                <SelectTrigger className="h-9 w-[155px] rounded-[8px] border-[#cfcfcf] bg-white text-xs">
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
            <div className="overflow-hidden rounded-[12px] border border-[#d9d9d9]">
              <div className="grid grid-cols-[52px_1.7fr_1.1fr_1.8fr_0.9fr_1fr] items-center bg-light-green px-2 py-3 text-sm font-medium text-white">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={
                      allSelected ? true : someSelected ? "indeterminate" : false
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all rows"
                  />
                </div>
                <div>Payee Info</div>
                <div>Payment Type</div>
                <div>Campaign</div>
                <div>Amount</div>
                <div className="text-right pr-3">Action</div>
              </div>

              <div className="divide-y divide-[#e5e5e5]">
                {(filteredData as PendingClearanceItem[]).map((item) => {
                  const selected = selectedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={[
                        "grid grid-cols-[52px_1.7fr_1.1fr_1.8fr_0.9fr_1fr] items-center px-2 py-3 transition",
                        selected ? "bg-[#f5f6eb]" : "bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleRow(item.id)}
                          aria-label={`Select ${item.payeeName}`}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 bg-[#a7d08c]">
                          <AvatarImage src="/" />
                          <AvatarFallback className="bg-[#a7d08c] text-[11px] text-white">
                            {item.payeeName?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-[#222]">
                            {item.payeeName}
                          </p>
                          <p className="text-[10px] capitalize leading-4 text-[#9a9a9a]">
                            {item.type}
                          </p>
                        </div>
                      </div>

                      <div className="text-[13px] text-[#222]">
                        {formatPaymentType(item.transactionType)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[#222]">
                          {item.campaign}
                        </p>
                        <p className="text-[10px] leading-4 text-[#a0a0a0]">
                          Milestone Reached:
                        </p>
                        <p className="text-[10px] leading-4 text-[#a0a0a0]">
                          {formatDateTimeSmall(item.milestoneReachedDate)}
                        </p>
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.amountRequested)}
                      </div>

                      <div className="flex justify-end pr-2">
                        <Button
                          variant="lightGreen"
                          className="h-8 rounded-[8px] px-4 text-[11px] font-medium"
                        >
                          Process Payment
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {filteredData.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No pending {activeTab} payments found.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "brand" && (
            <div className="overflow-hidden rounded-[12px] border border-[#d9d9d9]">
              <div className="grid grid-cols-[52px_1.5fr_0.9fr_1.6fr_0.9fr_0.9fr_1fr] items-center bg-light-green px-2 py-3 text-sm font-medium text-white">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={
                      allSelected ? true : someSelected ? "indeterminate" : false
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all rows"
                  />
                </div>
                <div>Brand Name</div>
                <div>Last Paid</div>
                <div>Campaign</div>
                <div>Paid</div>
                <div>Due Amount</div>
                <div className="text-right pr-3">Action</div>
              </div>

              <div className="divide-y divide-[#e5e5e5]">
                {(filteredData as BrandPendingPaymentItem[]).map((item) => {
                  const rowKey = `${item.clientId}-${item.campaignId}`;
                  const isLoading = notifyingKey === rowKey;
                  const selected = selectedIds.includes(item.campaignId);

                  return (
                    <div
                      key={item.campaignId}
                      className={[
                        "grid grid-cols-[52px_1.5fr_0.9fr_1.6fr_0.9fr_0.9fr_1fr] items-center px-2 py-3 transition",
                        selected ? "bg-[#f5f6eb]" : "bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleRow(item.campaignId)}
                          aria-label={`Select ${item.brandName}`}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={item.profileImage || "/"} />
                          <AvatarFallback className="bg-[#a7d08c] text-[11px] text-white">
                            {item.brandName?.charAt(0) || "B"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-[#222]">
                            {item.brandName}
                          </p>
                          <p className="text-[10px] capitalize leading-4 text-[#9a9a9a]">
                            {item.role}
                          </p>
                        </div>
                      </div>

                      <div className="text-[13px] text-[#222]">
                        {formatDate(item.lastCampaignPaidDate)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[#222]">
                          {item.campaignName}
                        </p>
                        <p className="text-[10px] leading-4 text-[#a0a0a0]">
                          Milestone Reached:
                        </p>
                        <p className="text-[10px] leading-4 text-[#a0a0a0]">
                          {formatDateTimeSmall(item.milestoneLastUpdatedAt)}
                        </p>
                      </div>

                      <div className="text-[15px] font-semibold text-light-green">
                        {formatCurrency(item.lastPaidAmount)}
                      </div>

                      <div className="text-[15px] font-semibold text-orange">
                        {formatCurrency(item.dueAmount)}
                      </div>

                      <div className="flex justify-end pr-2">
                        <Button
                          variant="orange"
                          onClick={() =>
                            handleNotifyClient(item.clientId, item.campaignId)
                          }
                          disabled={isLoading}
                          className="h-8 rounded-[8px] px-4 text-[11px] font-medium"
                        >
                          <Bell className="mr-1 h-3 w-3" />
                          {isLoading ? "Sending..." : "Notify"}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {filteredData.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No pending brand payments found.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end text-sm text-muted-foreground">
            Page {currentMeta?.page ?? 1} of {currentMeta?.totalPages ?? 1}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PendingTab;