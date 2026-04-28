import axios from "axios";
import { serviceClient } from "../base/axios_client";

export type DeleteOwnAccountResponse = {
  success: boolean;
  message: string;
};

export const deleteOwnAccount = async (): Promise<DeleteOwnAccountResponse> => {
  try {
    const response = await serviceClient.delete<DeleteOwnAccountResponse>("/user/me");
    const data = response.data;

    if (!data?.success) {
      throw new Error(data?.message || "Failed to delete account");
    }

    return {
      success: data.success,
      message: data.message || "Your account has been deleted successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ||
        error.message ||
        "Failed to delete account";

      throw new Error(message);
    }

    throw error;
  }
};
