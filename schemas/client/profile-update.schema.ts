import * as z from "zod";

export const profileUpdateSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  profileImg: z.string().optional(),
  thana: z.string().min(1, "Thana is required"),
  zilla: z.string().min(1, "Zilla is required"),
  fullAddress: z.string().min(1, "Full address is required"),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;