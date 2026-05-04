"use client";

import React from "react";
import { useClientReports } from "@/hooks/use-client-reports";
import ReportSummaryCards from "./_components/report-summary-cards";
import ReportLogCard from "./_components/report-log-card";

const ReportPage = () => {
  const {
    items,
    meta,
    counts,
    loading,
    isFetching,
    error,
    search,
    page,
    statusFilter,
    canGoPrev,
    canGoNext,
    setSearch,
    setStatusFilter,
    goPrev,
    goNext,
  } = useClientReports();

  return (
    <div className="space-y-4">
      <ReportSummaryCards
        activeStatus={statusFilter}
        pendingCount={counts.pending}
        resolvedCount={counts.resolved}
        onSelectStatus={setStatusFilter}
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <ReportLogCard
        items={items}
        totalResults={meta.total ?? 0}
        page={page}
        totalPages={meta.totalPages ?? 1}
        search={search}
        loading={loading || isFetching}
        onSearchChange={setSearch}
        onPrevPage={goPrev}
        onNextPage={goNext}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
    </div>
  );
};

export default ReportPage;