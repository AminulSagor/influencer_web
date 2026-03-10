"use client";
import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const gradientIds = {
  accepted: "acceptedGradient",
  declined: "declinedGradient",
};

const dataSets = {
  agencies: {
    today: [
      { name: "Accepted", value: 35 },
      { name: "Declined", value: 10 },
    ],
    week: [
      { name: "Accepted", value: 200 },
      { name: "Declined", value: 60 },
    ],
    thisMonth: [
      { name: "Accepted", value: 800 },
      { name: "Declined", value: 300 },
    ],
  },
  influencers: {
    today: [
      { name: "Accepted", value: 50 },
      { name: "Declined", value: 15 },
    ],
    week: [
      { name: "Accepted", value: 300 },
      { name: "Declined", value: 90 },
    ],
    thisMonth: [
      { name: "Accepted", value: 1200 },
      { name: "Declined", value: 400 },
    ],
  },
};

type TabType = "agencies" | "influencers";
type TimeframeType = "today" | "week" | "thisMonth";

const CampaignAcceptOrDeclinedCard = () => {
  const [tab, setTab] = useState<TabType>("agencies");
  const [timeframe, setTimeframe] = useState<TimeframeType>("today");
  const data = dataSets[tab][timeframe];

  // Colors for legend squares and gradients
  const acceptedColorStart = "#81BA44"; // light green
  const declinedColorStart = "#ef4444"; // red

  return (
    <Card className="p-0 gap-0">
      <div className="border-b-0">
        <div className="p-4 space-y-4">
          <CardTitle className="text-Primary">
            Campaigns - Accepted vs Declined
          </CardTitle>

          <div className="flex items-center gap-2">
            <p className="text-sm text-Primary">
              Get a glimpse how influencers / agencies are interacting
            </p>
            <Select
              defaultValue={timeframe}
              onValueChange={(value) => setTimeframe(value as TimeframeType)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select a timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient
                id={gradientIds.accepted}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={acceptedColorStart}
                  stopOpacity={0.8}
                />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
              </linearGradient>

              <linearGradient
                id={gradientIds.declined}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={declinedColorStart}
                  stopOpacity={0.8}
                />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />

            <Bar dataKey="value" radius={[0, 0, 0, 0]} barSize={90}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.name === "Accepted"
                      ? `url(#${gradientIds.accepted})`
                      : `url(#${gradientIds.declined})`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend below chart */}
      <div className="flex justify-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: acceptedColorStart }}
          />
          <span className="text-sm text-Primary font-medium">Accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: declinedColorStart }}
          />
          <span className="text-sm text-Primary font-medium">Declined</span>
        </div>
      </div>

      <div className="p-4 border-t">
        <Tabs value={tab} onValueChange={(value) => setTab(value as TabType)}>
          <TabsList className="w-full">
            <TabsTrigger
              className="data-[state=active]:bg-light-green data-[state=active]:text-white"
              value="agencies"
            >
              Agencies
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-light-green data-[state=active]:text-white"
              value="influencers"
            >
              Influencers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </Card>
  );
};

export default CampaignAcceptOrDeclinedCard;
