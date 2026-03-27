import { z } from "zod";

/**
 * Email OTP Verification Schema
 * Validates data for verifying email with OTP code
 * POST /influencer/auth/email/influencer/verify
 */
export const emailVerifySchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z
    .string()
    .trim()
    .min(4, "OTP code must be at least 4 characters")
    .max(6, "OTP code must be at most 6 characters"),
});

export type EmailVerifyFormData = z.infer<typeof emailVerifySchema>;
