"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const FinalStep = () => {
  const t = useTranslations("forgotPassword.finalStep");

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      {/* Checkmark with circle */}
      <div className="flex items-center justify-center gap-4">
        <div className="bg-Primary rounded-full w-8 h-8 flex items-center justify-center">
          <Check size={23} className="text-white" />
        </div>
        {/* Title */}
        <h1 className="text-Primary text-[32px] lg:text-[38px] font-semibold text-center">
          {t("title")}
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-[16px] text-light-green text-center">
        {t("subtitle")}
      </p>

      {/* Login Button */}

      <Button className="text-white bg-light-green hover:bg-Primary cursor-pointer h-16 w-full text-[18px] mt-6">
        <Link href={"/login"}> {t("button")}</Link>
      </Button>
    </div>
  );
};

export default FinalStep;
