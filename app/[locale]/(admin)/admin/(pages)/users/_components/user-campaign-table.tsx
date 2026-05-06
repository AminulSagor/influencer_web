"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { UserCampaign, UserCampaignStatus, UserCampaignTab } from "@/types/admin/user/user_campaign_type";

interface Props {
  initialData: UserCampaign[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const TABS: { label: string; value: UserCampaignTab }[] = [
  { label: "All", value: "all" },
  { label: "Needs Quote", value: "need_quote" },
  { label: "Active", value: "active" },
  { label: "Pending Invitation", value: "pending_invitation" },
  { label: "Completed", value: "completed" },
  { label: "Paid", value: "paid" },
  { label: "Canceled", value: "cancelled" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  needs_quote: { label: "Needs Quote", color: "text-gray-700", bgColor: "bg-gray-100" },
  negotiating: { label: "Needs Quote", color: "text-gray-700", bgColor: "bg-gray-100" },
  active: { label: "Active", color: "text-blue-700", bgColor: "bg-blue-50" },
  pending_invitation: { label: "Pending Invitation", color: "text-orange-700", bgColor: "bg-orange-50" },
  pending_influencer: { label: "Pending Invitation", color: "text-orange-700", bgColor: "bg-orange-50" },
  completed: { label: "Completed", color: "text-green-700", bgColor: "bg-green-50" },
  paid: { label: "Paid", color: "text-green-700", bgColor: "bg-green-50" },
  canceled: { label: "Canceled", color: "text-red-700", bgColor: "bg-red-50" },
  cancelled: { label: "Canceled", color: "text-red-700", bgColor: "bg-red-50" },
};

const UserCampaignTable = ({ initialData, meta }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentTab = (searchParams.get("tab") as UserCampaignTab) || "all";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const updateFilters = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    // Reset to page 1 if tab or search changes
    if (updates.tab !== undefined || updates.search !== undefined) {
      params.set("page", "1");
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      updateFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const toggleSelectAll = () => {
    if (selectedIds.length === initialData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialData.map((item) => item.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatCurrency = (amount: number) => {
    return `৳ ${new Intl.NumberFormat("en-BD").format(amount)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="border-none shadow-none p-4">
      <CardHeader className="px-0 pt-0 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-Primary">Campaigns</CardTitle>
          <CardDescription>Browse and manage the campaigns</CardDescription>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1 overflow-x-auto max-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateFilters({ tab: tab.value })}
              className={cn(
                "px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap",
                currentTab === tab.value
                  ? "bg-light-green text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        {/* Toolbar */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by campaign name"
              className="pl-10 h-10 border-gray-200 rounded-lg"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-Secondary/30 p-2 rounded-xl border border-light-green/20 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="bg-light-green text-white px-4 py-1.5 rounded-lg text-sm font-medium">
                {selectedIds.length} Selected
              </div>
              
              <Select>
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-light-green/30 h-9 text-sm">
                  <SelectValue placeholder="Bulk Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-light-green hover:bg-light-green/90 h-9 px-6 rounded-lg">
                Go
              </Button>
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-100 overflow-hidden bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-light-green hover:bg-light-green border-none">
                <TableHead className="w-12 text-white pl-4">
                  <Checkbox
                    checked={selectedIds.length === initialData.length && initialData.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-light-green"
                  />
                </TableHead>
                <TableHead className="text-white font-medium">Campaign Info</TableHead>
                <TableHead className="text-white font-medium text-center">Client</TableHead>
                <TableHead className="text-white font-medium">Timeline</TableHead>
                <TableHead className="text-white font-medium">Financials</TableHead>
                <TableHead className="text-white font-medium text-center">Status</TableHead>
                <TableHead className="text-white font-medium text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={cn(isPending && "opacity-50 pointer-events-none transition-opacity")}>
              {initialData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Search className="w-8 h-8 opacity-20" />
                       <p className="text-sm font-medium">No campaigns found matching the criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                initialData.map((campaign) => {
                  const config = STATUS_CONFIG[campaign.status] || {
                    label: campaign.status,
                    color: "text-gray-500",
                    bgColor: "bg-gray-50",
                  };
                  const showProgress = ["active", "completed", "paid"].includes(campaign.status);

                  return (
                    <TableRow key={campaign.id} className="hover:bg-gray-50/50 border-gray-100">
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={selectedIds.includes(campaign.id)}
                          onCheckedChange={() => toggleSelect(campaign.id)}
                          className="border-gray-300 data-[state=checked]:bg-light-green data-[state=checked]:border-light-green"
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-Primary text-base">
                            {campaign.campaignInfo.name}
                          </div>
                          <div className="text-gray-500 text-xs font-medium">
                            {campaign.campaignInfo.type} Promotion
                          </div>
                          <div className="text-gray-400 text-[10px]">
                            Niche: {campaign.campaignInfo.niche}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Avatar className="w-10 h-10 border border-gray-100">
                            <AvatarImage
                              src={campaign.client?.image || campaign.promotedBy?.image || ""}
                            />
                            <AvatarFallback className="bg-gray-100 text-xs">
                              {(campaign.client?.name || campaign.promotedBy?.name || "??")
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold text-gray-700">
                            {campaign.client?.name || campaign.promotedBy?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-3">
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              Start Date
                            </div>
                            <div className="text-xs font-semibold text-gray-600">
                              {formatDate(campaign.timeline.start)}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              End Date
                            </div>
                            <div className="text-xs font-semibold text-gray-600">
                              {formatDate(campaign.timeline.end)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-3">
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              Client Budget
                            </div>
                            <div className="text-xs font-semibold text-light-green">
                              {formatCurrency(campaign.financials.clientBudget)}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                              Final Quote Amount
                            </div>
                            <div className="text-xs font-semibold text-light-green">
                              {formatCurrency(campaign.financials.finalQuoteAmount)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center gap-3">
                          {showProgress && (
                            <div className="w-full max-w-[120px] space-y-1">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-gray-400">Progress</span>
                                <span className="font-semibold text-gray-600">
                                  {campaign.progress}%
                                </span>
                              </div>
                              <Progress
                                value={campaign.progress}
                                className="h-1.5 bg-gray-100"
                                indicatorClassName="bg-light-green"
                              />
                            </div>
                          )}
                          <Select defaultValue={campaign.status}>
                            <SelectTrigger
                              className={cn(
                                "w-[140px] h-8 text-[11px] font-semibold rounded-lg border-none shadow-sm",
                                config.bgColor,
                                config.color
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={campaign.status}>{config.label}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-Primary">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */ meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">
                {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, meta.total)}
            </span> of <span className="font-semibold text-gray-700">{meta.total}</span> Campaigns
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              className="text-gray-400" 
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateFilters({ page: currentPage - 1 })}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                    <Button 
                        key={pageNum}
                        onClick={() => updateFilters({ page: pageNum })}
                        className={cn(
                            "w-8 h-8 p-0 rounded-lg text-sm",
                            currentPage === pageNum ? "bg-light-green hover:bg-light-green/90" : "bg-transparent text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        {pageNum}
                    </Button>
                )
            })}

            <Button 
              variant="ghost" 
              className="text-Primary font-semibold"
              disabled={currentPage >= meta.totalPages || isPending}
              onClick={() => updateFilters({ page: currentPage + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCampaignTable;
