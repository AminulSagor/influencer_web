"use client";
import Step5 from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/step-5";
import Stepper from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/stepper";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import FinalStep from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/final-step";
import PlacementConfirmCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/placement-confirm-card";
import StepOne from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/step-1";
import StepTwoAgency from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/step-2";
import StepTwoInfluencer from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/step-2-influencer";
import StepThree from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/step-3";
import StepFour from "@/app/[locale]/(brand)/brand/(pages)/create-campaign-agency/_components/step-4";

const CreateCampaingAgencyPage = () => {
  const step = useCampaignStore((s) => s.step);
  const open = useCampaignStore((s) => s.open);
  const campaignType = useCampaignStore((s) => s.campaignType);

  // const open = useCampaignStore((s) => s.open);

  return (
    <div className="space-y-3">
      {/*============= header ==================*/}
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
                <h2>Create Campaign</h2>
              </div>
              <p className="text-dark-gray text-sm">
                Browse and manage your campaigns
              </p>
            </div>

            <div className="gap-4 flex items-start min-w-72">
              <PrimaryButton>Save As Draft</PrimaryButton>
              {step === 1 && <SecondaryButton>Cencel</SecondaryButton>}
            </div>
          </div>
        </CardHeader>

        {/* stepper */}
        <CardContent>
          <Stepper currentStep={step} />
        </CardContent>
      </Card>

      {/*============= midlle ==================*/}
      <Card className="text-orange font-semibold text-center flex items-center justify-center text-lg lg:text-xl">
        {step === 1 ? (
          <p>Set up the basics for your new campaign</p>
        ) : step === 2 ? (
          <>Provide your Preferences for this campaign</>
        ) : step === 3 ? (
          <p>Describe the requirements and provide a detailed brief.</p>
        ) : step === 4 ? (
          <p>Provide your budget and set milestones with placements</p>
        ) : step === 5 ? (
          <p>Upload you campaign Contents for the influencers</p>
        ) : (
          <p>REVIEW YOUR CAMPAIGN</p>
        )}
      </Card>

      {/*============= rendering compo based on steps ==================*/}
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
          <Step5 />
        ) : (
          <FinalStep />
        )}
      </div>

      {/* ============= footer ==================*/}

      {open && (
        <div className="absolute top-30 z-50 left-1/2 -translate-x-1/2">
          <PlacementConfirmCard />
        </div>
      )}
    </div>
  );
};

export default CreateCampaingAgencyPage;
