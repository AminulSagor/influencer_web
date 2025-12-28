"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import CampaignLinks from "./campaign-links";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaEye } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AssigneeTooltip from "./asignee-tooltip";

type CampaignStatus =
  | "needs-quote"
  | "active"
  | "pending"
  | "completed"
  | "paid"
  | "canceled";

type Campaign = {
  id: number;
  name: string;
  category: string;
  niches: string;
  client: string;
  avatar: string;
  startDate: string;
  endDate: string;
  budget: number;
  quote: number;
  status: CampaignStatus;
};

export type Assignee = {
  id: number;
  name: string;
  avatar: string;
};

const assignees: Assignee[] = [
  { id: 1, name: "John Doe", avatar: "/avatars/john.png" },
  { id: 2, name: "Sarah Ali", avatar: "/avatars/sarah.png" },
  { id: 3, name: "Rahim Uddin", avatar: "/avatars/rahim.png" },
  { id: 4, name: "Nusrat Jahan", avatar: "/avatars/nusrat.png" },
  { id: 5, name: "Tanvir Hasan", avatar: "/avatars/tanvir.png" },
];

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Summer Sale Fashion",
    category: "Influencer Promotion",
    niches: "Fashion",
    client: "StyleCo.",
    avatar: "https://github.com/ninjastorm24.png",
    startDate: "20 Mar, 2025",
    endDate: "31 Mar, 2025",
    budget: 100000,
    quote: 100,
    status: "active",
  },
  {
    id: 2,
    name: "Winter Drop",
    category: "Influencer Promotion",
    niches: "Lifestyle",
    client: "UrbanX",
    avatar: "https://github.com/shadcn.png",
    startDate: "01 Apr, 2025",
    endDate: "15 Apr, 2025",
    budget: 80000,
    quote: 80000,
    status: "paid",
  },
];

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

  const [status, setStatus] = useState<
    "needs-quote" | "active" | "pending" | "completed" | "paid" | "canceled"
  >("active");

  const progressMap: Record<CampaignStatus, number> = {
    "needs-quote": 0,
    pending: 0,
    canceled: 0,
    active: 70,
    completed: 100,
    paid: 100,
  };

  const handleStatusChange = (id: number, status: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, status } : campaign
      )
    );
  };
  return (
    <Card>
      <CardHeader className="flex items-center justify-between border-b">
        <div className="space-y-2">
          <CardTitle className="text-Primary">Campaigns</CardTitle>
          <CardDescription>Browse and manage the campaigns</CardDescription>
        </div>

        <div className="w-full sm:w-auto">
          <CampaignLinks />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* search bar */}
        <div className="flex justify-between items-center gap-4 mx-2">
          <div className="flex-1">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input placeholder="Search by campaign name" className="pl-10" />
            </div>
          </div>

          <div className="space-x-2">
            <Button className="bg-light-green hover:bg-light-green/90">
              List View
            </Button>
            <Button className="bg-Secondary text-light-green border-light-green border hover:bg-Secondary/90 hover:text-light-green">
              Grid View
            </Button>
          </div>
        </div>

        <div className="border border-light-green bg-Secondary p-2 rounded-md mx-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="bg-light-green px-4 py-1.5 border rounded-md border-Primary text-white text-sm">
                  1 selected
                </div>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="bg-white border border-light-green text-sm w-[180px]">
                    <SelectValue placeholder="Bulk Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm">
                  <SelectValue placeholder="Nov 20 - Dec 20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Nov 20 - Dec 20</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm">
                  <SelectValue placeholder="Influencer Promotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delete">Influencer Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
                const shouldShowProgress = [
                  "active",
                  "completed",
                  "paid",
                ].includes(campaign.status);

                return (
                  <TableRow key={campaign.id}>
                    <TableCell className="w-[40px]">
                      <Checkbox />
                    </TableCell>

                    <TableCell className="space-y-1">
                      <p className="font-medium text-lg">{campaign.name}</p>
                      <p className="text-sm text-gray-500">
                        {campaign.category}
                      </p>
                      <p className="text-xs text-gray-500">
                        Niches: {campaign.niches}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={campaign.avatar} />
                          <AvatarFallback>{campaign.client[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-xs">{campaign.client}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold">Start</p>
                        <p className="text-gray-500">{campaign.startDate}</p>
                        <p className="font-semibold mt-2">End</p>
                        <p className="text-gray-500">{campaign.endDate}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="font-semibold">Client Budget</p>
                      <p className="text-light-green font-semibold">
                        ৳{campaign.budget}
                      </p>
                      <p className="font-semibold mt-2">Final Quote</p>
                      <p className="text-light-green font-semibold">
                        ৳{campaign.quote}
                      </p>
                    </TableCell>
                    <TableCell>
                      {assignees.length === 0 ? (
                        <p className="text-light-green">None Assigned</p>
                      ) : (
                        <AssigneeTooltip assignees={assignees} />
                      )}
                    </TableCell>

                    {/* STATUS + PROGRESS */}
                    <TableCell>
                      <div className="space-y-2">
                        {shouldShowProgress && (
                          <div className="w-[180px] space-y-1">
                            <div className="flex justify-between text-sm font-semibold">
                              <span>Progress</span>
                              <span className="text-Primary">{progress}%</span>
                            </div>
                            <div className="h-2 bg-light-green/30 rounded-full">
                              <div
                                className="h-full bg-light-green rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <Select
                          value={campaign.status}
                          onValueChange={(v) =>
                            handleStatusChange(campaign.id, v as CampaignStatus)
                          }
                        >
                          <SelectTrigger className="w-[180px] border border-light-green cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="needs-quote">
                              Needs Quote
                            </SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
      </CardContent>
    </Card>
  );
};

export default AdminCampaigns;
