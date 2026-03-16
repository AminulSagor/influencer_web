import { z } from "zod";

/**
 * Niches Update Schema
 * Validates niches array for influencer profile (API expects array of strings)
 */
export const nichesUpdateSchema = z.object({
  niches: z
    .array(z.string().trim().min(1, "Niche name cannot be empty"))
    .max(10, "Maximum 10 niches allowed"),
});

export type NichesUpdateRequest = z.infer<typeof nichesUpdateSchema>;

/**
 * Niches Update Response Schema
 */
export const nichesUpdateResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
  data: z.any().optional(),
});

export type NichesUpdateResponse = z.infer<typeof nichesUpdateResponseSchema>;
