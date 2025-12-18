"use client";
import { GoArrowLeft } from "react-icons/go";
import { useState } from "react";
import SignUpStepOne from "@/app/[locale]/(auth)/signup/_components/signup-step-one";
import SignUpStepTwo from "@/app/[locale]/(auth)/signup/_components/sign-up-step-two";
import SignUpStepThree from "@/app/[locale]/(auth)/signup/_components/sign-up-step-three";
import SignUpStepFour from "@/app/[locale]/(auth)/signup/_components/signup-step-four";
import SignUpStepFive from "@/app/[locale]/(auth)/signup/_components/signup-step-five";
import SignUpStepSix from "@/app/[locale]/(auth)/signup/_components/signup-step-six";
import SignUpStepSeven from "@/app/[locale]/(auth)/signup/_components/signup-step-seven";
import SignUpStepEight from "@/app/[locale]/(auth)/signup/_components/signup-step-eight";
import SignUpStepNine from "@/app/[locale]/(auth)/signup/_components/signup-step-nine";
import FinalStep from "@/app/[locale]/(auth)/signup/_components/final-step";

const SignUpPage = () => {
  const [step, setStep] = useState<number>(1);

  const increaseStep = () => {
    setStep(step + 1);
  };

  const decreaseStep = () => {
    setStep(step - 1);
  };

  return (
    // main container
    <div className=" md:flex items-center justify-center">
      <div className="bg-white max-w-255 rounded-md shadow-md p-4 md:p-6 lg:px-9 min-h-205.5 h-full mx-auto">
        {/* Header with back button and stepper */}
        <div className="flex items-center">
          <button
            className="text-Primary cursor-pointer"
            onClick={decreaseStep}
            disabled={step === 1}
          >
            <GoArrowLeft size={23} />
          </button>

          {/* stepper */}
          <div className="w-full flex justify-end md:justify-center ">
            <div className="flex items-center gap-2">
              {/* first line */}
              <span className="bg-Primary h-2 rounded-md w-14 inline-block"></span>

              {/* dots */}
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full ${
                    index + 1 <= step ? "bg-Primary" : "bg-light-green"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="p-4 lg:pt-6">
          {step === 1 ? (
            <SignUpStepOne nextStep={increaseStep} />
          ) : step === 2 ? (
            <SignUpStepTwo nextStep={increaseStep} />
          ) : step === 3 ? (
            <SignUpStepThree nextStep={increaseStep} />
          ) : step === 4 ? (
            <SignUpStepFour nextStep={increaseStep} />
          ) : step === 5 ? (
            <SignUpStepFive nextStep={increaseStep} />
          ) : step === 6 ? (
            <SignUpStepSix nextStep={increaseStep} />
          ) : step === 7 ? (
            <SignUpStepSeven nextStep={increaseStep} />
          ) : step === 8 ? (
            <SignUpStepEight nextStep={increaseStep} />
          ) : step === 9 ? (
            <SignUpStepNine nextStep={increaseStep} />
          ) : (
            <FinalStep />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
