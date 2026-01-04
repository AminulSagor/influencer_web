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

type ForgotPasswordFormValues = {
  email: string;
};

type Props = {
  nextStep: () => void;
};

const ForgotPasswordForm = ({ nextStep }: Props) => {
  const t = useTranslations("forgotPassword");

  const methods = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    nextStep();
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-4 mt-8 md:mt-12"
      >
        <FormField
          control={methods.control}
          name="email"
          rules={{ required: t("validation.emailRequired") }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-green">
                {t("stepOne.label")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
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
        >
          {t("stepOne.button")}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
