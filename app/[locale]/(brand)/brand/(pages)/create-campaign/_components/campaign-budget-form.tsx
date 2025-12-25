"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

import {
  Hash,
  FileText,
  Calendar,
  Target,
  Instagram,
  Youtube,
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageCircle,
  CrossIcon,
  Cross,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { ImCheckmark } from "react-icons/im";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CampaignBudgetForm = () => {
  return (
    <div className="space-y-6">
      <BudgetCalculatorSection />
      <CampaignMilestonesSection />
    </div>
  );
};

export default CampaignBudgetForm;

const Row = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex justify-between text-Primary">
    <span className={bold ? "font-semibold" : ""}>{label}</span>
    <span className={bold ? "font-semibold" : ""}>{value}</span>
  </div>
);

const BudgetCalculatorSection = () => {
  return (
    <Card className="border-none">
      <CardContent className="space-y-6">
        {/* Suggestions */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-Primary">Suggestions</h3>
          <div className="flex gap-2 flex-wrap">
            {["৳ 30,000", "৳ 50,000", "৳ 80,000", "৳ 100,000"].map((v) => (
              <span
                key={v}
                className="rounded-full bg-light-green/30 px-3 py-1 text-sm text-Primary cursor-pointer"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Budget + Quote */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enter Budget */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-Primary">
              Enter Budget Amount
            </h3>

            <div className="flex items-center justify-center h-[100px] rounded-xl border border-light-gray bg-white">
              <span className="text-2xl font-semibold text-light-green">
                ৳ 100,000
              </span>
            </div>

            <p className="text-xs text-gray-400">Min: ৳ 25,000</p>
          </div>

          {/* Quote */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-Primary">
              Quote (Budget Breakdown)
            </h3>

            <div className="rounded-xl border border-light-green bg-linear-to-r from-light-green to-white bg-linear p-4 space-y-2 text-sm">
              <Row label="Base Campaign Budget" value="৳100,000" />
              <Row label="+ VAT/Tax (15%)" value="৳15,000" />
              <div className="border bg-light-gray" />
              <Row label="Budget Including Tax" value="৳115,000" bold />
            </div>
          </div>
        </div>

        {/* Net Payable */}
        <div className="flex justify-between items-center border-t pt-4">
          <span className="font-semibold text-Primary">
            Net Payable Budget Amount (Inc. Tax)
          </span>
          <span className="text-lg font-semibold text-Primary">৳ 115,000</span>
        </div>
      </CardContent>
    </Card>
  );
};

const CampaignMilestonesSection = () => {
  const METRICS = [
    {
      label: "Reach",
      icon: <Target className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
    {
      label: "Views",
      icon: <Eye className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
    {
      label: "Likes",
      icon: <Heart className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
    {
      label: "Comments",
      icon: <MessageCircle className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
  ];

  const milestones = [
    {
      id: 1,
      title: "Initial Content Creation",
      subtitle: "2 Instagram Posts + 3 Stories",
      day: "DAY 1",
    },
    {
      id: 2,
      title: "YouTube Video Upload",
      subtitle: "1 Sponsored Video (60 Sec)",
      day: "DAY 2",
    },
    {
      id: 3,
      title: "TikTok Campaign",
      subtitle: "1 Sponsored Video (60 Sec)",
      day: "DAY 3",
    },
  ];
  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex items-center gap-1">
          <Image
            src={"/influencer-images/milestone flask.png"}
            alt="flask"
            height={22}
            width={22}
          />
          <h3 className="text-base font-semibold text-Primary">
            Campaign Milestones
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* LEFT: Create Milestone (Keep as is) */}
          <div className="space-y-4 w-full">
            <DottedButton>Add another Milestone</DottedButton>

            {/* after onclick this field will be came */}
            <Card className="rounded-xl border border-light-green shadow-none">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <p className="bg-light-green flex justify-center p-3 text-sm text-white items-center w-5 h-5 rounded-full">
                    4
                  </p>
                  <p className="flex items-center gap-4 text-Primary">
                    <button className="cursor-pointer">
                      <ImCheckmark />
                    </button>
                    <button className="cursor-pointer">
                      <X />
                    </button>
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Ex: Initial Content Creation"
                  />
                  {/* selector */}
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Facebook" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="light">Facebook</SelectItem>
                      <SelectItem value="dark">Youtube</SelectItem>
                      <SelectItem value="system">Instragram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Input type="text" placeholder="1 Sponsered Video / 1 Post" />
                  <Input type="text" placeholder="DAY 1" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {METRICS.map(({ label, icon, placeholder }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex items-center gap-1">
                        {icon}
                        <Label className="text-sm font-semibold text-light-green">
                          {label}
                        </Label>
                      </div>
                      <Input
                        className="border rounded-md h-9 px-2 focus:border-light-green"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-auto bg-light-gray w-1 border" />

          {/* RIGHT: Milestone List - UPDATED with icons */}
          <div className="space-y-4 w-full">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-light-green bg-white p-5 flex items-center justify-between"
              >
                {/* LEFT */}
                <div className="flex items-start gap-4">
                  {/* Index */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-light-green text-white font-semibold text-sm">
                    {m.id}
                  </div>

                  {/* Text */}
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-Primary">
                      {m.title}
                    </p>
                    <p className="text-sm text-gray-500">{m.subtitle}</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-light-green">
                    {m.day}
                  </span>
                  <ChevronDown className="w-4 h-4 text-light-green" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
