"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

type NewOfferSearchProps = {
  title?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showingCount: number;
  totalCount: number;
  sortValue: "low_budget" | "high_budget";
  onSortToggle: () => void;
};

const NewOfferSearch = ({
  title = "New jobs only for you",
  searchValue,
  onSearchChange,
  showingCount,
  totalCount,
  sortValue,
  onSortToggle,
}: NewOfferSearchProps) => {
  const isLowToHigh = sortValue === "low_budget";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="whitespace-nowrap text-sm font-semibold text-Primary">
          {title}
        </h3>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Job, Name, Client Name"
              className="pl-10 focus-visible:border-Primary focus-visible:ring-2 focus-visible:ring-Primary/50"
            />
          </div>

          <p className="whitespace-nowrap text-xs text-muted-foreground">
            Showing {showingCount} of {totalCount} results
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={onSortToggle}
          className="cursor-pointer border border-light-green bg-Secondary text-xs text-Primary hover:bg-Secondary/70"
        >
          {isLowToHigh ? (
            <ArrowDown className="mr-1 h-4 w-4" />
          ) : (
            <ArrowUp className="mr-1 h-4 w-4" />
          )}
          {isLowToHigh ? "Low To High" : "High To Low"}
        </Button>
      </div>
    </div>
  );
};

export default NewOfferSearch;