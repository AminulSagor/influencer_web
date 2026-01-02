"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

import {
  Target,
  Eye,
  MessageCircle,
  X,
  Heart,
  ChevronDown,
  Check,
  ChevronUp,
} from "lucide-react";

import { ImCheckmark } from "react-icons/im";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Target as TargetIcon } from "lucide-react";
import { BsEye } from "react-icons/bs";
import CollapseCard from "@/app/[locale]/(brand)/brand/_components/collapse-card";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";

const Step4 = () => {
  return (
    <div className="space-y-4">
      <BudgetCalculatorSection />
      <CampaignMilestonesSection />
    </div>
  );
};

export default Step4;

{
  /* row */
}
const Row = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="flex justify-between text-Primary">
    <span className={bold ? "font-semibold" : ""}>{label}</span>
    <span className={bold ? "font-semibold" : ""}>{value}</span>
  </div>
);

const BudgetCalculatorSection = () => {
  const [budget, setBudget] = useState<string>("");
  const [submittedBudget, setSubmittedBudget] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  const MIN_BUDGET = 25000;
  const VAT_PERCENTAGE = 15;
  const AGENCY_FEE_MIN = 5;
  const AGENCY_FEE_MAX = 15;
  const EXCHANGE_RATE = 122.37; // BDT to USD

  const suggestions = [30000, 50000, 80000, 100000];

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and commas
    const numericValue = value.replace(/[^0-9,]/g, "");
    setBudget(numericValue);
    setError("");
  };

  const handleSuggestionClick = (amount: number) => {
    const formattedAmount = amount.toLocaleString("en-US");
    setBudget(formattedAmount);
    setError("");
  };

  const handleSubmit = () => {
    // Remove commas and convert to number
    const numericBudget = parseInt(budget.replace(/,/g, ""));

    if (!budget || isNaN(numericBudget)) {
      setError("Please enter a valid budget amount");
      return;
    }

    if (numericBudget < MIN_BUDGET) {
      setError(`Minimum budget is ৳${MIN_BUDGET.toLocaleString("en-US")}`);
      return;
    }

    setSubmittedBudget(numericBudget);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Calculate all values based on submitted budget
  const calculateValues = () => {
    if (!submittedBudget) return null;

    const vatAmount = submittedBudget * (VAT_PERCENTAGE / 100);
    const totalWithVAT = submittedBudget + vatAmount;

    const agencyFeeMin = totalWithVAT * (AGENCY_FEE_MIN / 100);
    const agencyFeeMax = totalWithVAT * (AGENCY_FEE_MAX / 100);

    const campaignBudgetMin = totalWithVAT - agencyFeeMin;
    const campaignBudgetMax = totalWithVAT - agencyFeeMax;

    const inDollarsMin = campaignBudgetMin / EXCHANGE_RATE;
    const inDollarsMax = campaignBudgetMax / EXCHANGE_RATE;

    return {
      baseBudget: submittedBudget,
      vatAmount,
      totalWithVAT,
      agencyFeeMin,
      agencyFeeMax,
      campaignBudgetMin,
      campaignBudgetMax,
      inDollarsMin,
      inDollarsMax,
    };
  };

  const calculated = calculateValues();

  // Format currency in BDT
  const formatBDT = (amount: number) => {
    return `৳${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Format currency in USD
  const formatUSD = (amount: number) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* Suggestions */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-Primary">Suggestions</h3>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleSuggestionClick(amount)}
                className="rounded-full bg-light-green/30 px-3 py-1 text-sm text-Primary cursor-pointer hover:bg-light-green/50 transition-colors"
              >
                {formatBDT(amount)}
              </button>
            ))}
          </div>
        </div>

        {/* Budget + Quote */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-12 xl:gap-24">
          {/* Enter Budget */}
          <div className="space-y-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-Primary">
              Enter Budget Amount
            </h3>

            <div className="rounded-xl border border-light-gray bg-white p-4">
              <div className="relative">
                <Input
                  value={budget}
                  onChange={handleBudgetChange}
                  onKeyDown={handleKeyPress}
                  className="border-none shadow-none focus-visible:ring-0 pr-16"
                  placeholder="Enter Budget here..."
                />
                {/* <PrimaryButton
                  type="button"
                  onClick={handleSubmit}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2"
                >
                  Calculate
                </PrimaryButton> */}
              </div>

              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

              <p className="text-xs text-light-gray text-end pt-10">
                Min: {formatBDT(MIN_BUDGET)}
              </p>
            </div>

            {/* Net Payable */}
            <div className="pt-4">
              <p className="font-semibold text-Primary">
                Net Payable Budget Amount (Inc. Tax)
              </p>
              <h1 className="text-2xl font-semibold text-light-green mt-1">
                {calculated ? formatBDT(calculated.totalWithVAT) : "৳ 0"}
              </h1>
            </div>
          </div>

          {/* Quote */}
          <div className="space-y-2 md:col-span-4">
            <h3 className="text-sm font-semibold text-Primary">
              Quote (Budget Breakdown)
            </h3>

            <div className="rounded-xl border border-light-green bg-linear-to-r from-light-green/20 to-white p-4 space-y-2 text-sm">
              <Row
                label="Base Campaign Budget"
                value={calculated ? formatBDT(calculated.baseBudget) : "৳0"}
              />
              <Row
                label={`+ VAT/Tax (${VAT_PERCENTAGE}%)`}
                value={calculated ? formatBDT(calculated.vatAmount) : "৳0"}
              />
              <div className="border border-light-gray" />
              <Row
                label="Budget Including Tax"
                value={calculated ? formatBDT(calculated.totalWithVAT) : "৳0"}
                bold
              />
            </div>

            <div className="rounded-xl border border-light-green bg-linear-to-r from-light-green/20 to-white p-4 space-y-2 text-sm">
              <Row
                label={`Agency Fee (${AGENCY_FEE_MIN} - ${AGENCY_FEE_MAX}%)`}
                value={
                  calculated
                    ? `${formatBDT(calculated.agencyFeeMin)} - ${formatBDT(
                        calculated.agencyFeeMax
                      )}`
                    : "৳0 - ৳0"
                }
              />
              <div className="border border-light-gray" />
              <Row
                label="Campaign Budget Excluding Agency Fee"
                value={
                  calculated
                    ? `${formatBDT(calculated.campaignBudgetMin)} - ${formatBDT(
                        calculated.campaignBudgetMax
                      )}`
                    : "৳0 - ৳0"
                }
              />
              <Row
                label={`In Dollars ( based on avg. ${EXCHANGE_RATE} BDT/$)`}
                value={
                  calculated
                    ? `${formatUSD(calculated.inDollarsMin)} - ${formatUSD(
                        calculated.inDollarsMax
                      )}`
                    : "$0.00 - $0.00"
                }
                bold
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

{
  /* selection */
}
interface Milestone {
  id: number;
  title: string;
  subtitle: string;
  day: string;
  platform: string;
  promotionTarget?: {
    title: string;
    amount: string;
  };
  promotionGoal?: string;
}

interface NewMilestoneForm {
  title: string;
  subtitle: string;
  day: string;
  platform: string;
  promotionTarget: {
    title: string;
    amount: string;
  };
  promotionGoal: string;
}

const CampaignMilestonesSection = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const increaseStep = useCampaignStore((s) => s.increaseStep);
  const decreaseStep = useCampaignStore((s) => s.decreaseStep);

  const [showNewMilestoneForm, setShowNewMilestoneForm] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMilestone, setNewMilestone] = useState<NewMilestoneForm>({
    title: "",
    subtitle: "",
    day: "",
    platform: "",
    promotionTarget: {
      title: "",
      amount: "",
    },
    promotionGoal: "",
  });

  const platforms = [
    "Facebook",
    "YouTube",
    "Instagram",
    "TikTok",
    "Twitter",
    "LinkedIn",
  ];

  const handleAddMilestoneClick = () => {
    setShowNewMilestoneForm(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewMilestone((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePromotionTargetChange = (
    field: "title" | "amount",
    value: string
  ) => {
    setNewMilestone((prev) => ({
      ...prev,
      promotionTarget: {
        ...prev.promotionTarget,
        [field]: value,
      },
    }));
    if (errors[`promotionTarget.${field}`]) {
      setErrors((prev) => ({ ...prev, [`promotionTarget.${field}`]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newMilestone.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!newMilestone.subtitle.trim()) {
      newErrors.subtitle = "Subtitle is required";
    }
    if (!newMilestone.day.trim()) {
      newErrors.day = "Day is required";
    }
    if (!newMilestone.platform.trim()) {
      newErrors.platform = "Platform is required";
    }
    if (!newMilestone.promotionTarget.title.trim()) {
      newErrors["promotionTarget.title"] = "Promotion target title is required";
    }
    if (!newMilestone.promotionTarget.amount.trim()) {
      newErrors["promotionTarget.amount"] =
        "Promotion target amount is required";
    }
    if (!newMilestone.promotionGoal.trim()) {
      newErrors.promotionGoal = "Promotion goal is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveMilestone = () => {
    if (!validateForm()) {
      return;
    }

    const newMilestoneData: Milestone = {
      id: milestones.length + 1,
      title: newMilestone.title,
      subtitle: newMilestone.subtitle,
      day: newMilestone.day,
      platform: newMilestone.platform,
      promotionTarget: {
        title: newMilestone.promotionTarget.title,
        amount: newMilestone.promotionTarget.amount,
      },
      promotionGoal: newMilestone.promotionGoal,
    };

    setMilestones((prev) => [...prev, newMilestoneData]);

    // Reset form
    setNewMilestone({
      title: "",
      subtitle: "",
      day: "",
      platform: "",
      promotionTarget: {
        title: "",
        amount: "",
      },
      promotionGoal: "",
    });

    setErrors({});
  };

  const handleCancelMilestone = () => {
    setShowNewMilestoneForm(false);
    setNewMilestone({
      title: "",
      subtitle: "",
      day: "",
      platform: "",
      promotionTarget: {
        title: "",
        amount: "",
      },
      promotionGoal: "",
    });
    setShowNewMilestoneForm(false);
    setErrors({});
  };

  const handleRemoveMilestone = (id: number) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <div className="flex items-center gap-1">
          <Image
            src={"/influencer-images/milestone flask.png"}
            alt="flask"
            height={22}
            width={22}
          />
          <h3 className="text-base font-semibold text-Primary">
            Campaign Milestones
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* LEFT: Create Milestone */}
          <div className="space-y-4 w-full">
            <DottedButton onClick={handleAddMilestoneClick}>
              Add another Milestone
            </DottedButton>

            {/* New Milestone Form */}
            {showNewMilestoneForm && (
              <Card className="rounded-xl border border-light-green shadow-none">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <p className="bg-light-green flex justify-center p-3 text-sm text-white items-center w-5 h-5 rounded-full">
                      {milestones.length + 1}
                    </p>
                    <p className="flex items-center gap-4 text-Primary">
                      <button
                        type="button"
                        onClick={handleSaveMilestone}
                        className="cursor-pointer text-light-green hover:text-Primary"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelMilestone}
                        className="cursor-pointer text-light-green hover:text-Primary"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={newMilestone.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Ex: Initial Content Creation"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>
                    {/* Platform Selector */}
                    <div className="flex-1">
                      <Select
                        value={newMilestone.platform}
                        onValueChange={(value) =>
                          handleInputChange("platform", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.platform ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {platforms.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.platform && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.platform}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={newMilestone.subtitle}
                        onChange={(e) =>
                          handleInputChange("subtitle", e.target.value)
                        }
                        placeholder="1 Sponsered Video / 1 Post"
                        className={errors.subtitle ? "border-red-500" : ""}
                      />
                      {errors.subtitle && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={newMilestone.day}
                        onChange={(e) =>
                          handleInputChange("day", e.target.value)
                        }
                        placeholder="DAY 1"
                        className={errors.day ? "border-red-500" : ""}
                      />
                      {errors.day && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.day}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT: Promotion Target */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-Primary" />
                        <p className="text-base font-semibold text-Primary">
                          Promotion Target
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BsEye className="w-4 h-4 text-light-green" />
                          <Label className="text-xs font-semibold text-Primary">
                            Target Title (Ex: Reach, Like, Follow, Comments)
                          </Label>
                        </div>
                        <Input
                          value={newMilestone.promotionTarget.title}
                          onChange={(e) =>
                            handlePromotionTargetChange("title", e.target.value)
                          }
                          placeholder="Reach"
                          className={`h-10 ${
                            errors["promotionTarget.title"]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors["promotionTarget.title"] && (
                          <p className="text-xs text-red-500">
                            {errors["promotionTarget.title"]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-Primary">
                          Target Amount (Ex: 300k, 2.5M)
                        </Label>
                        <Input
                          value={newMilestone.promotionTarget.amount}
                          onChange={(e) =>
                            handlePromotionTargetChange(
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="2.5M"
                          className={`h-10 ${
                            errors["promotionTarget.amount"]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors["promotionTarget.amount"] && (
                          <p className="text-xs text-red-500">
                            {errors["promotionTarget.amount"]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Promotion Goal */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-Primary" />
                        <p className="text-base font-semibold text-Primary">
                          Promotion Goal
                        </p>
                      </div>

                      <div>
                        <Textarea
                          value={newMilestone.promotionGoal}
                          onChange={(e) =>
                            handleInputChange("promotionGoal", e.target.value)
                          }
                          placeholder="Describe Your Milestone Goal Here, What You Want To Achieve Specifically"
                          className={`min-h-[120px] resize-none ${
                            errors.promotionGoal ? "border-red-500" : ""
                          }`}
                        />
                        {errors.promotionGoal && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.promotionGoal}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="h-auto bg-light-gray w-1 border" />

          {/* RIGHT: Milestone List */}
          <div className="w-full items-stretch">
            <div className="space-y-4 min-h-[200px]">
              {milestones.length === 0 ? (
                // Empty state - centered message
                <div className="flex flex-col items-center justify-center  border border-dashed border-light-gray rounded-xl py-10">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-light-green/10">
                      <BarChart3 className="h-6 w-6 text-light-green" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 mb-1">
                      No milestone added yet
                    </h3>
                    <p className="text-sm text-gray-500 max-w-[200px]">
                      Add your first milestone to get started
                    </p>
                  </div>
                </div>
              ) : (
                // Milestones list
                <div className="space-y-4">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`border border-light-green p-3 md:px-5 rounded-lg ${
                        openId === m.id ? "h-full" : "h-18 overflow-hidden"
                      }`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="flex h-6 w-6 items-center justify-center rounded-full bg-light-green text-white font-semibold text-sm">
                                {m.id}
                              </p>

                              <p className="text-Primary font-semibold text-base">
                                {m.title}
                              </p>
                            </div>
                            <p className="text-sm text-dark-gray mt-1 px-2">
                              {m.subtitle}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-3 text-light-green">
                              <p className="text-sm">{m.day}</p>
                              <button
                                type="button"
                                onClick={() => handleRemoveMilestone(m.id)}
                                className=""
                              >
                                <X className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() =>
                                  setOpenId(openId === m.id ? null : m.id)
                                }
                                className="cursor-pointer"
                              >
                                <ChevronUp
                                  size={25}
                                  className={`${
                                    openId === m.id &&
                                    "rotate-180 ease-in-out transition-all"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="px-3">
                          {/* Text */}
                          <div className="space-y-1">
                            <p className="text-sm text-dark-gray">
                              {m.subtitle}
                            </p>
                            <p className="text-xs text-gray-400">
                              Platform: {m.platform}
                            </p>
                            {m.promotionTarget && (
                              <div className="text-xs text-gray-400 mt-1">
                                Target: {m.promotionTarget.title} -{" "}
                                {m.promotionTarget.amount}
                              </div>
                            )}
                            {m.promotionGoal && (
                              <div className="text-xs text-gray-400 mt-1">
                                Goal: {m.promotionGoal.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-10">
              <div className="flex gap-4">
                <SecondaryButton onClick={() => decreaseStep()}>
                  Previous
                </SecondaryButton>

                <PrimaryButton
                  className="px-8"
                  onClick={() => {
                    if (!validateForm()) {
                      return;
                    } else {
                      increaseStep();
                    }
                  }}
                  type="submit"
                >
                  Next
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
