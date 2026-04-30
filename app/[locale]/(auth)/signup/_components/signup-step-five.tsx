"use client";

import { useEffect } from "react"; // ✅ Added useEffect
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import ZillaThanaFields from "@/components/location/zilla-thana-fields";
import type { UserRole } from "@/types/auth/role_type";

import { notifyError } from "@/utils/toast_util";
import Loader from "@/components/spin-loader";
import { AddressFormValues, addressSchema } from "@/schemas/onboarding/address_schema";
import { decodeJwtPayload } from "@/storage/jwt_decoder";
import { useOnboardingStore } from "@/store/onboarding_store";
import { useAuthStore } from "@/store/auth_store";


type Props = {
  nextStep: () => void;
};

const SignUpStepFive = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step5");
  const userType = useAuthStore((s) => s.userType) as UserRole;

  const savedAddress = useOnboardingStore((s) => s.address);
  const setAddress = useOnboardingStore((s) => s.setAddress);
  // ✅ CRITICAL: Get setUserRole from store
  const setUserRole = useOnboardingStore((s) => s.setUserRole);

  const methods = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: savedAddress,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const selectedZila = methods.watch("zila");
  const selectedThana = methods.watch("thana");
  const token = useAuthStore((s) => s.token);

  // ✅ CRITICAL: Use useEffect to set userRole on component mount
  useEffect(() => {
    if (token) {
      try {
        const jwt = decodeJwtPayload(token);
        // console.log("jwt payload:", jwt);
        // console.log("jwt role:", jwt?.role);
        // console.log("isVerified:", jwt?.isVerified);

        // ✅ CRITICAL: Set the role in Zustand store
        if (jwt?.role) {
          setUserRole(jwt.role);
          //console.log('✅ Successfully set userRole in store:', jwt.role);
        }
      } catch (error) {
        console.error('Failed to decode or set role:', error);
      }
    }
  }, [token, setUserRole]); // Add dependencies

  const onSubmit = async (data: AddressFormValues) => {
    setAddress(data);

    // optional: verify minimum state
    if (!data.zila || !data.thana || !data.fullAddress) {
      notifyError("Please fill all required fields");
      return;
    }

    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-10 justify-between mt-10">
      {/* Left */}
      <div className="w-full md:w-1/2">
        <div className="flex flex-col md:items-center text-center lg:px-4">
          <div className="space-y-5 md:space-y-10">
            <h1 className="text-Primary text-4xl md:text-[48px] font-semibold">
              {t("title")}
            </h1>

            <p className="text-2xl md:text-[23px] text-light-green font-semibold">
              {userType === "influencer"
                ? "Where should we send the good stuff?"
                : "Establish Your Business Presence"}
            </p>

            <p className="text-[18px] text-Primary">{t("description")}</p>
          </div>

          <Image
            src="/auth-images/step-5-brand.png"
            height={400}
            width={400}
            alt="brand-image"
            className="hidden md:block"
          />
        </div>
      </div>

      {/* Right */}
      <div className="rounded-xl md:p-4 w-full md:w-1/2">
        <div className="flex gap-2 text-Primary">
          <Image
            src="/auth-images/step-5-subimage.png"
            height={29}
            width={29}
            alt="logo-images"
            className="h-8"
          />
          <p>
            {userType === "agency"
              ? "You can always change or update your location on your profile."
              : userType === "influencer"
              ? "You can always change the product drop off point before accepting any deals!"
              : "This helps us customize your experience"}
          </p>
        </div>

        <div className="flex gap-2 text-Primary mt-10 items-center pb-4">
          <Image
            src="/auth-images/step-5-location.png"
            height={29}
            width={29}
            alt="logo-images"
            className="h-8"
          />
          <p className="font-semibold text-lg">{t("addressSection")}</p>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-4">
              <ZillaThanaFields
                zilla={selectedZila || ""}
                thana={selectedThana || ""}
                zillaLabel={t("zilaLabel")}
                thanaLabel={t("thanaLabel")}
                zillaPlaceholder={t("zilaPlaceholder")}
                thanaPlaceholder={t("thanaPlaceholder")}
                selectClassName="h-12 border bg-white py-3 font-normal focus-visible:ring-1"
                onZillaChange={(value) =>
                  methods.setValue("zila", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onThanaChange={(value) =>
                  methods.setValue("thana", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
              {methods.formState.errors.zila?.message && (
                <p className="text-sm font-medium text-destructive">
                  {methods.formState.errors.zila.message}
                </p>
              )}
              {methods.formState.errors.thana?.message && (
                <p className="text-sm font-medium text-destructive">
                  {methods.formState.errors.thana.message}
                </p>
              )}
            </div>

            {/* Full Address */}
            <FormField
              control={methods.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">{t("fullAddressLabel")}</FormLabel>
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
              disabled={!methods.formState.isValid}
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-4"
            >
              {methods.formState.isSubmitting ? <Loader /> : t("continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUpStepFive;
