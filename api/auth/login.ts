import { LoginPayload } from "@/types/auth/login_type";
import { apiClient } from "../base/axios_client";

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post(
    `/influencer/auth/login`,
    payload
  );

  return response.data;
};
