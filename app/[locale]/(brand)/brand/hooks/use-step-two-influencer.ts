"use client";

import { useEffect, useState } from "react";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { notifyError } from "@/utils/toast_util";
import { CampaignService } from "@/service/campaign/campaign-service";
import { serviceClient } from "@/service/base/axios_client";

type Influencer = { id: string; fullName: string };
type FieldErrors = Partial<
  Record<"productType" | "campaignNiche" | "preferred" | "notPreferred", string>
>;

export const useStepTwoInfluencer = () => {
  const { increaseStep, decreaseStep } = useCampaignStore();
  const campaignId = useCampaignStore((s) => s.campaignId);

  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [campaignNiches, setCampaignNiches] = useState<string[]>([]);
  const [productType, setProductType] = useState("");
  const [campaignNiche, setCampaignNiche] = useState("");
  const [preferredInput, setPreferredInput] = useState("");
  const [notPreferredInput, setNotPreferredInput] = useState("");
  const [preferred, setPreferred] = useState<Influencer[]>([]);
  const [notPreferred, setNotPreferred] = useState<Influencer[]>([]);
  const [preferredSuggestions, setPreferredSuggestions] = useState<
    Influencer[]
  >([]);
  const [notPreferredSuggestions, setNotPreferredSuggestions] = useState<
    Influencer[]
  >([]);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [types, niches] = await Promise.all([
          CampaignService.getProductTypes(),
          CampaignService.getCampaignNiches(),
        ]);

        setProductTypes(types);
        setCampaignNiches(niches);
      } catch (err: any) {
        notifyError(err.message || "Failed to load step two data");
      }
    };

    fetchInitialData();
  }, []);

  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const searchInfluencers = async (query: string, isPreferred: boolean) => {
    if (!query.trim()) {
      if (isPreferred) {
        setPreferredSuggestions([]);
      } else {
        setNotPreferredSuggestions([]);
      }
      return;
    }

    try {
      const response = await serviceClient.get("/client/search/influencers", {
        params: { query },
      });

      const data: Influencer[] = Array.isArray(response.data)
        ? response.data
        : [];

      if (isPreferred) {
        setPreferredSuggestions(data);
      } else {
        setNotPreferredSuggestions(data);
      }
    } catch (err) {
      console.error("Influencer search failed:", err);
    }
  };

  const validateAll = () => {
    const nextErrors: FieldErrors = {};

    if (!productType) {
      nextErrors.productType = "Please select a product type.";
    }

    if (!campaignNiche) {
      nextErrors.campaignNiche = "Please select a campaign niche.";
    }

    if (preferred.length === 0) {
      nextErrors.preferred = "Add at least 1 preferred influencer.";
    }

    if (notPreferred.length === 0) {
      nextErrors.notPreferred = "Add at least 1 not preferable influencer.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onNext = async () => {
    if (!campaignId) {
      notifyError("Campaign ID is missing.");
      return;
    }

    if (!validateAll()) return;

    try {
      await CampaignService.updateStepTwo(campaignId, {
        productType,
        campaignNiche,
        preferredInfluencers: preferred.map((item) => item.fullName),
        notPreferableInfluencers: notPreferred.map((item) => item.fullName),
      });

      increaseStep();
    } catch (err: any) {
      notifyError(err.message || "Failed to save step 2");
      console.error(err);
    }
  };

  const onPrevious = () => {
    decreaseStep();
  };

  return {
    productTypes,
    campaignNiches,
    productType,
    campaignNiche,
    preferredInput,
    notPreferredInput,
    preferred,
    notPreferred,
    preferredSuggestions,
    notPreferredSuggestions,
    errors,
    setProductType,
    setCampaignNiche,
    setPreferredInput,
    setNotPreferredInput,
    setPreferred,
    setNotPreferred,
    setPreferredSuggestions,
    setNotPreferredSuggestions,
    clearError,
    searchInfluencers,
    onNext,
    onPrevious,
  };
};
