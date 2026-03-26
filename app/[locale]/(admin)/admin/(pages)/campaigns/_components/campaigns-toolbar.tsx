"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CampaignView } from "@/types/admin/campaign/campaign_ui_type";
import {
  activeBtn,
  baseBtn,
} from "@/utils/admin/campaign/campaign_constrants_type_util";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CampaignTypeFilter = "all" | "influencer_promotion" | "paid_ad";

export default function CampaignsToolbar({
  view,
  setView,
  query,
  setQuery,
  campaignType,
  setCampaignType,
}: {
  view: CampaignView;
  setView: (v: CampaignView) => void;
  query: string;
  setQuery: (v: string) => void;
  campaignType: CampaignTypeFilter;
  setCampaignType: (v: CampaignTypeFilter) => void;
}) {
  return (
    <div className="mx-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:flex-1">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          size={18}
        />
        <Input
          placeholder="Search by campaign name"
          className="h-10 w-full pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 sm:flex-none">
          <Button
            className={cn(baseBtn, "flex-1 sm:flex-none", view === "list" && activeBtn)}
            onClick={() => setView("list")}
          >
            List View
          </Button>

          <Button
            className={cn(baseBtn, "flex-1 sm:flex-none", view === "grid" && activeBtn)}
            onClick={() => setView("grid")}
          >
            Grid View
          </Button>
        </div>
      </div>
    </div>
  );
}