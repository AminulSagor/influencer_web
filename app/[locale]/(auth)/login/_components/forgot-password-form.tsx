"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  handlePhoneFormat,
  notifyError,
  notifySuccess,
} from "@/helpers/helper";
import Loader from "@/components/spin-loader";
import { useAuthStore } from "@/app/[locale]/(auth)/zustand-store/auth-store";
import axios from "axios";

type ForgotPasswordFormValues = {
  identifier: string;
};

type Props = {
  nextStep: () => void;
};

const ForgotPasswordForm = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword");
  const [loading, setLoading] = useState(false);
  const setPhone = useAuthStore((s) => s.setPhone);

  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);

    const formatPhone = handlePhoneFormat(data.identifier);
    setPhone(formatPhone);

    try {
      const res = await axiosInstance.post("/influencer/auth/forgot-password", {
        identifier: formatPhone,
      });

      notifySuccess(res.data?.message);
      nextStep();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        notifyError(error.response?.data?.message || "Request failed");
      } else {
        notifyError("Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-4 mt-8 md:mt-12"
      >
        <FormField
          control={methods.control}
          name="identifier"
          rules={{ required: "Email or Phone required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-green">
                {t("stepOne.label")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("stepOne.placeholder")}
                    className="pl-10 py-6 font-normal focus-visible:ring-1 w-full"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 mt-2 text-lg bg-light-green text-white hover:bg-Primary"
          disabled={loading}
        >
          {loading ? <Loader /> : t("stepOne.button")}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
