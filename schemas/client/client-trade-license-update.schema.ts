import { z } from "zod";

export const clientTradeLicenseUpdateSchema = z.object({
  tradeLicenseNumber: z
    .string()
    .trim()
    .min(1, "Trade license number is required"),
  tradeLicenseImg: z
    .string()
    .trim()
    .min(1, "Trade license image is required"),
});

export type ClientTradeLicenseUpdateInput = z.infer<
  typeof clientTradeLicenseUpdateSchema
>;