import { serviceServer } from "@/service/base/axios_server";

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
        rejectReason?: string | null;
      }[]
    | null;
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification?: {
    nidStatus?: string | null;
    nidRejectReason?: string | null;
  } | null;
  tradeLicenseNumber: string | null;
  tradeLicenseImg: string | null;
  tradeLicenseVerification?: {
    tradeLicenseStatus?: string | null;
    tradeLicenseRejectReason?: string | null;
  } | null;
  tinNumber: string | null;
  tinImage: string | null;
  tinVerification?: {
    tinStatus?: string | null;
    tinRejectReason?: string | null;
  } | null;
  binNumber: string | null;
  binVerification?: {
    binStatus?: string | null;
    binRejectReason?: string | null;
  } | null;
  isOnboardingComplete: boolean;
  userId: string;
  user?: {
    isVerified?: boolean;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    isBlocked?: boolean;
    role?: string;
    verificationRejectReason?: string | null;
  } | null;
};

export async function getBrandProfile(userId: string) {
  const res = await serviceServer.get<BrandProfileApiResponse>(
    `/influencer/admin/verification/client/${userId}`
  );

  const item = res.data;

  return {
    id: item?.id ?? "",
    userId: item?.userId ?? "",
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
      rejectReason: link?.rejectReason ?? null,
    })),
    nidNumber: item?.nidNumber ?? "",
    nidFrontImg: item?.nidFrontImg ?? "",
    nidBackImg: item?.nidBackImg ?? "",
    nidVerification: {
      nidStatus: item?.nidVerification?.nidStatus ?? "",
      nidRejectReason: item?.nidVerification?.nidRejectReason ?? null,
    },
    tradeLicenseNumber: item?.tradeLicenseNumber ?? "",
    tradeLicenseImg: item?.tradeLicenseImg ?? "",
    tradeLicenseVerification: {
      tradeLicenseStatus:
        item?.tradeLicenseVerification?.tradeLicenseStatus ?? "",
      tradeLicenseRejectReason:
        item?.tradeLicenseVerification?.tradeLicenseRejectReason ?? null,
    },
    tinNumber: item?.tinNumber ?? "",
    tinImage: item?.tinImage ?? "",
    tinVerification: {
      tinStatus: item?.tinVerification?.tinStatus ?? "",
      tinRejectReason: item?.tinVerification?.tinRejectReason ?? null,
    },
    binNumber: item?.binNumber ?? "",
    binVerification: {
      binStatus: item?.binVerification?.binStatus ?? "",
      binRejectReason: item?.binVerification?.binRejectReason ?? null,
    },
    isOnboardingComplete: item?.isOnboardingComplete ?? false,
    isVerified: item?.user?.isVerified ?? false,
    isPhoneVerified: item?.user?.isPhoneVerified ?? false,
    isEmailVerified: item?.user?.isEmailVerified ?? false,
    isBlocked: item?.user?.isBlocked ?? false,
    role: item?.user?.role ?? "",
    verificationRejectReason: item?.user?.verificationRejectReason ?? null,
  };
}