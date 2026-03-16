import { serviceServer } from "@/service/base/axios_server";

type UserCompletionApiResponse = {
  success: boolean;
  data: {
    userId: string;
    role: string;
    completionPercentage: number;
    isFullyVerified: boolean;
    missingOrPendingSteps: string[];
  };
};

export async function getUserCompletion(userId: string) {
  try {
    const res = await serviceServer.get<UserCompletionApiResponse>(
      `/influencer/admin/users/${userId}/completion`
    );

    return {
      userId: res.data?.data?.userId ?? "",
      role: res.data?.data?.role ?? "",
      completionPercentage: Number(res.data?.data?.completionPercentage ?? 0),
      isFullyVerified: res.data?.data?.isFullyVerified ?? false,
      missingOrPendingSteps: res.data?.data?.missingOrPendingSteps ?? [],
    };
  } catch (error) {
    console.error("getUserCompletion failed:", error);

    return {
      userId: "",
      role: "",
      completionPercentage: 0,
      isFullyVerified: false,
      missingOrPendingSteps: [],
    };
  }
}