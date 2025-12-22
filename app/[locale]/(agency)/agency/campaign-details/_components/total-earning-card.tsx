import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const TotalEarningCard = () => {
  return (
    <Card>
      <CardContent>
        <div className="border-light-green border p-4 rounded-lg bg-linear-to-r from-Secondary to-white">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Campaign Earnings</p>
              <p className="text-2xl font-semibold text-Primary">৳ 0</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-light-green flex items-center justify-center font-black text-light-green">
              ৳
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalEarningCard;
