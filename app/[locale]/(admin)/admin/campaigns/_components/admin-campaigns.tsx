import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import CampaignLinks from "./campaign-links";

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
    </Card>
  );
};

export default AdminCampaigns;
