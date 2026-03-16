"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import NewOfferList from "./_components/new-offer-list";
import JobSearchBar from "@/app/[locale]/(influencer)/influencer/(pages)/jobs/_components/job-search-bar";

const Page = () => {
  const t = useTranslations("influencer.jobs");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"high_budget" | "low_budget">("low_budget");

  return (
    <div className="space-y-8">
      <JobSearchBar
        title={t("newOffer.title")}
        sortLabel={sort === "low_budget" ? "Low To High" : "High To Low"}
        onSearch={setSearch}
        onSort={() => setSort((s) => (s === "low_budget" ? "high_budget" : "low_budget"))}
      />
      <NewOfferList search={search} sort={sort} />
    </div>
  );
};

export default Page;
