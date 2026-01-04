"use client";

import React from "react";
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

type Props = {
  nextStep: () => void;
};

type FormValues = {
  password: string;
  confirmPassword: string;
};

const ForgotPasswordStepThree = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword.step3");

  const form = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 justify-between max-w-112.5">
      <div className="max-w-113.5">
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
            >
              {t("submit")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordStepThree;
