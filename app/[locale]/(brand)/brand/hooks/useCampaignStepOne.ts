import { useState } from "react";
import { useCampaignStore } from "../zustand-store/create-Campaign-Store";
import { notifyError } from "@/utils/toast_util";
import { CampaignService } from "@/api/campaign/campaign-service";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { CampaignType } from "@/types/campaign/step1_campaign_basic_type";

interface UseCampaignStepOneProps {
  onSuccess?: () => void;
}

interface FormErrors {
  campaignName?: string;
  campaignType?: string;
}

export const useCampaignStepOne = ({ onSuccess }: UseCampaignStepOneProps) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState<CampaignType>("paid_ad");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const setCampaignTypeInStore = useCampaignStore((s) => s.setCampaignType);
  const setCampaignId = useCampaignStore((s) => s.setCampaignId);
  const increaseStep = useCampaignStore((s) => s.increaseStep);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!campaignName.trim()) newErrors.campaignName = "Campaign name is required.";
    if (!campaignType) newErrors.campaignType = "Please select a campaign type.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCampaignNameChange = (value: string) => {
    setCampaignName(value);
    if (errors.campaignName) setErrors((prev) => ({ ...prev, campaignName: undefined }));
  };

  const handleCampaignTypeChange = (value: CampaignType) => {
    setCampaignType(value);
    setCampaignTypeInStore(value);
    if (errors.campaignType) setErrors((prev) => ({ ...prev, campaignType: undefined }));
  };

const handleSubmit = async () => {

  if (!validate()) return;

  setLoading(true);
  try {
    const payload = { campaignName: campaignName.trim(), campaignType };
    const response = await CampaignService.createBasicCampaign(payload);

    const campaignId = response.data.id; 
    if (campaignId) {
      setCampaignId(campaignId);
      increaseStep();
      onSuccess?.();
    } 
  } catch (error) {
    console.error("API call failed:", error);
  } finally {
    setLoading(false);
  }
};

  return {
    campaignName,
    campaignType,
    errors,
    loading,
    handleCampaignNameChange,
    handleCampaignTypeChange,
    handleSubmit,
  };
};
