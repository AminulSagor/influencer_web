"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CampaignsBulkBar() {
  return (
    <div className="border border-light-green bg-Secondary p-2 rounded-md mx-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-light-green px-4 py-1.5 border rounded-md border-Primary text-white text-sm">
            1 selected
          </div>

          <Select>
            <SelectTrigger className="bg-white border border-light-green text-sm w-[180px]">
              <SelectValue placeholder="Bulk Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="bg-white border border-light-green text-sm">
              <SelectValue placeholder="Nov 20 - Dec 20" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="range">Nov 20 - Dec 20</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white border border-light-green text-sm">
              <SelectValue placeholder="Influencer Promotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type">Influencer Promotion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
