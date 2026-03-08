// service/auth/login.ts

import { LoginPayload } from "@/types/auth/login_type";
import { serviceClient } from "../base/axios_client";

export const login = async (payload: LoginPayload) => {
  console.log("Base URL:", serviceClient.defaults.baseURL);
  console.log("Login Request Payload:", payload);

  const response = await serviceClient.post(
    `/influencer/auth/login`,
    payload
  );

  console.log("Login Response:", response);

  return response.data;
};