import { UserRole } from "@/types/auth/role_type";
import { z } from "zod";

export const buildSignupSchema = (userType: UserRole) =>
  z.object({
    brandName:
      userType === "client"
        ? z.string().trim().min(2, "Brand name is required").max(80)
        : z.string().optional(),

    firstName: z.string().trim().min(2, "First name is required").max(50),
    lastName: z.string().trim().min(2, "Last name is required").max(50),

    email: z.string().trim().email("Invalid email address"),

    // valid BD numbers: 01XXXXXXXXX, 8801XXXXXXXXX, +8801XXXXXXXXX
    phone: z.string().trim().regex(/^(?:\+?88)?01\d{9}$/, "Invalid phone number"),

    password: z.string().min(8, "Password must be at least 8 characters").max(64),
  });

// Useful inferred type (works with ReturnType)
export type SignupSchema = ReturnType<typeof buildSignupSchema>;
export type SignupFormValues = z.infer<SignupSchema>;
