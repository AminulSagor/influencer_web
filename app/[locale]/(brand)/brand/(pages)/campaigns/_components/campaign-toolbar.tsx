"use client";

import { ArrowDown } from "lucide-react";

import CampaignSearchBar from "@/app/[locale]/(brand)/brand/(pages)/campaigns/_components/campaign-search-bar";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  resultText: string;
  sortLabel: string;
  onSearch: (value: string) => void;
  onSort: () => void;
};

export default function CampaignToolbar({
  title,
  resultText,
  sortLabel,
  onSearch,
  onSort,
}: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <CampaignSearchBar
        title={title}
        resultText={resultText}
        placeholder="Search By Job Name, Client Name"
        onSearch={onSearch}
      />

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={onSort}
          className="bg-Secondary border-light-green border text-Primary text-xs hover:bg-Secondary/70"
        >
          <ArrowDown className="mr-1 h-4 w-4" />
          {sortLabel}
        </Button>
      </div>
    </div>
  );
}