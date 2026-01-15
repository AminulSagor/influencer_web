"use client";

import { useEffect, useMemo, useState } from "react";
import CampaignSearchBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaign-search-bar";
import PageFooterPagination from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/page-footer-pagination";

import {
  STATUS_QUERY,
  TAB_TITLE,
  type CampaignTabKey,
} from "./_lib/campaign-status";

import CompletedCampaignsList from "./_components/lists/completed-campaigns-list";
import DraftCampaignsList from "./_components/lists/draft-campaigns-list";
import CancelledCampaignsList from "./_components/lists/cancelled-campaigns-list";
import ActiveCampaignsList from "./_components/lists/active-campaigns-list";
import BudgetingQuotingList from "./_components/lists/budgeting-quoting-list";

import { useMyCampaignsByStatus } from "@/app/[locale]/(brand)/brand/hooks/useMyCampaignsByStatus";
import {
  filterBySearch,
  paginate,
} from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_lib/campaign-list-utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import Link from "next/link";

const PER_PAGE = 6;

export default function CampaignsPage() {
  const [tab, setTab] = useState<CampaignTabKey>("active");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const status = STATUS_QUERY[tab];
  const { data, loading } = useMyCampaignsByStatus(status);

  const filtered = useMemo(() => filterBySearch(data, q), [data, q]);

  const paging = useMemo(
    () => paginate(filtered, page, PER_PAGE),
    [filtered, page]
  );

  useEffect(() => {
    if (paging.page !== page) setPage(paging.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paging.page]);

  const resultText =
    paging.total === 0
      ? "Showing 0 results"
      : `Showing ${paging.start}-${paging.end} of ${paging.total} results`;

  const onChangeTab = (next: CampaignTabKey) => {
    setTab(next);
    setQ("");
    setPage(1);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          {/* Left */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 justify-between">
            <div>
              <CardTitle className="truncate text-lg font-bold text-Primary">
                Campaigns
              </CardTitle>
              <CardDescription className="text-sm">
                Browse and manage your campaigns
              </CardDescription>
            </div>

            <PrimaryButton type="button" className="sm:max-w-44">
              <Link href={"/brand/create-campaign"}>+ Create Campaign</Link>
            </PrimaryButton>
          </div>

          {/* Right tabs */}
          <div className="flex flex-wrap xl:gap-3 items-start lg:justify-end">
            {(
              [
                ["active", "Active"],
                ["budgeting_quoting", "Budgeting & Quoting"],
                ["completed", "Completed"],
                ["draft", "Draft"],
                ["cancelled", "Cancelled"],
              ] as Array<[CampaignTabKey, string]>
            ).map(([key, label]) => {
              const isActive = tab === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChangeTab(key)}
                  className={[
                    "px-4 py-2 rounded-full text-sm transition cursor-pointer",
                    isActive
                      ? "bg-light-green text-white border-light-green"
                      : "bg-white text-Primary border-border hover:bg-Secondary",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <div className="border border-gray-100 w-full" />

      <CardContent>
        <CampaignSearchBar
          title={TAB_TITLE[tab]}
          resultText={resultText}
          placeholder="Search By Job name, client name"
          onSearch={(val) => {
            setQ(val);
            setPage(1);
          }}
        />

        {/* Render correct UI list */}
        {tab === "active" && (
          <ActiveCampaignsList campaigns={paging.paged} loading={loading} />
        )}

        {tab === "budgeting_quoting" && (
          <BudgetingQuotingList campaigns={paging.paged} loading={loading} />
        )}

        {tab === "completed" && (
          <CompletedCampaignsList campaigns={paging.paged} loading={loading} />
        )}

        {tab === "draft" && (
          <DraftCampaignsList campaigns={paging.paged} loading={loading} />
        )}

        {tab === "cancelled" && (
          <CancelledCampaignsList campaigns={paging.paged} loading={loading} />
        )}

        <div className="mt-10">
          <PageFooterPagination
            page={paging.page}
            totalPages={paging.totalPages}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => p - 1)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
