"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
import { useCampaignBids } from "@/hooks/use-campaign-bids";
import { CampaignBid } from "@/types/client/campaigns/campaign-bids.types";
import { campaignBidsService } from "@/service/client/campaigns/campaign-bids.service";
import { notifySuccess, notifyError } from "@/utils/toast_util";
import PaymentDialog from "@/app/[locale]/(brand)/brand/(pages)/payment/_components/payment-dialog";

type AgencyQuotationsSectionProps = {
  campaign: ClientCampaignDetails;
};

const ITEMS_PER_PAGE = 12;

type SortKey =
  | "agencyName"
  | "agencyFeePercent"
  | "agencyFeeAmount"
  | "budgetExcludingAgencyFee"
  | "inDollar";

type DateFilterKey = "all" | "last7Days" | "last30Days" | "thisMonth";

const DATE_FILTER_OPTIONS: Array<{ key: DateFilterKey; label: string }> = [
  { key: "all", label: "All Time" },
  { key: "last7Days", label: "Last 7 Days" },
  { key: "last30Days", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
];

const isWithinDateFilter = (
  createdAt: string | undefined,
  filter: DateFilterKey,
) => {
  if (filter === "all") return true;
  if (!createdAt) return false;

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const now = new Date();

  if (filter === "last7Days") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return createdDate >= start && createdDate <= now;
  }

  if (filter === "last30Days") {
    const start = new Date();
    start.setDate(now.getDate() - 30);
    start.setHours(0, 0, 0, 0);
    return createdDate >= start && createdDate <= now;
  }

  if (filter === "thisMonth") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return createdDate >= start && createdDate <= end;
  }

  return true;
};

