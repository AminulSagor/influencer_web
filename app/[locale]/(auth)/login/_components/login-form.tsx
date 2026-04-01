"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { User, Lock, Loader } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { loginSchema, LoginFormValues } from "@/schemas/auth/login_schema";
import { login } from "@/service/auth/login";
import { useAuthStore } from "@/store/auth_store";
import { setToken } from "@/utils/cookies_util";
import { decodeJwtPayload } from "@/storage/jwt_decoder";
import { handlePhoneFormat } from "@/utils/phone_util";
import { notifyError } from "@/utils/toast_util";

const LoginForm = () => {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

const onSubmit = async (data: LoginFormValues) => {
  try {
    setLoading(true);

    const res = await login({
      phone: handlePhoneFormat(data.phone),
      password: data.password,
    });

    const token = res?.accessToken;
    if (!token) throw new Error("No token returned");

    setToken(token);

    const payload = decodeJwtPayload(token);
    if (!payload) throw new Error("Invalid token");

    setAuth({
      token,
      role: payload.role,
      phone: payload.phone,
      email: payload.email,
      isVerified: payload.isVerified,
    });

    const pathMap: Record<string, string> = {
      client: "brand",
      admin: "admin",
      agency: "agency",
      influencer: "influencer",
    };

    const basePath = pathMap[payload.role || ""] || (payload.role || "");
    // const nextPath = payload.isVerified
    //   ? `/${locale}/${basePath}/dashboard`
    //   : `/${locale}/brand/unverified`;

    // await router.push(nextPath);
    router.refresh();
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401) {
      notifyError("Phone Number or Password wrong");
    } else {
      notifyError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }

    methods.setError("root", {
      message:
        error?.response?.data?.message || "Login failed. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};



  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-8">
        <FormField
          control={methods.control}
          name="phone"
          rules={{ required: "Phone number required" }}
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
