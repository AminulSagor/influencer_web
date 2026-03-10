import { z } from "zod";

export const clientBinUpdateSchema = z.object({
  binNumber: z.string().trim().min(1, "BIN number is required"),
});

export type ClientBinUpdateInput = z.infer<typeof clientBinUpdateSchema>;