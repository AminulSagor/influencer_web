import { z } from "zod";

/*
|--------------------------------------------------------------------------
| Common Validators
|--------------------------------------------------------------------------
*/

const nameField = z
  .string()
  .trim()
  .min(1, "This field is required")
  .max(100, "Value is too long");

const accountNumberField = z
  .string()
  .trim()
  .min(1, "Account number is required")
  .max(15, "Account number cannot exceed 15 characters")
  .regex(/^[0-9]+$/, "Account number must contain only digits");

const routingNumberField = z
  .string()
  .trim()
  .min(7, "Routing number must be greater than 6 digits")
  .max(20, "Routing number is too long")
  .regex(/^[0-9]+$/, "Routing number must contain only digits");

/*
|--------------------------------------------------------------------------
| Bank Payout Schema
|--------------------------------------------------------------------------
*/

export const bankPayoutSchema = z
  .object({
    bankName: nameField,

    bankAccHolderName: nameField,

    bankAccNo: accountNumberField,

    bankBranchName: nameField,

    bankRoutingNo: routingNumberField,
  })
  .strict();

/*
|--------------------------------------------------------------------------
| Mobile Banking Payout Schema
|--------------------------------------------------------------------------
*/

export const mobileBankingPayoutSchema = z
  .object({
    accountType: z
      .string()
      .trim()
      .min(1, "Account type is required")
      .max(50, "Account type too long"),

    accountHolderName: nameField,

    accountNo: accountNumberField,
  })
  .strict();

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type BankPayoutFormData = z.infer<typeof bankPayoutSchema>;
export type MobileBankingPayoutFormData = z.infer<typeof mobileBankingPayoutSchema>;