"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  CheckCircle,
  CircleSlash,
  FileText,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import {
  StepThreeData,
  useFormStore,
} from "@/app/[locale]/(brand)/brand/zustand-store/campaign-forms-store";

const Step3 = () => {
  const { decreaseStep, increaseStep } = useCampaignStore();
  const {
    stepThree,
    setStepThree,
    validationErrors,
    setValidationErrors,
    clearValidationErrors,
  } = useFormStore();
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  console.log(stepThree);

  // Validate all required fields
  const validateStep = () => {
    const errors: Record<string, string> = {};

    // List of required fields
    const requiredFields = [
      { key: "campaignGoals", label: "Campaign Goals" },
      { key: "productDetails", label: "Product/Service Details" },
      { key: "dos", label: "Do's" },
      { key: "donts", label: "Don'ts" },
      { key: "termsConditions", label: "Terms & Conditions" },
      { key: "reportingRequirements", label: "Reporting Requirements" },
      { key: "usageRights", label: "Usage Rights" },
      { key: "startingDate", label: "Starting Date" },
      { key: "duration", label: "Duration" },
    ];

    requiredFields.forEach(({ key, label }) => {
      if (!stepThree[key as keyof StepThreeData]?.trim()) {
        errors[key] = `${label} is required`;
      }
    });

    // Set errors in store and local state
    setValidationErrors(errors);
    setLocalErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    clearValidationErrors();
    setLocalErrors({});

    if (validateStep()) {
      increaseStep();
    }
  };

  const handleInputChange = (field: keyof StepThreeData, value: string) => {
    setStepThree({ [field]: value });

    // Clear error for this field when user starts typing
    if (localErrors[field]) {
      const newErrors = { ...localErrors };
      delete newErrors[field];
      setLocalErrors(newErrors);
      setValidationErrors(newErrors);
    }
  };

  const getError = (field: string) => {
    return localErrors[field] || validationErrors[field];
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= LEFT ================= */}
        <Card>
          <CardContent>
            <div className="space-y-6">
              {/* Campaign Goals */}
              <Section
                icon={<ClipboardList className="w-4 h-4 text-Primary" />}
                title="Campaign Goals"
                error={getError("campaignGoals")}
              >
                <Textarea
                  value={stepThree.campaignGoals}
                  onChange={(e) =>
                    handleInputChange("campaignGoals", e.target.value)
                  }
                  placeholder="Enter Brief Description About Your Campaign Goals"
                  className={`min-h-[120px] placeholder:text-light-gray focus-visible:ring-1 ${
                    getError("campaignGoals") ? "border-red-500" : ""
                  }`}
                />
              </Section>

              {/* Product / Service Details */}
              <Section
                icon={<FileText className="w-4 h-4 text-Primary" />}
                title="Product / Service Details"
                error={getError("productDetails")}
              >
                <Textarea
                  value={stepThree.productDetails}
                  onChange={(e) =>
                    handleInputChange("productDetails", e.target.value)
                  }
                  placeholder="Enter Brief Description About Your Product / Service Details"
                  className={`min-h-[120px] placeholder:text-light-gray focus-visible:ring-1 ${
                    getError("productDetails") ? "border-red-500" : ""
                  }`}
                />
              </Section>

              {/* Do's & Don'ts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CircleSlash className="w-4 h-4 text-Primary" />
                  <h2 className="text-base font-semibold text-Primary">
                    Do&apo;s & Don&apo;ts
                  </h2>
                </div>

                {/* Do's */}
                <div className="rounded-xl border border-light-green bg-[#BBF7D0] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-Primary font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Do&apo;s
                  </div>
                  <Textarea
                    value={stepThree.dos}
                    onChange={(e) => handleInputChange("dos", e.target.value)}
                    placeholder={`Ex:\n• Show Authentic Usage, Mention Eco-Friendly Aspects\n• Tag @StyleCo in All Posts\n• Show Products in Natural Lighting\n• Include Discount Code in Captions`}
                    className={`bg-white min-h-[100px] placeholder:text-light-gray focus-visible:ring-1 ${
                      getError("dos") ? "border-red-500" : ""
                    }`}
                  />
                  {getError("dos") && (
                    <p className="text-red-500 text-sm">{getError("dos")}</p>
                  )}
                </div>

                {/* Don'ts */}
                <div className="rounded-xl border border-red-400 bg-[#FECACA] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-red-500 font-semibold">
                    <CircleSlash className="w-4 h-4" />
                    Don&apo;ts
                  </div>
                  <Textarea
                    value={stepThree.donts}
                    onChange={(e) => handleInputChange("donts", e.target.value)}
                    placeholder={`Ex:\n• Misleading Claims\n• Use Competitor Branding\n• Excessive Filters\n• Offensive Language`}
                    className={`bg-white min-h-[100px] placeholder:text-light-gray focus-visible:ring-1 ${
                      getError("donts") ? "border-red-500" : ""
                    }`}
                  />
                  {getError("donts") && (
                    <p className="text-red-500 text-sm">{getError("donts")}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================= RIGHT ================= */}
        <Card>
          <CardContent>
            <div className="space-y-6">
              {/* Terms & Conditions */}
              <Section
                icon={<ShieldCheck className="w-4 h-4 text-Primary" />}
                title="Terms & Conditions"
                error={getError("termsConditions")}
              >
                <Textarea
                  value={stepThree.termsConditions}
                  onChange={(e) =>
                    handleInputChange("termsConditions", e.target.value)
                  }
                  placeholder="Enter Terms & Conditions in details"
                  className={`min-h-[120px] placeholder:text-light-gray focus-visible:ring-1 ${
                    getError("termsConditions") ? "border-red-500" : ""
                  }`}
                />
              </Section>

              {/* Reporting Requirements */}
              <Section
                icon={<ClipboardList className="w-4 h-4 text-Primary" />}
                title="Reporting Requirements"
                error={getError("reportingRequirements")}
              >
                <Textarea
                  value={stepThree.reportingRequirements}
                  onChange={(e) =>
                    handleInputChange("reportingRequirements", e.target.value)
                  }
                  placeholder="Enter Reporting Requirements in details"
                  className={`min-h-[120px] placeholder:text-light-gray focus-visible:ring-1 ${
                    getError("reportingRequirements") ? "border-red-500" : ""
                  }`}
                />
              </Section>

              {/* Usage Rights */}
              <Section
                icon={<ShieldCheck className="w-4 h-4 text-Primary" />}
                title="Usage Rights"
                error={getError("usageRights")}
              >
                <Textarea
                  value={stepThree.usageRights}
                  onChange={(e) =>
                    handleInputChange("usageRights", e.target.value)
                  }
                  placeholder="Enter Usage Rights in details"
                  className={`min-h-[120px] placeholder:text-light-gray focus-visible:ring-1 ${
                    getError("usageRights") ? "border-red-500" : ""
                  }`}
                />
              </Section>

              {/* Starting Date */}
              <Section title="Starting Date" error={getError("startingDate")}>
                <div className="relative">
                  <Input
                    value={stepThree.startingDate}
                    onChange={(e) =>
                      handleInputChange("startingDate", e.target.value)
                    }
                    placeholder="12 December 2025"
                    className={`h-12 pr-10 placeholder:text-light-gray focus-visible:ring-1 ${
                      getError("startingDate") ? "border-red-500" : ""
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange" />
                </div>
              </Section>

              {/* Duration */}
              <Section title="Duration" error={getError("duration")}>
                <Input
                  value={stepThree.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="5 Days"
                  className={`h-12 placeholder:text-light-gray focus-visible:ring-1 ${
                    getError("duration") ? "border-red-500" : ""
                  }`}
                />
              </Section>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Summary */}
      {Object.keys(localErrors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-red-600">
              <p className="font-semibold mb-2">
                Please fill in all required fields:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {Object.values(localErrors).map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* footer */}
      <Card>
        <CardContent>
          <div className="flex justify-end">
            <div className="flex gap-4">
              <SecondaryButton onClick={() => decreaseStep()}>
                Previous
              </SecondaryButton>

              <PrimaryButton className="px-8" onClick={handleNext}>
                Next
              </PrimaryButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step3;

/* ================= Updated Section Component ================= */
const Section = ({
  title,
  icon,
  children,
  error,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-base font-semibold text-Primary">{title}</h2>
    </div>
    {children}
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
