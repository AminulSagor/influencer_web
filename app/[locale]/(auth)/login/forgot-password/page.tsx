"use client";

import ForgotPasswordStepOne from "@/app/[locale]/(auth)/login/_components/forgot-password-step-one";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import ForgotPasswordStepTwo from "@/app/[locale]/(auth)/login/_components/forgot-password-step-two";
import ForgotPasswordStepThree from "@/app/[locale]/(auth)/login/_components/forgot-password-step-three";
import FinalStep from "@/app/[locale]/(auth)/login/_components/forgot-password-final-step";

const ForgotPasswordPage = () => {
  const t = useTranslations("forgotPassword");
  const [step, setStep] = useState<number>(1);

  const increaseStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-Secondary p-2 sm:p-4 md:p-6">
      <div className="bg-white max-w-255 md:min-w-2xl rounded-md shadow-md p-4 md:p-6 lg:px-9 min-h-190 h-full mx-auto flex flex-col items-center justify-center">
        <div>
          {step === 1 ? (
            <ForgotPasswordStepOne nextStep={increaseStep} />
          ) : step === 2 ? (
            <ForgotPasswordStepTwo nextStep={increaseStep} />
          ) : step === 3 ? (
            <ForgotPasswordStepThree nextStep={increaseStep} />
          ) : (
            <FinalStep />
          )}
        </div>

        {/* footer area */}

        <div className={`${step > 3 && "hidden"}`}>
          <Link href={"/login"}>
            <p className="text-Primary flex items-center justify-center gap-4 mt-4">
              <FaArrowLeftLong size={20} />
              <span>{t("footer.backToLogin")}</span>
            </p>
          </Link>

          <p className="text-sm text-center text-light-gray mt-10 md:mt-20">
            {t("footer.noAccount")}{" "}
            <Link
              href="/signup"
              className="text-black font-medium hover:underline"
            >
              {t("footer.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
