import { z } from "zod";

export const basicInfoUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  bio: z.string().max(500).optional().nullable(),
  profileImg: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
});

export type BasicInfoUpdateRequest = z.infer<typeof basicInfoUpdateSchema>;

export interface BasicInfoUpdateResponse {
  success: boolean;
  message: string;
  data?: {
    firstName: string;
    lastName: string;
    bio: string | null;
    profileImg: string | null;
    website: string | null;
  };
}
