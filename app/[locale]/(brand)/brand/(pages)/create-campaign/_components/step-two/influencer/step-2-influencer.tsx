"use client";

import InfluencerPicker from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/influencer/influencer-picker";
import StepTwoActions from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/influencer/step-two-actions";
import StepTwoSelectField from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/influencer/step-two-select-field";
import { useStepTwoInfluencer } from "@/app/[locale]/(brand)/brand/hooks/use-step-two-influencer";
import { Card, CardContent } from "@/components/ui/card";

const StepTwoInfluencer = () => {
  const {
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
  } = useStepTwoInfluencer();

  return (
    <Card className="relative border-none">
      <CardContent className="space-y-8">
        <StepTwoSelectField
          label="Product Type"
          options={productTypes}
          value={productType}
          onChange={(value) => {
            setProductType(value);
            clearError("productType");
          }}
          error={errors.productType}
        />

        <StepTwoSelectField
          label="Campaign Niche"
          options={campaignNiches}
          value={campaignNiche}
          onChange={(value) => {
            setCampaignNiche(value);
            clearError("campaignNiche");
          }}
          error={errors.campaignNiche}
        />

        <InfluencerPicker
          label="Preferred Influencers"
          value={preferredInput}
          setValue={setPreferredInput}
          selected={preferred}
          setSelected={setPreferred}
          suggestions={preferredSuggestions}
          setSuggestions={setPreferredSuggestions}
          onSearch={(query) => searchInfluencers(query, true)}
          onClearError={() => clearError("preferred")}
          error={errors.preferred}
        />

        <InfluencerPicker
          label="Not Preferable Influencers"
          value={notPreferredInput}
          setValue={setNotPreferredInput}
          selected={notPreferred}
          setSelected={setNotPreferred}
          suggestions={notPreferredSuggestions}
          setSuggestions={setNotPreferredSuggestions}
          onSearch={(query) => searchInfluencers(query, false)}
          onClearError={() => clearError("notPreferred")}
          error={errors.notPreferred}
        />

        <StepTwoActions onPrevious={onPrevious} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default StepTwoInfluencer;
