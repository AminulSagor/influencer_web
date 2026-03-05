import * as z from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
    
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
