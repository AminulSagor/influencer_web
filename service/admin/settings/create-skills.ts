import { serviceClient } from "@/service/base/axios_client";

export type CreateSkillPayload = {
  name: string;
};

export type CreateSkillResponse = {
  success: boolean;
  id: string;
  message: string;
};

export const createSkill = async (
  payload: CreateSkillPayload
): Promise<CreateSkillResponse> => {
  const res = await serviceClient.post(
    "/influencer/admin/settings/skills",
    payload
  );

  return res.data;
};