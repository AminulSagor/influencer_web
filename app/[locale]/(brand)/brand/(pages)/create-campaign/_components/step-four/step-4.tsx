"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DottedButton from "@/app/[locale]/(brand)/brand/_components/dotted-button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  X,
  Check,
  ChevronUp,
  Target,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";
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
import Loader from "@/components/spin-loader";
import { notifyError } from "@/utils/toast_util";
import {
  serviceMilestone,
  NewMilestoneForm,
} from "@/types/client/campaigns/create-campaign-types";
import { submitCampaignStepFour } from "@/service/campaign/update-step-4";
import { stepFourSchema } from "@/schemas/campaign/step4_campaign_validation";
import { buildStepFourPayload } from "@/utils/campaigns/step_4_util";
import { useTranslations } from "next-intl";

type BudgetPros = {
  budget: string;
  setBudget: (v: string) => void;
};

const StepFour = () => {
  const [budget, setBudget] = useState<string>("");
  return (
    <div className="space-y-4">
      <BudgetCalculatorSection budget={budget} setBudget={setBudget} />
      <CampaignMilestonesSection budget={budget} />
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

const BudgetCalculatorSection = ({ budget, setBudget }: BudgetPros) => {
  const t = useTranslations("brand.CreateCampaignsPage");
  const campaignType = useCampaignStore((s) => s.campaignType);
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
      setError(
        t("minimumBudgetIs", {
          amount: `৳${MIN_BUDGET.toLocaleString("en-US")}`,
        }),
      );
      return;
    }
    setError("");
  };

  const handleSuggestionClick = (amount: number) => {
    setBudget(amount.toLocaleString("en-US"));
    if (amount < MIN_BUDGET) {
      setError(
        t("minimumBudgetIs", {
          amount: `৳${MIN_BUDGET.toLocaleString("en-US")}`,
        }),
      );
    } else {
      setError("");
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-Primary">
            {t("suggestions")}
          </h3>
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
              {t("enterBudgetAmount")}
            </h3>

            <div className="rounded-xl border border-light-gray bg-white p-4">
              <div className="relative">
                <input
                  value={budget}
                  onChange={handleBudgetChange}
                  className="w-full shadow-none pr-16 text-2xl text-light-green border border-white outline-none placeholder:text-sm placeholder:text-dark-gray"
                  placeholder={t("enterBudgetHere")}
                />
              </div>

              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

              <p className="text-xs text-light-gray text-end pt-10">
                {t("minLabel")}: {formatBDT(MIN_BUDGET)}
              </p>
            </div>

            {campaignType === "paid_ad" && (
              <div className="pt-4">
                <p className="font-semibold text-Primary">
                  {t("netPayableBudgetAmountIncTax")}
                </p>
                <h1 className="text-2xl font-semibold text-light-green mt-1">
                  {calculated ? formatBDT(calculated.totalWithVAT) : "৳ 0"}
                </h1>
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-3">
            <h3 className="text-sm font-semibold text-Primary">
              {t("quoteBudgetBreakdown")}
            </h3>

            <div className="rounded-xl border border-light-green bg-linear-to-r from-Secondary to-white p-4 space-y-2 text-sm">
              <Row
                label={t("baseCampaignBudget")}
                value={calculated ? formatBDT(calculated.baseBudget) : "৳0"}
              />
              <Row
                label={t("vatTaxLabel", { percentage: VAT_PERCENTAGE })}
                value={calculated ? formatBDT(calculated.vatAmount) : "৳0"}
              />
              <div className="border border-light-gray" />
              <Row
                label={t("budgetIncludingTax")}
                value={calculated ? formatBDT(calculated.totalWithVAT) : "৳0"}
                bold
              />
            </div>

            {campaignType === "influencer_promotion" && (
              <div className="pt-4 flex justify-between items-center">
                <p className="font-semibold text-Primary">
                  {t("netPayableBudgetAmountIncTax")}
                </p>
                <h1 className="text-2xl font-semibold text-light-green mt-1">
                  {calculated ? formatBDT(calculated.totalWithVAT) : "৳ 0"}
                </h1>
              </div>
            )}

            {campaignType === "paid_ad" && (
              <div className="rounded-xl border border-light-green bg-linear-to-r from-Secondary to-white p-4 space-y-2 text-sm">
                <Row
                  label={t("agencyFeeRange", {
                    min: AGENCY_FEE_MIN,
                    max: AGENCY_FEE_MAX,
                  })}
                  value={
                    calculated
                      ? `${formatBDT(calculated.agencyFeeMin)} - ${formatBDT(
                          calculated.agencyFeeMax,
                        )}`
                      : "৳0 - ৳0"
                  }
                />
                <div className="border border-light-gray" />
                <Row
                  label={t("campaignBudgetExcludingAgencyFee")}
                  value={
                    calculated
                      ? `${formatBDT(
                          calculated.campaignBudgetMin,
                        )} - ${formatBDT(calculated.campaignBudgetMax)}`
                      : "৳0 - ৳0"
                  }
                />
                <Row
                  label={t("inDollarsBasedOnAvg", {
                    rate: EXCHANGE_RATE,
                  })}
                  value={
                    calculated
                      ? `${formatUSD(calculated.inDollarsMin)} - ${formatUSD(
                          calculated.inDollarsMax,
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

const extractNumberLegacy = (value: string) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? n : 0;
};

const CampaignMilestonesSection = ({ budget }: { budget: string }) => {
  const t = useTranslations("brand.CreateCampaignsPage");
  const campaignId = useCampaignStore((s) => s.campaignId);
  const { increaseStep, decreaseStep } = useCampaignStore();
  const campaignType = useCampaignStore((s) => s.campaignType);

  const [openId, setOpenId] = useState<number | null>(null);
  const [showNewMilestoneForm, setShowNewMilestoneForm] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  type MilestoneLocalForm = NewMilestoneForm & {
    expectedReach?: string;
    expectedViews?: string;
    expectedLikes?: string;
    expectedComments?: string;
  };

  const [milestones, setMilestones] = useState<
    Array<MilestoneLocalForm & { id: number }>
  >([]);

  const platforms = ["Facebook", "YouTube", "Instagram", "TikTok"];

  const [newMilestone, setNewMilestone] = useState<MilestoneLocalForm>({
    title: "",
    subtitle: "",
    day: "",
    platform: "",
    promotionTarget: {
      title: "",
      amount: "",
    },
    promotionGoal: "",
    expectedReach: "",
    expectedViews: "",
    expectedLikes: "",
    expectedComments: "",
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
    value: string,
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

  const handleMetricChange = (
    field:
      | "expectedReach"
      | "expectedViews"
      | "expectedLikes"
      | "expectedComments",
    value: string,
  ) => {
    const cleaned = value.replace(/[^0-9kKmM. ]/g, "");
    setNewMilestone((prev) => ({ ...prev, [field]: cleaned }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newMilestone.title.trim()) newErrors.title = t("titleIsRequired");
    if (!newMilestone.subtitle.trim())
      newErrors.subtitle = t("subtitleIsRequired");
    if (!newMilestone.day.trim()) newErrors.day = t("dayIsRequired");
    if (!newMilestone.platform.trim())
      newErrors.platform = t("platformIsRequired");

    if (campaignType === "paid_ad") {
      if (!newMilestone.promotionTarget.title.trim())
        newErrors["promotionTarget.title"] = t(
          "promotionTargetTitleIsRequired",
        );
      if (!newMilestone.promotionTarget.amount.trim())
        newErrors["promotionTarget.amount"] = t(
          "promotionTargetAmountIsRequired",
        );
      if (!newMilestone.promotionGoal.trim())
        newErrors.promotionGoal = t("promotionGoalIsRequired");
    } else {
      if (!newMilestone.expectedReach?.trim())
        newErrors.expectedReach = t("reachIsRequired");
      if (!newMilestone.expectedViews?.trim())
        newErrors.expectedViews = t("viewsIsRequired");
      if (!newMilestone.expectedLikes?.trim())
        newErrors.expectedLikes = t("likesIsRequired");
      if (!newMilestone.expectedComments?.trim())
        newErrors.expectedComments = t("commentsIsRequired");
    }

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
        expectedReach: newMilestone.expectedReach || "",
        expectedViews: newMilestone.expectedViews || "",
        expectedLikes: newMilestone.expectedLikes || "",
        expectedComments: newMilestone.expectedComments || "",
      },
    ]);

    setNewMilestone({
      title: "",
      subtitle: "",
      day: "",
      platform: "",
      promotionTarget: { title: "", amount: "" },
      promotionGoal: "",
      expectedReach: "",
      expectedViews: "",
      expectedLikes: "",
      expectedComments: "",
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
      expectedReach: "",
      expectedViews: "",
      expectedLikes: "",
      expectedComments: "",
    });
    setErrors({});
  };

  const handleRemoveMilestone = (id: number) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    setOpenId((prev) => (prev === id ? null : prev));
  };

  const buildserviceMilestones = (): serviceMilestone[] => {
    return milestones.map((m) => {
      const deliveryDays = extractNumberLegacy(m.day) || 0;

      if (campaignType === "paid_ad") {
        const metricTitle = (m.promotionTarget?.title || "").toLowerCase();
        const metricValue = extractNumberLegacy(
          m.promotionTarget?.amount || "",
        );

        const base: serviceMilestone = {
          contentTitle: m.title.trim(),
          platform: toPlatformEnum(m.platform),
          contentQuantity: m.subtitle.trim(),
          deliveryDays,
          promotionGoal: (m.promotionGoal || "").trim(),
          order: m.id,
        };

        if (metricTitle.includes("reach")) base.expectedReach = metricValue;
        else if (metricTitle.includes("view")) base.expectedViews = metricValue;
        else if (metricTitle.includes("like")) base.expectedLikes = metricValue;
        else if (metricTitle.includes("comment"))
          base.expectedComments = metricValue;
        else base.expectedViews = metricValue;

        return base;
      }

      return {
        contentTitle: m.title.trim(),
        platform: toPlatformEnum(m.platform),
        contentQuantity: m.subtitle.trim(),
        deliveryDays,
        expectedReach: extractNumberLegacy(m.expectedReach || ""),
        expectedViews: extractNumberLegacy(m.expectedViews || ""),
        expectedLikes: extractNumberLegacy(m.expectedLikes || ""),
        expectedComments: extractNumberLegacy(m.expectedComments || ""),
      };
    });
  };

  const handleNextStep = async () => {
    const payload = buildStepFourPayload(budget, milestones, campaignType);
    const validation = stepFourSchema.safeParse(payload);

    if (!validation.success) {
      notifyError(validation.error.issues[0]?.message || t("validationFailed"));
      return;
    }

    setLoading(true);
    try {
      await submitCampaignStepFour(campaignId, payload);
      increaseStep();
    } catch (err: any) {
      notifyError(err?.message || t("failedToSaveStep4"));
    } finally {
      setLoading(false);
    }
  };

  const METRICS = [
    {
      key: "expectedReach" as const,
      label: t("reach"),
      icon: <Target className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
    {
      key: "expectedViews" as const,
      label: t("views"),
      icon: <Eye className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
    {
      key: "expectedLikes" as const,
      label: t("likes"),
      icon: <Heart className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
    {
      key: "expectedComments" as const,
      label: t("comments"),
      icon: <MessageCircle className="w-4 h-4 text-light-green" />,
      placeholder: "0",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-1">
          <Image
            src={"/influencer-images/milestone flask.png"}
            alt="flask"
            height={22}
            width={22}
          />
          <h3 className="text-base font-semibold text-Primary">
            {t("campaignMilestones")}
          </h3>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6 xl:gap-9">
          <div className="space-y-4 w-full">
            <DottedButton onClick={handleAddMilestoneClick}>
              {t("addAnotherMilestone")}
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
                        placeholder={t("initialContentCreationExample")}
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
                          <SelectValue placeholder={t("selectPlatform")} />
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
                        placeholder={t("sponsoredVideoPostExample")}
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
                        placeholder={t("day1")}
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

                  {campaignType === "paid_ad" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-Primary" />
                          <p className="text-base font-semibold text-Primary">
                            {t("promotionTarget")}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <BsEye className="w-4 h-4 text-light-green" />
                            <Label className="text-xs font-semibold text-Primary">
                              {t("targetTitleExample")}
                            </Label>
                          </div>
                          <Input
                            value={newMilestone.promotionTarget.title}
                            onChange={(e) =>
                              handlePromotionTargetChange(
                                "title",
                                e.target.value,
                              )
                            }
                            placeholder={t("reach")}
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
                            {t("targetAmountExample")}
                          </Label>
                          <Input
                            value={newMilestone.promotionTarget.amount}
                            onChange={(e) =>
                              handlePromotionTargetChange(
                                "amount",
                                e.target.value,
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
                            {t("promotionGoal")}
                          </p>
                        </div>

                        <div>
                          <Textarea
                            value={newMilestone.promotionGoal}
                            onChange={(e) =>
                              handleInputChange("promotionGoal", e.target.value)
                            }
                            placeholder={t(
                              "describeYourMilestoneGoalHereWhatYouWantToAchieveSpecifically",
                            )}
                            className={`w-full min-h-[120px] placeholder:text-light-gray resize-none focus-visible:ring-1 ${
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
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-Primary" />
                        <p className="text-base font-semibold text-Primary">
                          {t("promotionTarget")}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {METRICS.map(({ key, label, icon, placeholder }) => (
                          <div key={label} className="space-y-1">
                            <div className="flex items-center gap-1">
                              {icon}
                              <Label className="text-sm font-semibold text-light-green">
                                {label}
                              </Label>
                            </div>
                            <Input
                              className={`border rounded-md h-9 px-2 focus:border-light-green placeholder:text-light-gray focus-visible:ring-1 ${
                                errors[key] ? "border-red-500" : ""
                              }`}
                              placeholder={placeholder}
                              value={(newMilestone[key] as string) || ""}
                              onChange={(e) =>
                                handleMetricChange(key, e.target.value)
                              }
                            />
                            {errors[key] && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors[key]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      {t("noMilestoneAddedYet")}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-[200px]">
                      {t("addYourFirstMilestoneToGetStarted")}
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
                              {t("platform")}: {m.platform}
                            </p>

                            {campaignType === "paid_ad" ? (
                              <>
                                {m.promotionTarget && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {t("target")}: {m.promotionTarget.title} -{" "}
                                    {m.promotionTarget.amount}
                                  </div>
                                )}
                                {m.promotionGoal && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {t("goal")}:{" "}
                                    {m.promotionGoal.substring(0, 50)}...
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-xs text-gray-400 mt-1">
                                {t("reach")}: {m.expectedReach || "0"} |{" "}
                                {t("views")}: {m.expectedViews || "0"} |{" "}
                                {t("likes")}: {m.expectedLikes || "0"} |{" "}
                                {t("comments")}: {m.expectedComments || "0"}
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
                  {t("previous")}
                </SecondaryButton>

                <PrimaryButton
                  className="px-8"
                  onClick={handleNextStep}
                  type="button"
                  disabled={loading}
                >
                  {loading ? <Loader className="h-4 w-4" /> : t("next")}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
