"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

const FinalStep = () => {
  const t = useTranslations("Signup.finalStep");

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
          type="submit"
          className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 px-10 text-[18px] mt-10"
        >
          {t("cta")}
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;
