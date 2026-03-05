// types/campaign/step2_campaign_validation.ts
import { z } from "zod";

export const stepTwoSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  campaignNiche: z.string().min(1, "Campaign niche is required"),
  preferredInfluencerIds: z.array(z.string()).nonempty("Select at least one preferred influencer"),
  notPreferableInfluencerIds: z.array(z.string()).optional(),
});

export type StepTwoFormData = z.infer<typeof stepTwoSchema>;
