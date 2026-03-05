import { useState } from "react";
import { StepTwoData, useFormStore } from "../zustand-store/campaign-forms-store";
import { StepTwoPayload } from "@/types/campaign/step2_campaign_type";
import { CampaignService } from "@/api/campaign/campaign-service";
import { useCampaignStore } from "../zustand-store/create-Campaign-Store";

interface Options {
  onSuccess?: () => void;
}

export const useCampaignStepTwo = ({ onSuccess }: Options) => {
  const stepTwo = useFormStore((state) => state.stepTwo);
  const setStepTwo = useFormStore((state) => state.setStepTwo);
  const increaseStep = useCampaignStore((s) => s.increaseStep);
  const campaignId = useCampaignStore((s) => s.campaignId); // get campaignId from store
  const setCampaignId = useCampaignStore((s) => s.setCampaignId);

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof StepTwoData, value: any) => {
    setStepTwo({ [field]: value });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (!campaignId) {
      console.error("campaignId is undefined! Make sure it's set in the store.");
      setErrors({ campaignId: "Campaign ID is required." });
      return;
    }

    setLoading(true);

    // validate required fields
    const nextErrors: Record<string, string> = {};
    if (!stepTwo.productType) nextErrors.productType = "Required";
    if (!stepTwo.campaignNiche) nextErrors.campaignNiche = "Required";

    // validate influencer IDs (must be UUIDs)
    if (!stepTwo.preferredInfluencerIds || !stepTwo.preferredInfluencerIds.length) {
      nextErrors.preferredInfluencerIds = "At least one preferred influencer is required.";
    }
    if (!stepTwo.notPreferableInfluencerIds || !stepTwo.notPreferableInfluencerIds.length) {
      nextErrors.notPreferableInfluencerIds = "At least one not preferable influencer is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    try {
      const payload: StepTwoPayload = {
        productType: stepTwo.productType,
        campaignNiche: stepTwo.campaignNiche,
        preferredInfluencerIds: stepTwo.preferredInfluencerIds, // must be UUIDs
        notPreferableInfluencerIds: stepTwo.notPreferableInfluencerIds, // must be UUIDs
      };

      console.log("Submitting Step 2 payload:", payload, "campaignId:", campaignId);

      await CampaignService.updateStepTwo(campaignId, payload);
      increaseStep();
      onSuccess?.();
    } catch (err: any) {
      console.error("Step 2 update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return { stepTwo, errors, loading, handleChange, handleSubmit, setCampaignId };
};
