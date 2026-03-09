"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  STATUS_QUERY,
  TAB_TITLE,
  type CampaignTabKey,
} from "./_lib/campaign-status";

import { useMyCampaignsByStatus } from "@/app/[locale]/(brand)/brand/hooks/useMyCampaignsByStatus";
import {
  filterBySearch,
  paginate,
  sortCampaigns,
  type CampaignSortValue,
} from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-list-utils";

import CampaignTabs from "./_components/campaign-tabs";
import CampaignToolbar from "./_components/campaign-toolbar";
import CampaignListSection from "./_components/campaign-list-section";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import PageFooterPagination from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/page-footer-pagination";
import { CAMPAIGN_TAB_ITEMS } from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-tab-items";

const PER_PAGE = 6;

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<CampaignTabKey>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<CampaignSortValue>("budget_desc");

  const status = STATUS_QUERY[activeTab];
  const { data, loading, error } = useMyCampaignsByStatus(status);

  const filteredCampaigns = useMemo(
    () => filterBySearch(data, searchQuery),
    [data, searchQuery],
  );

  const sortedCampaigns = useMemo(
    () => sortCampaigns(filteredCampaigns, sortBy),
    [filteredCampaigns, sortBy],
  );

  const pagination = useMemo(
    () => paginate(sortedCampaigns, currentPage, PER_PAGE),
    [sortedCampaigns, currentPage],
  );

  const resultText =
    pagination.total === 0
      ? "Showing 0 Of 0 Results"
      : `Showing ${pagination.end} Of ${pagination.total} Results`;

  const sortLabel = sortBy === "budget_desc" ? "High To Low" : "Low To High";

  const handleTabChange = (nextTab: CampaignTabKey) => {
    setActiveTab(nextTab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortToggle = () => {
    setSortBy((prev) =>
      prev === "budget_desc" ? "budget_asc" : "budget_desc",
    );
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 justify-between">
            <div>
              <CardTitle className="truncate text-lg font-bold text-Primary">
                Campaigns
              </CardTitle>
              <CardDescription className="text-sm">
                Browse and manage your campaigns
              </CardDescription>
            </div>

            <PrimaryButton type="button" className="sm:max-w-54">
              <Link href="/brand/create-campaign">+ Create New Campaign</Link>
            </PrimaryButton>
          </div>

          <CampaignTabs
            items={CAMPAIGN_TAB_ITEMS}
            activeTab={activeTab}
            activeCount={data.length}
            onChange={handleTabChange}
          />
        </div>
      </CardHeader>

      <div className="border border-gray-100 w-full" />

      <CardContent>
        <CampaignToolbar
          title={TAB_TITLE[activeTab]}
          resultText={resultText}
          sortLabel={sortLabel}
          onSearch={handleSearch}
          onSort={handleSortToggle}
        />

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <CampaignListSection
          tab={activeTab}
          campaigns={pagination.paged}
          loading={loading}
        />

        <div className="mt-10">
          <PageFooterPagination
            page={currentPage}
            totalPages={pagination.totalPages}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
