import React from "react";
import { Check, Hourglass, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ApprovalStep {
  label: string;
  status: "completed" | "pending";
  subtitle: string;
}

interface Props {
  steps: ApprovalStep[];
}

const ApprovalProgress = ({ steps }: Props) => {
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const totalSteps = steps.length || 1;
  const pendingPercentage =
    100 - Math.round((completedCount / totalSteps) * 100);

  return (
    <Card className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-6 md:py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full text-[#355E1D]">
            <Target className="h-6 w-6 fill-current" />
          </div>
          <h2 className="text-[18px] font-semibold text-[#355E1D]">
            Approval Progress
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-black">Overall Progress</span>
          <span className="font-semibold text-[#D9822B]">
            {pendingPercentage}% Pending
          </span>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <div
          className="relative mx-auto flex min-w-[720px] items-start justify-between"
          style={{ width: `${Math.max(steps.length * 110, 720)}px` }}
        >
          <div className="absolute left-[48px] right-[48px] top-4 h-[1px] bg-gray-300" />

          {steps.map((step) => {
            const isCompleted = step.status === "completed";

            return (
              <div
                key={step.label}
                className="relative z-10 flex w-[110px] flex-col items-center text-center"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isCompleted ? "bg-[#355E1D]" : "bg-[#E5E5E5]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <Hourglass className="h-4 w-4 text-[#9E9E9E]" />
                  )}
                </div>

                <p className="mt-3 text-sm font-medium text-black">
                  {step.label}
                </p>

                <p className="mt-1 text-[11px] text-[#8B8B8B]">
                  {step.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex w-full max-w-[395px] items-center justify-between rounded-xl border border-[#C7D6A4] bg-[#F7F8EE] px-5 py-3">
          <p className="text-sm font-medium text-black">
            Approve With Current Progress!
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="h-8 rounded-xl border-gray-300 bg-[#F4F4F4] px-5 text-xs"
            >
              Reject
            </Button>
            <Button
              variant="lightGreen"
              className="h-8 rounded-xl px-5 text-xs"
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApprovalProgress;