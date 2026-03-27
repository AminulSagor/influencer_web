import { z } from "zod";

/**
 * Add Address Schema
 * Validates address fields for creating a new address
 * POST /influencer/profile/address
 */
export const addressSchema = z.object({
  addressName: z.string().trim().min(1, "Address name is required"),
  zilla: z.string().min(1, "Please select a Zilla"),
  thana: z.string().min(1, "Please select a Thana"),
  fullAddress: z.string().trim().min(5, "Full address must be at least 5 characters"),
});

export type AddressFormData = z.infer<typeof addressSchema>;

/**
 * Add Address Request Schema
 * Wraps addresses in an array as expected by the API
 * POST /influencer/profile/address
 */
export const addAddressRequestSchema = z.object({
  addresses: z.array(addressSchema).min(1, "At least one address is required"),
});

export type AddAddressRequest = z.infer<typeof addAddressRequestSchema>;

/**
 * Update Address Schema
 * Validates fields for updating an existing address (all fields optional)
 * PATCH /influencer/profile/address/:addressName
 */
export const updateAddressSchema = z.object({
  addressName: z.string().trim().min(1, "Address name is required").optional(),
  zilla: z.string().min(1, "Please select a Zilla").optional(),
  thana: z.string().min(1, "Please select a Thana").optional(),
  fullAddress: z.string().trim().min(5, "Full address must be at least 5 characters").optional(),
  isDefault: z.boolean().optional(),
});

export type UpdateAddressRequest = z.infer<typeof updateAddressSchema>;

/**
 * Address Response Schema
 */
export const addressResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string(),
  data: z.any().optional(),
});

export type AddressResponse = z.infer<typeof addressResponseSchema>;
