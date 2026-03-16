"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useForgotPasswordStore } from "@/store/forgot_password_store";
import Loader from "@/components/spin-loader";
import { notifySuccess, notifyError } from "@/utils/toast_util";
import { resetPassword } from "@/service/auth/forgot-password";

type Props = {
  nextStep: () => void;
};

type FormValues = {
  password: string;
  confirmPassword: string;
};

const ForgotPasswordStepThree = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword.step3");
  
  // Get data from Zustand store
  const { 
    identifier, 
    otp, // Get OTP array from store
    clearAll 
  } = useForgotPasswordStore();
  
  const [loading, setLoading] = useState(false);

  // Debug
  useEffect(() => {
  }, [identifier, otp]);

  const form = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    
    // Convert OTP array to string
    const otpCode = otp.join("");
    
    if (!otpCode || otpCode.length !== 4) {
      notifyError("OTP is missing or invalid. Please restart the process.");
      return;
    }

    setLoading(true);
    
    try {
      
      // Call service with correct parameters
      await resetPassword(identifier, otpCode, data.confirmPassword );
      
      notifySuccess("Password reset successfully!");
      
      // Clear the store since the process is complete
      clearAll();
      
      // Move to success step
      nextStep();
    } catch (error: any) {
      console.error("[Step3] Reset password error:", error);
      notifyError(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between max-w-112.5">
      <div className="max-w-113.5 w-full">
        <h1 className="text-Primary text-[32px] lg:text-[38px] text-center font-semibold">
          {t("title")}
        </h1>

        <p className="text-[16px] text-light-green text-center mt-2">
          {t("subtitle")}
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: t("errors.passwordRequired"),
                minLength: {
                  value: 8,
                  message: t("errors.passwordMin"),
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("passwordLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      className="pl-4 py-6 font-normal focus-visible:ring-1 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: t("errors.confirmRequired"),
                validate: (value) =>
                  value === form.getValues("password") ||
                  t("errors.passwordMismatch"),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    {t("confirmPasswordLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("confirmPasswordPlaceholder")}
                      {...field}
                      className="pl-4 py-6 font-normal focus-visible:ring-1 w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="text-white bg-light-green hover:bg-Primary cursor-pointer h-16 w-full text-[18px]"
              disabled={loading}
            >
              {loading ? <Loader /> : t("submit")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordStepThree;