// service/influencer/profile/profile.ts

import { serviceClient } from "../../base/axios_client";
import {
  InfluencerProfileData
} from "../../../types/influencer/account_setting/profile_type";
import {
  NichesUpdateRequest,
  NichesUpdateResponse,
} from "../../../schemas/influencer/niches-validation";
import {
  SkillsUpdateRequest,
  SkillsUpdateResponse,
} from "../../../schemas/influencer/skills-validation";
import {
  SocialLinksUpdateRequest,
  SocialLinksUpdateResponse,
} from "../../../schemas/influencer/social-links-validation";
import {
  BasicInfoUpdateRequest,
  BasicInfoUpdateResponse,
} from "../../../schemas/influencer/basic-info-validation";

export type InfluencerLookupOption = {
  id: string;
  name: string;
};

const normalizeLookupResponse = (data: unknown): InfluencerLookupOption[] => {
  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown })?.data)
      ? (data as { data: unknown[] }).data
      : [];

  return items
    .map((item) => {
      const value = item as Partial<InfluencerLookupOption>;
      return {
        id: String(value.id ?? value.name ?? ""),
        name: String(value.name ?? ""),
      };
    })
    .filter((item) => item.name.trim().length > 0);
};

export const getInfluencerProfile = async (
): Promise<InfluencerProfileData> => {
  const response = await serviceClient.get(`/influencer/profile`);

  return response.data;
};

export const getInfluencerSkillOptions = async (): Promise<InfluencerLookupOption[]> => {
  const response = await serviceClient.get(`/campaign/get/skills`);
  return normalizeLookupResponse(response.data);
};

export const getInfluencerNicheOptions = async (): Promise<InfluencerLookupOption[]> => {
  const response = await serviceClient.get(`/campaign/get/niches`);
  return normalizeLookupResponse(response.data);
};

export const getInfluencerPlatformOptions = async (): Promise<InfluencerLookupOption[]> => {
  const response = await serviceClient.get(`/campaign/get/platforms`);
  return normalizeLookupResponse(response.data);
};

/**
 * Update influencer basic info (name, bio, profile image)
 */
export const updateInfluencerBasicInfo = async (
  data: BasicInfoUpdateRequest
): Promise<BasicInfoUpdateResponse> => {
  const response = await serviceClient.patch(`/influencer/profile/basic-info`, data);
  return response.data;
};

/**
 * Update influencer niches
 */
export const updateInfluencerNiches = async (
  data: NichesUpdateRequest
): Promise<NichesUpdateResponse> => {
  const response = await serviceClient.patch(`/influencer/profile/niches`, data);
  return response.data;
};

/**
 * Update influencer skills
 */
export const updateInfluencerSkills = async (
  data: SkillsUpdateRequest
): Promise<SkillsUpdateResponse> => {
  const response = await serviceClient.patch(`/influencer/profile/skills`, data);
  return response.data;
};

/**
 * Update influencer social links
 */
export const updateInfluencerSocialLinks = async (
  data: SocialLinksUpdateRequest
): Promise<SocialLinksUpdateResponse> => {
  const response = await serviceClient.patch(
    `/influencer/profile/edit/social-links`,
    data
  );
  return response.data;
};

/**
 * Delete a skill by name
 */
export const deleteInfluencerSkill = async (
  skillName: string
): Promise<{ success: boolean; message: string }> => {
  const response = await serviceClient.delete(
    `/influencer/profile/skill/${encodeURIComponent(skillName)}`
  );
  return response.data;
};

/**
 * Delete a social link by URL
 */
export const deleteInfluencerSocialLink = async (
  url: string
): Promise<{ success: boolean; message: string }> => {
  const response = await serviceClient.delete(
    `/influencer/profile/social-link`,
    { data: { url } }
  );
  return response.data;
};

/**
 * Remove a niche by name
 * DELETE /influencer/profile/niche/:nicheName
 */
export const deleteInfluencerNiche = async (
  nicheName: string
): Promise<{ success: boolean; message: string }> => {
  const response = await serviceClient.delete(
    `/influencer/profile/niche/${encodeURIComponent(nicheName)}`
  );
  return response.data;
};

/**
 * Remove profile image
 * DELETE /influencer/profile/profile-image
 */
export const deleteInfluencerProfileImage = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await serviceClient.delete(`/influencer/profile/profile-image`);
  return response.data;
};
