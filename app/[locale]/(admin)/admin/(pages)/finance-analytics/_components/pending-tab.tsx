"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";

/* ================= TYPES ================= */

type UserRole = "agency" | "influencer" | "brand";

type PayeeInfo = {
  id: string;
  name: string;
  role: "Agency" | "Influencer" | "Brand";
  avatar?: string;
};

type CampaignInfo = {
  id: string;
  title: string;
  milestone: string;
  dateTime: string;
};

type PendingPayment = {
  id: string;
  tab: UserRole;
  payee?: PayeeInfo;
  brandName?: string;
  lastPaid?: string;
  paymentType?: string;
  campaign: CampaignInfo;
  amount?: number;
  paid?: number;
  due?: number;
};

/* ================= MOCK DATA ================= */

const pendingPayments: PendingPayment[] = [
  {
    id: "1",
    tab: "influencer",
    payee: {
      id: "u1",
      name: "Rafsan the chotobhai",
      role: "Influencer",
    },
    paymentType: "Partial Payment",
    campaign: {
      id: "c1",
      title: "Summer Sale Fashion",
      milestone: "Milestone Reached",
      dateTime: "13-05-25 at 2:30 PM",
    },
    amount: 25000,
  },
  {
    id: "2",
    tab: "agency",
    payee: {
      id: "u2",
      name: "Growthify Agency",
      role: "Agency",
    },
    paymentType: "Final Payment",
    campaign: {
      id: "c2",
      title: "Tech Launch 2025",
      milestone: "Campaign Completed",
      dateTime: "15-05-25 at 6:00 PM",
    },
    amount: 60000,
  },
  {
    id: "3",
    tab: "brand",
    brandName: "Venus Fashion Ltd",
    lastPaid: "13-April-25",
    campaign: {
      id: "c3",
      title: "Eid Special Campaign",
      milestone: "Invoice Generated",
      dateTime: "12-05-25 at 11:15 AM",
    },
    paid: 50000,
    due: 25000,
  },
  {
    id: "4",
    tab: "influencer",
    payee: {
      id: "u3",
      name: "Nafisa Rahman",
      role: "Influencer",
    },
    paymentType: "Milestone Payment",
    campaign: {
      id: "c4",
      title: "Skincare Awareness",
      milestone: "50% Engagement Target",
      dateTime: "14-05-25 at 9:45 PM",
    },
    amount: 18000,
  },
  {
    id: "5",
    tab: "brand",
    brandName: "TechNova BD",
    lastPaid: "02-May-25",
    campaign: {
      id: "c5",
      title: "Gadget Review Blast",
      milestone: "Pending Clearance",
      dateTime: "16-05-25 at 4:10 PM",
    },
    paid: 70000,
    due: 30000,
  },
];

/* ================= COMPONENT ================= */

const PendingTab = () => {
  const [activeTab, setActiveTab] = useState<UserRole>("agency");

  const filteredData = pendingPayments.filter((item) => item.tab === activeTab);

  return (
    <TabsContent value="pending" className="space-y-4">
      <Card>
        <CardHeader className="border-b flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-Primary">
              Pending Payment Approval
            </CardTitle>
            <CardDescription>
              Process different types of payment
            </CardDescription>
          </div>

          <div className="flex gap-2">
            {(["agency", "influencer", "brand"] as UserRole[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                className={
                  activeTab === tab
                    ? "bg-light-green text-white hover:bg-light-green"
                    : "border-light-green text-light-green"
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* SEARCH */}
          <div className="flex justify-between items-center gap-4 mx-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input placeholder="Search by campaign name" className="pl-10" />
            </div>
          </div>

          {/* BULK BAR */}
          <div className="border border-light-green bg-Secondary p-2 rounded-md mx-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-light-green px-4 py-1.5 border rounded-md border-Primary text-white text-sm">
                {filteredData.length} selected
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

            <Select>
              <SelectTrigger className="bg-white border border-light-green text-sm">
                <SelectValue placeholder="Nov 20 - Dec 20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Nov 20 - Dec 20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TABLE */}
          <div className="rounded-md overflow-hidden border mt-2">
            {(activeTab === "agency" || activeTab === "influencer") && (
              <Table>
                <TableHeader>
                  <TableRow className="bg-light-green hover:bg-light-green">
                    <TableHead className="w-[40px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-white">Payee Info</TableHead>
                    <TableHead className="text-white">Payment Type</TableHead>
                    <TableHead className="text-white">Campaign</TableHead>
                    <TableHead className="text-white">Amount</TableHead>
                    <TableHead className="text-white text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={item.payee?.avatar || "/"} />
                            <AvatarFallback>
                              {item.payee?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{item.payee?.name}</p>
                            <p className="text-xs text-gray-400">
                              {item.payee?.role}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{item.paymentType}</TableCell>

                      <TableCell>
                        <p className="font-semibold">{item.campaign.title}</p>
                        <p className="text-xs text-gray-400">
                          {item.campaign.milestone}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.campaign.dateTime}
                        </p>
                      </TableCell>

                      <TableCell className="text-light-green font-semibold">
                        ৳{item.amount?.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button variant="lightGreen">Process Payment</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeTab === "brand" && (
              <Table>
                <TableHeader>
                  <TableRow className="bg-light-green hover:bg-light-green">
                    <TableHead className="w-[40px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead className="text-white">Brand Name</TableHead>
                    <TableHead className="text-white">Last Paid</TableHead>
                    <TableHead className="text-white">Campaign</TableHead>
                    <TableHead className="text-white">Paid</TableHead>
                    <TableHead className="text-white">Due Amount</TableHead>
                    <TableHead className="text-white text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>

                      <TableCell>{item.brandName}</TableCell>
                      <TableCell>{item.lastPaid}</TableCell>

                      <TableCell>
                        <p className="font-semibold">{item.campaign.title}</p>
                        <p className="text-xs text-gray-400">
                          {item.campaign.milestone}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.campaign.dateTime}
                        </p>
                      </TableCell>

                      <TableCell className="text-light-green font-semibold">
                        ৳{item.paid?.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-orange font-semibold">
                        ৳{item.due?.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button variant="orange">Notify</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PendingTab;
