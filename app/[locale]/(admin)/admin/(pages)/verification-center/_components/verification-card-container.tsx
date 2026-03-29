"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

import VerificationCardGrid from "./verification-card-grid";
import TablePagination from "./table-pagination";
import NicheCell from "./niche-cell";

import type {
  VerificationCardDataType,
  VerificationTableData,
  VerificationTableMeta,
  VerificationTableRow,
  VerificationTabKey,
} from "@/service/admin/verification-center/get-pending-profiles";

import { bulkVerifyUsers } from "@/service/admin/verification-center/bulk-verify-users";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  verificationData: VerificationCardDataType[];
  verificationTableData: VerificationTableData;
  verificationTableMeta: VerificationTableMeta;
  currentTab: VerificationTabKey;
  currentSearch?: string;
  currentStartDate?: string;
  currentEndDate?: string;
}

const labelByTab: Record<VerificationTabKey, "Influencer" | "Brand" | "Agency"> =
  {
    influencer: "Influencer",
    brand: "Brand",
    agency: "Agency",
  };

const titleByTab: Record<VerificationTabKey, string> = {
  influencer: "Influencer List",
  agency: "Agency",
  brand: "Brand",
};

const subtitleByTab: Record<VerificationTabKey, string> = {
  influencer: "Verify Influencer Profiles",
  agency: "Verify Agency Profiles",
  brand: "Verify Brand Profiles",
};

const searchPlaceholderByTab: Record<VerificationTabKey, string> = {
  influencer: "Search by influencer name, phone number...",
  agency: "Search by agency name, phone number...",
  brand: "Search by brand name, phone number...",
};

const bulkActionOptions = [
  { label: "Bulk Action", value: "placeholder" },
  { label: "Approve", value: "approve" },
  { label: "Reject", value: "reject" },
];

