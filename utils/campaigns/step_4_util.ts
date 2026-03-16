import { StepFourPayload } from "@/types/campaign/step4_campaign_type";

export const parseBudget = (budget: string): number => {
  return parseInt(budget.replace(/,/g, ""), 10) || 0;
};

export const extractNumber = (value?: string): number | undefined => {
  if (!value) return undefined;

  const raw = value.trim().toLowerCase().replace(/,/g, "");
  const num = parseFloat(raw);

  if (!Number.isFinite(num)) return undefined;

  if (raw.endsWith("m")) return Math.round(num * 1_000_000);
  if (raw.endsWith("k")) return Math.round(num * 1_000);

  return Math.round(num);
};

export const toPlatformEnum = (platform: string) => {
  const p = platform.trim().toLowerCase();
  if (p === "facebook") return "facebook";
  if (p === "instagram") return "instagram";
  if (p === "youtube") return "youtube";
  if (p === "tiktok") return "tiktok";
  if (p === "twitter") return "twitter";
  if (p === "linkedin") return "linkedin";
  return p || "instagram";
};

const getPaidAdMetricField = (
  title?: string,
): "expectedReach" | "expectedViews" | "expectedLikes" | "expectedComments" => {
  const metric = title?.trim().toLowerCase() || "";

  if (metric.includes("reach")) return "expectedReach";
  if (metric.includes("view")) return "expectedViews";
  if (metric.includes("like")) return "expectedLikes";
  if (metric.includes("comment")) return "expectedComments";

  return "expectedViews";
};

export const buildStepFourPayload = (
  budget: string,
  milestones: any[],
): StepFourPayload => {
  return {
    baseBudget: parseBudget(budget),
    milestones: milestones.map((m, index) => {
      const promotionTargetAmount = extractNumber(m.promotionTarget?.amount);
      const metricField = getPaidAdMetricField(m.promotionTarget?.title);

      return {
        contentTitle: m.title.trim(),
        platform: toPlatformEnum(m.platform),
        contentQuantity: m.subtitle.trim(),
        deliveryDays: parseInt(m.day.replace(/[^0-9]/g, ""), 10) || 0,

        expectedReach:
          metricField === "expectedReach"
            ? promotionTargetAmount
            : extractNumber(m.expectedReach),

        expectedViews:
          metricField === "expectedViews"
            ? promotionTargetAmount
            : extractNumber(m.expectedViews),

        expectedLikes:
          metricField === "expectedLikes"
            ? promotionTargetAmount
            : extractNumber(m.expectedLikes),

        expectedComments:
          metricField === "expectedComments"
            ? promotionTargetAmount
            : extractNumber(m.expectedComments),

        promotionGoal: m.promotionGoal?.trim(),
        order: index + 1,
      };
    }),
  };
};
