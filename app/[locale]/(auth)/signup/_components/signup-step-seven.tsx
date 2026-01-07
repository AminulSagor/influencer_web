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
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import ImageUploader from "@/app/[locale]/(auth)/signup/_components/image-uploader";
import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";

type Props = {
  nextStep: () => void;
};

type SocialFormValues = {
  website?: string;
  nidFront?: FileList;
  nidBack?: FileList;
};

const SignUpStepSeven = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step7");
  const userType = useAuthStore((s) => s.userType);

  const methods = useForm<SocialFormValues>({
    defaultValues: {
      website: "",
      nidFront: undefined,
      nidBack: undefined,
    },
  });

  const onSubmit = (data: SocialFormValues) => {
    console.log("NID Front:", data.nidFront?.[0]);
    console.log("NID Back:", data.nidBack?.[0]);
    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-10 justify-between">
      {/* Left Content */}
      <div className="w-full md:w-1/2 pt-4">
        <div className="flex flex-col text-center lg:text-start lg:px-4">
          <div className="space-y-5 md:space-y-10">
            <h1 className="text-Primary text-4xl md:text-[45px] font-semibold">
              {userType === "brand" ? "Build Your Trust" : "Unlock Payout!"}
            </h1>
            <p className="text-2xl md:text-[23px] text-light-green font-semibold">
              {userType === "brand"
                ? "Let's get you ready to grow!"
                : "Let's get you ready to earn!"}
            </p>
            <p className="text-md md:text-[16px] text-Primary text-justify">
              {userType === "brand"
                ? "Just a quick check to make sure you're the real you! This ensures your money goes to the right place. We keep your info 100% private."
                : "This is a onetime security check to ensure payments are sent to the correct person. Your data is safe with us."}
            </p>
          </div>

          <Image
            src={"/auth-images/step-7-brand.png"}
            height={340}
            width={340}
            alt="brand-image"
            className="hidden md:block object-cover"
          />
        </div>
      </div>

      {/* Right Content */}
      <div className="rounded-xl md:p-4 w-full md:w-1/2">
        <div className="flex flex-col md:flex-row gap-4 text-Primary items-center">
          <Image
            src={"/auth-images/step-7-gaurd.png"}
            height={35}
            width={35}
            alt="logo-images"
            className="h-8"
          />
          <p className="text-justify">
            {t("securityText")}{" "}
            <span className="text-light-green ">{t("privacyPolicy")}</span>
          </p>
        </div>

        <div className="flex gap-4 text-Primary mt-10 items-center pb-4">
          <p className="font-semibold text-lg">{t("provideNidTitle")}</p>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={methods.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("nidLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("nidPlaceholder")}
                      {...field}
                      className="bg-white border py-3 font-normal focus-visible:ring-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ImageUploader
              label={t("nidFront")}
              name="nidFront"
              control={methods.control}
            />

            <ImageUploader
              label={t("nidBack")}
              name="nidBack"
              control={methods.control}
            />

            <Button
              type="submit"
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-10"
            >
              {t("continue")}
            </Button>
          </form>
        </Form>

        <div className="flex justify-end">
          <span
            className="text-light-green text-lg text-end mt-3 font-semibold cursor-pointer"
            onClick={nextStep}
          >
            {t("skip")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpStepSeven;
