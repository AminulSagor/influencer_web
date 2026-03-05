import { z } from "zod";

export const addressSchema = z.object({
  zila: z.string().min(1, "Zila is required"),
  thana: z.string().min(1, "Thana is required"),
  fullAddress: z.string().min(3, "Full address is required").max(200),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
