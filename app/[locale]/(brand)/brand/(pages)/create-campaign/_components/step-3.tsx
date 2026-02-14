"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
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
//import axiosInstance from "@/lib/axios";
import axios from "axios";
import Loader from "@/components/spin-loader";
import { notifyError } from "@/utils/toast_util";
//import { useToken } from "@/hooks/useGetToken";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import clsx from "clsx";
import { apiClient } from "@/api/base/axios_client";

const StepThree = () => {
  const { decreaseStep, increaseStep } = useCampaignStore();
  const campaignId = useCampaignStore((s) => s.campaignId);
  // const { token } = useToken();

  const {
    stepThree,
    setStepThree,
    validationErrors,
    setValidationErrors,
    clearValidationErrors,
  } = useFormStore();

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const selectedDate = useMemo(() => {
    const v = stepThree.startingDate?.trim();
    if (!v) return undefined;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }, [stepThree.startingDate]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const validateStep = () => {
    const errors: Record<string, string> = {};

    const requiredFields: Array<{ key: keyof StepThreeData; label: string }> = [
      { key: "campaignGoals", label: "Campaign Goals" },
      { key: "productDetails", label: "Product/Service Details" },
      { key: "dos", label: "Do's" },
      { key: "donts", label: "Don'ts" },
      { key: "reportingRequirements", label: "Reporting Requirements" },
      { key: "usageRights", label: "Usage Rights" },
      { key: "startingDate", label: "Starting Date" },
      { key: "duration", label: "Duration" },
    ];

    requiredFields.forEach(({ key, label }) => {
      if (!stepThree[key]?.trim()) {
        errors[key] = `${label} is required`;
      }
    });

    if (stepThree.duration?.trim()) {
      const n = Number(stepThree.duration);
      if (!Number.isFinite(n) || n <= 0) {
        errors.duration = "Duration must be a positive number";
      }
    }

    if (stepThree.startingDate?.trim()) {
      const d = new Date(stepThree.startingDate);
      if (Number.isNaN(d.getTime())) {
        errors.startingDate = "Please select a valid starting date";
      } else {
        const dd = new Date(d);
        dd.setHours(0, 0, 0, 0);
        if (dd < today) errors.startingDate = "Starting date can't be past";
      }
    }

    setValidationErrors(errors);
    setLocalErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    clearValidationErrors();
    setLocalErrors({});

    if (!validateStep()) return;

    setLoading(true);
    try {
      const payload = {
        campaignGoals: stepThree.campaignGoals.trim(),
        productServiceDetails: stepThree.productDetails.trim(),
        reportingRequirements: stepThree.reportingRequirements.trim(),
        usageRights: stepThree.usageRights.trim(),
        dos: stepThree.dos.trim(),
        donts: stepThree.donts.trim(),
        startingDate: stepThree.startingDate.trim(),
        duration: Number(stepThree.duration),
      };

      const res = await apiClient.patch(
        `/campaign/${campaignId}/step-3`,
        payload
      );

      if (res.status === 200 || res.status === 201) {
        increaseStep();
      }
    } catch (err: unknown) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.";
        notifyError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StepThreeData, value: string) => {
    setStepThree({ [field]: value });

    if (localErrors[field]) {
      const next = { ...localErrors };
      delete next[field];
      setLocalErrors(next);
      setValidationErrors(next);
    }
  };

  const getError = (field: string) =>
    localErrors[field] || validationErrors[field];

  const inputErrCls = (field: string) =>
    clsx("focus-visible:ring-1", getError(field) && "border-red-500");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= LEFT ================= */}
        <Card>
          <CardContent>
            <div className="space-y-6">
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
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("campaignGoals")
                  )}
                />
              </Section>

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
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("productDetails")
                  )}
                />
              </Section>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CircleSlash className="w-4 h-4 text-Primary" />
                  <h2 className="text-base font-semibold text-Primary">
                    Do&apos;s & Don&apos;ts
                  </h2>
                </div>

                <div className="rounded-xl border border-light-green bg-[#BBF7D0] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-Primary font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Do&apos;s
                  </div>
                  <Textarea
                    value={stepThree.dos}
                    onChange={(e) => handleInputChange("dos", e.target.value)}
                    placeholder={`Ex:\n• Show Authentic Usage, Mention Eco-Friendly Aspects\n• Tag @StyleCo in All Posts\n• Show Products in Natural Lighting\n• Include Discount Code in Captions`}
                    className={clsx(
                      "bg-white min-h-[100px] placeholder:text-light-gray",
                      inputErrCls("dos")
                    )}
                  />
                  {getError("dos") && (
                    <p className="text-red-500 text-sm">{getError("dos")}</p>
                  )}
                </div>

                <div className="rounded-xl border border-red-400 bg-[#FECACA] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-red-500 font-semibold">
                    <CircleSlash className="w-4 h-4" />
                    Don&apos;ts
                  </div>
                  <Textarea
                    value={stepThree.donts}
                    onChange={(e) => handleInputChange("donts", e.target.value)}
                    placeholder={`Ex:\n• Misleading Claims\n• Use Competitor Branding\n• Excessive Filters\n• Offensive Language`}
                    className={clsx(
                      "bg-white min-h-[100px] placeholder:text-light-gray",
                      inputErrCls("donts")
                    )}
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
              <div className="text-Primary font-semibold flex gap-2 items-center">
                <span>
                  <ShieldCheck className="w-5 h-5 text-Primary" />
                </span>
                <span>Terms And Conditions</span>
              </div>

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
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("reportingRequirements")
                  )}
                />
              </Section>

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
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("usageRights")
                  )}
                />
              </Section>

              <Section title="Starting Date" error={getError("startingDate")}>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="w-full">
                      <div className="relative">
                        <Input
                          readOnly
                          value={
                            selectedDate
                              ? format(selectedDate, "dd MMMM yyyy")
                              : ""
                          }
                          placeholder="12 December 2025"
                          className={clsx(
                            "h-12 pr-10 placeholder:text-light-gray cursor-pointer",
                            inputErrCls("startingDate")
                          )}
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange" />
                      </div>
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => {
                        if (!d) return;
                        const dd = new Date(d);
                        dd.setHours(0, 0, 0, 0);
                        if (dd < today) return;

                        const yyyy = dd.getFullYear();
                        const mm = String(dd.getMonth() + 1).padStart(2, "0");
                        const day = String(dd.getDate()).padStart(2, "0");
                        handleInputChange(
                          "startingDate",
                          `${yyyy}-${mm}-${day}`
                        );
                      }}
                      disabled={(date) => {
                        const dd = new Date(date);
                        dd.setHours(0, 0, 0, 0);
                        return dd < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </Section>

              <Section title="Duration" error={getError("duration")}>
                <Input
                  value={stepThree.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="30"
                  inputMode="numeric"
                  className={clsx(
                    "h-12 placeholder:text-light-gray",
                    inputErrCls("duration")
                  )}
                />
              </Section>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <Card>
        <CardContent>
          <div className="flex justify-end">
            <div className="flex gap-4">
              <SecondaryButton onClick={() => decreaseStep()}>
                Previous
              </SecondaryButton>

              <PrimaryButton
                className="px-8"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <Loader className="h-4 w-4" /> : "Next"}
              </PrimaryButton>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepThree;

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
