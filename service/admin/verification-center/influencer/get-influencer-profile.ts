import { serviceServer } from "@/service/base/axios_server";

export type InfluencerNicheItem = {
  niche: string;
  status?: string | null;
  rejectReason?: string | null;
};

export type InfluencerSkillItem = {
  skill: string;
  status?: string | null;
  rejectReason?: string | null;
};

export type InfluencerSocialItem = {
  url: string;
  platform: string;
  status?: string | null;
  rejectReason?: string | null;
};

export type InfluencerProfileDetails = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string | null;
  website: string | null;
  profileImg: string | null;
  addresses: {
    thana?: string;
    zilla?: string;
    country?: string;
    addressName?: string;
    fullAddress?: string;
  }[];
  niches: InfluencerNicheItem[];
  skills: InfluencerSkillItem[];
  socialLinks: InfluencerSocialItem[];
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification?: {
    nidStatus?: string | null;
    nidRejectReason?: string | null;
  } | null;
  isOnboardingComplete: boolean;
  payouts: {
    bank: {
      bankName: string;
      accStatus?: string;
      bankAccNo: string;
      bankRoutingNo: string;
      bankBranchName: string;
      bankAccHolderName: string;
    }[];
    mobileBanking: {
      accStatus?: string;
      accountNo: string;
      accountType: string;
      accountHolderName: string;
    }[];
  };
  averageRating?: string;
  totalReviews?: number;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
};

export const getInfluencerProfile = async (
  userId: string
): Promise<InfluencerProfileDetails | null> => {
  const res = await serviceServer.get(
    `/influencer/admin/verification/profile/${userId}`
  );

  const raw = res?.data?.data;
  if (!raw) return null;

  return {
    id: raw.id,
    userId: raw.userId,
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    fullName:
      `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim() ||
      raw.fullName ||
      "",
    bio: raw.bio ?? null,
    website: raw.website ?? null,
    profileImg: raw.profileImg ?? null,
    addresses: raw.addresses ?? [],
    niches: (raw.niches ?? []).map((item: any) => ({
      niche: item?.niche ?? "",
      status: item?.status ?? null,
      rejectReason: item?.rejectReason ?? null,
    })),
    skills: (raw.skills ?? []).map((item: any) => ({
      skill: item?.skill ?? "",
      status: item?.status ?? null,
      rejectReason: item?.rejectReason ?? null,
    })),
    socialLinks: (raw.socialLinks ?? []).map((item: any) => ({
      url: item?.url ?? "",
      platform: item?.platform ?? "",
      status: item?.status ?? null,
      rejectReason: item?.rejectReason ?? null,
    })),
    nidNumber: raw.nidNumber ?? null,
    nidFrontImg: raw.nidFrontImg ?? null,
    nidBackImg: raw.nidBackImg ?? null,
    nidVerification: raw.nidVerification
      ? {
          nidStatus: raw.nidVerification?.nidStatus ?? null,
          nidRejectReason: raw.nidVerification?.nidRejectReason ?? null,
        }
      : null,
    isOnboardingComplete: !!raw.isOnboardingComplete,
    payouts: {
      bank: raw.payouts?.bank ?? [],
      mobileBanking: raw.payouts?.mobileBanking ?? [],
    },
    averageRating: raw.averageRating ?? "0.0",
    totalReviews: raw.totalReviews ?? 0,
    email: raw.user?.email ?? "",
    phone: raw.user?.phone ?? "",
    isVerified: !!raw.user?.isVerified,
    isEmailVerified: !!raw.user?.isEmailVerified,
  };
};