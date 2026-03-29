import { serviceClient } from "@/service/base/axios_client";

export type GetSignedUrlPayload = {
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
    payload: GetSignedUrlPayload
): Promise<GetSignedUrlResponse> => {
    const response = await serviceClient.post<GetSignedUrlResponse>(
        "/upload/signed-url",
        payload
    );

    return response.data;
};