"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

type Props = {
  nextStep: () => void;
};

const SignUpStepThree = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step3");

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

      digits.slice(0, 4).forEach((digit, index) => {
        newCodes[index] = digit;
      });

      setCodes(newCodes);

      if (digits.length >= 4) {
        inputRefs.current[3]?.focus();
      } else if (digits.length > 0) {
        inputRefs.current[digits.length]?.focus();
      }
    }
  };

  const handleContinue = () => {
    const code = codes.join("");
    if (code.length === 4) {
    }
    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      {/* Left content */}
      <div className="md:w-1/2 flex flex-col items-center justify-center">
        <h1 className="text-Primary text-[32px] lg:text-[38px] text-center max-w-72 font-semibold">
          {t("title")}
        </h1>
        <p className="text-[16px] text-black mt-6 font-normal text-center">
          {t("subtitle")}
        </p>

        {/* code send part */}
        <div className="mt-14">
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
          <p className="text-light-gray text-sm mt-4 text-center">
            {t("resend")}:{" "}
            <button className="text-black cursor-pointer font-medium hover:underline">
              {t("resend")}
            </button>
          </p>
        </div>

        <Button
          className="text-white bg-light-green hover:bg-Primary cursor-pointer h-16 w-full sm:w-78.5 text-[18px] mt-10"
          onClick={handleContinue}
        >
          {t("continue")}
        </Button>

        <p className="text-light-gray text-sm mt-12 text-center">
          Already have an account?{" "}
          <span className="text-black">
            <Link href="/login">Login</Link>
          </span>
        </p>
      </div>

      {/* Right image */}
      <div className="hidden md:block md:w-1/2 border border-light-green rounded-xl p-2 pb-20">
        <Image
          src="/auth-images/step-3-brand-image.png"
          height={428}
          width={428}
          alt="brand-image"
        />
        <div className="text-Primary text-[30px] text-center mt-4">
          <h1>{t("rightTitle")}</h1>
        </div>
        <p className="text-Primary mt-14 text-[15px] text-center px-4">
          {t("rightDescription")}
        </p>
      </div>
    </div>
  );
};

export default SignUpStepThree;
