import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  districtId: z.string().min(1, "Zilla is required"),
  thana: z.string().min(1, "Thana is required"),
  address: z.string().min(10, "Full address is required"),
});

export type LocationFormValues = z.infer<typeof locationSchema>;
