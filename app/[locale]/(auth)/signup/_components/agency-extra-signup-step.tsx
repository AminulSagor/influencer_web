"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

type Props = {
  nextStep: () => void;
};

// Social Links form values
type SocialFormValues = {
  website?: string;
  platform?: string;
  profileLink?: string;
};

const AgencyExtraSignUpStep = ({ nextStep }: Props) => {
  const t = useTranslations("Signup.step6"); // step6 translations
  const methods = useForm<SocialFormValues>({
    defaultValues: {
      website: "",
      platform: "",
      profileLink: "",
    },
  });

  const onSubmit = (data: SocialFormValues) => {
    console.log(data);
    nextStep();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between mt-4">
      {/* Left Content */}
      <div className="w-full lg:w-1/2">
        <div className="">
          <div className=" space-y-5 md:space-y-10 flex flex-col text-center lg:text-start">
            <h1 className="text-Primary text-3xl md:text-[40px] font-semibold">
              Define Your Expertise
            </h1>
            <p className=" text-2xl md:text-[23px] text-light-green font-semibold">
              Showcase Your Experience
            </p>
            <p className=" text-md md:text-[18px] text-Primary">
              Tell us which industries you specialize in so we can match you
              with the most relevant campaign briefs.
            </p>
          </div>

          <div className="flex justify-center mt-10">
            <Image
              src={"/auth-images/step-6-agency.png"}
              height={428}
              width={350}
              alt="brand-image"
              className="hidden md:block object-cover"
            />
          </div>
        </div>
      </div>

      {/* user type wise form */}

      <div className="rounded-xl md:p-4 w-full lg:w-1/2 ">
        <div className="flex gap-2 text-Primary">
          <Image
            src={"/auth-images/step-5-subimage.png"}
            height={29}
            width={29}
            alt="logo-images"
            className="h-8"
          />
          <p>
            We use these preferences to filter out irrelevant briefs, saving you
            time.
          </p>
        </div>

        <div className="flex gap-2 text-Primary mt-10 items-center pb-4">
          <Image
            src={"/auth-images/step-5-location.png"}
            height={29}
            width={29}
            alt="logo-images"
            className="h-8"
          />
          <p className="font-semibold text-lg">Select Industries</p>
        </div>

        {/* Form Area */}

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* platform */}
            <div className="space-y-2">
              <Label htmlFor="platform-select" className="text-light-green">
                Select Platforms *
              </Label>
              <Select>
                <SelectTrigger className="w-full focus-visible:ring-1 py-6">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="youtube">Youtube</SelectItem>
                  <SelectItem value="tiktok">Tiktok</SelectItem>
                  <SelectItem value="linkedin">Linkedin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* choose niches */}
            <div className="space-y-2">
              <Label className="text-light-green">Select Niches * </Label>
              <Dialog>
                <DialogTrigger className="w-full border border-light-gray rounded-md py-3 bg-[#F8F8F8] text-start px-4 text-dark-gray text-sm cursor-pointer">
                  Search & Select Niches
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-Primary">
                      Experienced Niche
                    </DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              <Label className="text-light-green">Worked Niches *</Label>
              <div className="w-full border border-light-gray h-34 p-4 text-dark-gray rounded-md text-sm">
                Select from above
              </div>
            </div>

            <button
              className="border mt-9 font-semibold rounded-xl  border-dashed border-Primary w-full h-14 text-light-green cursor-pointer flex items-center justify-center"
              type="button"
            >
              + Add Another Platform
            </button>

            <Button
              type="submit"
              className="text-white hover:bg-Primary cursor-pointer bg-light-green h-16 w-full text-[18px] mt-10"
            >
              {t("continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AgencyExtraSignUpStep;
