"use client";

import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOnboardingStore } from "@/store/onboarding_store";
import { useTranslations } from "next-intl"; // ✅ Import useTranslations

// Define the form type
export type AgencyExpertiseFormValues = {
  platforms: {
    platform: string;
    niches: string[];
    workedNiches: string[];
  }[];
};

// Change props interface
interface Props {
  nextStep: () => void;
}

export default function AgencyExtraSignUpStep({ nextStep }: Props) { 
  const t = useTranslations("Signup.step6"); 
  
  // Rest of your code remains the same...
  const { 
    agencyExpertise, 
    addAgencyPlatform, 
    removeAgencyPlatform, 
    updateAgencyPlatform 
  } = useOnboardingStore();

  const methods = useForm<AgencyExpertiseFormValues>({
    defaultValues: {
      platforms: agencyExpertise.platforms,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "platforms",
  });

  const onSubmit = (data: AgencyExpertiseFormValues) => {
    // Update the store with all platforms
    data.platforms.forEach((platform, index) => {
      if (index < agencyExpertise.platforms.length) {
        // Update existing platform
        updateAgencyPlatform(index, platform);
      } else {
        // Add new platform
        addAgencyPlatform(platform);
      }
    });
    
    // Remove any platforms that were deleted
    if (data.platforms.length < agencyExpertise.platforms.length) {
      for (let i = data.platforms.length; i < agencyExpertise.platforms.length; i++) {
        removeAgencyPlatform(i);
      }
    }
    
    nextStep();
  };

  // Handler for adding a new platform
  const handleAddPlatform = () => {
    append({
      platform: "",
      niches: [],
      workedNiches: [],
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between mt-4">
      {/* Left Content */}
      <div className="w-full lg:w-1/2">
        <div className="">
          <div className="space-y-5 md:space-y-10 flex flex-col text-center lg:text-start">
            <h1 className="text-Primary text-3xl md:text-[40px] font-semibold">
              Define Your Expertise
            </h1>
            <p className="text-2xl md:text-[23px] text-light-green font-semibold">
              Showcase Your Experience
            </p>
            <p className="text-md md:text-[18px] text-Primary">
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

      {/* Right Form Content */}
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

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 border-b pb-4">
                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label htmlFor="platform-select" className="text-light-green">
                    Select Platforms *
                  </Label>
                  <Select
                    onValueChange={(value) => 
                      methods.setValue(`platforms.${index}.platform`, value)
                    }
                    value={methods.watch(`platforms.${index}.platform`)}
                  >
                    <SelectTrigger className="w-full focus-visible:ring-1 py-6">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">Youtube</SelectItem>
                      <SelectItem value="tiktok">Tiktok</SelectItem>
                      <SelectItem value="linkedin">Linkedin</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="x">X (Twitter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Choose Niches Dialog */}
                <div className="space-y-2">
                  <Label className="text-light-green">Select Niches *</Label>
                  <Dialog>
                    <DialogTrigger className="w-full border border-light-gray rounded-md py-3 bg-[#F8F8F8] text-start px-4 text-dark-gray text-sm cursor-pointer">
                      Search & Select Niches
                      {methods.watch(`platforms.${index}.niches`).length > 0 && 
                        ` (${methods.watch(`platforms.${index}.niches`).length} selected)`}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-Primary">
                          Experienced Niche*
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-2">
                        {["Fashion", "Tech", "Food", "Travel", "Fitness", "Beauty"].map((niche) => (
                          <button
                            key={niche}
                            type="button"
                            onClick={() => {
                              const currentNiches = methods.watch(`platforms.${index}.niches`);
                              const newNiches = currentNiches.includes(niche)
                                ? currentNiches.filter(n => n !== niche)
                                : [...currentNiches, niche];
                              methods.setValue(`platforms.${index}.niches`, newNiches);
                            }}
                            className={`p-2 rounded border ${
                              methods.watch(`platforms.${index}.niches`).includes(niche)
                                ? 'bg-light-green text-white'
                                : 'bg-gray-100'
                            }`}
                          >
                            {niche}
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Worked Niches Display */}
                <div className="space-y-2">
                  <Label className="text-light-green">Worked Niches *</Label>
                  <div className="w-full border border-light-gray min-h-[80px] p-4 text-dark-gray rounded-md text-sm">
                    {methods.watch(`platforms.${index}.niches`).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {methods.watch(`platforms.${index}.niches`).map((niche) => (
                          <span 
                            key={niche} 
                            className="px-3 py-1 bg-light-green/10 text-light-green rounded-full text-sm"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "Select from above"
                    )}
                  </div>
                </div>

                {/* Remove Platform Button */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm text-red-600 mt-2"
                  >
                    Remove Platform
                  </button>
                )}
              </div>
            ))}

            {/* Add Another Platform Button */}
            <button
              className="border mt-9 font-semibold rounded-xl border-dashed border-Primary w-full h-14 text-light-green cursor-pointer flex items-center justify-center"
              type="button"
              onClick={handleAddPlatform}
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
}