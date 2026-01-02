"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

type CampaignType = "paid-ad" | "influencer";

/** move this OUTSIDE Step1 */
function RadioVisual({ checked }: { checked: boolean }) {
  return (
    <div
      className={clsx(
        "h-6 w-6 rounded-full border flex items-center justify-center",
        checked ? "border-light-green" : "border-gray-300"
      )}
    >
      {checked ? <div className="h-3 w-3 rounded-full bg-light-green" /> : null}
    </div>
  );
}

const CampaignBasicForm = () => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState<CampaignType>("paid-ad");

  const isPaid = campaignType === "paid-ad";
  const isInfluencer = campaignType === "influencer";

  const cardBase =
    "flex items-center justify-between rounded-xl border p-5 cursor-pointer transition";
  const activeCard = "border-Primary bg-[#F5F5DC]";
  const inactiveCard = "border-light-gray";

  return (
    <Card className="border-none">
      <CardContent className="space-y-8">
        {/* Campaign Name */}
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
            className="h-12 focus-visible:ring-1"
          />
        </div>

        {/* Campaign Type */}
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
                <p className="text-sm">Launch targeted advertising campaign</p>
              </div>

              <RadioGroupItem
                id="paid-ad"
                value="paid-ad"
                className="sr-only"
              />
              <RadioVisual checked={isPaid} />
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
                <p className="font-semibold text-base">Influencer promotion</p>
                <p className="text-sm">Partner with influencer for promotion</p>
              </div>

              <RadioGroupItem
                id="influencer"
                value="influencer"
                className="sr-only"
              />
              <RadioVisual checked={isInfluencer} />
            </Label>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignBasicForm;
