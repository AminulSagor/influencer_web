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

const PendingTab = () => {
  const [activeTab, setActiveTab] = useState<"agency" | "influencer" | "brand">(
    "agency"
  );
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
            <Button
              variant={activeTab === "agency" ? "default" : "outline"}
              className={
                activeTab === "agency"
                  ? "bg-light-green text-white hover:bg-light-green"
                  : "border-light-green text-light-green"
              }
              onClick={() => setActiveTab("agency")}
            >
              Agency
            </Button>

            <Button
              variant={activeTab === "influencer" ? "default" : "outline"}
              className={
                activeTab === "influencer"
                  ? "bg-light-green text-white hover:bg-light-green"
                  : "border-light-green text-light-green"
              }
              onClick={() => setActiveTab("influencer")}
            >
              Influencer
            </Button>

            <Button
              variant={activeTab === "brand" ? "default" : "outline"}
              className={
                activeTab === "brand"
                  ? "bg-light-green text-white hover:bg-light-green"
                  : "border-light-green text-light-green"
              }
              onClick={() => setActiveTab("brand")}
            >
              Brand
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center gap-4 mx-2">
            <div className="flex-1">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Search by campaign name"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

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

              <Select>
                <SelectTrigger className="bg-white border border-light-green text-sm">
                  <SelectValue placeholder="Nov 20 - Dec 20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Nov 20 - Dec 20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={"/"} />
                          <AvatarFallback>R</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p>Rafsan the chotobhai</p>
                          <p className="text-xs text-gray-400">Influencer</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>Partial Payment</p>
                    </TableCell>
                    <TableCell className="space-y-1">
                      <p className="font-semibold">Summer Sale Fashion</p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">
                          Milestone Reached
                        </p>
                        <p className="text-xs text-gray-400">
                          13-05-25 at 2:30 PM
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-light-green font-semibold">৳25,000</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant={"lightGreen"}>Process Payment</Button>
                    </TableCell>
                  </TableRow>
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
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={"/"} />
                          <AvatarFallback>R</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p>Rafsan the chotobhai</p>
                          <p className="text-xs text-gray-400">Influencer</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>Partial Payment</p>
                    </TableCell>
                    <TableCell className="space-y-1">
                      <p className="font-semibold">Summer Sale Fashion</p>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">
                          Milestone Reached
                        </p>
                        <p className="text-xs text-gray-400">
                          13-05-25 at 2:30 PM
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-light-green font-semibold">৳25,000</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant={"lightGreen"}>Process Payment</Button>
                    </TableCell>
                  </TableRow>
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
