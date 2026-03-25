// service/upload.ts — Global file upload utility (signed URL flow)

import axios from "axios";
import { serviceClient } from "./base/axios_client";

// ── Types ────────────────────────────────────────────────────────────

export interface SignedUrlResponse {
  success: boolean;
  message: string;
  signedUrl: string;
  fileKey: string;
  publicUrl: string;
}

export interface UploadResult {
  publicUrl: string;
  fileKey: string;
}

// ── Core upload function ─────────────────────────────────────────────

/**
 * Upload a file using the two-step signed-URL flow:
 *  1. POST  /upload/signed-url  → get a pre-signed S3 URL
 *  2. PUT   the binary file to that URL
 *
 * @param file   - The File object to upload
 * @param module - Folder path in the bucket (e.g. "onboarding/nid")
 * @returns        { publicUrl, fileKey }
 */
export async function uploadFile(
  file: File,
  module: string
): Promise<UploadResult> {
  // Step 1: Request signed URL from the backend
  const { data } = await serviceClient.post<SignedUrlResponse>(
    "/upload/signed-url",
    {
      fileName: file.name,
      fileType: file.type,
      module,
    }
  );

  // Step 2: PUT the binary file directly to S3
  await axios.put(data.signedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return {
    publicUrl: data.publicUrl,
    fileKey: data.fileKey,
  };
}
