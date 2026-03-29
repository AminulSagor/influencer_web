import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const QuickActionsCard = () => {
  return (
    <Card className="p-0 gap-0">
      <div className="border-b">
        <div className="p-4">
          <CardTitle className="text-Primary">Quick Actions</CardTitle>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/admin/campaigns?tab=active"
            className="flex items-center justify-center flex-col border border-purple-200 rounded-lg p-3 md:p-4 bg-linear-to-r from-white to-purple-100 gap-2 md:gap-4 hover:shadow-md transition-all active:scale-95"
          >
            <div className="relative w-[30px] md:w-[40px] aspect-square">
              <Image
                src="/icons/campaign.svg"
                alt="Campaign"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-semibold text-purple-600 text-xs md:text-sm lg:text-base text-center">Active Campaign</p>
          </Link>

          <Link
            href="/admin/verification-center"
            className="flex items-center justify-center flex-col border border-red-200 rounded-lg p-3 md:p-4 bg-linear-to-r from-white to-red-100 gap-2 md:gap-4 hover:shadow-md transition-all active:scale-95"
          >
            <div className="relative w-[30px] md:w-[40px] aspect-square ">
              <Image
                src="/icons/users.svg"
                alt="Campaign"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-semibold text-red-600 text-xs md:text-sm lg:text-base text-center">Verify Users</p>
          </Link>

          <Link
            href="/admin/users/influencer"
            className="flex items-center justify-center flex-col border border-lime-200 rounded-lg p-3 md:p-4 bg-linear-to-r from-white to-lime-100 gap-2 md:gap-4 hover:shadow-md transition-all active:scale-95"
          >
            <div className="relative w-[30px] md:w-[40px] aspect-square">
              <Image
                src="/icons/agency.svg"
                alt="Campaign"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-semibold text-lime-600 text-center text-xs md:text-sm lg:text-base">
              Influencers
            </p>
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center justify-center flex-col border border-Blue/20 rounded-lg p-3 md:p-4 bg-linear-to-r from-white to-Blue/20 gap-2 md:gap-4 hover:shadow-md transition-all active:scale-95"
          >
            <div className="relative w-[30px] md:w-[40px] aspect-square ">
              <Image
                src="/icons/report.svg"
                alt="Campaign"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-semibold text-Blue text-xs md:text-sm lg:text-base text-center">View Reports</p>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default QuickActionsCard;
