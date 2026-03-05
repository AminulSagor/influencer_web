"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CampaignView } from "@/types/admin/campaign/campaign_ui_type";
import { activeBtn, baseBtn } from "@/utils/admin/campaign/campaign_constrants_type_util";
import { Search } from "lucide-react";

// import type { CampaignView } from "../_types/ui.types";
// import { activeBtn, baseBtn } from "../_utils/campaign-constants";

export default function CampaignsToolbar({
  view,
  setView,
  query,
  setQuery,
}: {
  view: CampaignView;
  setView: (v: CampaignView) => void;
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div className="flex justify-between items-center gap-4 mx-2">
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Search by campaign name"
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-x-2">
        <Button className={cn(baseBtn, view === "list" && activeBtn)} onClick={() => setView("list")}>
          List View
        </Button>
        <Button className={cn(baseBtn, view === "grid" && activeBtn)} onClick={() => setView("grid")}>
          Grid View
        </Button>
      </div>
    </div>
  );
}
