// service/auth/login.ts

import { LoginPayload } from "@/types/auth/login_type";
import { serviceClient } from "../base/axios_client";

export const login = async (payload: LoginPayload) => {

  const response = await serviceClient.post(
    `/influencer/auth/login`,
    payload
  );

  return response.data;
};