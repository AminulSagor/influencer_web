"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding_store";
import { useState } from "react";
import Loader from "@/components/spin-loader";
import { notifyError } from "@/utils/toast_util";
import { submitOnboarding } from "@/service/onboarding";
import { useAuthStore } from "@/store/auth_store";

const FinalStep = () => {
  const t = useTranslations("Signup.finalStep");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { userType, token, isVerified } = useAuthStore();
  const { toPayload } = useOnboardingStore();

  const getRedirectPath = () => {
    const locale = window.location.pathname.split("/")[1];

    const root =
      userType === "client"
        ? "brand"
        : userType === "influencer"
          ? "influencer"
          : userType === "agency"
            ? "agency"
            : null;

    if (!root) {
      return `/${locale}/login`;
    }

    return isVerified
      ? `/${locale}/${root}/dashboard`
      : `/${locale}/${root}/unverified`;
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
        const redirectPath = getRedirectPath();

        router.push(redirectPath);
      }
    } catch (err: any) {
      notifyError(
        err.message || t("errorMessage") || "Failed to complete onboarding",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:px-2">
      <h1 className="text-[30px] text-Primary text-center font-semibold md:text-[48px]">
        {t("title")}
      </h1>

      <div className="mt-10 flex justify-between gap-7">
        <div className="w-full md:w-1/2">
          <h2 className="text-light-green text-center text-[22px] md:text-start">
            {t("successTitle")}
          </h2>

          <p className="text-Primary mt-4 text-center md:text-start">
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

          <div className="text-Primary mt-12 flex flex-col items-center gap-4 md:flex-row lg:mt-18">
            <Image
              src="/auth-images/final-step-light.png"
              height={45}
              width={45}
              alt="security"
              className="h-10"
            />

            <p className="text-light-green text-justify text-sm">
              {t("infoText")}
            </p>
          </div>
        </div>

        <div className="relative hidden w-1/2 md:block">
          <Image
            src="/auth-images/final-step-brand.png"
            height={420}
            width={420}
            alt="brand-image"
            className="object-cover md:absolute md:-top-20 md:right-0"
          />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center lg:mt-16">
        <Button
          onClick={handleSubmit}
          className="bg-light-green hover:bg-Primary mt-10 h-16 cursor-pointer px-10 text-[18px] text-white"
          disabled={loading}
        >
          {loading ? <Loader /> : t("cta")}
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;
