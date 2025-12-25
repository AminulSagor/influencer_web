"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

type CampaignType = "paid-ad" | "influencer";

const CampaignBasicForm = () => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] =
    useState<CampaignType>("paid-ad");

  const isPaid = campaignType === "paid-ad";
  const isInfluencer = campaignType === "influencer";

  const cardBase =
    "flex items-center justify-between rounded-xl border p-5 cursor-pointer transition";
  const activeCard = "border-Primary bg-light-green/20";
  const inactiveCard = "border-light-gray";

  const radioCls =
  "h-7 w-7 border-Primary text-light-green [&_[data-radix-radio-indicator]]:h-4 [&_[data-radix-radio-indicator]]:w-4";


  return (
    <Card className="border-none">
      <CardContent className="space-y-8">
        {/* ================= Campaign Name ================= */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Campaign Name
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <Input
            placeholder="Enter Campaign Name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="h-12"
          />
        </div>

        {/* ================= Campaign Type ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Campaign Type
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <RadioGroup
            value={campaignType}
            onValueChange={(v) => setCampaignType(v as CampaignType)}
            className="space-y-4"
          >
            {/* Paid Ad */}
            <Label
              htmlFor="paid-ad"
              className={clsx(cardBase, isPaid ? activeCard : inactiveCard)}
            >
              <div className="space-y-1 text-Primary">
                <p className="font-semibold text-base">Paid Ad</p>
                <p className="text-sm">
                  Launch targeted advertising campaign
                </p>
              </div>

              <RadioGroupItem
                id="paid-ad"
                value="paid-ad"
                className={radioCls}
              />
            </Label>

            {/* Influencer */}
            <Label
              htmlFor="influencer"
              className={clsx(
                cardBase,
                isInfluencer ? activeCard : inactiveCard
              )}
            >
              <div className="space-y-1 text-Primary">
                <p className="font-semibold text-base">
                  Influencer promotion
                </p>
                <p className="text-sm">
                  Partner with influencer for promotion
                </p>
              </div>

              <RadioGroupItem
                id="influencer"
                value="influencer"
                className={radioCls}
              />
            </Label>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignBasicForm;
