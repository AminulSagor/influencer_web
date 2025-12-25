import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
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

const AdminCampaigns = () => {
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
        <div className="flex justify-between items-center gap-4">
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

        <div className="border border-light-green bg-Secondary p-2 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <div className="bg-light-green px-4 py-1.5 border rounded-md border-Primary text-white text-sm">
                  1 selected
                </div>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="bg-white border border-light-green text-sm">
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
      </CardContent>
    </Card>
  );
};

export default AdminCampaigns;
