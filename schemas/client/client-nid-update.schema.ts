import { z } from "zod";

export const clientNidUpdateSchema = z.object({
  nidNumber: z.string().trim().min(1, "NID number is required"),
  nidFrontImg: z.string().trim().min(1, "NID front image is required"),
  nidBackImg: z.string().trim().min(1, "NID back image is required"),
});

export type ClientNidUpdateInput = z.infer<typeof clientNidUpdateSchema>;