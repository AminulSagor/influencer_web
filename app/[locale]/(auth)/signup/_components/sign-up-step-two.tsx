"use client";

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
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";

type Props = {
  nextStep: () => void;
};

type SignUpFormValues = {
  brandName?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

const SignUpStepTwo = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step2");
  const userType = useAuthStore((s) => s.userType);

  const signUpDefaultValue: SignUpFormValues = {
    brandName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  };

  const methods = useForm<SignUpFormValues>({
    defaultValues: signUpDefaultValue,
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log(data);
    nextStep();
  };

  // Fields array
  const fields = [
    ...(userType === "brand"
      ? [
          {
            name: "brandName",
            label: t("fields.brandName.label"),
            placeholder: t("fields.brandName.placeholder"),
          },
        ]
      : []),
    {
      name: "firstName",
      label: t("fields.firstName.label"),
      placeholder: t("fields.firstName.placeholder"),
    },
    {
      name: "lastName",
      label: t("fields.lastName.label"),
      placeholder: t("fields.lastName.placeholder"),
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
      placeholder: t("fields.phone.placeholder"),
    },
    {
      name: "password",
      label: t("fields.password.label"),
      placeholder: t("fields.password.placeholder"),
      type: "password",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between">
      {/* Left content */}
      <div className="md:w-1/2 lg:px-8">
        <h1 className="text-Primary text-[32px] lg:text-[38px] font-semibold">
          {userType === "brand"
            ? t("title")
            : userType === "influencer"
            ? t("Hello, Influencer!")
            : userType === "agency"
            ? "Hey Agency"
            : ""}
        </h1>
        <p className="text-[18px] text-Primary mt-2 font-normal">
          {userType === "brand" ? t("subtitle") : t("Let's Get You Set Up!")}
        </p>

        <h2 className="text-Primary text-[15px] font-semibold mt-3">
          {t("profileDetails")}
        </h2>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={methods.control}
                name={field.name as keyof SignUpFormValues}
                rules={{ required: t(`fields.${field.name}.required`) }}
                render={({ field: hookField }) => (
                  <FormItem>
                    <FormLabel className="text-light-green">
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        className="bg-white border py-6 focus:outline-none font-normal focus-visible:ring-1"
                        {...hookField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              className="text-white bg-light-green h-12 w-full text-[18px] hover:bg-Primary cursor-pointer"
            >
              {t("continue")}
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

      {/* Right image */}
      <div className="hidden md:block md:w-1/2 border border-light-green rounded-xl p-2">
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
