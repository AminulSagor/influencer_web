"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import type { CampaignType } from "@/app/[locale]/(brand)/brand/types/client-types";
import axiosInstance from "@/lib/axios";
import axios from "axios";
import Loader from "@/components/spin-loader";
import { notifyError } from "@/helpers/helper";
import { useToken } from "@/hooks/useGetToken";

const StepOne = () => {
  const increaseStep = useCampaignStore((s) => s.increaseStep);
  const setCampaignTypeInStore = useCampaignStore((s) => s.setCampaignType);
  const setCampaignId = useCampaignStore((s) => s.setCampaignId);
  const { token } = useToken();

  // local form state (default select paid-ad)
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState<CampaignType>("paid_ad");

  // errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // keep store in sync with default selection
    setCampaignTypeInStore("paid_ad");
  }, [setCampaignTypeInStore]);

  const isPaid = campaignType === "paid_ad";
  const isInfluencer = campaignType === "influencer_promotion";

  const cardBase =
    "flex items-center justify-between rounded-xl border p-5 cursor-pointer transition";
  const activeCard = "border-Primary bg-[#F5F5DC]";
  const inactiveCard = "border-light-gray";

  const validate = () => {
    let ok = true;

    if (!campaignName.trim()) {
      setNameError("Campaign name is required.");
      ok = false;
    } else {
      setNameError(null);
    }

    // default selected, kept for safety
    if (!campaignType) {
      setTypeError("Please select a campaign type.");
      ok = false;
    } else {
      setTypeError(null);
    }

    return ok;
  };

  //api calling
  const handleNext = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        campaignName: campaignName.trim(),
        campaignType,
      };

      const res = await axiosInstance.post("/campaign", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        setCampaignId(res.data?.data?.id);
      }

      // save campaign type in z-store for later usage
      setCampaignTypeInStore(payload.campaignType);

      increaseStep();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.";
        notifyError(message);
      }
    } finally {
      setLoading(false);
    }
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
            value={campaignName}
            onChange={(e) => {
              setCampaignName(e.target.value);
              if (nameError) setNameError(null);
            }}
            onBlur={() => {
              if (!campaignName.trim())
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
            value={campaignType}
            onValueChange={(v) => {
              const nextType = v as CampaignType;
              setCampaignType(nextType);

              if (typeError) setTypeError(null);
              setCampaignTypeInStore(nextType);
            }}
            className="space-y-4"
          >
            {/* Paid Ad */}
            <Label
              htmlFor="paid_ad"
              className={clsx(cardBase, isPaid ? activeCard : inactiveCard)}
            >
              <div className="space-y-1 text-Primary">
                <p className="font-semibold text-base">Paid Ad</p>
                <p className="text-sm">Launch targeted advertising campaign</p>
              </div>

              <RadioGroupItem
                id="paid_ad"
                value="paid_ad"
                className="sr-only"
              />
              <RadioVisual checked={isPaid} />
            </Label>

            {/* Influencer */}
            <Label
              htmlFor="influencer_promotion"
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
                id="influencer_promotion"
                value="influencer_promotion"
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
            onClick={handleNext}
            className="max-w-24 px-8"
            disabled={loading}
          >
            {loading ? <Loader className="h-4 w-4" /> : "Next"}
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepOne;

// radio visual
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
