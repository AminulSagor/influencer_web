import { z } from "zod";
import { bankPayoutSchema, mobileBankingPayoutSchema } from "./payout-validation";

/**
 * Update Payout Schema
 * Validates full payout update (bank + mobile banking arrays)
 * PATCH /influencer/profile/edit/payouts
 */

const bankPayoutWithStatusSchema = bankPayoutSchema.extend({
  accStatus: z.string().min(1, "Account status is required"),
});

const mobileBankingWithStatusSchema = mobileBankingPayoutSchema.extend({
  accStatus: z.string().min(1, "Account status is required"),
});

export const updatePayoutSchema = z.object({
  bank: z.array(bankPayoutWithStatusSchema).optional(),
  mobileBanking: z.array(mobileBankingWithStatusSchema).optional(),
});

export type UpdatePayoutFormData = z.infer<typeof updatePayoutSchema>;
