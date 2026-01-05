'use client'
import RecentTransactionsCard, {
  Transaction,
} from "@/app/[locale]/(brand)/brand/(pages)/analytics/recent-transection-card";
import { Card, CardContent } from "@/components/ui/card";
import { Droplet, UserRound } from "lucide-react";
import React, { useState} from "react";

const AnalyticsPage = () => {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<"lowToHigh" | "highToLow">(
    "lowToHigh"
  );
  const items: Transaction[] = [
    {
      id: "1",
      title: `Payment For "Summer Sale"`,
      timeLabel: "Today, 2:30 PM",
      amountLabel: "৳20,000",
      onViewDetails: () => console.log("view 1"),
    },
    {
      id: "2",
      title: `Payment For "Summer Sale"`,
      timeLabel: "Today, 2:30 PM",
      amountLabel: "৳20,000",
      onViewDetails: () => console.log("view 2"),
    },
    {
      id: "3",
      title: `Payment For "Summer Sale"`,
      timeLabel: "Today, 2:30 PM",
      amountLabel: "৳20,000",
      onViewDetails: () => console.log("view 3"),
    },
    {
      id: "4",
      title: `Payment For "Summer Sale"`,
      timeLabel: "Today, 2:30 PM",
      amountLabel: "৳20,000",
      onViewDetails: () => console.log("view 4"),
    },
  ];
  return (
    <div className="space-y-4">
      {/* top */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* top campaign */}
        <Card className="border-none bg-linear-to-r from-Primary/90 to-light-green text-white w-full">
          <CardContent>
            <div className="flex justify-between">
              <div>
                <h3>Top Campaign</h3>
                <h1 className="text-white font-semibold text-xl lg:text-3xl">
                  Summer Sale
                </h1>
              </div>
              <span>
                <Droplet size={32} />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* top influencer */}
        <Card className="border-none bg-linear-to-r from-Primary/90 to-light-green text-white w-full">
          <CardContent>
            <div className="flex justify-between">
              <div>
                <h3>Top Influencer</h3>
                <h1 className="text-white font-semibold text-xl lg:text-3xl">
                  Hania Amir
                </h1>
                <p className="text-xs">12 Jobs Completed</p>
              </div>
              <span>
                <UserRound size={32} />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* bottom */}
      <div className="">
        <RecentTransactionsCard
          totalResults={20}
          pageSize={4}
          pageCount={5}
          page={1}
          items={items}
          searchValue={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          onNextPage={() => console.log("next")}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
