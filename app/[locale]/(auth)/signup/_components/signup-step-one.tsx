"use client";

import LanguageSwitcher from "@/app/[locale]/(auth)/signup/_components/language-switcher";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";
import { notifyError } from "@/helpers/helper";
import { UserRole } from "@/types/auth/role_type";

type Props = {
  nextStep: () => void;
};

type User = {
  key: UserRole;
  title: string;
  role: string;
};

const SignUpStepOne = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step1");
  const { setUserType } = useAuthStore();

  // selected now UserType
  const [selected, setSelected] = useState<UserRole>(null);

  const users: User[] = [
    {
      key: "client",
      title: t("users.brand.title"),
      role: t("users.brand.role"),
    },
    {
      key: "influencer",
      title: t("users.influencer.title"),
      role: t("users.influencer.role"),
    },
    {
      key: "agency",
      title: t("users.agency.title"),
      role: t("users.agency.role"),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      <div className="md:w-1/2 flex flex-col md:items-center">
        <div className="">
          <div className="md:w-auto lg:w-full">
            <h1 className="text-Primary text-4xl lg:text-[52px] font-semibold text-center md:text-start">
              {t("title")}
            </h1>
            <p className="text-[18px] text-Primary border-Primary hidden md:block">
              {t("subtitle")}
            </p>
          </div>

          <div className="md:hidden mt-4">
            <div className="text-Primary text-2xl font-semibold flex flex-col items-center justify-center">
              <h1 className="text-center">{t("rightTitle1")}</h1>
              <h1>{t("rightTitle2")}</h1>
            </div>
            <p className="text-Primary mt-3 text-base text-center lg:px-8 h-18">
              {t("rightDescription")}
            </p>

            <div className="flex justify-center mt-7">
              <LanguageSwitcher />
            </div>
          </div>

          <p className="text-[18px] text-Primary border-Primary md:hidden mt-7 ">
            {t("subtitle")}
          </p>

          <div className="gap-3">
            {users.map((user) => (
              <div
                key={user.key}
                onClick={() => {
                  setSelected(user.key);
                  setUserType(user.key);
                }}
                className={`mt-3 border rounded-xl p-4 cursor-pointer h-31.5 md:w-78.5
                flex justify-between items-center
                ${
                  selected === user.key
                    ? "bg-Secondary border-Primary"
                    : "bg-off-white"
                }
              `}
              >
                <div className="text-Primary">
                  <h1 className="font-semibold text-[26px]">{user.title}</h1>
                  <p>{user.role}</p>
                </div>

                {selected === user.key && (
                  <FaCheck className="text-Primary text-xl" />
                )}
              </div>
            ))}
          </div>

          <Button
            className="text-white hover hover:bg-Primary cursor-pointer bg-light-green h-16 w-full md:w-78.5 text-[18px] mt-10"
            onClick={() => {
              if (!selected) {
                notifyError("Please select a user to continue.");
                return;
              }
              nextStep();
            }}
          >
            {t("continue")}
          </Button>
        </div>

        <p className="text-light-gray text-sm mt-5 text-center">
          {t("Already have an account")}{" "}
          <span className="text-black">
            <Link href={"/login"} className="hover:border-b border-black">
              Login
            </Link>
          </span>
        </p>
      </div>

      <div className="hidden md:block border border-light-green rounded-xl p-2 w-1/2">
        <Image
          src={"/auth-images/step-1-brand-image.png"}
          height={428}
          width={428}
          alt="brand-image"
          loading="eager"
        />
        <div className="text-Primary text-[30px] font-semibold flex flex-col items-center justify-center">
          <h1 className="text-center">{t("rightTitle1")}</h1>
          <h1>{t("rightTitle2")}</h1>
        </div>
        <p className="text-Primary mt-3 text-[15px] text-center px-4 lg:px-8 h-18">
          {t("rightDescription")}
        </p>

        <div className="flex justify-center mt-2">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default SignUpStepOne;