export default function AgencyQuotationsSection({
  campaign,
}: AgencyQuotationsSectionProps) {
  const t = useTranslations("brand.payment");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBid, setSelectedBid] = useState<CampaignBid | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("agencyName");
  const [sortAsc, setSortAsc] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilterKey>("last30Days");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const dateDropdownRef = useRef<HTMLDivElement | null>(null);

  const { items, isLoading, error, refetch } = useCampaignBids({
    campaignId: campaign.id,
    baseBudget: campaign.baseBudget,
    enabled: Boolean(campaign.id),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setDateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let list = [...items];

    list = list.filter((item) =>
      isWithinDateFilter(item.createdAt, dateFilter),
    );

    if (keyword) {
      list = list.filter((item) => {
        const nicheText = item.nicheLabels.join(" ").toLowerCase();

        return (
          item.agency.agencyName.toLowerCase().includes(keyword) ||
          item.agencyId.toLowerCase().includes(keyword) ||
          nicheText.includes(keyword) ||
          (item.email ?? "").toLowerCase().includes(keyword) ||
          (item.phone ?? "").toLowerCase().includes(keyword)
        );
      });
    }

    list.sort((a, b) => {
      const aValue =
        sortKey === "agencyName"
          ? a.agency.agencyName.toLowerCase()
          : a[sortKey];
      const bValue =
        sortKey === "agencyName"
          ? b.agency.agencyName.toLowerCase()
          : b[sortKey];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortAsc
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortAsc
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

    return list;
  }, [items, search, sortKey, sortAsc, dateFilter]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const showFooter = totalItems > ITEMS_PER_PAGE;

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  const handleAccept = async (bid: CampaignBid) => {
    setSelectedBid(bid);
    setPaymentDialogOpen(true);
  };

  const handleBeforePayment = async (amount: number) => {
    if (!selectedBid) return;

    // First, select the agency
    try {
      await campaignBidsService.selectAgency({
        campaignId: campaign.id,
        agencyId: selectedBid.agencyId,
      });

      // Store the selected agency ID
      setSelectedAgencyId(selectedBid.agencyId);

      notifySuccess("Agency selected successfully!");
    } catch (error) {
      console.error("Failed to select agency:", error);
      notifyError("Failed to select agency. Please try again.");
      throw error; // Prevent payment from proceeding
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
    setSelectedBid(null);
    refetch(); // Refresh to update the selected status
  };

  const handleSortToggle = (key: SortKey) => {
    setCurrentPage(1);

    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }

    setSortKey(key);
    setSortAsc(true);
  };

  const selectedDateFilterLabel =
    DATE_FILTER_OPTIONS.find((option) => option.key === dateFilter)?.label ??
    "Last 30 Days";

  // Get the total due amount from campaign
  const totalDue = Number(
    campaign.paymentInfo?.dueAmount ?? campaign.dueAmount ?? 0,
  );
  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-light-gray bg-white">
        <div className="border-b border-light-gray px-5 py-4">
          <h2 className="text-base font-semibold text-primary-color">
            Agency Quotations
          </h2>
          <p className="mt-1 text-sm text-black/40">
            Select and accept your desired deal
          </p>
        </div>

        <div className="space-y-5 p-4 md:p-5">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
            <div className="relative xl:col-span-8">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-black/25" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by agency name, phone or email..."
                className="h-12 w-full rounded-[14px] border border-light-gray bg-white pl-12 pr-4 text-sm text-black outline-none placeholder:text-black/25"
              />
            </div>

            <div className="xl:col-span-2">
              <button
                type="button"
                onClick={() => handleSortToggle("agencyFeePercent")}
                className="flex h-12 w-full items-center justify-between rounded-[14px] border border-primary-color/40 bg-[#F7F8EA] px-4 text-sm font-medium text-primary-color"
              >
                <span>Agency Fee (%)</span>
                <ChevronDown className="size-4" />
              </button>
            </div>

            <div className="relative xl:col-span-2" ref={dateDropdownRef}>
              <button
                type="button"
                onClick={() => setDateDropdownOpen((prev) => !prev)}
                className="flex h-12 w-full items-center justify-between rounded-[14px] border border-primary-color/40 bg-[#F7F8EA] px-4 text-sm font-medium text-primary-color"
              >
                <span>{selectedDateFilterLabel}</span>
                <ChevronDown className="size-4" />
              </button>

              {dateDropdownOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[180px] overflow-hidden rounded-[14px] border border-light-gray bg-white shadow-lg">
                  {DATE_FILTER_OPTIONS.map((option) => {
                    const isActive = option.key === dateFilter;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setDateFilter(option.key);
                          setCurrentPage(1);
                          setDateDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-start px-4 py-3 text-left text-sm transition ${
                          isActive
                            ? "bg-[#F7F8EA] font-medium text-primary-color"
                            : "text-black hover:bg-[#F8F9ED]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1180px]">
              <div className="overflow-hidden rounded-[18px] border border-[#D8DEC8]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#7FA35A] text-left text-white">
                      <th className="px-6 py-4 text-sm">Name</th>
                      <th className="px-4 py-4 text-sm">Niche</th>
                      <th
                        className="cursor-pointer px-4 py-4 text-sm"
                        onClick={() => handleSortToggle("agencyFeePercent")}
                      >
                        Agency Fee(%)
                      </th>
                      <th
                        className="cursor-pointer px-4 py-4 text-sm"
                        onClick={() => handleSortToggle("agencyFeeAmount")}
                      >
                        Agency Fee(৳)
                      </th>
                      <th
                        className="cursor-pointer px-4 py-4 text-sm leading-tight"
                        onClick={() =>
                          handleSortToggle("budgetExcludingAgencyFee")
                        }
                      >
                        Budget Exc.
                        <br />
                        Agency Fee
                      </th>
                      <th className="px-4 py-4 text-sm">Date</th>
                      <th
                        className="cursor-pointer px-4 py-4 text-sm"
                        onClick={() => handleSortToggle("inDollar")}
                      >
                        In Dollar($)
                      </th>
                      <th className="px-6 py-4 text-right text-sm">Action</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-sm text-black/50"
                        >
                          Loading agency quotations...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-sm text-red-500"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : paginatedItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-sm text-black/50"
                        >
                          No agency quotation found.
                        </td>
                      </tr>
                    ) : (
                      paginatedItems.map((item, index) => {
                        const firstNiche = item.nicheLabels[0] ?? "N/A";
                        const extraNicheCount =
                          item.nicheLabels.length > 1
                            ? item.nicheLabels.length - 1
                            : 0;

                        const formattedDate = item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A";

                        // Check if this agency is selected
                        const isSelected = selectedAgencyId === item.agencyId;

                        return (
                          <tr
                            key={item.id}
                            className={
                              index === 0
                                ? "bg-[#F8F9ED]"
                                : "border-t border-light-gray"
                            }
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                {item.agency.logo ? (
                                  <div className="relative size-11 overflow-hidden rounded-full">
                                    <Image
                                      src={item.agency.logo}
                                      alt={item.agency.agencyName}
                                      fill
                                      className="object-cover"
                                      sizes="44px"
                                    />
                                  </div>
                                ) : (
                                  <div className="size-11 rounded-full bg-[#9DC77F]" />
                                )}

                                <span className="text-base font-medium text-black">
                                  {item.agency.agencyName}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-5 align-middle">
                              <div className="leading-tight">
                                <p className="text-base font-medium text-black">
                                  {firstNiche}
                                </p>
                                {extraNicheCount > 0 ? (
                                  <button
                                    type="button"
                                    className="mt-1 text-sm font-medium text-primary-color underline"
                                  >
                                    +{extraNicheCount} more
                                  </button>
                                ) : null}
                              </div>
                            </td>

                            <td className="px-4 py-5 text-base font-semibold text-primary-color">
                              {item.agencyFeePercent}%
                            </td>

                            <td className="px-4 py-5 text-base font-semibold text-primary-color">
                              ৳{item.agencyFeeAmount.toLocaleString()}
                            </td>

                            <td className="px-4 py-5 text-base font-semibold text-primary-color">
                              ৳{item.budgetExcludingAgencyFee.toLocaleString()}
                            </td>

                            <td className="px-4 py-5 text-base font-semibold text-primary-color">
                              {formattedDate}
                            </td>

                            <td className="px-4 py-5 text-base font-semibold text-primary-color">
                              ${item.inDollar.toFixed(2)}
                            </td>

                            <td className="px-6 py-5 text-right">
                              <button
                                type="button"
                                onClick={() => handleAccept(item)}
                                disabled={isSelected}
                                className={`inline-flex h-10 min-w-[104px] items-center justify-center rounded-[12px] px-5 text-sm text-white transition ${
                                  isSelected
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#7FA35A] hover:opacity-90"
                                }`}
                              >
                                {isSelected ? "Selected" : "Accept"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {showFooter ? (
                <div className="flex items-center justify-between px-4 py-6 md:px-6">
                  <div className="text-base text-black/60">
                    Showing{" "}
                    <span className="font-bold text-black/70">{startItem}</span>{" "}
                    - <span className="font-bold text-black/70">{endItem}</span>{" "}
                    of{" "}
                    <span className="font-bold text-black/70">
                      {totalItems}
                    </span>{" "}
                    Quotes
                  </div>

                  <div className="flex items-center gap-3 text-base">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                      className="font-medium text-black/50 disabled:cursor-not-allowed disabled:text-black/25"
                    >
                      Previous
                    </button>

                    {visiblePages.map((page) => {
                      const isActive = currentPage === page;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={
                            isActive
                              ? "flex size-10 items-center justify-center rounded-[10px] bg-primary-color text-base font-bold text-white"
                              : "flex size-10 items-center justify-center rounded-[10px] text-base font-medium text-black/80"
                          }
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="font-medium text-black/50 disabled:cursor-not-allowed disabled:text-black/25"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Generic Payment Dialog */}
      <PaymentDialog
        campaignId={campaign.id}
        campaignName={campaign.campaignName}
        config={{
          amount: totalDue,
          minPaymentPercent: 50,
          dialogTitle: t("fundYourCampaign"),
          buttonText: t("payNow"),
          successMessage: "Payment initiated successfully!",
          errorMessage: "Failed to initiate payment. Please try again.",
          showPaymentMethod: true,
        }}
        onBeforePayment={handleBeforePayment}
        onSuccess={handlePaymentSuccess}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        hideTrigger={true}
      />
    </>
  );
}
