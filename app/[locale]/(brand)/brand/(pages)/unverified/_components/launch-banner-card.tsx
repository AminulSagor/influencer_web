"use client";

import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  isAgency?: boolean;
};

const LaunchBannerCard = ({ isAgency = false }: Props) => {
  return (
    <Card className="bg-linear-to-r from-Primary/90 to-light-green border-none">
      <CardContent>
        <div className="flex flex-col items-center text-center text-white">
          <Star className="w-6 h-6 mb-2" />

          <h2 className="text-lg font-semibold">
            {isAgency ? "Almost Ready To Launch" : "Almost There"}
          </h2>

          <p className="text-sm text-white/90 mt-1 leading-relaxed max-w-[290px]">
            {isAgency
              ? "Complete Verification To Unlock Your Full Dashboard With Earnings, Active Jobs, And New Opportunities."
              : "Complete Verification To Unlock Your Full Dashboard, Search For Top Talent, And Publish Your First Campaign."}

          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaunchBannerCard;