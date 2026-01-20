import React from "react";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ApprovalProgress = () => {
  const steps = [
    { label: "Niches", status: "completed", subtitle: "3 Approved" },
    { label: "Social Links", status: "completed", subtitle: "3 Approved" },
    { label: "NID", status: "completed", subtitle: "Approved" },
    { label: "Trade License", status: "completed", subtitle: "Approved" },
    { label: "TIN", status: "pending", subtitle: "Pending" },
    { label: "BIN", status: "pending", subtitle: "Pending" },
    {
      label: "Payment Setup",
      status: "pending",
      subtitle: "1 Approved 2 Pending",
    },
    { label: "Email", status: "pending", subtitle: "Pending" },
  ];

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const totalSteps = steps.length;
  const progressPercentage = Math.round((completedCount / totalSteps) * 100);

  return (
    <Card className="w-full max-w-7xl mx-auto p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Approval Progress
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Overall Progress</span>
          <span className="text-orange-500 font-semibold text-lg">
            {progressPercentage}% Pending
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative mb-8">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center relative"
              style={{ width: `${100 / steps.length}%` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 ${
                    step.status === "completed" ? "bg-green-700" : "bg-gray-300"
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Step Circle */}
              <div className="relative z-10 mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === "completed" ? "bg-green-700" : "bg-gray-300"
                  }`}
                >
                  {step.status === "completed" ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Step Label */}
              <div className="text-center">
                <div className="font-medium text-gray-800 text-sm mb-1">
                  {step.label}
                </div>
                <div
                  className={`text-xs ${
                    step.status === "completed"
                      ? "text-gray-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ApprovalProgress;
