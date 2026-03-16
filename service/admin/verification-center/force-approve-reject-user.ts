import { serviceClient } from "@/service/base/axios_client";

export interface ForceApproveResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    isVerified: boolean;
  };
}

export interface ForceRejectResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    isVerified: false;
    rejectReason: string;
  };
}

export const forceApproveUser = async (
  userId: string
): Promise<ForceApproveResponse> => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/approve`,
    {}
  );

  return res.data;
};

export const forceRejectUser = async (
  userId: string,
  reason: string
): Promise<ForceRejectResponse> => {
  const res = await serviceClient.patch(
    `/influencer/admin/verification/profile/${userId}/reject`,
    {
      reason,
    }
  );

  return res.data;
};