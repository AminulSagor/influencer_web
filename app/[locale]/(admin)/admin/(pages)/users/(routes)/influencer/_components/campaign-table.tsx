"use client";
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
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { userData } from "../../../_components/user-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaEye } from "react-icons/fa6";
import { FaTrash, FaTrashAlt } from "react-icons/fa";

const CampaignTable = () => {
  const pathname = usePathname();
  const id = Number(pathname.split("/").pop());
  const influencerData = userData["influencer"];
  const data = influencerData.find((i) => i.id === id);
  const campaignData = data?.campaigns;
  //console.log(campaignData);
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Campaign</CardTitle>
        <CardDescription>Browse and manage the campaigns</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
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
                <TableHead className="text-white text-center">Status</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignData?.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div>
                      <h3 className="text-lg">{campaign.title}</h3>
                      <p className="text-sm text-gray-400">
                        {campaign.campaignType}
                      </p>
                      <p className="text-xs text-gray-400">{campaign.niche}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback> hi</AvatarFallback>
                      </Avatar>
                      <p>{campaign.client}</p>
                    </div>
                  </TableCell>
                  <TableCell className="space-y-2">
                    <div>
                      <p className="font-semibold">Start Date</p>
                      <p>{campaign.startDate}</p>
                    </div>
                    <div>
                      <p className="font-semibold">End Date</p>
                      <p>{campaign.startDate}</p>
                    </div>
                  </TableCell>
                  <TableCell className="space-y-2">
                    <div>
                      <p className="font-semibold">Client Budget</p>
                      <p>{campaign.clientBudget}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Final Quote Amount</p>
                      <p>{campaign.finalQuoteAmount}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant={"outline"}>
                      <FaEye />
                    </Button>
                    <Button variant={"outline"}>
                      <FaTrashAlt />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTable;
