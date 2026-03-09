"use client";

import { useMemo, useState } from "react";
import ExploreSearchBar from "./explore-search-bar";
import ExplorePagination from "./explore-pagination";
import InfluencerGrid from "./influencer-grid";
import { Influencer, ExploreType } from "@/app/[locale]/(brand)/brand/(pages)/explore/explore-query";

type Props = {
  influencers: Influencer[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  activeType: ExploreType;
};

export default function InfluencerExploreSection({
  influencers,
  total,
  currentPage,
  totalPages,
  limit,
  activeType,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredInfluencers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return influencers;

    return influencers.filter((item) => {
      const name = item.name?.toLowerCase() ?? "";
      const niches = item.niches?.join(" ").toLowerCase() ?? "";
      const platforms = item.platforms?.join(" ").toLowerCase() ?? "";

      return (
        name.includes(keyword) ||
        niches.includes(keyword) ||
        platforms.includes(keyword)
      );
    });
  }, [influencers, search]);

  return (
    <>
      <ExploreSearchBar
        placeholder="Search By Influencer Name"
        showingText={`Showing ${filteredInfluencers.length} of ${total} Results`}
        value={search}
        onChange={setSearch}
      />

      <InfluencerGrid influencers={filteredInfluencers} />

      <ExplorePagination
        currentPage={currentPage}
        totalPages={totalPages}
        activeType={activeType}
        limit={limit}
      />
    </>
  );
}