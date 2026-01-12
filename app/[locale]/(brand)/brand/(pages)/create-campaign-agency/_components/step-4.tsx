"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { X, Check, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3 } from "lucide-react";
import { BsEye } from "react-icons/bs";
import SecondaryButton from "@/app/[locale]/(brand)/brand/_components/secondary-button";
import PrimaryButton from "@/app/[locale]/(brand)/brand/_components/primary-button";
import { useCampaignStore } from "@/app/[locale]/(brand)/brand/zustand-store/create-Campaign-Store";
import axiosInstance from "@/lib/axios";
import axios from "axios";
import Loader from "@/components/spin-loader";
import { notifyError } from "@/helpers/helper";
import { useToken } from "@/hooks/useGetToken";

const StepFour = () => {
  return (
    <div className="space-y-4">
      <BudgetCalculatorSection />
      <CampaignMilestonesSection />
    </div>
  );
};

export default StepFour;

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
  const campaignType = useCampaignStore((s) => s.campaignType);

  const [budget, setBudget] = useState<string>("");
  const [error, setError] = useState<string>("");

  const MIN_BUDGET = 25000;
  const VAT_PERCENTAGE = 15;
  const AGENCY_FEE_MIN = 5;
  const AGENCY_FEE_MAX = 15;
  const EXCHANGE_RATE = 122.37;

  const suggestions = [30000, 50000, 80000, 100000];

  const numericBudget = useMemo(() => {
    const n = parseInt((budget || "").replace(/,/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  }, [budget]);

  const isValidBudget = useMemo(() => {
    if (!budget.trim()) return false;
    if (!numericBudget) return false;
    if (numericBudget < MIN_BUDGET) return false;
    return true;
  }, [budget, numericBudget, MIN_BUDGET]);

  const calculated = useMemo(() => {
    if (!isValidBudget) return null;

    const vatAmount = numericBudget * (VAT_PERCENTAGE / 100);
    const totalWithVAT = numericBudget + vatAmount;

    const agencyFeeMin = totalWithVAT * (AGENCY_FEE_MIN / 100);
    const agencyFeeMax = totalWithVAT * (AGENCY_FEE_MAX / 100);

    const campaignBudgetMin = totalWithVAT - agencyFeeMin;
    const campaignBudgetMax = totalWithVAT - agencyFeeMax;

    const inDollarsMin = campaignBudgetMin / EXCHANGE_RATE;
    const inDollarsMax = campaignBudgetMax / EXCHANGE_RATE;

    return {
      baseBudget: numericBudget,
      vatAmount,
      totalWithVAT,
      agencyFeeMin,
      agencyFeeMax,
      campaignBudgetMin,
      campaignBudgetMax,
      inDollarsMin,
      inDollarsMax,
    };
  }, [
    isValidBudget,
    numericBudget,
    VAT_PERCENTAGE,
    AGENCY_FEE_MIN,
    AGENCY_FEE_MAX,
    EXCHANGE_RATE,
  ]);

  const formatBDT = (amount: number) =>
    `৳${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const formatUSD = (amount: number) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9,]/g, "");
    setBudget(numericValue);

    const n = parseInt(numericValue.replace(/,/g, ""), 10);
    if (!numericValue.trim() || !Number.isFinite(n)) {
      setError("");
      return;
    }
    if (n < MIN_BUDGET) {
      setError(`Minimum budget is ৳${MIN_BUDGET.toLocaleString("en-US")}`);
      return;
    }
    setError("");
  };

  const handleSuggestionClick = (amount: number) => {
    setBudget(amount.toLocaleString("en-US"));
    if (amount < MIN_BUDGET) {
      setError(`Minimum budget is ৳${MIN_BUDGET.toLocaleString("en-US")}`);
    } else {
      setError("");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-Primary">Suggestions</h3>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleSuggestionClick(amount)}
                className="rounded-full bg-Secondary px-3 py-1 text-sm text-Primary cursor-pointer hover:bg-light-green/50 transition-colors"
              >
                {formatBDT(amount)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-12">
          <div className="space-y-2 md:col-span-2">
            <h3 className="text-sm font-semibold text-Primary">
              Enter Budget Amount
            </h3>

            <div className="rounded-xl border border-light-gray bg-white p-4">
              <div className="relative">
                <input
                  value={budget}
                  onChange={handleBudgetChange}
                  className="w-full shadow-none pr-16 text-2xl text-light-green border border-white outline-none placeholder:text-sm placeholder:text-dark-gray"
                  placeholder="Enter Budget here..."
                />
              </div>

              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

              <p className="text-xs text-light-gray text-end pt-10">
                Min: {formatBDT(MIN_BUDGET)}
              </p>
            </div>

            {campaignType === "paid_ad" && (
              <div className="pt-4">
                <p className="font-semibold text-Primary">
                  Net Payable Budget Amount (Inc. Tax)
                </p>
                <h1 className="text-2xl font-semibold text-light-green mt-1">
                  {calculated ? formatBDT(calculated.totalWithVAT) : "৳ 0"}
                </h1>
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-3">
            <h3 className="text-sm font-semibold text-Primary">
              Quote (Budget Breakdown)
            </h3>

            <div className="rounded-xl border border-light-green bg-linear-to-r from-Secondary to-white p-4 space-y-2 text-sm">
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

            {campaignType === "influencer_promotion" && (
              <div className="pt-4 flex justify-between items-center">
                <p className="font-semibold text-Primary">
                  Net Payable Budget Amount (Inc. Tax)
                </p>
                <h1 className="text-2xl font-semibold text-light-green mt-1">
                  {calculated ? formatBDT(calculated.totalWithVAT) : "৳ 0"}
                </h1>
              </div>
            )}

            {campaignType === "paid_ad" && (
              <div className="rounded-xl border border-light-green bg-linear-to-r from-Secondary to-white p-4 space-y-2 text-sm">
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
                      ? `${formatBDT(
                          calculated.campaignBudgetMin
                        )} - ${formatBDT(calculated.campaignBudgetMax)}`
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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

type ApiMilestone = {
  contentTitle: string;
  platform: string;
  contentQuantity: string;
  deliveryDays: number;
  expectedReach: number;
  expectedViews: number;
  expectedLikes: number;
  expectedComments: number;
};

const toPlatformEnum = (platform: string) => {
  const p = platform.trim().toLowerCase();
  if (p === "facebook") return "facebook";
  if (p === "instagram") return "instagram";
  if (p === "youtube") return "youtube";
  if (p === "tiktok") return "tiktok";
  if (p === "twitter") return "twitter";
  if (p === "linkedin") return "linkedin";
  return p || "instagram";
};

const extractNumber = (value: string) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
};

const CampaignMilestonesSection = () => {
  const campaignId = useCampaignStore((s) => s.campaignId);
  const { token } = useToken();
  const { increaseStep, decreaseStep } = useCampaignStore();

  const [openId, setOpenId] = useState<number | null>(null);
  const [showNewMilestoneForm, setShowNewMilestoneForm] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [budget, setBudget] = useState<string>("");

  const [milestones, setMilestones] = useState<
    Array<NewMilestoneForm & { id: number }>
  >([]);

  const MIN_BUDGET = 25000;

  const numericBudget = useMemo(() => {
    const n = parseInt((budget || "").replace(/,/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  }, [budget]);

  const platforms = [
    "Facebook",
    "YouTube",
    "Instagram",
    "TikTok",
    "Twitter",
    "LinkedIn",
  ];

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

  const handleAddMilestoneClick = () => setShowNewMilestoneForm(true);

  const handleInputChange = (field: string, value: string) => {
    setNewMilestone((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
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
    const key = `promotionTarget.${field}`;
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newMilestone.title.trim()) newErrors.title = "Title is required";
    if (!newMilestone.subtitle.trim())
      newErrors.subtitle = "Subtitle is required";
    if (!newMilestone.day.trim()) newErrors.day = "Day is required";
    if (!newMilestone.platform.trim())
      newErrors.platform = "Platform is required";
    if (!newMilestone.promotionTarget.title.trim())
      newErrors["promotionTarget.title"] = "Promotion target title is required";
    if (!newMilestone.promotionTarget.amount.trim())
      newErrors["promotionTarget.amount"] =
        "Promotion target amount is required";
    if (!newMilestone.promotionGoal.trim())
      newErrors.promotionGoal = "Promotion goal is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveMilestone = () => {
    if (!validateForm()) return;

    const id = milestones.length + 1;

    setMilestones((prev) => [
      ...prev,
      {
        id,
        title: newMilestone.title,
        subtitle: newMilestone.subtitle,
        day: newMilestone.day,
        platform: newMilestone.platform,
        promotionTarget: {
          title: newMilestone.promotionTarget.title,
          amount: newMilestone.promotionTarget.amount,
        },
        promotionGoal: newMilestone.promotionGoal,
      },
    ]);

    setNewMilestone({
      title: "",
      subtitle: "",
      day: "",
      platform: "",
      promotionTarget: { title: "", amount: "" },
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
      promotionTarget: { title: "", amount: "" },
      promotionGoal: "",
    });
    setErrors({});
  };

  const handleRemoveMilestone = (id: number) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    setOpenId((prev) => (prev === id ? null : prev));
  };

  const buildApiMilestones = (): ApiMilestone[] => {
    return milestones.map((m) => {
      const deliveryDays = extractNumber(m.day) || 0;

      const expectedReach = extractNumber(m.promotionTarget.amount);
      const expectedViews = extractNumber(m.promotionTarget.amount);
      const expectedLikes = extractNumber(m.promotionTarget.amount);
      const expectedComments = extractNumber(m.promotionTarget.amount);

      return {
        contentTitle: m.title.trim(),
        platform: toPlatformEnum(m.platform),
        contentQuantity: m.subtitle.trim(),
        deliveryDays,
        expectedReach,
        expectedViews,
        expectedLikes,
        expectedComments,
      };
    });
  };

  const validateBeforeSubmit = () => {
    if (milestones.length === 0)
      return "Please add at least one campaign milestone";
    return "";
  };

  const handleNextStep = async () => {
    const msg = validateBeforeSubmit();
    if (msg) {
      notifyError(msg);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        baseBudget: numericBudget,
        milestones: buildApiMilestones(),
      };

      const res = await axiosInstance.patch(
        `/campaign/${campaignId}/step-4`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        increaseStep();
      }
    } catch (err: unknown) {
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
          <div className="space-y-4 w-full">
            <DottedButton onClick={handleAddMilestoneClick}>
              Add another Milestone
            </DottedButton>

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
                        className={`w-full focus-visible:ring-1 ${
                          errors.title ? "border-red-500" : ""
                        }`}
                      />
                      {errors.title && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <Select
                        value={newMilestone.platform}
                        onValueChange={(value) =>
                          handleInputChange("platform", value)
                        }
                      >
                        <SelectTrigger
                          className={`w-full focus-visible:ring-1 ${
                            errors.platform ? "border-red-500" : ""
                          }`}
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
                        className={`w-full focus-visible:ring-1 ${
                          errors.subtitle ? "border-red-500" : ""
                        }`}
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
                        className={`w-full focus-visible:ring-1 ${
                          errors.day ? "border-red-500" : ""
                        }`}
                      />
                      {errors.day && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.day}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className={`w-full h-10 focus-visible:ring-1 ${
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
                          className={`w-full h-10 focus-visible:ring-1 ${
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
                          className={`w-full min-h-[120px] resize-none focus-visible:ring-1 ${
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

          <div className="h-auto bg-light-gray w-1" />

          <div className="w-full items-stretch relative">
            <div className="space-y-4 min-h-[200px]">
              {milestones.length === 0 ? (
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

            <div className="flex justify-end mt-10 lg:absolute bottom-0 right-0">
              <div className="flex gap-4">
                <SecondaryButton onClick={() => decreaseStep()}>
                  Previous
                </SecondaryButton>

                <PrimaryButton
                  className="px-8"
                  onClick={handleNextStep}
                  type="button"
                  disabled={loading}
                >
                  {loading ? <Loader className="h-4 w-4" /> : "Next"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
