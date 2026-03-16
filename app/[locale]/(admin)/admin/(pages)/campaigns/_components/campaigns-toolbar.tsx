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
    <div className="mx-2 flex items-center justify-between gap-4">
      <div className="relative flex-1">
        <Search
          className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          size={18}
        />
        <Input
          placeholder="Search by campaign name"
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          className={cn(baseBtn, view === "list" && activeBtn)}
          onClick={() => setView("list")}
        >
          List View
        </Button>

        <Button
          className={cn(baseBtn, view === "grid" && activeBtn)}
          onClick={() => setView("grid")}
        >
          Grid View
        </Button>

        <Select
          value={campaignType}
          onValueChange={(value) =>
            setCampaignType(value as CampaignTypeFilter)
          }
        >
          <SelectTrigger className="w-[190px] border border-light-green bg-white text-sm">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="influencer_promotion">
              Influencer Promotion
            </SelectItem>
            <SelectItem value="paid_ad">Paid Ad</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}