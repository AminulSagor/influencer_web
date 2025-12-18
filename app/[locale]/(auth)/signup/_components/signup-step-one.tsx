"use client";

import LanguageSwitcher from "@/app/[locale]/(auth)/signup/_components/language-switcher";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";

type Props = {
  nextStep: () => void;
};

type User = {
  title: string;
  role: string;
};

const SignUpStepOne = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step1");

  // translation users
  const users: User[] = [
    {
      title: t("users.brand.title"),
      role: t("users.brand.role"),
    },
    {
      title: t("users.influencer.title"),
      role: t("users.influencer.role"),
    },
    {
      title: t("users.agency.title"),
      role: t("users.agency.role"),
    },
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      <div className="md:w-1/2">
        <div className="flex flex-col md:items-center text-start">
          <div className="md:w-auto lg:w-full lg:pl-16">
            <h1 className="text-Primary text-[52px] font-semibold">
              {t("title")}
            </h1>
            <p className="text-[18px] text-Primary border-Primary ">
              {t("subtitle")}
            </p>
          </div>

          <div className="gap-3">
            {users.map((user) => (
              <div
                key={user.title}
                onClick={() => setSelected(user.title)}
                className={`mt-3 border rounded-xl p-4 cursor-pointer h-31.5 sm:w-78.5
                flex justify-between items-center
                ${
                  selected === user.title
                    ? "bg-Secondary border-Primary"
                    : "bg-off-white"
                }
              `}
              >
                {/* Left content */}
                <div className="text-Primary">
                  <h1 className="font-semibold text-[26px]">{user.title}</h1>
                  <p>{user.role}</p>
                </div>

                {/* Right tick */}
                {selected === user.title && (
                  <FaCheck className="text-Primary text-xl" />
                )}
              </div>
            ))}
          </div>

          <Button
            className="text-white hover hover:bg-Primary cursor-pointer bg-light-green h-16 w-full sm:w-78.5 text-[18px] mt-10"
            onClick={() => nextStep()}
          >
            {t("continue")}
          </Button>
        </div>
        <p className="text-light-gray text-sm mt-5 text-center">
          {" "}
          Already have an account?{" "}
          <span className="text-black">
            {" "}
            <Link href={"/login"}>Login</Link>{" "}
          </span>{" "}
        </p>
      </div>

      <div className="hidden md:block border border-light-green rounded-xl p-2 w-1/2">
        <Image
          src={"/auth-images/step-1-brand-image.png"}
          height={428}
          width={428}
          alt="brand-image"
        />
        <div className="text-Primary text-[30px] font-semibold flex flex-col items-center justify-center">
          <h1 className="text-center">{t("rightTitle1")}</h1>
          <h1>{t("rightTitle2")}</h1>
        </div>
        <p className="text-Primary mt-3 text-[15px] text-center px-4 lg:px-8 h-18">
          {t("rightDescription")}
        </p>

        {/* language switcher */}
        <div className="flex justify-center mt-2">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default SignUpStepOne;
