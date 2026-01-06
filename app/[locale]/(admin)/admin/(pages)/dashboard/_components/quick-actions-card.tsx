import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
const QuickActionsCard = () => {
  return (
    <Card className="p-0 gap-0">
      <div className="border-b">
        <div className="p-4">
          <CardTitle className="text-Primary">Quick Actions</CardTitle>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6">
            <div className="border border-purple-200 rounded-lg p-4 flex items-center justify-center flex-col bg-linear-to-r from-white to-purple-100 gap-4">
              <div className="relative w-[40px] aspect-square">
                <Image
                  src="/icons/campaign.svg"
                  alt="Campaign"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-semibold text-purple-600">Active Campaign</p>
            </div>
          </div>
          <div className="col-span-6">
            <div className="border border-red-200 rounded-lg p-4 flex items-center justify-center flex-col bg-linear-to-r from-white to-red-100 gap-4">
              <div className="relative w-[40px] aspect-square ">
                <Image
                  src="/icons/users.svg"
                  alt="Campaign"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-semibold text-red-600">Verify Users</p>
            </div>
          </div>
          <div className="col-span-6">
            <div className="border border-lime-200 rounded-lg p-4 flex items-center justify-center flex-col bg-linear-to-r from-white to-lime-100 gap-4">
              <div className="relative w-[40px] aspect-square">
                <Image
                  src="/icons/agency.svg"
                  alt="Campaign"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-semibold text-lime-600 text-center">
                Influencers
              </p>
            </div>
          </div>
          <div className="col-span-6">
            <div className="border border-Blue/20 rounded-lg p-4 flex items-center justify-center flex-col bg-linear-to-r from-white to-Blue/20 gap-4">
              <div className="relative w-[40px] aspect-square ">
                <Image
                  src="/icons/report.svg"
                  alt="Campaign"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-semibold text-Blue">View Reports</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuickActionsCard;
