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
  currentStep?: number; // 0..4
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

  if (status === "done" || status === "current") {
    return (
      <div className={`${base} bg-Primary border-Primary text-white`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${base} bg-white border-black/15 text-black/35`}>
      {children}
    </div>
  );
};

const ProgressStepper = ({ currentStep = 1 }: ProgressStepperProps) => {
  const stepsCount = steps.length;
  const progressPct =
    stepsCount <= 1 ? 0 : (currentStep / (stepsCount - 1)) * 100;

  // start line from center of first column and end at center of last column
  const edgeOffsetPct = 100 / (stepsCount * 2); // 5 steps => 10%

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="relative min-w-[720px]">
        {/* Track: exactly from first circle center to last circle center */}
        <div
          className="absolute top-5 h-[2px] bg-black/10"
          style={{
            left: `${edgeOffsetPct}%`,
            right: `${edgeOffsetPct}%`,
          }}
        >
          {/* Progress inside track */}
          <div
            className="h-full bg-Primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

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
                  <p className="mt-0.5 text-[11px] text-black/40">
                    {s.subtitle}
                  </p>
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
