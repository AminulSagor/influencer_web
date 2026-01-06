"use client";

import { Check, Quote, CreditCard, Megaphone, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type StepperProps = {
  currentStep: number; // 0-based index
};

const icons = {
  check: Check,
  quote: Quote,
  card: CreditCard,
  megaphone: Megaphone,
  lock: Lock,
};

const steps = [
  {
    key: "request",
    title: "Request Received",
    subtitle: "Campaign Request Received",
    icon: "check",
  },
  {
    key: "quoted",
    title: "Quoted",
    subtitle: "Quote Provided",
    icon: "quote",
  },
  {
    key: "paid",
    title: "Paid",
    subtitle: "Payment Processed",
    icon: "card",
  },
  {
    key: "promoting",
    title: "Promoting",
    subtitle: "Content is Live",
    icon: "megaphone",
  },
  {
    key: "completed",
    title: "Completed",
    subtitle: "Campaign Finished",
    icon: "lock",
  },
];

export default function CampaignStepper({ currentStep }: StepperProps) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="rounded-xl border bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-green-700">
          <Check className="h-5 w-5" />
          Campaign Progress
        </h3>

        <p className="text-sm">
          Overall Progress{" "}
          <span className="font-semibold text-orange-500">
            {progress}% Completed
          </span>
        </p>
      </div>

      {/* Stepper */}
      <div className="relative flex items-center justify-between">
        {/* Line */}
        <div className="absolute left-0 right-0 top-6 h-[2px] bg-gray-200">
          <div
            className="h-full bg-green-700 transition-all"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, index) => {
          const Icon = icons[step.icon as keyof typeof icons];
          const isCompleted = index <= currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={step.key}
              className="relative z-10 flex w-full flex-col items-center text-center"
            >
              {/* Circle */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white",
                  isCompleted
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-gray-300 text-gray-400",
                  isActive && "ring-4 ring-green-100"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <p className="mt-3 text-sm font-medium">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
