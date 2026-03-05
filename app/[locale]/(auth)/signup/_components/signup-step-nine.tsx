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
import { useState } from "react";
import Loader from "@/components/spin-loader";
import { useOnboardingStore } from "@/store/onboarding_store";
import { useAuthStore } from "@/store/auth_store";

type Props = {
  nextStep: () => void;
};

type FormDataWithFiles = {
  tinNumber?: string;
  tinImage?: FileList;
  binNumber?: string;
};

const SignUpStepNine = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step9");
  const [loading, setLoading] = useState(false);
  const userType = useAuthStore((s) => s.userType);
  
  // Use the onboarding store - add TIN/BIN fields
  const { tinNumber, tinImage, binNumber, setTinBinInfo } = useOnboardingStore();

  const methods = useForm<FormDataWithFiles>({
    defaultValues: {
      tinNumber: tinNumber || "",
      tinImage: undefined,
      binNumber: binNumber || "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = (formData: FormDataWithFiles) => {
    setLoading(true);

    try {
      // Store TIN/BIN info in Zustand store - EXACTLY LIKE OTHER STEPS
      setTinBinInfo({
        tinNumber: formData.tinNumber || "",
        tinImage: formData.tinImage?.[0] ? "pending-upload" : "",
        binNumber: formData.binNumber || "",
      });

      // Move to next step - NO API CALL
      nextStep();
    } catch (error: unknown) {
      console.error("Error in step 9:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-10 justify-between mt-4">
      <div className="w-full md:w-1/2 pt-4">
        <div className="flex flex-col text-center lg:text-start lg:px-4">
          <div className="space-y-5 md:space-y-10">
            <h1 className="text-Primary text-4xl md:text-[45px] font-semibold">
              {t("title")}
            </h1>
            <p className="text-2xl md:text-[23px] text-light-green font-semibold">
              {t("subtitle")}
            </p>
            <p className="text-md md:text-[18px] text-Primary text-justify">
              {t("description")}
            </p>
          </div>

          <Image
            src="/auth-images/step-9-brand.png"
            height={340}
            width={340}
            alt="brand-image"
            className="hidden md:block object-cover"
          />
        </div>
      </div>

      <div className="rounded-xl md:p-4 w-full md:w-1/2">
        <div className="flex flex-col md:flex-row gap-4 text-Primary items-center">
          <Image
            src="/auth-images/step-7-gaurd.png"
            height={45}
            width={45}
            alt="security"
            className="h-10"
          />
          <p className="text-justify">
            {t("securityText")}{" "}
            <span className="text-light-green">{t("privacyPolicy")}</span>
          </p>
        </div>

        <div className="flex gap-4 text-Primary mt-10 items-center pb-4">
          <p className="font-semibold text-lg">{t("provideTinTitle")}</p>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={methods.control}
              name="tinNumber"
              // Remove required validation to make it optional
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("tinLabel")} (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("tinPlaceholder")}
                      {...field}
                      className="bg-white border py-3 font-normal focus-visible:ring-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ImageUploader<FormDataWithFiles>
              label={`${t("tinUpload")} (optional)`}
              name="tinImage"
              control={methods.control}
              // Remove required validation
            />

            <FormField
              control={methods.control}
              name="binNumber"
              // Remove required validation to make it optional
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("binLabel")} (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("binPlaceholder")}
                      {...field}
                      className="bg-white border py-3 font-normal focus-visible:ring-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-10"
              disabled={loading}
            >
              {loading ? <Loader /> : t("continue")}
            </Button>
          </form>
        </Form>

        <div className="flex justify-end">
          <span
            className="text-light-green text-lg text-end mt-3 font-semibold cursor-pointer"
            onClick={() => {
              // Skip step - store empty values
              setTinBinInfo({
                tinNumber: "",
                tinImage: "",
                binNumber: "",
              });
              nextStep();
            }}
          >
            {t("skip")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpStepNine;