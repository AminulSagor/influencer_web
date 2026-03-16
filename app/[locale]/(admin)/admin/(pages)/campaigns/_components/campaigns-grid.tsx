"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { FaClock } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

import AssignedPersonalsCell from "./assigned-personals-cell";
import {
  CampaignStatus,
  CampaignUI,
  CampaignView,
} from "@/types/admin/campaign/campaign_ui_type";
import { progressMap } from "@/utils/admin/campaign/campaign_constrants_type_util";
import StatusSelect from "./status-select";
import ProgressBar from "./progress-bar";

export default function CampaignsGrid({
  campaigns,
  view,
  onStatusChange,
}: {
  campaigns: CampaignUI[];
  view: CampaignView;
  onStatusChange: (id: string, status: CampaignStatus) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => {
        const progress = progressMap[campaign.status] ?? 0;

        return (
          <Card key={campaign.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-Primary">{campaign.name}</CardTitle>
                  <p className="text-sm text-gray-400">{campaign.category}</p>
                  <p className="text-xs text-gray-400">Niches: {campaign.niches}</p>
                </div>
                <Checkbox />
              </div>

              <div className="rounded-md border px-4 py-2">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={campaign.avatar} />
                    <AvatarFallback>{campaign.client?.[0] || "C"}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-Primary">{campaign.client}</p>
                </div>
              </div>

              <div className="rounded-md border px-4 py-2">
                <AssignedPersonalsCell
                  count={campaign.assignedPersonals.count}
                  influencers={campaign.assignedPersonals.influencers}
                  compact={view === "grid"}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 rounded-lg border border-light-green bg-linear-to-r from-Secondary to-white px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-Primary">Client Budget</p>
                  <p className="text-2xl font-semibold text-light-green">
                    ৳{Number(campaign.budget || 0).toLocaleString()}
                  </p>
                </div>

                <Separator className="bg-light-green/60" />

                <div>
                  <p className="text-xs font-semibold text-Primary">Final Quote</p>
                  <p className="text-2xl font-semibold text-light-green">
                    ৳{Number(campaign.quote || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-yellow-600">
                  <span className="flex items-center gap-1">
                    <FaClock /> Start
                  </span>
                  <span>{campaign.startDate}</span>
                </div>
                <div className="flex justify-between text-sm text-yellow-600">
                  <span className="flex items-center gap-1">
                    <FaClock /> End
                  </span>
                  <span>{campaign.endDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <StatusSelect
                  value={campaign.status}
                  onChange={(v) => onStatusChange(campaign.id, v)}
                  className="w-full border border-light-green"
                />

                <div className="space-y-1">
                  <ProgressBar value={progress} />
                  <p className="text-sm font-medium text-orange">{progress}% Completed</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="lightGreen" className="flex-1">
                  <Link href={`/admin/campaigns/${campaign.id}`}>View Details</Link>
                </Button>

                <Button variant="outline">
                  <FaRegTrashCan />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}