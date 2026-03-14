"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import clsx from "clsx";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import Loader from "@/components/spin-loader";
import { useCampaignStepOne } from "@/app/[locale]/(brand)/brand/hooks/useCampaignStepOne";
import { CampaignType } from "@/types/campaign/step1_campaign_basic_type";

const StepOne = () => {
  const {
    campaignName,
    campaignType,
    errors,
    loading,
    handleCampaignNameChange,
    handleCampaignTypeChange,
    handleSubmit,
  } = useCampaignStepOne({});

  const cardBase = "flex items-center justify-between rounded-xl border p-5 cursor-pointer transition";
  const activeCard = "border-Primary bg-[#F5F5DC]";
  const inactiveCard = "border-light-gray";

  const isPaid = campaignType === "paid_ad";
  const isInfluencer = campaignType === "influencer_promotion";

  return (
    <Card>
      <CardContent className="space-y-8">
        {/* Campaign Name */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">Campaign Name</h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <Input
            placeholder="Enter Campaign Name"
            value={campaignName}
            onChange={(e) => handleCampaignNameChange(e.target.value)}
            className={clsx(
              "h-12 focus-visible:ring-1",
              errors.campaignName && "border-red-500 focus-visible:ring-red-500"
            )}
          />

          {errors.campaignName && <p className="text-sm text-red-500">{errors.campaignName}</p>}
        </div>

        {/* Campaign Type */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-Primary">Campaign Type</h2>
            <Info className="w-4 h-4 text-gray-400" />
          </div>

          <RadioGroup
            value={campaignType}
            onValueChange={(value) => handleCampaignTypeChange(value as CampaignType)}
            className="space-y-4"
          >
            <Label className={clsx(cardBase, isPaid ? activeCard : inactiveCard)}>
              <div className="space-y-1 text-Primary">
                <p className="font-semibold text-base">Paid Ad</p>
                <p className="text-sm">Launch targeted advertising campaign</p>
              </div>
              <RadioGroupItem value="paid_ad" className="sr-only" />
              <RadioVisual checked={isPaid} />
            </Label>

            <Label className={clsx(cardBase, isInfluencer ? activeCard : inactiveCard)}>
              <div className="space-y-1 text-Primary">
                <p className="font-semibold text-base">Influencer promotion</p>
                <p className="text-sm">Partner with influencer for promotion</p>
              </div>
              <RadioGroupItem value="influencer_promotion" className="sr-only" />
              <RadioVisual checked={isInfluencer} />
            </Label>
          </RadioGroup>

          {errors.campaignType && <p className="text-sm text-red-500">{errors.campaignType}</p>}
        </div>

        {/* Submit button */}
        <div className="flex justify-end w-full">
          <PrimaryButton onClick={handleSubmit} className="max-w-[6rem] px-8" disabled={loading}>
            {loading ? <Loader className="h-4 w-4" /> : "Next"}
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
};

function RadioVisual({ checked }: { checked: boolean }) {
  return (
    <div
      className={clsx(
        "h-6 w-6 rounded-full border flex items-center justify-center",
        checked ? "border-light-green" : "border-gray-300"
      )}
    >
      {checked && <div className="h-3 w-3 rounded-full bg-light-green" />}
    </div>
  );
}

export default StepOne;
