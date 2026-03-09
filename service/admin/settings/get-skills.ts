import { serviceServer } from "@/service/base/axios_server";

export type SkillItem = {
  id: string;
  name: string;
};

export const getSkills = async (): Promise<SkillItem[]> => {
  const res = await serviceServer.get("/influencer/admin/settings/skills");

  return res.data;
};