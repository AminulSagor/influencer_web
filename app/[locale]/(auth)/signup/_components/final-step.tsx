"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding_store";
import { useState } from "react";
import Loader from "@/components/spin-loader";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import { submitOnboarding } from "@/api/onboarding";
import { useAuthStore } from "@/store/auth_store";

const FinalStep = () => {
  const t = useTranslations("Signup.finalStep");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { userType, clearAuth, token } = useAuthStore();
  const { toPayload } = useOnboardingStore();

  const getDashboardPath = () => {
    const locale = window.location.pathname.split("/")[1];

    switch (userType) {
      case "client":
        return `/${locale}/brand/dashboard`;
      case "influencer":
        return `/${locale}/influencer/dashboard`;
      case "agency":
        return `/${locale}/agency/dashboard`;
      default:
        return `/${locale}/login`;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = toPayload();
      if (token === null || userType === null) {
        notifyError("Missing token or user type. Cannot submit.");
        setLoading(false);
        return;
      }
      const response = await submitOnboarding(userType, payload, token);
      if (response.status === 200) {
        setTimeout(() => {
          clearAuth();
          const dashboardPath = getDashboardPath();
          router.push(dashboardPath);
        }, 1500);
      }
    } catch (err: any) {
      notifyError(
        err.message ||
        t("errorMessage") ||
        "Failed to complete onboarding"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:px-2">
      <h1 className="text-[30px] md:text-[48px] text-Primary font-semibold text-center">
        {t("title")}
      </h1>

      <div className="flex gap-7 justify-between mt-10">
        <div className="w-full md:w-1/2">
          <h2 className="text-[22px] text-light-green text-center md:text-start">
            {t("successTitle")}
          </h2>

          <p className="mt-4 text-Primary text-center md:text-start">
            {t("description")}
          </p>
          <div className="flex items-center justify-center md:hidden">
            <Image
              src="/auth-images/final-step-brand.png"
              height={220}
              width={220}
              alt="brand-image"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 text-Primary items-center mt-12 lg:mt-18">
            <Image
              src="/auth-images/final-step-light.png"
              height={45}
              width={45}
              alt="security"
              className="h-10"
            />
            <p className="text-justify text-light-green text-sm">
              {t("infoText")}
            </p>
          </div>
        </div>

        <div className="hidden md:block w-1/2 relative ">
          <Image
            src="/auth-images/final-step-brand.png"
            height={420}
            width={420}
            alt="brand-image"
            className="object-cover md:absolute md:right-0 md:-top-20"
          />
        </div>
      </div>

      <div className="flex items-center justify-center mt-10 lg:mt-16">
        <Button
          onClick={handleSubmit}
          className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 px-10 text-[18px] mt-10"
          disabled={loading}
        >
          {loading ? <Loader /> : t("cta")}
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;