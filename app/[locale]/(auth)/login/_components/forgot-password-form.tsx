"use client";

import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Loader from "@/components/spin-loader";
import { useState } from "react";
import { useForgotPasswordStore } from "@/store/forgot-password_store";
import { requestForgotPasswordOtp } from "@/api/auth/forgot-password";
import { notifyError, notifySuccess } from "@/utils/toast_util";
import { handlePhoneFormat } from "@/utils/phone_util";

type Props = {
  nextStep: () => void;
};

type FormData = {
  identifier: string;
};

const ForgotPasswordForm = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword.stepOne");
  const [loading, setLoading] = useState(false);
  const { setIdentifier } = useForgotPasswordStore();

  const methods = useForm<FormData>({
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formattedPhone = handlePhoneFormat(data.identifier);
      setIdentifier(formattedPhone);
      await requestForgotPasswordOtp(formattedPhone);
      notifySuccess("Verification code sent successfully!");
      nextStep();
    } catch (error: any) {
      notifyError(error.message || "Failed to send verification code");
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
                {t("label")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("placeholder")}
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
          {loading ? <Loader /> : t("button")}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;