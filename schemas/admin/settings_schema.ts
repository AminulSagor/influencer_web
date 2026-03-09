import z from "zod";

export const securitySchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    oldPassword: z
      .string()
      .min(1, "Old password is required")
      .min(8, "Old password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SecurityFormData = z.infer<typeof securitySchema>;

export type FormErrors = Partial<Record<keyof SecurityFormData, string>>;