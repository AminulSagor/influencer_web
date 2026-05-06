import { Check, CheckCircle2, Clock3, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AgencyProfileResponse } from "@/types/agency/profile";

type VerificationProgressCardProps = {
  profile: AgencyProfileResponse | null;
};

type StepStatus = "approved" | "pending" | "rejected";

type VerificationStep = {
  label: string;
  description: string;
  status: StepStatus;
};

const getStepStyle = (status: StepStatus) => {
  if (status === "approved") {
    return "bg-[#7a9d58] text-white";
  }

  if (status === "rejected") {
    return "bg-[#ffb5b5] text-white";
  }

  return "bg-[#e1e1e1] text-white";
};

const getStepIcon = (status: StepStatus) => {
  if (status === "approved") return <Check className="size-5" />;
  if (status === "rejected") return <X className="size-4" />;
  return <Clock3 className="size-4" />;
};

export function VerificationProgressCard({
  profile,
}: VerificationProgressCardProps) {
  const steps: VerificationStep[] = [
    {
      label: "Basic Informations",
      description: "That's How We Are Going To Reach You",
      status: profile ? "approved" : "pending",
    },
    {
      label: "Social Portfolio",
      description: profile?.socialLinks?.length
        ? `${profile.socialLinks.length} Added You Can Always Add More`
        : "Pending",
      status: profile?.socialLinks?.length ? "approved" : "pending",
    },
    {
      label: "NID",
      description:
        profile?.nidVerification?.nidStatus === "approved"
          ? "Approved"
          : profile?.nidVerification?.nidStatus === "rejected"
            ? profile.nidVerification.nidRejectReason || "Rejected"
            : "In Review",
      status: profile?.nidVerification?.nidStatus ?? "pending",
    },
    {
      label: "Trade License",
      description:
        profile?.tradeLicenseVerification?.tradeLicenseStatus === "rejected"
          ? profile.tradeLicenseVerification.tradeLicenseRejectReason ||
            "Declined, documents details don't match with the provided information"
          : profile?.tradeLicenseVerification?.tradeLicenseStatus === "approved"
            ? "Approved"
            : "Pending",
      status:
        profile?.tradeLicenseVerification?.tradeLicenseStatus ?? "pending",
    },
    {
      label: "TIN",
      description: "Pending",
      status: profile?.tinVerification?.tinStatus ?? "pending",
    },
    {
      label: "BIN",
      description: "Pending",
      status: profile?.binVerification?.binStatus ?? "pending",
    },
    {
      label: "Payment Setup",
      description:
        profile?.payouts?.bank?.length ||
        profile?.payouts?.mobileBanking?.length
          ? "Added"
          : "Pending",
      status:
        profile?.payouts?.bank?.length ||
        profile?.payouts?.mobileBanking?.length
          ? "approved"
          : "pending",
    },
    {
      label: "Verify Email",
      description: profile?.isEmailVerified ? "Verified" : "Pending",
      status: profile?.isEmailVerified ? "approved" : "pending",
    },
  ];

  const completedSteps = steps.filter(
    (step) => step.status === "approved",
  ).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="verification-progress"
      className="rounded-xl border bg-white"
    >
      <AccordionItem value="verification-progress" className="border-none">
        <AccordionTrigger className="px-5 py-5 hover:no-underline">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-8 fill-[#416f2e] text-white" />
            <h2 className="text-base font-semibold text-[#254b19] sm:text-lg">
              Verification Progress
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
                    className={`flex size-9 items-center justify-center rounded-full ${getStepStyle(
                      step.status,
                    )}`}
                  >
                    {getStepIcon(step.status)}
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="h-10 w-px bg-[#d6d6d6]" />
                  )}
                </div>

                <div className="pt-1">
                  <h3 className="text-sm font-medium text-black">
                    {step.label}
                  </h3>
                  <p className="mt-0.5 max-w-[360px] text-xs leading-relaxed text-[#666]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
