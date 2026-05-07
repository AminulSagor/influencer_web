import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type CampaignTypeFilter = "all" | "influencer_promotion" | "paid_ad";

export default function CampaignsBulkActionBar({
  selectedCount,
  onExport,
  campaignType,
  setCampaignType,
}: {
  selectedCount: number;
  onExport: () => void;
  campaignType: CampaignTypeFilter;
  setCampaignType: (v: CampaignTypeFilter) => void;
}) {
  const [action, setAction] = useState<string>("");

  const handleGo = () => {
    if (action === "export") {
      onExport();
    }
  };

  return (
    <div className="mx-2 mt-4 flex flex-col items-center justify-between gap-4 rounded-md border border-[#d2e0cc] bg-[#edf6ea] px-3 py-2 sm:flex-row">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-light-green px-3 py-1.5 text-sm font-medium text-white">
          {selectedCount} Selected
        </div>

        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-[150px] border-gray-300 bg-white text-sm">
            <SelectValue placeholder="Bulk Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="export">Export to Excel</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleGo}
          disabled={!action || selectedCount === 0}
          className="bg-light-green text-white hover:bg-light-green/90"
          size="sm"
        >
          Go
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={campaignType}
          onValueChange={(value) =>
            setCampaignType(value as CampaignTypeFilter)
          }
        >
          <SelectTrigger className="w-full border-gray-300 bg-white text-sm sm:w-[190px]">
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
