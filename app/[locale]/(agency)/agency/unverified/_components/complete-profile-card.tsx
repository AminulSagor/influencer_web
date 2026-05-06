import { Check, CheckCircle2, Clock3, HelpCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AgencyProfileResponse } from "@/types/agency/profile";

type CompleteProfileCardProps = {
  profile: AgencyProfileResponse | null;
};

type ProfileStep = {
  label: string;
  description: string;
  completed: boolean;
  helpText?: string;
};

export function CompleteProfileCard({ profile }: CompleteProfileCardProps) {
  const steps: ProfileStep[] = [
    {
      label: "Add Profile Picture",
      description: "That's How We Are Going To Reach You",
      completed: Boolean(profile?.logo),
    },
    {
      label: "Add Niches",
      description: "Pending",
      completed: Boolean(profile?.niches?.length),
      helpText:
        "A niche is a focused area of interest, need, or demographic that an influencer focuses on exclusively",
    },
    {
      label: "Add Bio",
      description: "Pending",
      completed: Boolean(profile?.agencyBio),
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="complete-profile"
      className="rounded-xl border bg-white"
    >
      <AccordionItem value="complete-profile" className="border-none">
        <AccordionTrigger className="px-5 py-5 hover:no-underline">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-8 fill-[#254b19] text-white" />
            <h2 className="text-base font-semibold text-[#254b19] sm:text-lg">
              Complete Your Profile
            </h2>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-5 pb-6">
          <div className="mb-7 h-2 rounded-full bg-[#dbe5d3]">
            <div
              className="h-full rounded-full bg-[#5f853e]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-0">
            {steps.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-9 items-center justify-center rounded-full ${
                      step.completed
                        ? "bg-[#7a9d58] text-white"
                        : "bg-[#e1e1e1] text-white"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="size-5" />
                    ) : (
                      <Clock3 className="size-4" />
                    )}
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="h-10 w-px bg-[#d6d6d6]" />
                  )}
                </div>

                <div className="flex flex-1 items-start justify-between gap-4 pt-1">
                  <div>
                    <h3 className="text-sm font-medium text-black">
                      {step.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#666]">
                      {step.completed ? "Completed" : step.description}
                    </p>
                  </div>

                  {step.helpText && (
                    <div className="group relative">
                      <HelpCircle className="size-5 cursor-help fill-[#7a9d58] text-white" />

                      <div className="pointer-events-none absolute right-0 top-8 z-20 hidden w-[260px] rounded-xl bg-white px-4 py-3 text-xs leading-relaxed text-[#254b19] shadow-lg ring-1 ring-black/5 group-hover:block sm:w-[330px]">
                        {step.helpText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
