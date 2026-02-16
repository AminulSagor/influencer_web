"use client";

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
import { FaRegTrashCan } from "react-icons/fa6";

import AssignedPersonalsCell from "./assigned-personals-cell";
import { isProgressStatus, progressMap } from "@/utils/admin/campaign/campaign-constrants_type";
import StatusSelect from "./status-select";
import { CampaignStatus, CampaignUI } from "@/types/admin/campaign/campaign-ui_type";
import ProgressBar from "./progress-bar";

export default function CampaignsListTable({
  campaigns,
  onStatusChange,
}: {
  campaigns: CampaignUI[];
  onStatusChange: (id: string, status: CampaignStatus) => void;
}) {
  return (
    <div className="rounded-md overflow-hidden border">
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
            <TableHead className="text-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {campaigns.map((campaign) => {
            const progress = progressMap[campaign.status];
            const showProgress = isProgressStatus(campaign.status);

            return (
              <TableRow key={campaign.id}>
                <TableCell className="w-[40px]">
                  <Checkbox />
                </TableCell>

                <TableCell className="space-y-1">
                  <p className="font-medium text-lg">{campaign.name}</p>
                  <p className="text-sm text-gray-500">{campaign.category}</p>
                  <p className="text-xs text-gray-500">Niches: {campaign.niches}</p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={campaign.avatar} />
                      <AvatarFallback>{campaign.client?.[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs">{campaign.client}</p>
                  </div>
                </TableCell>

                <TableCell>
                  <p className="font-semibold">Start</p>
                  <p className="text-gray-500">{campaign.startDate}</p>
                  <p className="font-semibold mt-2">End</p>
                  <p className="text-gray-500">{campaign.endDate}</p>
                </TableCell>

                <TableCell>
                  <p className="font-semibold">Client Budget</p>
                  <p className="text-light-green font-semibold">৳{campaign.budget}</p>
                  <p className="font-semibold mt-2">Final Quote</p>
                  <p className="text-light-green font-semibold">৳{campaign.quote}</p>
                </TableCell>

                <TableCell>
                  <AssignedPersonalsCell
                    count={campaign.assignedPersonals.count}
                    influencers={campaign.assignedPersonals.influencers}
                  />
                </TableCell>

                <TableCell>
                  {showProgress && (
                    <div className="w-[180px] space-y-1 mb-2">
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
                    className="w-[180px] border border-light-green cursor-pointer"
                  />
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline">
                      <FaEye />
                    </Button>
                    <Button variant="outline">
                      <FaRegTrashCan />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
