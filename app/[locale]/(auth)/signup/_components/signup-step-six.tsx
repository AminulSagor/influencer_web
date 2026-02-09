"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Loader from "@/components/spin-loader";
import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";
import { useOnboardingStore } from "@/store/onboarding_store";

import { notifyError } from "@/utils/toast_util";
import type { UserRole } from "@/types/auth/role_type";

import {
  socialSchema,
  type SocialFormValues,
  SOCIAL_PLATFORMS,
  type SocialPlatform,
} from "@/schemas/onboarding/social_schema";

type Props = {
  nextStep: () => void;
};

const PLATFORM_LABEL: Record<Exclude<SocialPlatform, "">, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

const SignUpStepSix = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step6");
  const userType = useAuthStore((s) => s.userType) as UserRole;

  const savedSocial = useOnboardingStore((s) => ({
    website: (s.data.website ?? "") as string,
    socialLinks:
      (s.data.socialLinks ?? []).map((x) => ({
        platform: (x.platform ?? "") as SocialPlatform,
        url: x.url ?? "",
      })) || [],
  }));

  const setWebsite = useOnboardingStore((s) => s.setWebsite);
  const setSocialLinks = useOnboardingStore((s) => s.setSocialLinks);

  const [loading, setLoading] = useState(false);

  const methods = useForm<SocialFormValues>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      website: savedSocial.website,
      socialLinks: savedSocial.socialLinks.length
        ? savedSocial.socialLinks
        : [{ platform: "", url: "" }],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "socialLinks",
  });

  const onSubmit = async (values: SocialFormValues) => {
    setLoading(true);
    try {
      const website = (values.website ?? "").trim();

      const normalized = (values.socialLinks ?? [])
        .map((row) => ({
          platform: (row.platform ?? "").toString().trim() as SocialPlatform,
          url: (row.url ?? "").trim(),
        }))
        .filter((x) => x.platform && x.url); // keep complete rows only

      // store only (NO API CALL)
      setWebsite(website);
      setSocialLinks(normalized);

      nextStep();
    } catch {
      notifyError("Try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between mt-4">
      {/* Left */}
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
            src="/auth-images/step-6-brand.png"
            height={428}
            width={428}
            alt="brand-image"
            className="hidden md:block object-cover"
          />
        </div>
      </div>

      {/* Right */}
      <div className="rounded-xl md:p-4 w-full lg:w-1/2">
        <div className="flex gap-4 text-Primary md:items-center">
          <Image
            src="/auth-images/step-6-handshack.png"
            height={35}
            width={35}
            alt="logo-images"
            className="h-8"
          />
          <p>{t("descriptionSmall")}</p>
        </div>

        <div className="flex gap-4 text-Primary mt-10 items-center pb-4">
          <Image
            src="/auth-images/step-6-media.png"
            height={35}
            width={35}
            alt="logo-images"
            className="h-8"
          />
          <p className="font-semibold text-lg">{t("socialSection")}</p>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Website */}
            <FormField
              control={methods.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">{t("websiteLabel")}</FormLabel>
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

            {/* Social Links */}
            <div className="space-y-6">
              {fields.map((f, index) => {
                const platformName = `socialLinks.${index}.platform` as const;
                const urlName = `socialLinks.${index}.url` as const;

                return (
                  <div key={f.id} className="space-y-4">
                    {/* Platform */}
                    <FormField
                      control={methods.control}
                      name={platformName}
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-light-green">Choose platform</Label>

                          <Select
                            value={field.value || ""}
                            onValueChange={(val) => {
                              if (val === "__none__") {
                                field.onChange("");
                                methods.setValue(`socialLinks.${index}.url`, "", {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                return;
                              }
                              field.onChange(val as SocialPlatform);
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full focus-visible:ring-1 py-6">
                                <SelectValue placeholder="Choose platform" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent className="w-full">
                              <SelectItem value="__none__">Clear selection</SelectItem>
                              {SOCIAL_PLATFORMS.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {PLATFORM_LABEL[p]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* URL */}
                    <FormField
                      control={methods.control}
                      name={urlName}
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
              type="submit"
              disabled={loading || !methods.formState.isValid}
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-10 disabled:opacity-60"
              onClick={() => {
                if (!methods.formState.isValid) {
                  notifyError("Please fix the errors above.");
                }
              }}
            >
              {loading ? <Loader /> : t("continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpStepSix;
