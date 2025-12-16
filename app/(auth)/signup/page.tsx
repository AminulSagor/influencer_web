"use client";
import { GoArrowLeft } from "react-icons/go";
import { useState } from "react";
import SignUpStepOne from "@/app/(auth)/signup/_components/signup-step-one";
import SignUpStepTwo from "@/app/(auth)/signup/_components/sign-up-step-two";

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
      <div className="bg-white max-w-255 rounded-md shadow-md p-4 md:p-6 lg:p-8 min-h-205.5 h-full mx-auto border">
        {/* Header with back button and stepper */}
        <div className="flex">
          <button
            className="text-Primary cursor-pointer"
            onClick={decreaseStep}
            disabled={step === 1}
          >
            <GoArrowLeft size={23} />
          </button>

          {/* stepper */}
          <div className="w-full flex justify-center">
            <div className="flex items-center mt-4 gap-2">
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
            <SignUpStepOne nextstep={increaseStep} />
          ) : step === 2 ? (
            <SignUpStepTwo nextstep={increaseStep} />
          ) : (
            <div>Step 3 or other content</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
