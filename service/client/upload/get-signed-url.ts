import { serviceClient } from "@/service/base/axios_client";

export type GetSignedUrlBody = {
  fileName: string;
  fileType: string;
  module: string;
};

export type GetSignedUrlResponse = {
  success: boolean;
  message: string;
  signedUrl: string;
  fileKey: string;
  publicUrl: string;
};

export const getSignedUrl = async (
  body: GetSignedUrlBody,
): Promise<GetSignedUrlResponse | string> => {
  try {
    const { data } = await serviceClient.post<GetSignedUrlResponse>(
      "/upload/signed-url",
      body,
    );
    return data;
  } catch {
    return "Failed to generate upload URL";
  }
};