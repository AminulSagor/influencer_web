import { z } from "zod";

/**
 * Skills Update Schema
 * Validates skills array for influencer profile (API expects array of strings)
 */
export const skillsUpdateSchema = z.object({
  skills: z
    .array(z.string().trim().min(1, "Skill name cannot be empty"))
    .max(15, "Maximum 15 skills allowed"),
});

export type SkillsUpdateRequest = z.infer<typeof skillsUpdateSchema>;

/**
 * Skills Update Response Schema
 */
export const skillsUpdateResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
  data: z.any().optional(),
});

export type SkillsUpdateResponse = z.infer<typeof skillsUpdateResponseSchema>;
