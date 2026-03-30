import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useTranslations } from "next-intl";

type StepTwoActionsProps = {
  onPrevious: () => void;
  onNext: () => void;
};

const StepTwoActions = ({ onPrevious, onNext }: StepTwoActionsProps) => {
  const t = useTranslations("brand.CreateCampaignsPage");

  return (
    <div className="mt-10 flex justify-end gap-4">
      <SecondaryButton onClick={onPrevious}>{t("previous")}</SecondaryButton>
      <PrimaryButton onClick={onNext}>{t("next")}</PrimaryButton>
    </div>
  );
};

export default StepTwoActions;
