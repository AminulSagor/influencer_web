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
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

type Props = {
  nextStep: () => void;
};

type AddressFormValues = {
  thana: string;
  zila: string;
  fullAddress: string;
};

const SignUpStepFive = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step5");

  const methods = useForm<AddressFormValues>({
    defaultValues: {
      thana: "",
      zila: "",
      fullAddress: "",
    },
  });

  const onSubmit = (data: AddressFormValues) => {
    console.log(data);
    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-10 justify-between mt-10">
      {/* Left Content */}
      <div className="w-full md:w-1/2">
        <div className="flex flex-col md:items-center  text-center lg:px-4">
          <div className="space-y-5 md:space-y-10">
            <h1 className="text-Primary text-4xl md:text-[48px] font-semibold">
              {t("title")}
            </h1>
            <p className=" text-2xl md:text-[23px] text-light-green font-semibold">
              {t("subtitle")}
            </p>
            <p className="text-[18px] text-Primary">{t("description")}</p>
          </div>

          <Image
            src={"/auth-images/step-5-brand.png"}
            height={400}
            width={400}
            alt="brand-image"
            className="hidden md:block"
          />
        </div>
      </div>

      {/* Right Content / Form */}
      <div className="rounded-xl md:p-4 w-full md:w-1/2 ">
        <div className="flex gap-2 text-Primary">
          <Image
            src={"/auth-images/step-5-subimage.png"}
            height={29}
            width={29}
            alt="logo-images"
            className="h-8"
          />
          <p>{t("customizeExperience")}</p>
        </div>

        <div className="flex gap-2 text-Primary mt-10 items-center pb-4">
          <Image
            src={"/auth-images/step-5-location.png"}
            height={29}
            width={29}
            alt="logo-images"
            className="h-8"
          />
          <p className="font-semibold text-lg">{t("addressSection")}</p>
        </div>

        {/* Form Area */}
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={methods.control}
              name="thana"
              rules={{ required: `${t("thanaLabel")} is required` }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("thanaLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("thanaPlaceholder")}
                      {...field}
                      className="bg-white border py-3 font-normal focus-visible:ring-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="zila"
              rules={{ required: `${t("zilaLabel")} is required` }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("zilaLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("zilaPlaceholder")}
                      {...field}
                      className="bg-white border py-3 font-normal focus-visible:ring-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="fullAddress"
              rules={{ required: `${t("fullAddressLabel")} is required` }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("fullAddressLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("fullAddressPlaceholder")}
                      {...field}
                      className="bg-white border h-32 font-normal focus-visible:ring-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-4"
            >
              {t("continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpStepFive;
