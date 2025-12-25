"use client";
import CampaignBasicForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-basics-form";
import CampaignBudgetForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-budget-form";
import CampaignDetailsForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-details-form";
import CampaignPreferencesForm from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/campaign-preferences-form";
import Stepper from "@/app/[locale]/(brand)/brand/(pages)/create-campaign/_components/stepper";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CampaignCreatePage = () => {
  const [step, setStep] = useState<number>(4);
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

            <div className="gap-4 flex ">
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
        ) : (
          <p></p>
        )}
      </Card>

      {/*============= rendering form based on steps ==================*/}
      <div>
        {step === 1 ? (
          <CampaignBasicForm />
        ) : step === 2 ? (
          <CampaignPreferencesForm />
        ) : step === 3 ? (
          <CampaignDetailsForm />
        ) : step === 4 ? (
          <CampaignBudgetForm />
        ) : (
          ""
        )}
      </div>

      {/*============= footer ==================*/}
      <Card className="border-none">
        <CardContent>
          <div className="flex gap-4 justify-end">
            {step !== 1 && (
              <SecondaryButton onClick={() => setStep(step - 1)}>
                Previous
              </SecondaryButton>
            )}

            <PrimaryButton onClick={() => setStep((prev) => prev + 1)}>
              Next
            </PrimaryButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignCreatePage;
