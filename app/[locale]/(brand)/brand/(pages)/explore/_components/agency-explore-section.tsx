"use client";

import { useMemo, useState } from "react";
import ExploreSearchBar from "./explore-search-bar";
import ExplorePagination from "./explore-pagination";
import AgencyGrid from "./agency-grid";
import { Agency, ExploreType } from "@/app/[locale]/(brand)/brand/(pages)/explore/explore-query";

type Props = {
  agencies: Agency[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  activeType: ExploreType;
};

export default function AgencyExploreSection({
  agencies,
  total,
  currentPage,
  totalPages,
  limit,
  activeType,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredAgencies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return agencies;

    return agencies.filter((item) => {
      const agencyName = item.agencyName?.toLowerCase() ?? "";
      const fullName = item.fullName?.toLowerCase() ?? "";
      const email = item.user?.email?.toLowerCase() ?? "";
      const niches =
        item.niches?.map((n) => n.niche).join(" ").toLowerCase() ?? "";

      return (
        agencyName.includes(keyword) ||
        fullName.includes(keyword) ||
        email.includes(keyword) ||
        niches.includes(keyword)
      );
    });
  }, [agencies, search]);

  return (
    <>
      <ExploreSearchBar
        placeholder="Search By Brand Name"
        showingText={`Showing ${filteredAgencies.length} of ${total} Results`}
        value={search}
        onChange={setSearch}
      />

      <AgencyGrid agencies={filteredAgencies} />

      <ExplorePagination
        currentPage={currentPage}
        totalPages={totalPages}
        activeType={activeType}
        limit={limit}
      />
    </>
  );
}