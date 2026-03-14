import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";

type StepTwoAgencyActionsProps = {
  onPrevious: () => void;
  onNext: () => void;
};

const StepTwoAgencyActions = ({
  onPrevious,
  onNext,
}: StepTwoAgencyActionsProps) => {
  return (
    <div className="mt-6 flex justify-end gap-4">
      <SecondaryButton onClick={onPrevious}>Previous</SecondaryButton>
      <PrimaryButton onClick={onNext}>Next</PrimaryButton>
    </div>
  );
};

export default StepTwoAgencyActions;