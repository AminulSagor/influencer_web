import axios from "axios";
import { apiClient } from "../base/axios_client";
import { SignupPayload, SignupResponse } from "@/types/auth/signup_type";


export async function signup(payload: SignupPayload) {
  try {
    const res = await apiClient.post<SignupResponse>(
      "/influencer/auth/signup",
      payload
    );
    return res;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const msg =
        (err.response?.data as { message?: string })?.message ||
        "Something went wrong";
      const status = err.response?.status ?? 0;
      throw { status, message: msg };
    }
    throw { status: 0, message: "Something went wrong" };
  }
}
