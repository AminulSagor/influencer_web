"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { CampaignDetails } from "@/types/client/campaigns/campaign-details";

type AgencyQuotationsSectionProps = {
  campaign: CampaignDetails;
};

const ITEMS_PER_PAGE = 12;

export default function AgencyQuotationsSection({
  campaign,
}: AgencyQuotationsSectionProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAgencies = useMemo(() => {
    const list = campaign.assignedAgencies ?? [];

    if (!search.trim()) return list;

    const keyword = search.toLowerCase();

    return list.filter((item) =>
      item.agency.agencyName.toLowerCase().includes(keyword),
    );
  }, [campaign.assignedAgencies, search]);

  const totalItems = filteredAgencies.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedAgencies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAgencies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAgencies, currentPage]);

  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  const showFooter = totalItems > 12;

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  return (
    <section className="overflow-hidden rounded-3xl border border-light-gray bg-white">
      <div className="border-b border-light-gray px-5 py-4">
        <h2 className="text-base font-semibold text-primary-color md:text-lg">
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
              className="flex h-12 w-full items-center justify-between rounded-[14px] border border-primary-color/40 bg-[#F7F8EA] px-4 text-sm font-medium text-primary-color"
            >
              <span>Agency Fee (%)</span>
              <ChevronDown className="size-4" />
            </button>
          </div>

          <div className="xl:col-span-2">
            <button
              type="button"
              className="flex h-12 w-full items-center justify-between rounded-[14px] border border-primary-color/40 bg-[#F7F8EA] px-4 text-sm font-medium text-primary-color"
            >
              <span>Nov 20 - Dec 20</span>
              <ChevronDown className="size-4" />
            </button>
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
                    <th className="px-4 py-4 text-sm">Dollar Rate(৳/$)</th>
                    <th className="px-4 py-4 text-sm">In Dollar($)</th>
                    <th className="px-6 py-4 text-right text-sm">Action</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {paginatedAgencies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-sm text-black/50"
                      >
                        No agency quotation found.
                      </td>
                    </tr>
                  ) : (
                    paginatedAgencies.map((item, index) => {
                      const budget = Number(campaign.baseBudget ?? 0);
                      const feePercent = 10;
                      const feeAmount = (budget * feePercent) / 100;
                      const budgetExcludingFee = budget;
                      const dollarRate = 122.37;
                      const inDollar =
                        budgetExcludingFee > 0
                          ? budgetExcludingFee / dollarRate
                          : 0;

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
                              <div className="size-11 rounded-full bg-[#9DC77F]" />
                              <span className="text-base font-medium text-black">
                                {item.agency.agencyName}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-5 align-middle">
                            <div className="leading-tight">
                              <p className="text-base font-medium text-black">
                                Lifestyle
                              </p>
                              <button
                                type="button"
                                className="mt-1 text-sm font-medium text-primary-color underline"
                              >
                                +5 more
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-5 text-base font-semibold text-primary-color">
                            {feePercent}%
                          </td>

                          <td className="px-4 py-5 text-base font-semibold text-primary-color">
                            ৳{feeAmount.toLocaleString()}
                          </td>

                          <td className="px-4 py-5 text-base font-semibold text-primary-color">
                            ৳{budgetExcludingFee.toLocaleString()}
                          </td>

                          <td className="px-4 py-5 text-base font-semibold text-primary-color">
                            ৳{dollarRate}
                          </td>

                          <td className="px-4 py-5 text-base font-semibold text-primary-color">
                            ${inDollar.toFixed(2)}
                          </td>

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              className="inline-flex h-10 min-w-[104px] items-center justify-center rounded-[12px] bg-[#7FA35A] px-5 text-sm text-white transition hover:opacity-90"
                            >
                              Accept
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
                  <span className="font-bold text-black/70">{startItem}</span> -{" "}
                  <span className="font-bold text-black/70">{endItem}</span> of{" "}
                  <span className="font-bold text-black/70">{totalItems}</span>{" "}
                  Quotes
                </div>

                <div className="flex items-center gap-3 text-base">
                  <button
                    type="button"
                    onClick={goToPrevious}
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
                    onClick={goToNext}
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
  );
}
