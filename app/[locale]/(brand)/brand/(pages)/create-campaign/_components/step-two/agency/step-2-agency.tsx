"use client";

import AgencyListSection from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/agency-list-section";
import AgencySearchPicker from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/agency-search-picker";
import SelectedAgenciesTags from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/selected-agencies-tags";
import StepTwoAgencyActions from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/step-two-agency-actions";
import StepTwoAgencySelectField from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/step-two-agency-select-field";
import { useStepTwoAgency } from "@/app/[locale]/(brand)/brand/hooks/use-step-two-agency";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const StepTwoAgency = () => {
  const t = useTranslations("brand.CreateCampaignsPage");

  const {
    campaignNiches,
    campaignNiche,
    agencyInput,
    agencySuggestions,
    selectedAgencies,
    recommendedAgencies,
    otherAgencies,
    recommendedHasMore,
    otherHasMore,
    loadingRecommendedAgencies,
    loadingOtherAgencies,
    errors,
    setCampaignNiche,
    setAgencyInput,
    setAgencySuggestions,
    clearError,
    searchAgencies,
    addAgency,
    removeAgency,
    loadMoreRecommendedAgencies,
    loadMoreOtherAgencies,
    onNext,
    onPrevious,
  } = useStepTwoAgency();

  return (
    <Card className="border-none">
      <CardContent className="space-y-6">
        <StepTwoAgencySelectField
          label={t("campaignNiche")}
          options={campaignNiches}
          value={campaignNiche}
          onChange={(value) => {
            setCampaignNiche(value);
            clearError("campaignNiche");
          }}
          error={errors.campaignNiche}
        />

        <AgencySearchPicker
          value={agencyInput}
          setValue={setAgencyInput}
          suggestions={agencySuggestions}
          setSuggestions={setAgencySuggestions}
          onSearch={searchAgencies}
          onSelect={addAgency}
          error={errors.selectedAgencies}
        />

        <SelectedAgenciesTags
          agencies={selectedAgencies}
          onRemove={removeAgency}
        />

        {(loadingRecommendedAgencies || recommendedAgencies.length > 0) && (
          <AgencyListSection
            title={t("recommendedAdAgencies")}
            agencies={recommendedAgencies}
            variant="horizontal"
            onSelect={addAgency}
            onReachEnd={loadMoreRecommendedAgencies}
            hasMore={recommendedHasMore}
            isLoading={loadingRecommendedAgencies}
          />
        )}

        <AgencyListSection
          title={t("otherAdAgencies")}
          agencies={otherAgencies}
          variant="vertical"
          onSelect={addAgency}
          onReachEnd={loadMoreOtherAgencies}
          hasMore={otherHasMore}
          isLoading={loadingOtherAgencies}
        />

        <StepTwoAgencyActions onPrevious={onPrevious} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default StepTwoAgency;
