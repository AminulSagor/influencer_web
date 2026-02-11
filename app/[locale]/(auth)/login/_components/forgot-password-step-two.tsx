"use client";

import { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/spin-loader";
import { useTranslations } from "next-intl";
import { useForgotPasswordStore } from "@/store/forgot-password_store";
import { verifyForgotPasswordOtp, requestForgotPasswordOtp } from "@/api/auth/forgot-password";
import { notifyError, notifySuccess } from "@/utils/toast_util";

type Props = {
  nextStep: () => void;
};

const ForgotPasswordStepTwo = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [codes, setCodes] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { identifier, otp, setOtp, setOtpDigit } = useForgotPasswordStore();

  useEffect(() => {
    setCodes(otp);
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);
      setOtpDigit(index, value);
      
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newCodes = pastedData.split("").slice(0, 4);
    
    const updatedCodes = [...codes];
    newCodes.forEach((char, idx) => {
      if (idx < 4 && /^\d$/.test(char)) {
        updatedCodes[idx] = char;
        setOtpDigit(idx, char);
      }
    });
    
    setCodes(updatedCodes);
    inputRefs.current[Math.min(newCodes.length, 3)]?.focus();
  };

  const handleContinue = async () => {
    if (codes.some(code => !code)) {
      notifyError("Please enter the complete OTP");
      return;
    }

    setLoading(true);
    try {
      const otpCode = codes.join("");
      console.log("Verifying OTP:", { identifier, otp: otpCode });
      
      // Verify OTP with backend
      await verifyForgotPasswordOtp(identifier, otpCode);
      
      // Save OTP to store for step 3
      setOtp(codes);
      
      notifySuccess("OTP verified successfully!");
      nextStep();
    } catch (error: any) {
      notifyError(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading2(true);
    try {
      await requestForgotPasswordOtp(identifier);
      notifySuccess("OTP resent successfully!");
    } catch (error: any) {
      notifyError(error.message || "Failed to resend OTP");
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between max-w-112.5">
      <div className="flex-col items-center justify-center">
        <h1 className="text-Primary max-w-xl text-[32px] lg:text-[38px] text-center font-semibold">
          {t("stepTwo.title")}
        </h1>
        <p className="text-[16px] text-light-green font-normal text-center">
          {t("stepTwo.subtitle")}
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
          disabled={loading}
        >
          {loading ? <Loader /> : t("stepTwo.continue")}
        </Button>

        <p className="text-sm mt-4 text-center text-light-green">
          {t("stepTwo.resendText")}{" "}
          <button
            className="cursor-pointer text-Primary font-semibold hover:underline "
            onClick={handleResendOtp}
            disabled={loading2}
          >
            {loading2 ? "Sending...." : t("stepTwo.resendAction")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordStepTwo;