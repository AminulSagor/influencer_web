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
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import {
  notifyError,
  notifySuccess,
} from "@/utils/toast_util";
import Loader from "@/components/spin-loader";
import { useRouter } from "next/navigation";
import { handlePhoneFormat } from "@/utils/phone_util";

type UserRole = "client" | "influencer" | "agency";
type Response = {
  role?: string;
  message?: string;
  isVerified?: boolean;
};

const roleRoot = {
  client: "brand",
  influencer: "influencer",
  agency: "agency",
} as const;

function isUserRole(v: unknown): v is UserRole {
  return v === "client" || v === "influencer" || v === "agency";
}
const LoginForm = () => {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const methods = useForm<LoginFormValues>({
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const formatedPhone = handlePhoneFormat(data.phone);
    const payload = { ...data, phone: formatedPhone };

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data: Response = await res.json();
      if (res.status === 200) {
        notifySuccess(data?.message as string);
      }

      if (res.status === 401) {
        notifyError(data?.message as string);
      }

      const role = data.role;

      if (!isUserRole(role)) {
        console.log("Role missing/invalid from API response");
        return;
      }

      const root = roleRoot[role];
      const nextPath = data.isVerified
        ? `/${locale}/${root}/dashboard`
        : `/${locale}/${root}/unverified`;

      router.push(nextPath);
      router.refresh();
    } catch (error: unknown) {
      if (error) {
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
        className="space-y-4 mt-8"
      >
        {/* Phone / Email */}
        <FormField
          control={methods.control}
          name="phone"
          rules={{ required: "Email or phone required" }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-light-gray" />
                  <Input
                    type="text"
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
            href={`/${locale}/login/forgot-password`}
            className="text-sm hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        {/* Login button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg bg-light-green text-white hover:bg-Primary"
        >
          {loading ? <Loader /> : t("loginButton")}
        </Button>

        {/* Footer */}
        <p className="text-sm text-center text-light-gray mt-6 md:mt-12">
          {t("footer.text")}{" "}
          <Link
            href={`/${locale}/signup`}
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
