import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const InfluencerTable = () => {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-Primary">Campaigns</CardTitle>
            <CardDescription>Browse and manage the campaigns</CardDescription>
          </div>

          <div className="flex items-center gap-2"></div>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default InfluencerTable;
