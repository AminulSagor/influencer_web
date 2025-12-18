"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

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
      <Link href="/login" className="w-full sm:w-78.5">
        <Button className="text-white bg-light-green hover:bg-Primary cursor-pointer h-16 w-full text-[18px] mt-6">
          {t("button")}
        </Button>
      </Link>
    </div>
  );
};

export default FinalStep;
