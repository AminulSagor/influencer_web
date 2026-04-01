import { z } from "zod";

/**
 * Accept Job Schema
 * Validates data for accepting a job offer
 * POST /campaign/influencer/job/:jobId/accept
 */
export const acceptJobSchema = z.object({
  addressId: z.string().uuid("Invalid address ID").optional(),
});

export type AcceptJobFormData = z.infer<typeof acceptJobSchema>;

/**
 * Decline Job Schema
 * Validates data for declining a job offer
 * POST /campaign/influencer/job/:jobId/decline
 */
export const declineJobSchema = z.object({
  reason: z.string().trim().max(500, "Reason is too long").optional(),
});

export type DeclineJobFormData = z.infer<typeof declineJobSchema>;

/**
 * Complete Job Schema
 * POST /campaign/influencer/job/:jobId/complete
 */
export const completeJobSchema = z.object({
  completionNotes: z.string().trim().max(1000, "Notes are too long").optional(),
});

export type CompleteJobFormData = z.infer<typeof completeJobSchema>;

/**
 * Withdrawal Request Schema
 * POST /campaign/influencer/withdrawal/request
 */
export const withdrawalRequestSchema = z.object({
  campaignId: z.string().uuid("Invalid campaign ID"),
  amount: z.number().positive("Amount must be positive"),
});

export type WithdrawalRequestFormData = z.infer<typeof withdrawalRequestSchema>;
