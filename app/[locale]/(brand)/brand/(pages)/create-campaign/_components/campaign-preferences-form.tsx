"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, ChevronDown, X } from "lucide-react";
import React, { useState } from "react";
import clsx from "clsx";

const mockTags = [
  "Hania Amir",
  "T-Sureeh",
  "Rafsan D Chotomai",
  "Ayman Sadiq",
  "Dilkush Hossain",
];

const CampaignPreferencesForm = () => {
  const [preferred, setPreferred] = useState<string[]>(mockTags);
  const [notPreferred, setNotPreferred] = useState<string[]>(mockTags);

  return (
    <Card className="border-none">
      <CardContent className="space-y-8">
        {/* ================= Select Product Type ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Select Product Type
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              placeholder="Select Product Type"
              readOnly
              className="h-12 pr-10"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* ================= Campaign Niche ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Campaign Niche
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <Input
              placeholder="Select Niche Type"
              readOnly
              className="h-12 pr-10"
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* ================= Preferred Influencers ================= */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-Primary">
            Preferred Influencers
          </h2>

          <Input
            placeholder="Enter Influencers Names... (Separate Each With A Comma)"
            className="h-12"
          />

          <TagBox tags={preferred} />
        </div>

        {/* ================= Not Preferable Influencers ================= */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-Primary">
            Not Preferable Influencers
          </h2>

          <Input
            placeholder="Enter Influencers Names... (Separate Each With A Comma)"
            className="h-12"
          />

          <TagBox tags={notPreferred} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignPreferencesForm;

const TagBox = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-light-gray p-3 min-h-24">
      <div className="flex items-center gap-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-light-green/30 px-3 py-1 text-sm text-Primary"
          >
            {tag}
            <X className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" />
          </span>
        ))}
      </div>
    </div>
  );
};
