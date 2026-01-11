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
import { useState } from "react";
import Loader from "@/components/spin-loader";
import axiosInstance from "@/lib/axios";
import { notifyError } from "@/helpers/helper";

type Props = {
  nextStep: () => void;
};

type TradeLicenseFormValues = {
  tradeLicenseNumber: string;
  tradeLicenseImg: string;
};

type FormDataWithFiles = {
  tradeLicenseNumber: string;
  tradeLicenseImg?: FileList;
};

type SignedUrlResponse = {
  success: boolean;
  message: string;
  signedUrl: string;
  fileKey: string;
  publicUrl: string;
};

const SignUpStepEight = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step8");
  const [loading, setLoading] = useState(false);
  const userType = useAuthStore((s) => s.userType);
  const token = useAuthStore((s) => s.token);

  const methods = useForm<FormDataWithFiles>({
    defaultValues: {
      tradeLicenseNumber: "",
      tradeLicenseImg: undefined,
    },
  });

  const getSignedUrl = async (file: File): Promise<string> => {
    const payload = {
      fileName: file.name,
      fileType: file.type,
      module: `${userType}/trade-license`,
    };

    const response = await axiosInstance.post<SignedUrlResponse>(
      "/upload/signed-url",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) {
      throw new Error("Failed to get signed URL");
    }

    return response.data.signedUrl;
  };

  const uploadToS3 = async (signedUrl: string, file: File): Promise<void> => {
    await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
  };

  const getPublicUrl = async (file: File): Promise<string> => {
    const payload = {
      fileName: file.name,
      fileType: file.type,
      module: `${userType}/trade-license`,
    };

    const response = await axiosInstance.post<SignedUrlResponse>(
      "/upload/signed-url",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) {
      throw new Error("Failed to get public URL");
    }

    return response.data.publicUrl;
  };

  const onSubmit = async (formData: FormDataWithFiles) => {
    setLoading(true);

    try {
      const payload: TradeLicenseFormValues = {
        tradeLicenseNumber: formData.tradeLicenseNumber,
        tradeLicenseImg: "",
      };

      if (formData.tradeLicenseImg && formData.tradeLicenseImg.length > 0) {
        const file = formData.tradeLicenseImg[0];
        const signedUrl = await getSignedUrl(file);
        await uploadToS3(signedUrl, file);
        payload.tradeLicenseImg = await getPublicUrl(file);
      }

      const res = await axiosInstance.patch(
        `/${userType}/profile/onboarding`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        nextStep();
      }
    } catch (error: unknown) {
      notifyError("Try again later");
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
            src="/auth-images/step-8-brand.png"
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
          <p className="font-semibold text-lg">{t("provideNidTitle")}</p>
        </div>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={methods.control}
              name="tradeLicenseNumber"
              rules={{
                required: "Trade license number is required",
                validate: (v) =>
                  (v ?? "").trim().length > 0 ||
                  "Trade license number is required",
              }}
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

            <ImageUploader<FormDataWithFiles>
              label={t("nidFront")}
              name="tradeLicenseImg"
              control={methods.control}
              rules={{
                validate: (value) =>
                  value?.length ? true : "Trade license file is required",
              }}
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
            onClick={nextStep}
          >
            {t("skip")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpStepEight;
