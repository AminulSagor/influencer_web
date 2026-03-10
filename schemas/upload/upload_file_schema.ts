/**
 * File Upload Schemas
 * Zod validation for upload requests and responses
 */

import * as z from "zod";

// ==================== REQUEST SCHEMA ====================
export const signedUrlRequestSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  module: z.string().min(1, "Module is required"),
  fileSize: z.number().positive().optional(),
});

export type SignedUrlRequest = z.infer<typeof signedUrlRequestSchema>;

// ==================== RESPONSE SCHEMA ====================
export const signedUrlResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  signedUrl: z.string().url("Invalid signed URL"),
  fileKey: z.string().min(1, "File key is required"),
  publicUrl: z.string().url("Invalid public URL"),
});

export type SignedUrlResponse = z.infer<typeof signedUrlResponseSchema>;

// ==================== UPLOAD RESULT ====================
export type UploadConfirmation = {
  fileKey: string;
  publicUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  uploadedAt?: Date;
};