const VerificationCardsContainer = ({
  verificationData,
  verificationTableData,
  verificationTableMeta,
  currentTab,
  currentSearch = "",
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("placeholder");
  const [bulkRejectReason, setBulkRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isSubmittingBulkAction, setIsSubmittingBulkAction] = useState(false);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const selectedCard = useMemo(
    () => verificationData.find((item) => item.key === currentTab) ?? null,
    [verificationData, currentTab]
  );

  const selectedLabel = labelByTab[currentTab];
  const rows: VerificationTableRow[] = verificationTableData[selectedLabel] ?? [];
  const meta = verificationTableMeta[selectedLabel];

  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const selectedCount = selectedIds.length;

  const buildQueryString = (
    updates: Record<string, string | null | undefined>
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    return params.toString();
  };

  const handleSelectTab = (tab: VerificationTabKey) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("tab", tab);
    query.set("page", "1");
    query.delete("search");
    query.delete("startDate");
    query.delete("endDate");

    router.push(`${pathname}?${query.toString()}`);
    setSelectedIds([]);
    setBulkAction("placeholder");
    setBulkRejectReason("");
    setShowRejectInput(false);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const queryString = buildQueryString({
      tab: currentTab,
      page: "1",
      search: search.trim() || null,
    });

    router.push(`${pathname}?${queryString}`);
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(rows.map((row) => row.id));
      return;
    }

    setSelectedIds([]);
  };

  const handleToggleRow = (rowId: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)
    );
  };

  const handleBulkActionChange = (value: string) => {
    setBulkAction(value);
    setShowRejectInput(value === "reject");

    if (value !== "reject") {
      setBulkRejectReason("");
    }
  };

  const handleGo = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    if (bulkAction === "placeholder") {
      alert("Please select a bulk action.");
      return;
    }

    if (bulkAction === "reject" && !bulkRejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    try {
      setIsSubmittingBulkAction(true);

      await bulkVerifyUsers({
        userIds: selectedIds,
        isVerified: bulkAction === "approve",
        ...(bulkAction === "reject"
          ? { reason: bulkRejectReason.trim() }
          : {}),
      });

      setSelectedIds([]);
      setBulkAction("placeholder");
      setBulkRejectReason("");
      setShowRejectInput(false);
      router.refresh();
    } catch (error) {
      console.error("bulk verify failed", error);
      alert("Bulk action failed. Please try again.");
    } finally {
      setIsSubmittingBulkAction(false);
    }
  };

  return (
    <>
      <VerificationCardGrid
        data={verificationData}
        selectedKey={currentTab}
        onSelect={handleSelectTab}
      />

      {selectedCard && (
        <div className="overflow-hidden rounded-[24px] border border-[#d7d7d7] bg-white">
          <div className="border-b border-[#e6e6e6] px-6 py-5">
            <h2 className="text-[20px] font-semibold text-Primary">
              {titleByTab[currentTab]}
            </h2>
            <p className="text-[14px] text-[#9b9b9b]">
              {subtitleByTab[currentTab]}
            </p>
          </div>

          <div className="space-y-4 px-6 py-6">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b0b0b0]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholderByTab[currentTab]}
                  className="h-[44px] rounded-[12px] border border-[#cfcfcf] bg-white pl-12 pr-4 text-sm shadow-none focus-visible:ring-0"
                />
              </div>
            </form>

            <div className="rounded-[12px] border border-light-green bg-Secondary p-2">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-[10px] border border-[#577d34] bg-[#7f9f4b] px-5 py-2 text-sm font-medium text-white min-w-[124px] text-center">
                      {selectedCount} Selected
                    </div>

                    <Select
                      value={bulkAction}
                      onValueChange={handleBulkActionChange}
                    >
                      <SelectTrigger className="h-[40px] w-[132px] rounded-[12px] border border-[#cfcfcf] bg-white text-sm shadow-none focus:ring-0">
                        <SelectValue placeholder="Bulk Action" />
                      </SelectTrigger>
                      <SelectContent>
                        {bulkActionOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      onClick={handleGo}
                      disabled={isSubmittingBulkAction}
                      className="h-[40px] rounded-[10px] bg-light-green px-5 text-white hover:bg-light-green/90"
                    >
                      {isSubmittingBulkAction ? "Please wait..." : "Go"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-end">
                    <div className="flex h-[40px] min-w-[170px] items-center justify-between rounded-[12px] border border-[#cfcfcf] bg-white px-4 text-sm text-[#2d2d2d]">
                      <span>Nov 20 - Dec 20</span>
                      <span className="text-base">⌄</span>
                    </div>
                  </div>
                </div>

                {showRejectInput && (
                  <div className="w-full">
                    <Input
                      value={bulkRejectReason}
                      onChange={(e) => setBulkRejectReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="h-[42px] rounded-[10px] border border-[#cfcfcf] bg-white text-sm shadow-none focus-visible:ring-0"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-[#e8e8e8] bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="h-[42px] border-0 bg-[#7f9f4b] hover:bg-[#7f9f4b]">
                    <TableHead className="w-[52px] pl-4">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          handleToggleAll(Boolean(checked))
                        }
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#7f9f4b]"
                      />
                    </TableHead>
                    <TableHead className="text-center text-[14px] font-semibold text-white">
                      Name
                    </TableHead>
                    <TableHead className="text-center text-[14px] font-semibold text-white">
                      Niche
                    </TableHead>
                    <TableHead className="text-center text-[14px] font-semibold text-white">
                      Pending Items
                    </TableHead>
                    <TableHead className="text-center text-[14px] font-semibold text-white">
                      Approval Progress
                    </TableHead>
                    <TableHead className="text-center text-[14px] font-semibold text-white">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.length > 0 ? (
                    rows.map((row, index) => {
                      const checked = selectedIds.includes(row.id);

                      return (
                        <TableRow
                          key={row.id}
                          className={`h-[74px] border-b border-[#efefef] ${
                            index === 0 ? "bg-[#f7f7ea]" : "bg-white"
                          } hover:bg-[#f7f7ea]`}
                        >
                          <TableCell className="pl-4">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                handleToggleRow(row.id, Boolean(value))
                              }
                              className="border-[#7f9f4b] data-[state=checked]:bg-[#7f9f4b] data-[state=checked]:text-white"
                            />
                          </TableCell>

                          <TableCell className="text-center">
                            <p className="text-[16px] font-medium text-[#1f1f1f]">
                              {row.name}
                            </p>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              {selectedLabel === "Brand" ? (
                                <p className="text-sm text-muted-foreground">—</p>
                              ) : (
                                <NicheCell niches={row.niche} />
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <p className="text-[16px] font-medium text-[#1f1f1f]">
                              {row.pendingItems}
                            </p>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="mx-auto w-[124px] space-y-1 text-left">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-[#a0a0a0]">Progress</span>
                                <span className="text-[#9c9c9c]">
                                  {row.approvalProgress}%
                                </span>
                              </div>
                              <div className="h-[8px] rounded-full bg-[#c9e3b6]">
                                <div
                                  className="h-full rounded-full bg-[#7f9f4b] transition-all"
                                  style={{ width: `${row.approvalProgress}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <Link
                              href={`/admin/verification-center/${selectedLabel.toLowerCase()}/${row.id}`}
                              className="inline-flex items-center justify-center"
                            >
                              <button
                                type="button"
                                className="text-[#9d9d9d] transition hover:text-Primary"
                              >
                                <FaEye size={20} />
                              </button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <TablePagination meta={meta} currentTab={currentTab} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationCardsContainer;