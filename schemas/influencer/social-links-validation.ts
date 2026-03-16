import { z } from "zod";

/**
 * Social Link Schema (for API requests - without status)
 * Single social link with platform and URL
 */
export const socialLinkSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(1, "Platform name is required")
    .refine(
      (val) =>
        ["Instagram", "YouTube", "TikTok", "Facebook", "Twitter", "LinkedIn"].includes(val),
      {
        message: "Invalid platform. Must be Instagram, YouTube, TikTok, Facebook, Twitter, or LinkedIn",
      }
    ),
  url: z
    .string()
    .trim()
    .min(1, "URL or username is required"),
});

/**
 * Social Links Update Schema
 * Validates social links array for influencer profile
 */
export const socialLinksUpdateSchema = z.object({
  socialLinks: z
    .array(socialLinkSchema)
    .max(10, "Maximum 10 social links allowed")
    .refine(
      (links) => {
        // Check for duplicate platforms
        const platforms = links.map((link) => link.platform);
        return new Set(platforms).size === platforms.length;
      },
      {
        message: "Each platform can only be added once",
      }
    ),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type SocialLinksUpdateRequest = z.infer<typeof socialLinksUpdateSchema>;

/**
 * Social Links Update Response Schema
 */
export const socialLinksUpdateResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
  data: z.any().optional(),
});

export type SocialLinksUpdateResponse = z.infer<
  typeof socialLinksUpdateResponseSchema
>;
