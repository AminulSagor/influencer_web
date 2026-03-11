import { serviceServer } from "@/service/base/axios_server";
import type { BrandProfileDetails } from "@/types/admin/user/user_type";

type BrandProfileApiResponse = {
  id: string;
  brandName: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImg: string | null;
  email: string | null;
  phone: string | null;
  thana: string | null;
  zilla: string | null;
  fullAddress: string | null;
  country: string | null;
  website: string | null;
  socialLinks:
    | {
        url: string | null;
        status: string | null;
        platform: string | null;
      }[]
    | null;
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  tradeLicenseNumber: string | null;
  tradeLicenseImg: string | null;
  tinNumber: string | null;
  tinImage: string | null;
  binNumber: string | null;
  isOnboardingComplete: boolean;
  userId: string;
  user?: {
    isVerified?: boolean;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    isBlocked?: boolean;
  } | null;
};

export async function getBrandProfile(
  userId: string
): Promise<BrandProfileDetails> {
  const res = await serviceServer.get<BrandProfileApiResponse>(
    `/influencer/admin/verification/client/${userId}`
  );

  const item = res.data;

  return {
    id: item?.id ?? "",
    brandName: item?.brandName ?? "",
    firstName: item?.firstName ?? "",
    lastName: item?.lastName ?? "",
    fullName: `${item?.firstName ?? ""} ${item?.lastName ?? ""}`.trim(),
    profileImg: item?.profileImg ?? null,
    email: item?.email ?? "",
    phone: item?.phone ?? "",
    thana: item?.thana ?? "",
    zilla: item?.zilla ?? "",
    fullAddress: item?.fullAddress ?? "",
    country: item?.country ?? "",
    website: item?.website ?? "",
    socialLinks: (item?.socialLinks ?? []).map((link) => ({
      url: link?.url ?? "",
      platform: link?.platform ?? "",
      status: link?.status ?? "",
    })),
    nidNumber: item?.nidNumber ?? "",
    nidFrontImg: item?.nidFrontImg ?? "",
    nidBackImg: item?.nidBackImg ?? "",
    tradeLicenseNumber: item?.tradeLicenseNumber ?? "",
    tradeLicenseImg: item?.tradeLicenseImg ?? "",
    tinNumber: item?.tinNumber ?? "",
    tinImage: item?.tinImage ?? "",
    binNumber: item?.binNumber ?? "",
    isOnboardingComplete: item?.isOnboardingComplete ?? false,
    isVerified: item?.user?.isVerified ?? false,
    isPhoneVerified: item?.user?.isPhoneVerified ?? false,
    isEmailVerified: item?.user?.isEmailVerified ?? false,
    isBlocked: item?.user?.isBlocked ?? false,
  };
}