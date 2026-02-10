"use client";

import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SocialPlatform } from "@/types/onboarding/social-link_type";
import { useOnboardingStore } from "@/store/onboarding_store";



export type Step6FormValues = {
  website: string;
  socialLinks: {
    platform: SocialPlatform | "";
    profileUrl: string;
  }[];
};


const PLATFORM_OPTIONS = [
  "Facebook",
  "Instagram",
  "Tiktok",
  "Youtube",
  "X",
] as const;

export default function StepSix({ userType, t, nextStep }: any) {
  const { website, socialLinks, setWebsite, setSocialLinks } =
    useOnboardingStore();

  const methods = useForm<Step6FormValues>({
    defaultValues: {
      website,
      socialLinks,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "socialLinks",
  });

  const onSubmit = (data: Step6FormValues) => {
    setWebsite(data.website);
    setSocialLinks(data.socialLinks);
    nextStep();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between mt-4">
      {/* LEFT */}
      <div className="w-full lg:w-1/2">
        <div className="space-y-5 md:space-y-10 flex flex-col text-center lg:text-start">
          <h1 className="text-Primary text-3xl md:text-[40px] font-semibold">
            Time to shine!
          </h1>

          <p className="text-2xl md:text-[23px] text-light-green font-semibold">
            Let shine your social presence!
          </p>

          <p className="text-md md:text-[18px] text-Primary">
            {userType === "client"
              ? "Help creators understand your brand's voice and aesthetic by linking your active social channels."
              : "Think of this as your digital resume for every campaign offer. The more you add, the better!"}
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/auth-images/step-6-brand.png"
            height={428}
            width={428}
            alt="brand-image"
            className="hidden md:block object-cover"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="rounded-xl md:p-4 w-full lg:w-1/2">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={methods.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-green">
                    Website (optional)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white py-5.5" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="w-full">
              {fields.map((f, index) => (
                <div key={f.id} className="space-y-4">
                  <FormField
                    control={methods.control}
                    name={`socialLinks.${index}.platform`}
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-light-green">
                          Choose platforms
                        </Label>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="py-6 text-light-green w-full">
                              <SelectValue placeholder="Choose platforms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PLATFORM_OPTIONS.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={methods.control}
                    name={`socialLinks.${index}.profileUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-light-green w-full">
                          Profile link
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="py-6" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append({ platform: "", profileUrl: "" })}
              className="border border-dashed border-light-green w-full rounded-lg h-14 text-light-green cursor-pointer flex items-center justify-center font-semibold"
            >
              + Add Another
            </button>

            <Button type="submit" className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-10 disabled:opacity-60">
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
