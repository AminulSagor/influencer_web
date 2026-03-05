import { z } from "zod";

export const stepThreeSchema = z.object({
  campaignGoals: z.string().min(1, "Campaign Goals is required"),
  productDetails: z.string().min(1, "Product/Service Details is required"),
  dos: z.string().min(1, "Do's is required"),
  donts: z.string().min(1, "Don'ts is required"),
  reportingRequirements: z.string().min(1, "Reporting Requirements is required"),
  usageRights: z.string().min(1, "Usage Rights is required"),
  startingDate: z
    .string()
    .min(1, "Starting Date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Please select a valid starting date",
    }),
  duration: z
    .string()
    .min(1, "Duration is required")
    .refine((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }, "Duration must be a positive number"),
});

export type StepThreeForm = z.infer<typeof stepThreeSchema>;
