"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";

import Loader from "@/components/spin-loader";

import { notifyError, notifySuccess } from "@/utils/toast_util";
import { handlePhoneFormat } from "@/utils/phone_util";
import { resendOtp, verifyOtp } from "@/api/auth/otp";
import { useAuthStore } from "@/store/auth_store";

type Props = {
  nextStep: () => void;
};

function extractToken(data: unknown): string | null {
  if (!data) return null;


  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const d: any = data;

  
    const t1 = d.token;
    if (typeof t1 === "string") return t1;

    const t2 = d.accessToken;
    if (typeof t2 === "string") return t2;

    const t3 = d.data?.token;
    if (typeof t3 === "string") return t3;

    const t4 = d.token?.accessToken;
    if (typeof t4 === "string") return t4;

    const t5 = d.data?.accessToken;
    if (typeof t5 === "string") return t5;
  }

  return null;
}

const SignUpStepThree = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step3");
  const phoneFromStore = useAuthStore((s) => s.phone);
  const setToken = useAuthStore((s) => s.setToken);

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = useMemo(() => codes.join(""), [codes]);
  const isOtpComplete = useMemo(
    () => codes.every((c) => c.trim().length === 1),
    [codes]
  );

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const next = [...codes];
      next[index] = value;
      setCodes(next);

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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").trim();
    if (!/^\d{4}$/.test(pasted)) return;

    const digits = pasted.split("");
    const next = [...codes];
    digits.forEach((d, i) => {
      if (i < 4) next[i] = d;
    });
    setCodes(next);
    inputRefs.current[3]?.focus();
  };

  const handleContinue = async () => {
    if (!isOtpComplete) {
      notifyError("Please enter the 4-digit code");
      return;
    }

    const formattedPhone = handlePhoneFormat(phoneFromStore || "");
    if (!formattedPhone) {
      notifyError("Phone number not found. Please sign up again.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp({ phone: formattedPhone, otp });

      if (res.status === 200 || res.status === 201) {
        const token = extractToken(res.data);

        if (!token) {
          notifyError("Token missing from server response. Please contact support.");
          return;
        }

        setToken(token);
        notifySuccess("OTP verified successfully");
        nextStep();
        return;
      }

      notifyError("OTP verification failed");
    } catch (e: any) {
      notifyError(e?.message ?? "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetOtp = async () => {
    setResendLoading(true);

    const formattedPhone = handlePhoneFormat(phoneFromStore || "");
    if (!formattedPhone) {
      notifyError("Phone number not found");
      setResendLoading(false);
      return;
    }

    try {
      const res = await resendOtp(formattedPhone);

      if (res.status === 200 || res.status === 201) {
        notifySuccess(`Otp sent again to ${formattedPhone}`);
      } else {
        notifyError("Failed to resend OTP");
      }
    } catch (e: any) {
      if (e?.status === 400 && e?.message === "Phone number is already verified") {
        notifyError("Phone number is already verified");
      } else {
        notifyError(e?.message ?? "Failed to resend OTP");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      {/* Left content */}
      <div className="md:w-1/2 flex flex-col items-center justify-center">
        <h1 className="text-Primary text-[32px] lg:text-[38px] text-center max-w-72 font-semibold">
          {t("title")}
        </h1>

        <p className="text-[16px] text-black mt-6 font-normal text-center">
          We send a code to {phoneFromStore}
        </p>

        {/* OTP boxes */}
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
                disabled={loading}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(index, e)
                }
                onPaste={handlePaste}
                className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-light-gray rounded-lg text-center text-Primary text-2xl font-semibold focus:outline-none focus:border-light-green focus:ring-1 focus:ring-light-green transition-colors disabled:opacity-60"
              />
            ))}
          </div>

          <p className="text-light-gray text-sm mt-4 text-center">
            {t("resend")}:{" "}
            <button
              type="button"
              className="text-black cursor-pointer font-medium hover:underline disabled:opacity-60"
              onClick={handleResetOtp}
              disabled={resendLoading}
            >
              {resendLoading ? "ReSending..." : t("resend")}
            </button>
          </p>
        </div>

        <Button
          type="button"
          className="text-white bg-light-green hover:bg-Primary cursor-pointer h-16 w-full sm:w-78.5 text-[18px] mt-10"
          onClick={handleContinue}
          disabled={loading || !isOtpComplete}
        >
          {loading ? <Loader /> : t("continue")}
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
