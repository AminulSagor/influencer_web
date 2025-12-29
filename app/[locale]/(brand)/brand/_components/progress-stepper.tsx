import React from "react";
import { Check, Quote, ReceiptText, Megaphone, Lock } from "lucide-react";

type StepperStatus = "done" | "current" | "todo";

type Step = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

type ProgressStepperProps = {
  /** 0..4 (index of current step). If you want “2 progress”, pass 1 (Submitted done, Quoted current) */
  currentStep?: number;
};

const steps: Step[] = [
  {
    key: "submitted",
    title: "Submitted",
    subtitle: "Campaign Request Sent",
    icon: <Check className="h-5 w-5" />,
  },
  {
    key: "quoted",
    title: "Quoted",
    subtitle: "Quote Provided",
    icon: <Quote className="h-5 w-5" />,
  },
  {
    key: "paid",
    title: "Paid",
    subtitle: "Payment Processed",
    icon: <ReceiptText className="h-5 w-5" />,
  },
  {
    key: "promoting",
    title: "Promoting",
    subtitle: "Content is Live",
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    key: "completed",
    title: "Completed",
    subtitle: "Campaign Finished",
    icon: <Lock className="h-5 w-5" />,
  },
];

const getStatus = (i: number, currentStep: number): StepperStatus => {
  if (i < currentStep) return "done";
  if (i === currentStep) return "current";
  return "todo";
};

const StepIcon = ({
  status,
  children,
}: {
  status: StepperStatus;
  children: React.ReactNode;
}) => {
  const base =
    "h-10 w-10 rounded-full flex items-center justify-center border transition-colors";
  if (status === "done")
    return (
      <div className={`${base} bg-Primary border-Primary text-white`}>
        {children}
      </div>
    );
  if (status === "current")
    return (
      <div className={`${base} bg-Primary border-Primary text-white`}>
        {children}
      </div>
    );
  return (
    <div className={`${base} bg-white border-black/15 text-black/35`}>
      {children}
    </div>
  );
};

const ProgressStepper = ({ currentStep = 1 }: ProgressStepperProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        {/* Track */}
        <div className="absolute left-0 right-0 top-5 h-[2px] bg-black/10" />

        {/* Progress (up to current step) */}
        <div
          className="absolute left-0 top-5 h-[2px] bg-Primary transition-all"
          style={{
            width:
              steps.length === 1
                ? "0%"
                : `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative grid grid-cols-5">
          {steps.map((s, i) => {
            const status = getStatus(i, currentStep);

            return (
              <div key={s.key} className="flex flex-col items-center text-center">
                <StepIcon status={status}>{s.icon}</StepIcon>

                <div className="mt-3">
                  <p
                    className={`text-sm font-semibold ${
                      status === "todo" ? "text-black/45" : "text-black/80"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-black/40">{s.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;