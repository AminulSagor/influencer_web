import { serviceClient } from "@/service/base/axios_client";

interface FcmDeviceResponse {
  success: boolean;
  message: string;
}

export const registerFcmDevice = async (
  fcmToken: string
): Promise<FcmDeviceResponse> => {
  const res = await serviceClient.post<FcmDeviceResponse>(
    "/notifications/device/fcm-token",
    {
      fcmToken,
      deviceType: "web",
    }
  );
  return res.data;
};

export const unregisterFcmDevice = async (
  fcmToken: string
): Promise<FcmDeviceResponse> => {
  const res = await serviceClient.delete<FcmDeviceResponse>(
    `/notifications/device/fcm/${fcmToken}`
  );
  return res.data;
};
