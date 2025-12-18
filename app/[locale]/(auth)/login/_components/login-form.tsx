"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Lock, User } from "lucide-react";
import { useTranslations } from "next-intl";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const t = useTranslations("login");

  const methods = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-4 mt-8"
      >
        {/* Email */}
        <FormField
          control={methods.control}
          name="email"
          rules={{ required: t("fields.email.required") }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-gray" />
                  <Input
                    type="email"
                    placeholder={t("fields.email.placeholder")}
                    className="pl-10 py-6 font-normal focus-visible:ring-1 sm:w-78.5"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={methods.control}
          name="password"
          rules={{ required: t("fields.password.required") }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-gray" />
                  <Input
                    type="password"
                    placeholder={t("fields.password.placeholder")}
                    className="pl-10 py-6 font-normal focus-visible:ring-1"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Forgot password */}
        <div className="text-right">
          <Link
            href="/login/forgot-password"
            className="text-sm hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        {/* Login button */}
        <Button
          type="submit"
          className="w-full h-12 text-lg bg-light-green text-white hover:bg-Primary"
        >
          {t("loginButton")}
        </Button>

        {/* Footer */}
        <p className="text-sm text-center text-light-gray mt-6 md:mt-12">
          {t("footer.text")}{" "}
          <Link
            href="/signup"
            className="text-black font-medium hover:underline"
          >
            {t("footer.signup")}
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default LoginForm;
