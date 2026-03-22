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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import clsx from "clsx";
import { z } from "zod";
import Loader from "@/components/spin-loader";
import { stepThreeSchema } from "@/schemas/campaign/step3_campaign_validation";
import { notifyError } from "@/utils/toast_util";
import { submitCampaignStepThree } from "@/service/campaign/update-step-3";
import { StepThreePayload } from "@/types/campaign/step3_campaign_type";
import { useTranslations } from "next-intl";

const StepThree = () => {
  const t = useTranslations("brand.CreateCampaignsPage");

  const { decreaseStep, increaseStep, campaignId } = useCampaignStore();
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
    if (!stepThree.startingDate) return undefined;
    const d = new Date(stepThree.startingDate);
    return isNaN(d.getTime()) ? undefined : d;
  }, [stepThree.startingDate]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const validateStep = (): boolean => {
    const result = stepThreeSchema.safeParse(stepThree);

    if (!result.success) {
      const formatted: Record<string, string> = {};

      result.error.issues.forEach((issue: z.ZodIssue) => {
        const field = issue.path[0] as string;
        if (field) {
          formatted[field] = issue.message;
        }
      });

      setValidationErrors(formatted);
      setLocalErrors(formatted);
      return false;
    }

    setValidationErrors({});
    setLocalErrors({});
    return true;
  };

  const handleNext = async () => {
    clearValidationErrors();
    setLocalErrors({});

    if (!validateStep()) return;

    setLoading(true);
    try {
      const payload: StepThreePayload = {
        campaignGoals: stepThree.campaignGoals,
        productServiceDetails: stepThree.productDetails,
        reportingRequirements: stepThree.reportingRequirements,
        usageRights: stepThree.usageRights,
        startingDate: stepThree.startingDate,
        duration: Number(stepThree.duration),
        dos: stepThree.dos,
        donts: stepThree.donts,
      };

      await submitCampaignStepThree(campaignId, payload);

      increaseStep();
    } catch (err: unknown) {
      console.error(err);
      notifyError(t("somethingWentWrongWhileSavingStep3"));
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
        <Card>
          <CardContent>
            <div className="space-y-6">
              <Section
                icon={<ClipboardList className="w-4 h-4 text-Primary" />}
                title={t("campaignGoals")}
                error={getError("campaignGoals")}
              >
                <Textarea
                  value={stepThree.campaignGoals}
                  onChange={(e) =>
                    handleInputChange("campaignGoals", e.target.value)
                  }
                  placeholder={t("enterBriefDescriptionAboutYourCampaignGoals")}
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("campaignGoals"),
                  )}
                />
              </Section>

              <Section
                icon={<FileText className="w-4 h-4 text-Primary" />}
                title={t("productServiceDetails")}
                error={getError("productDetails")}
              >
                <Textarea
                  value={stepThree.productDetails}
                  onChange={(e) =>
                    handleInputChange("productDetails", e.target.value)
                  }
                  placeholder={t(
                    "enterBriefDescriptionAboutYourProductServiceDetails",
                  )}
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("productDetails"),
                  )}
                />
              </Section>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CircleSlash className="w-4 h-4 text-Primary" />
                  <h2 className="text-base font-semibold text-Primary">
                    {t("dosAndDonts")}
                  </h2>
                </div>

                <div className="rounded-xl border border-light-green bg-[#BBF7D0] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-Primary font-semibold">
                    <CheckCircle className="w-4 h-4" /> {t("dos")}
                  </div>
                  <Textarea
                    value={stepThree.dos}
                    onChange={(e) => handleInputChange("dos", e.target.value)}
                    placeholder={t("dosExample")}
                    className={clsx(
                      "bg-white min-h-[100px] placeholder:text-light-gray",
                      inputErrCls("dos"),
                    )}
                  />
                  {getError("dos") && (
                    <p className="text-red-500 text-sm">{getError("dos")}</p>
                  )}
                </div>

                <div className="rounded-xl border border-red-400 bg-[#FECACA] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-red-500 font-semibold">
                    <CircleSlash className="w-4 h-4" /> {t("donts")}
                  </div>
                  <Textarea
                    value={stepThree.donts}
                    onChange={(e) => handleInputChange("donts", e.target.value)}
                    placeholder={t("dontsExample")}
                    className={clsx(
                      "bg-white min-h-[100px] placeholder:text-light-gray",
                      inputErrCls("donts"),
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

        <Card>
          <CardContent>
            <div className="space-y-6">
              <div className="text-Primary font-semibold flex gap-2 items-center">
                <ShieldCheck className="w-5 h-5 text-Primary" />{" "}
                {t("termsAndConditions")}
              </div>

              <Section
                icon={<ClipboardList className="w-4 h-4 text-Primary" />}
                title={t("reportingRequirements")}
                error={getError("reportingRequirements")}
              >
                <Textarea
                  value={stepThree.reportingRequirements}
                  onChange={(e) =>
                    handleInputChange("reportingRequirements", e.target.value)
                  }
                  placeholder={t("enterReportingRequirementsInDetails")}
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("reportingRequirements"),
                  )}
                />
              </Section>

              <Section
                icon={<ShieldCheck className="w-4 h-4 text-Primary" />}
                title={t("usageRights")}
                error={getError("usageRights")}
              >
                <Textarea
                  value={stepThree.usageRights}
                  onChange={(e) =>
                    handleInputChange("usageRights", e.target.value)
                  }
                  placeholder={t("enterUsageRightsInDetails")}
                  className={clsx(
                    "min-h-[120px] placeholder:text-light-gray",
                    inputErrCls("usageRights"),
                  )}
                />
              </Section>

              <Section
                title={t("startingDate")}
                error={getError("startingDate")}
              >
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
                          placeholder={t("startingDatePlaceholder")}
                          className={clsx(
                            "h-12 pr-10 placeholder:text-light-gray cursor-pointer",
                            inputErrCls("startingDate"),
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
                      required={true}
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
                          `${yyyy}-${mm}-${day}`,
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

              <Section title={t("duration")} error={getError("duration")}>
                <Input
                  value={stepThree.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder={t("durationPlaceholder")}
                  inputMode="numeric"
                  className={clsx(
                    "h-12 placeholder:text-light-gray",
                    inputErrCls("duration"),
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
                {t("pleaseFillInAllRequiredFields")}
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
                {t("previous")}
              </SecondaryButton>
              <PrimaryButton
                className="px-8"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <Loader className="h-4 w-4" /> : t("next")}
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
