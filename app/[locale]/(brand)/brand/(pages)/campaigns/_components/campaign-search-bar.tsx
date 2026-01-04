"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, Search } from "lucide-react";

type CampaignSearchBarProps = {
  title: string;
  placeholder?: string;
  resultText?: string;
  sortLabel?: string;

  onSearch?: (value: string) => void;
  onSort?: () => void;
};

const CampaignSearchBar = ({
  title,
  placeholder = "Search Campaign, Name, Client Name",
  resultText,
  sortLabel = "Low To High",
  onSearch,
  onSort,
}: CampaignSearchBarProps) => {
  return (
    <div className="flex justify-between">
      {/* Left */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <h3 className="text-sm font-semibold text-Primary whitespace-nowrap">
          {title}
        </h3>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center">
          <div className="relative w-full sm:max-w-sm lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={placeholder}
              className="pl-10 w-full lg:w-94 focus-visible:border-Primary focus-visible:ring-Primary/50 focus-visible:ring-2"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>

          {resultText && (
            <p className="text-muted-foreground text-xs whitespace-nowrap">
              {resultText}
            </p>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex justify-end">
        <Button
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
};

export default CampaignSearchBar;
