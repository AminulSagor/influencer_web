"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Props {
  nextStep: () => void;
}

const SignUpStepFour = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step4");

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      <div className="flex flex-col items-center justify-center md:p-6">
        <div className="relative mb-8">
          <div className="w-21.75 h-21.75 rounded-full bg-Primary flex items-center justify-center">
            <div className="relative">
              <Check
                className="w-12 h-12 text-white stroke-[3px]"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </div>
          </div>
        </div>

        {/* Verification text */}
        <div className="text-center flex items-center flex-col w-full">
          <h2 className="text-Primary text-2xl md:text-[35px] font-semibold mb-2 max-w-82">
            {t("title")}
          </h2>

          <p className="text-black mb-20 pt-20 text-[16px] max-w-md text-center ">
            {t("subtitle")}
          </p>
        </div>

        {/* Continue button */}
        <Button
          className="text-white bg-light-green h-16 w-full sm:w-78.5 text-[18px] mt-4 hover:bg-Primary cursor-pointer transition-colors"
          onClick={nextStep}
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default SignUpStepFour;
