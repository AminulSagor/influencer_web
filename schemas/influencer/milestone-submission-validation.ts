import { z } from "zod";

/**
 * Milestone Submission Schema
 * Validates data for submitting milestone work
 * POST /campaign/influencer/milestone/:milestoneId/submit
 */
export const milestoneSubmissionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description is too long"),
  liveLinks: z
    .array(z.string().trim().min(1, "Link cannot be empty"))
    .min(1, "At least one live link is required"),
  proofAttachments: z
    .array(z.string().url("Invalid attachment URL"))
    .min(1, "At least one proof attachment is required"),
  achievedViews: z.number().int().min(0, "Views must be non-negative"),
  achievedReach: z.number().int().min(0, "Reach must be non-negative"),
  achievedLikes: z.number().int().min(0, "Likes must be non-negative"),
  achievedComments: z.number().int().min(0, "Comments must be non-negative"),
});

export type MilestoneSubmissionFormData = z.infer<typeof milestoneSubmissionSchema>;

/**
 * Milestone Resubmission Schema
 * Validates data for resubmitting/updating milestone work
 * PATCH /campaign/influencer/submission/:submissionId/resubmit
 */
export const milestoneResubmissionSchema = z.object({
  description: z.string().trim().max(2000).optional(),
  liveLinks: z.array(z.string().trim().min(1)).optional(),
  proofAttachments: z.array(z.string().url()).optional(),
  achievedViews: z.number().int().min(0).optional(),
  achievedReach: z.number().int().min(0).optional(),
  achievedLikes: z.number().int().min(0).optional(),
  achievedComments: z.number().int().min(0).optional(),
});

export type MilestoneResubmissionFormData = z.infer<typeof milestoneResubmissionSchema>;
