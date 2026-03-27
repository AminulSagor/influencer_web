import { StepFourPayload } from "@/types/campaign/step4_campaign_type";

export const parseBudget = (budget: string): number => {
  return parseInt(budget.replace(/,/g, ""), 10) || 0;
};

export const extractNumber = (value?: string | number): number => {
  // Handle if value is already a number
  if (typeof value === "number") return value;

  // Handle undefined or empty string
  if (!value || value === "") return 0;

  // Convert to string and clean
  const raw = String(value).trim().toLowerCase().replace(/,/g, "");

  // Handle K/M abbreviations
  if (raw.endsWith("k")) {
    const num = parseFloat(raw.slice(0, -1));
    return !isNaN(num) ? Math.round(num * 1000) : 0;
  }

  if (raw.endsWith("m")) {
    const num = parseFloat(raw.slice(0, -1));
    return !isNaN(num) ? Math.round(num * 1000000) : 0;
  }

  // Handle regular numbers
  const num = parseFloat(raw);
  return !isNaN(num) ? Math.round(num) : 0;
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
):
  | "expectedReach"
  | "expectedViews"
  | "expectedLikes"
  | "expectedComments"
  | "expectedFollows" => {
  const metric = title?.trim().toLowerCase() || "";

  if (metric.includes("reach")) return "expectedReach";
  if (metric.includes("view")) return "expectedViews";
  if (metric.includes("like")) return "expectedLikes";
  if (metric.includes("comment")) return "expectedComments";
  if (metric.includes("follow")) return "expectedFollows";

  return "expectedViews"; // Default fallback
};

export const buildStepFourPayload = (
  budget: string,
  milestones: any[],
  campaignType: string,
): StepFourPayload => {
  return {
    baseBudget: parseBudget(budget),
    milestones: milestones.map((m, index) => {
      // Determine if this is a paid ad milestone based on campaign type
      const isPaidAd = campaignType === "paid_ad";

      if (isPaidAd) {
        // Paid ad logic - INCLUDES follows field
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

          expectedFollows:
            metricField === "expectedFollows"
              ? promotionTargetAmount
              : extractNumber(m.expectedFollows),

          promotionGoal: m.promotionGoal?.trim(),
          order: index + 1,
        };
      } else {
        // Influencer promotion logic - NO follows field
        return {
          contentTitle: m.title.trim(),
          platform: toPlatformEnum(m.platform),
          contentQuantity: m.subtitle.trim(),
          deliveryDays: parseInt(m.day.replace(/[^0-9]/g, ""), 10) || 0,

          expectedReach: extractNumber(m.expectedReach),
          expectedViews: extractNumber(m.expectedViews),
          expectedLikes: extractNumber(m.expectedLikes),
          expectedComments: extractNumber(m.expectedComments),

          promotionGoal: undefined,
          order: index + 1,
        };
      }
    }),
  };
};
