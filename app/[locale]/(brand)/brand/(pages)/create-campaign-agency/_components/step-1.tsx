"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { useFormStore } from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";

type CampaignType = "paid-ad" | "influencer";

const Step1 = () => {
  const increaseStep = useCampaignStore((s) => s.increaseStep);
  const { stepOne, setStepOne } = useFormStore();

  // errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  const isPaid = stepOne.campaignType === "paid-ad";
  const isInfluencer = stepOne.campaignType === "influencer";

  const cardBase =
    "flex items-center justify-between rounded-xl border p-5 cursor-pointer transition";
  const activeCard = "border-Primary bg-[#F5F5DC]";
  const inactiveCard = "border-light-gray";

  const validate = () => {
    let ok = true;

    if (!stepOne.campaignName.trim()) {
      setNameError("Campaign name is required.");
      ok = false;
    } else {
      setNameError(null);
    }

    if (!stepOne.campaignType) {
      setTypeError("Please select a campaign type.");
      ok = false;
    } else {
      setTypeError(null);
    }

    return ok;
  };

  return (
    <Card>
      <CardContent className="space-y-8">
        {/* Campaign Name */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">
              Campaign Name
            </h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <Input
            placeholder="Enter Campaign Name"
            value={stepOne.campaignName}
            onChange={(e) => {
              setStepOne({
                campaignName: e.target.value,
                campaignType: stepOne.campaignType,
              });
              if (nameError) setNameError(null);
            }}
            onBlur={() => {
              if (!stepOne.campaignName.trim())
                setNameError("Campaign name is required.");
            }}
            className={clsx(
              "h-12 focus-visible:ring-1",
              nameError && "border-red-500 focus-visible:ring-red-500"
            )}
          />

          {nameError && <p className="text-sm text-red-500">{nameError}</p>}
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
            value={stepOne.campaignType}
            onValueChange={(v) => {
              setStepOne({
                campaignName: stepOne.campaignName,
                campaignType: v as CampaignType,
              });
              if (typeError) setTypeError(null);
            }}
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

          {typeError && <p className="text-sm text-red-500">{typeError}</p>}
        </div>

        {/* Submit / Next button */}
        <div className="flex justify-end w-full">
          <PrimaryButton
            onClick={() => {
              if (!validate()) return;
              increaseStep();
            }}
            className="max-w-24"
          >
            Next
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1;

//======= radio visual=========
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