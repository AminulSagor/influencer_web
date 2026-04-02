"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, XCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Loader from "@/components/spin-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type {
  CancellationRequestItem,
  CancellationRequestsResponse,
  CancellationTargetType,
  ProcessCancellationAction,
} from "@/types/admin/campaign/cancellation_requests_type";
import { processCancellationRequest } from "@/service/admin/campaign/process-cancellation-request";
import { getCancellationRequestDetails } from "@/service/admin/campaign/get-cancellation-request-details";

type Props = {
  requests: CancellationRequestsResponse;
  filters: {
    page: number;
    limit: number;
  };
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatDateTime = (date?: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatCurrency = (amount?: number) => {
  if (amount == null) return "৳0";
  return `৳${new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)}`;
};

const normalizeStatus = (status?: string) => {
  const s = (status ?? "").trim();
  if (!s) return "Active";
  if (s.toLowerCase().includes("active")) return "Active";
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const ProgressCell = ({ progress }: { progress: number }) => {
  const safe = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#9b9b9b]">Progress</p>
        <p className="text-[10px] text-[#9b9b9b]">{safe}%</p>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#e5e5e5]">
        <div className="h-full rounded-full bg-light-green" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
};

export default function CancellationRequestsCard({
  requests,
  filters,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState("");
  const [campaignType, setCampaignType] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogActionLoading, setDialogActionLoading] = useState(false);

  const [selected, setSelected] = useState<{
    requestId: string;
    targetType: CancellationTargetType;
    cancellationReason: string;
    requestedAt: string;
  } | null>(null);

  const [detailsLoading, setDetailsLoading] = useState(false);
  useEffect(() => {
    // Reset local filters when server page changes.
    setSearchValue("");
    setCampaignType("all");
  }, [filters.page, filters.limit]);

  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();

    return (requests.data ?? []).filter((item) => {
      const matchesSearch = !q
        ? true
        : item.campaignInfo.name.toLowerCase().includes(q);
      const matchesType = campaignType === "all"
        ? true
        : item.campaignInfo.type === campaignType;

      return matchesSearch && matchesType;
    });
  }, [requests.data, searchValue, campaignType]);

  const typeOptions = useMemo(() => {
    const unique = new Set<string>();
    (requests.data ?? []).forEach((r) => unique.add(r.campaignInfo.type));
    return Array.from(unique);
  }, [requests.data]);

  const total = requests.meta.total;
  const currentPage = filters.page;
  const limit = filters.limit;
  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(total, currentPage * limit);

  const totalPages = requests.meta.totalPages;

  const pageNumbers = useMemo(() => {
    const center = currentPage;
    const candidates = [center - 1, center, center + 1].filter(
      (p) => p >= 1 && p <= totalPages
    );
    // If list is shorter at the edges, add from the other side.
    while (candidates.length < 3 && candidates[0] > 1) {
      candidates.unshift(candidates[0] - 1);
    }
    while (candidates.length < 3 && candidates[candidates.length - 1] < totalPages) {
      candidates.push(candidates[candidates.length - 1] + 1);
    }
    return Array.from(new Set(candidates)).slice(0, 3);
  }, [currentPage, totalPages]);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    params.set("limit", String(limit));
    router.push(`${pathname}?${params.toString()}`);
  };

  const openDialog = (item: CancellationRequestItem) => {
    setSelected({
      requestId: item.requestId,
      targetType: item.targetType,
      cancellationReason: item.cancellationReason,
      requestedAt: item.requestedAt,
    });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const run = async () => {
      if (!isDialogOpen || !selected) return;

      try {
        setDetailsLoading(true);
        const res = await getCancellationRequestDetails(
          selected.targetType,
          selected.requestId
        );

        if (res?.success) {
          setSelected((prev) =>
            prev
              ? {
                  ...prev,
                  cancellationReason: res.data.cancellationReason,
                  requestedAt: res.data.requestedAt,
                }
              : prev
          );
        }
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Failed to load request details.";
        toast.error(message);
      } finally {
        setDetailsLoading(false);
      }
    };

    void run();
  }, [isDialogOpen, selected?.requestId, selected?.targetType]);

  const handleProcess = async (action: ProcessCancellationAction) => {
    if (!selected) return;

    try {
      setDialogActionLoading(true);
      const res = await processCancellationRequest({
        targetType: selected.targetType,
        targetId: selected.requestId,
        action,
      });

      if (!res.success) {
        toast.error(res.message ?? "Action failed.");
        return;
      }

      toast.success(res.message ?? "Processed successfully.");
      setIsDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to process cancellation request.";
      toast.error(message);
    } finally {
      setDialogActionLoading(false);
    }
  };

  return (
    <>
      <div className="w-full rounded-2xl border border-[#D9D9D9] bg-white p-6 shadow-sm">
        {/* Header Section */}
        <div className="space-y-1 mb-5">
          <h1 className="text-[22px] font-bold tracking-tight text-[#4c6a2e]">
            Approve Campaign Cancellation
          </h1>
          <p className="text-[13px] text-[#a2a2a2]">Cancellation Requests by Clients</p>
        </div>

        {/* Filters Section */}
        <div className="space-y-4 mb-5">
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a2a2a2]" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by campaign name"
              className="h-11 w-full rounded-xl border-[#d1d1d1] bg-white pl-11 text-[13px] text-[#222] shadow-none focus-visible:ring-1 focus-visible:ring-[#7ca153]"
            />
          </div>

          <div className="flex h-[46px] w-full items-center justify-end gap-3 rounded-xl border border-[#d1d1d1] bg-[#f2f5da] px-4 shadow-sm relative overflow-hidden">
             {/* Simple gradient effect inside the yellow bar if needed, otherwise plain color */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#fdfdfd] opacity-40"></div>
            
            <div className="relative z-10 flex gap-3">
              <Select defaultValue="dates">
                <SelectTrigger className="h-8 w-[160px] rounded-[8px] border-[#d1d1d1] bg-white px-3 text-[12px] font-medium text-[#444] shadow-sm">
                  <SelectValue placeholder="Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dates">Nov 20 - Dec 20</SelectItem>
                </SelectContent>
              </Select>

              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger className="h-8 w-[180px] rounded-[8px] border-[#d1d1d1] bg-white px-3 text-[12px] font-medium text-[#444] shadow-sm">
                  <SelectValue placeholder={campaignType === "all" ? "Influencer Promotion" : "Campaign Type"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Influencer Promotion</SelectItem>
                  {typeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-xl">
          <div className="min-w-[1100px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1.1fr_0.8fr_0.9fr] items-center rounded-xl bg-[#7ca153] px-6 py-[14px] text-[13px] font-semibold text-white">
              <div>Campaign Info</div>
              <div>Client</div>
              <div>Timeline</div>
              <div>Financials</div>
              <div className="text-center">Assigned Personals</div>
              <div className="text-center">Status</div>
              <div className="pr-4 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#e5e5e5]">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No cancellation requests found.
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.requestId}
                    className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1.1fr_0.8fr_0.9fr] items-center px-6 py-6 transition-colors hover:bg-[#fafafa]"
                  >
                    {/* Campaign Info */}
                    <div className="flex flex-col justify-center">
                      <p className="text-[13px] font-medium text-[#222] mb-1">
                        {item.campaignInfo.name || "Summer Sale"}
                        <br />
                        {item.campaignInfo.niche || "Fashion"}
                      </p>
                      <p className="text-[11px] text-[#a2a2a2] mt-1">
                        {item.campaignInfo.type || "Influencer Promotion"}
                      </p>
                      <p className="text-[11px] text-[#a2a2a2]">
                        Niches: {item.campaignInfo.niche || "Fashion"}
                      </p>
                    </div>

                    {/* Client */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-[#e0e0e0]">
                        <AvatarImage src={item.clientInfo?.image || "/"} />
                        <AvatarFallback className="bg-[#cfcfcf]" />
                      </Avatar>
                      <p className="text-[13px] font-semibold text-[#222]">
                        {item.clientInfo.name || "StyleCo."}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-[14px]">
                      <div>
                        <p className="text-[13px] font-semibold text-[#222] leading-tight">Start Date:</p>
                        <p className="text-[12px] text-[#888]">{formatDate(item.timeline.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#222] leading-tight">End Date:</p>
                        <p className="text-[12px] text-[#888]">{formatDate(item.timeline.endDate)}</p>
                      </div>
                    </div>

                    {/* Financials */}
                    <div className="space-y-[14px]">
                      <div>
                        <p className="text-[12px] font-semibold text-[#222] leading-tight">Client Budget</p>
                        <p className="text-[12px] font-semibold text-[#7ca153]">{formatCurrency(item.financials.clientBudget)}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#222] leading-tight">Final Quote Amount</p>
                        <p className="text-[12px] font-semibold text-[#7ca153]">
                          {formatCurrency(item.financials.finalQuoteAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Assigned Personals */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      {item.assignedPersonals?.length > 0 ? (
                        <>
                          <div className="flex -space-x-[10px]">
                            {item.assignedPersonals.slice(0, 3).map((p, i) => (
                              <Avatar key={p.id} className="h-8 w-8 border-2 border-white bg-white">
                                <AvatarImage src={p.image || "/"} />
                                <AvatarFallback
                                  className={`text-[10px] text-white ${
                                    i === 0 ? "bg-[#a1ca75]" : i === 1 ? "bg-[#b5de8a]" : "bg-[#d0f3a8]"
                                  }`}
                                >
                                  {p.name?.charAt(0) || "P"}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <p className="text-[12px] font-medium text-[#7ca153] underline decoration-[#7ca153]">
                            {item.assignedPersonals.length <= 3
                              ? `${item.assignedPersonals.length} Assigned`
                              : `+${item.assignedPersonals.length - 3} Assigned`}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="h-8 w-8 rounded-full bg-[#a1ca75] opacity-60 border-2 border-white" />
                          <p className="text-[12px] font-medium text-[#7ca153]">None assigned</p>
                        </>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-full max-w-[110px]">
                        <div className="mb-[6px] flex items-center justify-between">
                          <p className="text-[11px] font-medium text-[#9b9b9b]">Progress</p>
                          <p className="text-[11px] font-medium text-[#9b9b9b]">
                            {Math.max(0, Math.min(100, item.statusInfo.progress ?? 0))}%
                          </p>
                        </div>
                        <div className="h-[5px] w-full overflow-hidden rounded-full bg-[#e5e5e5]">
                          <div
                            className="h-full rounded-full bg-[#7ca153]"
                            style={{ width: `${item.statusInfo.progress ?? 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex h-[32px] w-[110px] items-center justify-between rounded-full border border-[#d9d9d9] bg-white px-4 shadow-sm cursor-pointer hover:bg-[#fafafa]">
                        <span className="text-[12px] font-medium text-[#2b2b2b]">
                          {normalizeStatus(item.statusInfo.status)}
                        </span>
                        <ChevronDown size={14} className="text-[#888]" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-center gap-[10px] pr-2">
                      <Button
                        type="button"
                        variant="lightGreen"
                        onClick={() => openDialog(item)}
                        className="h-[34px] w-[95px] rounded-xl bg-[#7a9d54] text-[12px] font-medium text-white hover:bg-[#6b8e46] shadow-sm"
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openDialog(item)}
                        className="h-[34px] w-[95px] rounded-xl border-[#d1d1d1] bg-white text-[12px] font-medium text-[#555] shadow-sm hover:bg-[#f5f5f5]"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-between pt-6 px-1">
          <div className="text-[13px] text-[#8a8a8a]">
            {filtered.length === 0
              ? `Showing 0 of ${requests.meta.total} Campaigns`
              : (
                  <>
                    Showing <span className="font-semibold text-[#222]">{start} - {end}</span> of{" "}
                    <span className="font-semibold text-[#222]">{requests.meta.total}</span> Campaigns
                  </>
                )}
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="text-[13px] font-medium text-[#8a8a8a] transition-colors hover:text-[#222] disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    "flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-[13px] font-medium transition-colors",
                    p === currentPage
                      ? "bg-[#7ca153] text-white shadow-sm"
                      : "text-[#8a8a8a] hover:bg-[#f5f5f5]",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="text-[13px] font-medium text-[#8a8a8a] transition-colors hover:text-[#222] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(nextOpen) => {
          setIsDialogOpen(nextOpen);
          if (!nextOpen) {
            setSelected(null);
            setDetailsLoading(false);
            setDialogActionLoading(false);
          }
        }}
      >
        <DialogContent
          className="border-white/30 bg-[#5C7F3C] w-[420px] rounded-2xl"
          showCloseButton
        >
          <DialogHeader className="space-y-0 text-left">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-white" />
              <div>
                <DialogTitle className="text-xl font-semibold leading-tight text-white">
                  Cancellation Request
                </DialogTitle>
                <p className="mt-1 text-sm text-white/90">
                  Confirm your decision
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-xs font-semibold text-white/90">Request</p>
              <p className="mt-1 text-sm font-medium text-white">
                {selected?.requestId ?? "-"}
              </p>

              <div className="mt-3">
                <p className="text-xs font-semibold text-white/90">Reason</p>
                  {detailsLoading ? (
                    <div className="mt-1">
                      <Loader className="h-5 w-5" />
                    </div>
                  ) : (
                    <p className="mt-1 text-xs leading-5 text-white/90">
                      {selected?.cancellationReason ?? "-"}
                    </p>
                  )}
              </div>

              <p className="mt-3 text-[11px] text-white/80">
                Requested: {formatDateTime(selected?.requestedAt)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => void handleProcess("approve")}
                disabled={dialogActionLoading}
                variant="lightGreen"
                className="h-12 flex-1 rounded-lg text-base font-medium hover:bg-light-green/90"
              >
                {dialogActionLoading ? <Loader className="h-5 w-5" /> : "Approve"}
              </Button>

              <Button
                type="button"
                onClick={() => void handleProcess("decline")}
                disabled={dialogActionLoading}
                variant="outline"
                className="h-12 flex-1 rounded-lg border border-white/60 bg-transparent text-white hover:bg-white/10 text-base font-medium"
              >
                {dialogActionLoading ? "Processing..." : "Decline"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

