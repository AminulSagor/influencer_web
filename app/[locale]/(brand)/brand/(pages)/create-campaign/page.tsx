"use client";

import FinalStep from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-six/final-step";
import StepOne from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-one/step-1";
import StepTwoAgency from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/agency/step-2-agency";
import StepTwoInfluencer from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-two/influencer/step-2-influencer";
import StepThree from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-three/step-3";
import StepFour from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-four/step-4";
import StepFive from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/step-five/step-5";
import Stepper from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/stepper";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const CreateCampaingAgencyPage = () => {
  const t = useTranslations("brand.CreateCampaignsPage");
  const step = useCampaignStore((s) => s.step);
  const campaignType = useCampaignStore((s) => s.campaignType);

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b pb-8">
            <div>
              <div className="flex gap-2 text-Primary font-semibold items-center">
                <span>
                  <Link href={"/brand/campaigns"}>
                    <MoveLeft />
                  </Link>
                </span>
                <h2>{t("createCampaign")}</h2>
              </div>
              <p className="text-dark-gray text-sm">
                {t("browseAndManageYourCampaigns")}
              </p>
            </div>

            <div className="gap-4 flex items-start min-w-72">
              <PrimaryButton>{t("saveAsDraft")}</PrimaryButton>
              {step === 1 && <SecondaryButton>{t("cancel")}</SecondaryButton>}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Stepper currentStep={step} />
        </CardContent>
      </Card>

      <Card className="text-orange font-semibold text-center flex items-center justify-center text-lg lg:text-xl">
        {step === 1 ? (
          <p>{t("stepOneDescription")}</p>
        ) : step === 2 ? (
          <>{t("stepTwoDescription")}</>
        ) : step === 3 ? (
          <p>{t("stepThreeDescription")}</p>
        ) : step === 4 ? (
          <p>{t("stepFourDescription")}</p>
        ) : step === 5 ? (
          campaignType === "influencer_promotion" ? (
            <p>{t("stepFiveInfluencerDescription")}</p>
          ) : (
            <p>{t("stepFiveAgencyDescription")}</p>
          )
        ) : (
          <p>{t("reviewYourCampaign")}</p>
        )}
      </Card>

      <div>
        {step === 1 ? (
          <StepOne />
        ) : step === 2 ? (
          campaignType === "influencer_promotion" ? (
            <StepTwoInfluencer />
          ) : (
            <StepTwoAgency />
          )
        ) : step === 3 ? (
          <StepThree />
        ) : step === 4 ? (
          <StepFour />
        ) : step === 5 ? (
          <StepFive />
        ) : (
          <FinalStep />
        )}
      </div>
    </div>
  );
};

export default CreateCampaingAgencyPage;
