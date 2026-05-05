"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ClientCampaignDetails } from "@/types/client/campaigns/campaign-details";
import { useCampaignBids } from "@/hooks/use-campaign-bids";
import {
  CampaignBid,
  CampaignBidsSortBy,
} from "@/types/client/campaigns/campaign-bids.types";
import { campaignBidsService } from "@/service/client/campaigns/campaign-bids.service";
import { notifySuccess, notifyError } from "@/utils/toast_util";
import PaymentDialog from "@/app/[locale]/(brand)/brand/(pages)/payment/_components/payment-dialog";
import PageFooterPagination from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/page-footer-pagination";

type AgencyQuotationsSectionProps = {
  campaign: ClientCampaignDetails;
};

const ITEMS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 500;

type DateFilterKey = "all" | "last7Days" | "last30Days" | "thisMonth";

const DATE_FILTER_OPTIONS: Array<{ key: DateFilterKey; label: string }> = [
  { key: "all", label: "All Time" },
  { key: "last7Days", label: "Last 7 Days" },
  { key: "last30Days", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
];

const SORT_OPTIONS: Array<{ key: CampaignBidsSortBy; label: string }> = [
  { key: "date", label: "Newest" },
  { key: "fee", label: "Agency Fee(%)" },
  { key: "dollarRate", label: "Dollar Rate" },
];

const toIsoDate = (date: Date) => date.toISOString();

const getDateRange = (filter: DateFilterKey) => {
  if (filter === "all") {
    return {};
  }

  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (filter === "last7Days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);

    return {
      startDate: toIsoDate(start),
      endDate: toIsoDate(end),
    };
  }

  if (filter === "last30Days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 30);
    start.setHours(0, 0, 0, 0);

    return {
      startDate: toIsoDate(start),
      endDate: toIsoDate(end),
    };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);

  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  };
};

export default function AgencyQuotationsSection({
  campaign,
}: AgencyQuotationsSectionProps) {
  const t = useTranslations("brand.payment");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBid, setSelectedBid] = useState<CampaignBid | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(
    campaign.selectedAgencyId,
  );
  const [sortBy, setSortBy] = useState<CampaignBidsSortBy>("date");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterKey>("all");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const dateDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  const dateRange = useMemo(() => getDateRange(dateFilter), [dateFilter]);

  const { items, pagination, isLoading, error, refetch } = useCampaignBids({
    campaignId: campaign.id,
    baseBudget: campaign.baseBudget,
    enabled: Boolean(campaign.id),
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder: "DESC",
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(target)
      ) {
        setDateDropdownOpen(false);
      }

      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(target)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalItems = pagination.total;
  const totalPages = Math.max(1, pagination.totalPages);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const handleAccept = async (bid: CampaignBid) => {
    setSelectedBid(bid);
    setPaymentDialogOpen(true);
  };

  const handleBeforePayment = async () => {
    if (!selectedBid) return;

    try {
      await campaignBidsService.selectAgency({
        campaignId: campaign.id,
        agencyId: selectedBid.agencyId,
      });

      setSelectedAgencyId(selectedBid.agencyId);
      notifySuccess("Agency selected successfully!");
    } catch (error) {
      console.error("Failed to select agency:", error);
      notifyError("Failed to select agency. Please try again.");
      throw error;
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentDialogOpen(false);
    setSelectedBid(null);
    refetch();
  };

  const handleSortChange = (nextSortBy: CampaignBidsSortBy) => {
    setSortBy(nextSortBy);
    setCurrentPage(1);
    setSortDropdownOpen(false);
  };

  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.key === sortBy)?.label ?? "Newest";

  const selectedDateFilterLabel =
    DATE_FILTER_OPTIONS.find((option) => option.key === dateFilter)?.label ??
    "All Time";

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by agency name, phone or email..."
                className="h-12 w-full rounded-[14px] border border-light-gray bg-white pl-12 pr-4 text-sm text-black outline-none placeholder:text-black/25"
              />
            </div>

            <div className="relative xl:col-span-2" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setSortDropdownOpen((prev) => !prev)}
                className="flex h-12 w-full items-center justify-between rounded-[14px] border border-primary-color/40 bg-[#F7F8EA] px-4 text-sm font-medium text-primary-color"
              >
                <span>{selectedSortLabel}</span>
                <ChevronDown className="size-4" />
              </button>

              {sortDropdownOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[180px] overflow-hidden rounded-[14px] border border-light-gray bg-white shadow-lg">
                  {SORT_OPTIONS.map((option) => {
                    const isActive = option.key === sortBy;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handleSortChange(option.key)}
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
                      <th className="px-4 py-4 text-sm">Agency Fee(%)</th>
                      <th className="px-4 py-4 text-sm">Agency Fee(৳)</th>
                      <th className="px-4 py-4 text-sm leading-tight">
                        Budget Exc.
                        <br />
                        Agency Fee
                      </th>
                      <th className="px-4 py-4 text-sm">Date</th>
                      <th className="px-4 py-4 text-sm">In Dollar($)</th>
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
                    ) : items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-10 text-center text-sm text-black/50"
                        >
                          No agency quotation found.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, index) => {
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
                                    ? "cursor-not-allowed bg-gray-400"
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

              {totalItems > 0 ? (
                <div className="flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
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

                  <PageFooterPagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPrev={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    onNext={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

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
