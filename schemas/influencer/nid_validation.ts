import { z } from "zod";

/**
 * NID Update Schema
 * Validates NID number and document images
 */

export const nidUpdateSchema = z.object({
  nidNumber: z
    .string()
    .trim()
    .min(1, "NID number is required"),
  
  nidFrontImg: z
    .string()
    .url("Invalid NID front image URL")
    .min(1, "NID front image is required"),
  
  nidBackImg: z
    .string()
    .url("Invalid NID back image URL")
    .min(1, "NID back image is required"),
});

export type NidUpdateRequest = z.infer<typeof nidUpdateSchema>;

/**
 * NID Update Response Schema
 */
export const nidUpdateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    nidNumber: z.string(),
    nidFrontImg: z.string(),
    nidBackImg: z.string(),
    nidVerification: z.enum(["pending", "verified", "rejected"]),
  }).optional(),
});

export type NidUpdateResponse = z.infer<typeof nidUpdateResponseSchema>;
