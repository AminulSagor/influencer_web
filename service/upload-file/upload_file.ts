/**
 * File Upload Service
 * Handles signed URL generation and S3 uploads
 */

import axios from "axios";
import { serviceClient } from "../base/axios_client";
import {
  signedUrlRequestSchema,
  signedUrlResponseSchema,
  type SignedUrlRequest,
  type SignedUrlResponse,
  type UploadConfirmation,
} from "@/schemas/upload/upload_file_schema";

// Re-export types for convenience
export type { UploadConfirmation, SignedUrlRequest, SignedUrlResponse };

// Get signed URL from backend
export const getSignedUrl = async (
  request: SignedUrlRequest
): Promise<SignedUrlResponse> => {
  const validatedRequest = signedUrlRequestSchema.parse(request);
  const response = await serviceClient.post(`/upload/signed-url`, validatedRequest);
  return signedUrlResponseSchema.parse(response.data);
};

// Upload file to S3 using signed URL
export const uploadFileToS3 = async (
  signedUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> => {
  await axios.put(signedUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

// Complete upload flow (get signed URL + upload to S3)
export const uploadFile = async (
  file: File,
  module: string,
  onProgress?: (progress: number) => void
): Promise<UploadConfirmation> => {
  const { signedUrl, fileKey, publicUrl } = await getSignedUrl({
    fileName: file.name,
    fileType: file.type,
    module,
  });

  await uploadFileToS3(signedUrl, file, onProgress);

  return {
    fileKey,
    publicUrl,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    uploadedAt: new Date(),
  };
};
