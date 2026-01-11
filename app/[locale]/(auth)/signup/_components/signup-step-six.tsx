"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslations } from "next-intl";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";
import axiosInstance from "@/lib/axios";

type Props = {
  nextStep: () => void;
};

type SocialLinkItem = {
  platform: string;
  url: string;
};

type SocialFormValues = {
  website?: string;
  socialLinks: SocialLinkItem[];
};

const PLATFORM_OPTIONS = ["Facebook", "YouTube", "TikTok", "LinkedIn"] as const;

const SignUpStepSix = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step6");
  const token = useAuthStore((s) => s.token);
  const userType = useAuthStore((s) => s.userType);

  const [loading, setLoading] = useState(false);

  const methods = useForm<SocialFormValues>({
    defaultValues: {
      website: "",
      socialLinks: [{ platform: "", url: "" }],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "socialLinks",
  });

  const onSubmit = async (values: SocialFormValues) => {
    const website = (values.website ?? "").trim();

    const touchedRows = (values.socialLinks ?? [])
      .map((x) => ({
        platform: (x.platform ?? "").trim(),
        url: (x.url ?? "").trim(),
      }))
      .filter((x) => x.platform || x.url);

    const socialLinks = touchedRows.filter((x) => x.platform && x.url);

    const hasAnyData = Boolean(website) || socialLinks.length > 0;

    if (!hasAnyData) {
      nextStep();
      return;
    }

    setLoading(true);
    try {
      const payload: { website?: string; socialLinks?: SocialLinkItem[] } = {};
      if (website) payload.website = website;
      if (socialLinks.length) payload.socialLinks = socialLinks;

      await axiosInstance.patch(`/${userType}/profile/onboarding`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      nextStep();
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between mt-4">
      <div className="w-full lg:w-1/2">
        <div className="space-y-5 md:space-y-10 flex flex-col text-center lg:text-start">
          <h1 className="text-Primary text-3xl md:text-[40px] font-semibold">
            Time to shine!
          </h1>
          <p className="text-2xl md:text-[23px] text-light-green font-semibold">
            Let shine your social presence!
          </p>
          <p className="text-md md:text-[18px] text-Primary">
            {userType === "client"
              ? "Help creators understand your brand's voice and aesthetic by linking your active social channels."
              : "Think of this as your digital resume for every campaign offer. The more you add, the better!"}
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src={"/auth-images/step-6-brand.png"}
            height={428}
            width={428}
            alt="brand-image"
            className="hidden md:block object-cover"
          />
        </div>
      </div>

      <div className="rounded-xl md:p-4 w-full lg:w-1/2">
        <div className="flex gap-4 text-Primary md:items-center">
          <Image
            src={"/auth-images/step-6-handshack.png"}
            height={35}
            width={35}
            alt="logo-images"
            className="h-8"
          />
          <p>{t("descriptionSmall")}</p>
        </div>

        <div className="flex gap-4 text-Primary mt-10 items-center pb-4">
          <Image
            src={"/auth-images/step-6-media.png"}
            height={35}
            width={35}
            alt="logo-images"
            className="h-8"
          />
          <p className="font-semibold text-lg">{t("socialSection")}</p>
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
                    {t("websiteLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("websitePlaceholder")}
                      {...field}
                      className="bg-white border py-5.5 font-normal focus-visible:ring-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              {fields.map((f, index) => {
                const platformName = `socialLinks.${index}.platform` as const;
                const urlName = `socialLinks.${index}.url` as const;

                return (
                  <div key={f.id} className="space-y-4">
                    <FormField
                      control={methods.control}
                      name={platformName}
                      rules={{
                        validate: (_, formValues) => {
                          const row = formValues.socialLinks?.[index];
                          const p = (row?.platform ?? "").trim();
                          const u = (row?.url ?? "").trim();

                          if (!p && !u) return true;

                          if (
                            p &&
                            !PLATFORM_OPTIONS.includes(
                              p as (typeof PLATFORM_OPTIONS)[number]
                            )
                          ) {
                            return "Please select a valid platform.";
                          }

                          return (
                            (p && u) || "After selecting platform, enter URL."
                          );
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-light-green">
                            Choose platforms
                          </Label>
                          <Select
                            value={field.value || ""}
                            onValueChange={(val) => {
                              if (val === "__none__") {
                                field.onChange("");
                                methods.setValue(
                                  `socialLinks.${index}.url`,
                                  "",
                                  { shouldValidate: true, shouldDirty: true }
                                );
                                methods.clearErrors([
                                  `socialLinks.${index}.platform`,
                                  `socialLinks.${index}.url`,
                                ]);
                                return;
                              }
                              field.onChange(val);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full focus-visible:ring-1 py-6">
                                <SelectValue placeholder="Choose platforms" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent className="w-full">
                              <SelectItem value="__none__">
                                Clear selection
                              </SelectItem>
                              {PLATFORM_OPTIONS.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name={urlName}
                      rules={{
                        validate: (v) => {
                          const row = methods.getValues(`socialLinks.${index}`);
                          const p = (row?.platform ?? "").trim();
                          const u = (v ?? "").trim();

                          if (!p && !u) return true;

                          if (p && !u)
                            return "After selecting platform, enter URL.";

                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-light-green">
                            {t("profileLinkLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("profileLinkPlaceholder")}
                              {...field}
                              className="bg-white border py-6 font-normal focus-visible:ring-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => append({ platform: "", url: "" })}
              className="border border-dashed border-Primary w-full rounded-lg h-14 text-light-green cursor-pointer flex items-center justify-center font-semibold"
            >
              + {t("addAnother")}
            </button>

            <Button
              disabled={loading}
              type="submit"
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-10 disabled:opacity-60"
            >
              {loading ? "Saving..." : t("continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpStepSix;
