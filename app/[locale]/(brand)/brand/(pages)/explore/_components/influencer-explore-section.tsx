"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExploreSearchBar from "./explore-search-bar";
import ExplorePagination from "./explore-pagination";
import InfluencerGrid from "./influencer-grid";
import { Influencer, ExploreType } from "@/app/[locale]/(brand)/brand/(pages)/explore/explore-query";

const SEARCH_DEBOUNCE_MS = 500;

type Props = {
  influencers: Influencer[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  activeType: ExploreType;
  searchValue?: string;
};

export default function InfluencerExploreSection({
  influencers,
  total,
  currentPage,
  totalPages,
  limit,
  activeType,
  searchValue,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchValue ?? "");

  useEffect(() => {
    setSearch(searchValue ?? "");
  }, [searchValue]);

  useEffect(() => {
    if (search === (searchValue ?? "")) return;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const nextSearch = search.trim();

      params.set("type", activeType);
      params.set("page", "1");
      params.set("limit", String(limit));

      if (nextSearch) {
        params.set("search", nextSearch);
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeType, limit, pathname, router, search, searchParams, searchValue]);

  return (
    <>
      <ExploreSearchBar
        placeholder="Search By Influencer Name"
        showingText={`Showing ${influencers.length} of ${total} Results`}
        value={search}
        onChange={setSearch}
      />

      <InfluencerGrid influencers={influencers} />

      <ExplorePagination
        currentPage={currentPage}
        totalPages={totalPages}
        activeType={activeType}
        limit={limit}
      />
    </>
  );
}
