"use client";

import { Check } from "lucide-react";
import clsx from "clsx";

const STEPS = [
  { id: 1, title: "Let’s Get Started", subtitle: "Step 1" },
  { id: 2, title: "Your Preferences", subtitle: "Step 2" },
  { id: 3, title: "Campaign Details", subtitle: "Step 3" },
  { id: 4, title: "Placement & Budget", subtitle: "Step 4" },
  { id: 5, title: "Upload Your Content", subtitle: "Step 5" },
  { id: 6, title: "Review Your Campaign", subtitle: "Step 6" },
];

interface StepperProps {
  currentStep: number;
}

const Stepper = ({ currentStep }: StepperProps) => {
  // Calculate width from first circle center to current circle center
  const getProgressWidth = () => {
    if (STEPS.length <= 1 || currentStep < 1) return "0%";

    // Each step takes 100% / (total steps - 1) of the progress bar
    const stepWidthPercentage = 100 / (STEPS.length - 1);

    // Progress goes from center of first to center of current step
    const width = (currentStep - 1) * stepWidthPercentage;

    return `${width}%`;
  };

  const progressWidth = getProgressWidth();

  return (
    <div className="w-full overflow-x-scroll no-scrollbar overflow-y-scroll">
      {/* Single responsive design for all screens */}
      <div className="relative">
        {/* Background line - starts after first circle, ends before last circle */}
        <div
          className="absolute top-3 xs:top-4 h-px xs:h-[1.5px] sm:h-0.5 bg-gray-200"
          style={{
            left: `calc(${100 / STEPS.length}% / 2)`, // Start from center of first circle
            width: `calc(100% - ${100 / STEPS.length}%)`, // End before center of last circle
          }}
        />

        {/* Progress line - starts from first circle center, ends at current circle center */}
        <div
          className="absolute top-3 xs:top-4 h-px xs:h-[1.5px] sm:h-0.5 bg-light-green transition-all duration-300 ease-in-out"
          style={{
            left: `calc(${100 / STEPS.length}% / 2)`, // Start from center of first circle
            width: progressWidth,
          }}
        />

        <div className="relative flex justify-between">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;
            const isInactive = !isCompleted && !isActive;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
                style={{
                  width: `${100 / STEPS.length}%`,
                  minWidth: "60px", // Prevent collapsing on mobile
                }}
              >
                {/* Circle - Responsive sizes */}
                <div
                  className={clsx(
                    "w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8",
                    "rounded-full flex items-center justify-center border-2",
                    "transition-all duration-300 mb-1 xs:mb-2 relative z-10",
                    {
                      "bg-light-green border-light-green text-white":
                        isCompleted,
                      "border-light-green bg-white shadow-[0_0_0_2px_rgba(122,155,87,0.15)] xs:shadow-[0_0_0_3px_rgba(122,155,87,0.15)] sm:shadow-[0_0_0_4px_rgba(122,155,87,0.15)]":
                        isActive,
                      "border-gray-300 bg-white": isInactive,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check size={10} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                  ) : isActive ? (
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-light-green rounded-full" />
                  ) : (
                    <span className="text-[10px] xs:text-xs text-gray-500">
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Text container */}
                <div className="text-center w-full px-0.5 xs:px-1">
                  {/* Title - Responsive with line clamp */}
                  <p
                    className={clsx(
                      "text-[9px] xs:text-[10px] sm:text-xs font-semibold",
                      "leading-tight mb-0.5 xs:mb-1",
                      "line-clamp-2 h-6 xs:h-7 sm:h-8",
                      "flex items-center justify-center",
                      {
                        "text-light-green": isCompleted || isActive,
                        "text-gray-500": isInactive,
                      }
                    )}
                    title={step.title}
                  >
                    {step.title}
                  </p>

                  {/* Subtitle - Hide on very small screens, show on xs+ */}
                  <p
                    className={clsx(
                      "hidden xs:block text-[9px] xs:text-[10px] sm:text-xs font-medium",
                      {
                        "text-light-green": isCompleted || isActive,
                        "text-gray-400": isInactive,
                      }
                    )}
                  >
                    {step.subtitle}
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

export default Stepper;
