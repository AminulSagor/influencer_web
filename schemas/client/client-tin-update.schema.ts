import { z } from "zod";

export const clientTinUpdateSchema = z.object({
  tinNumber: z.string().trim().min(1, "TIN number is required"),
  tinImage: z.string().trim().min(1, "TIN certificate is required"),
});

export type ClientTinUpdateInput = z.infer<typeof clientTinUpdateSchema>;