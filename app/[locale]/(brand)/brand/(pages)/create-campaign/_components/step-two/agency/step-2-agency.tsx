"use client";

import AgencyListSection from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/agency-list-section";
import AgencySearchPicker from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/agency-search-picker";
import SelectedAgenciesTags from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/selected-agencies-tags";
import StepTwoAgencyActions from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/step-two-agency-actions";
import StepTwoAgencySelectField from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/step-two-agency-select-field";
import { useStepTwoAgency } from "@/app/[locale]/(brand)/brand/hooks/use-step-two-agency";
import { Card, CardContent } from "@/components/ui/card";

const StepTwoAgency = () => {
  const {
    campaignNiches,
    campaignNiche,
    agencyInput,
    agencySuggestions,
    selectedAgencies,
    recommendedAgencies,
    otherAgencies,
    hasMore,
    loadingAgencies,
    errors,
    setCampaignNiche,
    setAgencyInput,
    setAgencySuggestions,
    clearError,
    searchAgencies,
    addAgency,
    removeAgency,
    loadMoreAgencies,
    onNext,
    onPrevious,
  } = useStepTwoAgency();

  return (
    <Card className="border-none">
      <CardContent className="space-y-6">
        <StepTwoAgencySelectField
          label="Campaign Niche"
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

        <AgencyListSection
          title="Recommended Ad Agencies"
          agencies={recommendedAgencies}
          variant="horizontal"
          onSelect={addAgency}
        />

        <AgencyListSection
          title="Other Ad Agencies"
          agencies={otherAgencies}
          variant="vertical"
          onSelect={addAgency}
          onReachEnd={loadMoreAgencies}
          hasMore={hasMore}
          isLoading={loadingAgencies}
        />

        <StepTwoAgencyActions onPrevious={onPrevious} onNext={onNext} />
      </CardContent>
    </Card>
  );
};

export default StepTwoAgency;
