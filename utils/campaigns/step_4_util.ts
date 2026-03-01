import { StepFourPayload } from "@/types/campaign/step4_campaign_type";

export const parseBudget = (budget: string): number => {
  return parseInt(budget.replace(/,/g, ""), 10) || 0;
};

export const extractNumber = (value?: string): number | undefined => {
  if (!value) return undefined;
  const n = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : undefined;
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

export const buildStepFourPayload = (
  budget: string,
  milestones: any[]
): StepFourPayload => {
  return {
    baseBudget: parseBudget(budget),
    milestones: milestones.map((m, index) => ({
      contentTitle: m.title.trim(),
      platform: toPlatformEnum(m.platform),
      contentQuantity: m.subtitle.trim(),
      deliveryDays:
        parseInt(m.day.replace(/[^0-9]/g, ""), 10) || 0,

      expectedReach: extractNumber(m.expectedReach),
      expectedViews: extractNumber(m.expectedViews),
      expectedLikes: extractNumber(m.expectedLikes),
      expectedComments: extractNumber(m.expectedComments),

      promotionGoal: m.promotionGoal?.trim(),
      order: index + 1,
    })),
  };
};
