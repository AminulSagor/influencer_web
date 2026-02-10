"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/spin-loader";

import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";

import { handlePhoneFormat } from "@/utils/phone_util";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import {
  buildSignupSchema,
  type SignupFormValues,
} from "@/schemas/signup_schema";
import { UserRole } from "@/types/auth/role_type";
import { apiClient } from "@/api/base/axios_client";
import { signup } from "@/api/auth/signup";

type Props = {
  nextStep: () => void;
};

type Response = {
  status?: number;
};

const SignUpStepTwo = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step2");
  const userType = useAuthStore((s) => s.userType) as UserRole;
  const setPhone = useAuthStore((s) => s.setPhone);

  const [loading, setLoading] = useState(false);

  const schema = useMemo(() => buildSignupSchema(userType), [userType]);

  const methods = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      brandName: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setLoading(true);

    const formattedPhone = handlePhoneFormat(data.phone);
    setPhone(formattedPhone);

    const payload: SignupFormValues & { role: UserRole } = {
      ...data,
      phone: formattedPhone,
      role: userType,
    };

    if (userType !== "client") {
      delete (payload as { brandName?: string }).brandName;
    }

    try {
    const res = await signup(payload);

    if (res.status === 201) {
      notifySuccess(`Verification Code Sent on ${formattedPhone}`);
      nextStep();
    }
  } catch (error: any) {
    notifyError(error.message);
  } finally {
    setLoading(false);
  }
  };

  const fields = [
    ...(userType === "client"
      ? [
          {
            name: "brandName",
            label: t("fields.brandName.label"),
            placeholder: t("fields.brandName.placeholder"),
            type: "text",
          },
        ]
      : []),
    {
      name: "firstName",
      label: t("fields.firstName.label"),
      placeholder: t("fields.firstName.placeholder"),
      type: "text",
    },
    {
      name: "lastName",
      label: t("fields.lastName.label"),
      placeholder: t("fields.lastName.placeholder"),
      type: "text",
    },
    {
      name: "email",
      label: t("fields.email.label"),
      placeholder: t("fields.email.placeholder"),
      type: "email",
    },
    {
      name: "phone",
      label: t("fields.phone.label"),
      placeholder: "1648936921",
      type: "text",
    },
    {
      name: "password",
      label: t("fields.password.label"),
      placeholder: t("fields.password.placeholder"),
      type: "password",
    },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="w-full md:w-1/2 lg:px-8">
        <h1 className="text-Primary text-[32px] lg:text-[38px] font-semibold">
          {userType === "client"
            ? t("title")
            : userType === "influencer"
            ? "Hello, Influencer!"
            : userType === "agency"
            ? "Hey Agency"
            : ""}
        </h1>

        <p className="text-[18px] text-Primary mt-2 font-normal">
          {userType === "client" ? t("subtitle") : "Let's Get You Set Up!"}
        </p>

        <h2 className="text-Primary text-[15px] font-semibold mt-3">
          {t("profileDetails")}
        </h2>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {fields.map((f) => (
              <FormField
                key={f.name}
                control={methods.control}
                name={f.name as keyof SignupFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-light-green">
                      {f.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={f.type}
                        placeholder={f.placeholder}
                        className="bg-white w-full border py-5 focus:outline-none font-normal focus-visible:ring-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              disabled={loading}
              className="text-white bg-light-green h-12 w-full text-[18px] hover:bg-Primary cursor-pointer"
            >
              {loading ? <Loader /> : t("continue")}
            </Button>
          </form>
        </Form>

        <p className="text-light-gray text-sm mt-5 text-center">
          Already have an account?{" "}
          <span className="text-black">
            <Link href="/login">Login</Link>
          </span>
        </p>
      </div>

      <div className="hidden md:block w-full md:w-1/2 border border-light-green rounded-xl p-2 py-10 pb-20">
        <Image
          src="/auth-images/step-2-brand-image.png"
          height={428}
          width={428}
          alt="brand-image"
        />
        <div className="text-Primary text-[30px] font-semibold text-center mt-4">
          <h1>{t("rightTitle")}</h1>
        </div>
        <p className="text-Primary mt-4 text-[15px] text-center px-4">
          {t("rightDescription")}
        </p>
      </div>
    </div>
  );
};

export default SignUpStepTwo;
