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
import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  nextStep: () => void;
};

// Social Links form values
type SocialFormValues = {
  website?: string;
  platform?: string;
  profileLink?: string;
};

const SignUpStepSix = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step6"); // step6 translations
  const userType = useAuthStore((s) => s.userType);
  const methods = useForm<SocialFormValues>({
    defaultValues: {
      website: "",
      platform: "",
      profileLink: "",
    },
  });

  const onSubmit = (data: SocialFormValues) => {
    console.log(data);
    nextStep();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between mt-4">
      {/* Left Content */}
      <div className="w-full lg:w-1/2">
        <div className="">
          <div className=" space-y-5 md:space-y-10 flex flex-col text-center lg:text-start">
            <h1 className="text-Primary text-3xl md:text-[40px] font-semibold">
              Time to shine!
            </h1>
            <p className=" text-2xl md:text-[23px] text-light-green font-semibold">
              Let shine your social presence!
            </p>
            <p className=" text-md md:text-[18px] text-Primary">
              {userType === "brand"
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
      </div>

      {/* right content */}
      <div className="rounded-xl md:p-4 w-full lg:w-1/2 ">
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

        {/* Form Area */}
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

            <div className="space-y-2">
              <Label className="text-light-green ">Choose platforms *</Label>
              <Select>
                <SelectTrigger className="w-full focus-visible:ring-1 py-6">
                  <SelectValue placeholder="Choose platforms" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">Youtube</SelectItem>
                  <SelectItem value="tiktok">Tiktok</SelectItem>
                  <SelectItem value="linkedin">Linkedin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={methods.control}
              name="profileLink"
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

            <div className="border border-dashed border-Primary w-full rounded-lg h-14 text-light-green cursor-pointer flex items-center justify-center font-semibold">
              + {t("addAnother")}
            </div>

            <Button
              type="submit"
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-10"
            >
              {t("continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpStepSix;
