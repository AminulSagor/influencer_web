"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CampaignLinks from "./campaign-links";

export default function CampaignsHeader({ tabs }: { tabs?: React.ReactNode }) {
  return (
    <CardHeader className="border-b">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* left */}
        <div className="space-y-1">
          <CardTitle className="text-Primary">Campaigns</CardTitle>
          <CardDescription>Browse and manage your campaigns</CardDescription>
        </div>

        {/* middle */}
        <div className="lg:mx-auto">
          <CampaignLinks />
        </div>

        {/* right */}
        <div className="lg:ml-auto">{tabs}</div>
      </div>
    </CardHeader>
  );
}
