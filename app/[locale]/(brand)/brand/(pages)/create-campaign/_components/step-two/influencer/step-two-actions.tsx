import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";

type StepTwoActionsProps = {
  onPrevious: () => void;
  onNext: () => void;
};

const StepTwoActions = ({ onPrevious, onNext }: StepTwoActionsProps) => {
  return (
    <div className="mt-10 flex justify-end gap-4">
      <SecondaryButton onClick={onPrevious}>Previous</SecondaryButton>
      <PrimaryButton onClick={onNext}>Next</PrimaryButton>
    </div>
  );
};

export default StepTwoActions;