import { z } from "zod";

export const milestoneSchema = z.object({
  contentTitle: z.string().min(1, "Content title is required"),
  platform: z.string().min(1, "Platform is required"),
  contentQuantity: z.string().min(1, "Content quantity is required"),
  deliveryDays: z.number().min(1, "Delivery days must be at least 1"),
  promotionGoal: z.string().optional(),
  expectedViews: z.number().optional(),
  expectedReach: z.number().optional(),
  expectedLikes: z.number().optional(),
  expectedComments: z.number().optional(),
  order: z.number(),
});

export const stepFourSchema = z.object({
  baseBudget: z
    .number()
    .min(25000, "Minimum budget must be ৳25,000"),
  milestones: z
    .array(milestoneSchema)
    .min(1, "At least one milestone is required"),
});
