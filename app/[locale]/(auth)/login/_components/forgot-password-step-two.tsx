"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

type Props = {
  nextStep: () => void;
};

const ForgotPasswordStepTwo = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword.stepTwo");

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newCodes = [...codes];

      digits.forEach((digit, index) => {
        if (index < 4) newCodes[index] = digit;
      });

      setCodes(newCodes);
      inputRefs.current[3]?.focus();
    }
  };

  const handleContinue = () => {
    const code = codes.join("");
    console.log("Reset code:", code);
    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between max-w-112.5">
      <div className="flex-col items-center justify-center">
        <h1 className="text-Primary max-w-xl text-[32px] lg:text-[38px] text-center font-semibold">
          {t("title")}
        </h1>
        <p className="text-[16px] text-light-green font-normal text-center">
          {t("subtitle")}
        </p>

        <div className="mt-8">
          <div className="flex justify-center gap-3 sm:gap-4">
            {codes.map((code, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={code}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(index, e)
                }
                onPaste={handlePaste}
                className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-light-gray rounded-lg text-center text-Primary text-2xl font-semibold focus:outline-none focus:border-light-green focus:ring-1 focus:ring-light-green transition-colors"
              />
            ))}
          </div>
        </div>

        <Button
          className="text-white bg-light-green hover:bg-Primary cursor-pointer h-16 w-full text-[18px] mt-6"
          onClick={handleContinue}
        >
          {t("continue")}
        </Button>

        <p className="text-sm mt-4 text-center text-light-green">
          {t("resendText")}{" "}
          <button className="cursor-pointer text-Primary font-semibold hover:underline ">
            {t("resendAction")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordStepTwo;
