"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FaEye } from "react-icons/fa";

import AssignedPersonalsCell from "./assigned-personals-cell";
import {
  isProgressStatus,
  progressMap,
} from "@/utils/admin/campaign/campaign_constrants_type_util";
import StatusSelect from "./status-select";
import {
  CampaignStatus,
  CampaignUI,
} from "@/types/admin/campaign/campaign_ui_type";
import ProgressBar from "./progress-bar";

export default function CampaignsListTable({
  campaigns,
  onStatusChange,
}: {
  campaigns: CampaignUI[];
  onStatusChange: (id: string, status: CampaignStatus) => void;
}) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-light-green hover:bg-light-green">
            <TableHead className="w-[40px]">
              <Checkbox />
            </TableHead>
            <TableHead className="text-white">Campaign Info</TableHead>
            <TableHead className="text-white">Client</TableHead>
            <TableHead className="text-white">Timeline</TableHead>
            <TableHead className="text-white">Financials</TableHead>
            <TableHead className="text-white">Assigned Personals</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-right text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {campaigns.map((campaign) => {
            const progress = progressMap[campaign.status] ?? 0;
            const showProgress = isProgressStatus(campaign.status);

            return (
              <TableRow key={campaign.id}>
                <TableCell className="w-[40px]">
                  <Checkbox />
                </TableCell>

                <TableCell className="space-y-1">
                  <p className="text-lg font-medium">{campaign.name}</p>
                  <p className="text-sm text-gray-500">{campaign.category}</p>
                  <p className="text-xs text-gray-500">Niches: {campaign.niches}</p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={campaign.avatar} />
                      <AvatarFallback>{campaign.client?.[0] || "C"}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs">{campaign.client}</p>
                  </div>
                </TableCell>

                <TableCell>
                  <p className="font-semibold">Start</p>
                  <p className="text-gray-500">{campaign.startDate}</p>
                  <p className="mt-2 font-semibold">End</p>
                  <p className="text-gray-500">{campaign.endDate}</p>
                </TableCell>

                <TableCell>
                  <p className="font-semibold">Client Budget</p>
                  <p className="font-semibold text-light-green">
                    ৳{Number(campaign.budget || 0).toLocaleString()}
                  </p>
                  <p className="mt-2 font-semibold">Final Quote</p>
                  <p className="font-semibold text-light-green">
                    ৳{Number(campaign.quote || 0).toLocaleString()}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center">
                    <AssignedPersonalsCell
                      count={campaign.assignedPersonals.count}
                      influencers={campaign.assignedPersonals.influencers}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  {showProgress && (
                    <div className="mb-2 w-[180px] space-y-1">
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Progress</span>
                        <span className="text-Primary">{progress}%</span>
                      </div>
                      <ProgressBar value={progress} />
                    </div>
                  )}

                  <StatusSelect
                    value={campaign.status}
                    onChange={(v) => onStatusChange(campaign.id, v)}
                    className="w-[180px] cursor-pointer border border-light-green"
                  />
                </TableCell>

                <TableCell className="text-right">
                  <Button asChild variant="outline">
                    <Link href={`/admin/campaigns/${campaign.id}`}>
                      <FaEye />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}