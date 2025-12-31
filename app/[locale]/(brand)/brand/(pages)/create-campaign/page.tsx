"use client";
import CampaignBasicForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-basics-form";
import CampaignBudgetForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-budget-form";
import CampaignDetailsForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-details-form";
import CampaignPreferencesForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-preferences-form";
import CampaignUpload from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-upload";
import PlacementConfirmCard from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/placement-confirm-card";
import ReviewCampaign from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/review-campaign";
import Stepper from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/stepper";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoveLeft, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CampaignCreatePage = () => {
  const [step, setStep] = useState<number>(1);
  const [enabled, setEnabled] = useState<boolean>(false);
  const toggleOpen = useCampaignStore((s) => s.toggleOpen);
  const open = useCampaignStore((s) => s.open);

  return (
    <div className="space-y-3">
      {/*============= header ==================*/}
      <Card className="border-none">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 border-b pb-8">
            <div>
              <div className="flex gap-2 text-Primary font-semibold items-center">
                <span>
                  <Link href={"/"}>
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
              <PrimaryButton className="text-sm">Save As Draft</PrimaryButton>
              {step === 1 && (
                <SecondaryButton className="text-sm">Cencel</SecondaryButton>
              )}
            </div>
          </div>
        </CardHeader>

        {/* stepper */}
        <CardContent>
          <Stepper currentStep={step} />
        </CardContent>
      </Card>
      {/*============= midlle ==================*/}
      <Card className="text-orange font-semibold text-center flex items-center justify-center text-lg lg:text-xl border-none">
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
          <CampaignBasicForm />
        ) : step === 2 ? (
          <CampaignPreferencesForm />
        ) : step === 3 ? (
          <CampaignDetailsForm />
        ) : step === 4 ? (
          <CampaignBudgetForm />
        ) : step === 5 ? (
          <CampaignUpload />
        ) : (
          <ReviewCampaign />
        )}
      </div>

      {/*============= footer ==================*/}
      <Card className="border-none">
        <CardContent>
          <div className="flex justify-end items-center">
            {step === 5 && (
              <div className="space-y-3.5 w-full">
                <div className="flex gap-2 text-Primary items-center font-semibold">
                  <span>
                    <Trash size={16} />
                  </span>
                  <p>Do you need to send sample?</p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Label */}
                  <span className="text-light-green text-xs">
                    Need To Send Sample
                  </span>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => setEnabled(!enabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      enabled ? "bg-light-green" : "bg-light-gray"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        enabled ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* next steper button */}
            {step !== 6 ? (
              <div className="flex gap-4">
                {step !== 1 && (
                  <SecondaryButton onClick={() => setStep(step - 1)}>
                    Previous
                  </SecondaryButton>
                )}

                <PrimaryButton onClick={() => setStep((prev) => prev + 1)}>
                  Next
                </PrimaryButton>
              </div>
            ) : (
              <div className="w-full flex gap-4 lg:justify-center">
                <SecondaryButton className="lg:max-w-96">
                  Previous
                </SecondaryButton>
                <PrimaryButton className="lg:max-w-96" onClick={toggleOpen}>
                  Get Quote
                </PrimaryButton>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {open && (
        <div className="absolute top-30 z-50 left-1/2 -translate-x-1/2">
          <PlacementConfirmCard />
        </div>
      )}
    </div>
  );
};

export default CampaignCreatePage;
