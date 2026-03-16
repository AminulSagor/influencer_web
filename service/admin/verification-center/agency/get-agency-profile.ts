import { serviceServer } from "@/service/base/axios_server";

export type AgencyNicheItem = {
  niche: string;
  status?: string | null;
  rejectReason?: string | null;
};

export type AgencySocialItem = {
  url: string;
  platform: string;
  status?: string | null;
  rejectReason?: string | null;
};

export type AgencyProfileDetails = {
  id: string;
  userId: string;
  agencyName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  secondaryPhone?: string | null;
  logo: string | null;
  agencyBio: string | null;
  serviceFee?: string | null;
  dollarRate?: string | null;
  website: string | null;
  address?: {
    thana?: string;
    zilla?: string;
    fullAddress?: string;
  } | null;
  niches: AgencyNicheItem[];
  socialLinks: AgencySocialItem[];
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification?: {
    nidStatus?: string | null;
    nidRejectReason?: string | null;
  } | null;
  tradeLicenseNumber: string | null;
  tradeLicenseImage: string | null;
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
  payouts: {
    bank: {
      bankName: string;
      accStatus?: string | null;
      bankAccNo: string;
      bankRoutingNo: string;
      bankBranchName: string;
      bankAccHolderName: string;
    }[];
    mobileBanking: {
      accStatus?: string | null;
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
  verificationRejectReason?: string | null;
};

export const getAgencyVerificationProfile = async (
  userId: string
): Promise<AgencyProfileDetails | null> => {
  const res = await serviceServer.get(
    `/influencer/admin/verification/agency/${userId}`
  );

  const raw = res?.data;
  if (!raw) return null;

  return {
    id: raw.id,
    userId: raw.userId,
    agencyName: raw.agencyName ?? "",
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    fullName:
      `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim() ||
      raw.fullName ||
      raw.agencyName ||
      "",
    secondaryPhone: raw.secondaryPhone ?? null,
    logo: raw.logo ?? null,
    agencyBio: raw.agencyBio ?? null,
    serviceFee: raw.serviceFee ?? null,
    dollarRate: raw.dollarRate ?? null,
    website: raw.website ?? null,
    address: raw.address ?? null,
    niches: (raw.niches ?? []).map((item: any) => ({
      niche: item?.niche ?? "",
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
    tradeLicenseNumber: raw.tradeLicenseNumber ?? null,
    tradeLicenseImage: raw.tradeLicenseImage ?? null,
    tradeLicenseVerification: raw.tradeLicenseVerification
      ? {
          tradeLicenseStatus:
            raw.tradeLicenseVerification?.tradeLicenseStatus ?? null,
          tradeLicenseRejectReason:
            raw.tradeLicenseVerification?.tradeLicenseRejectReason ?? null,
        }
      : null,
    tinNumber: raw.tinNumber ?? null,
    tinImage: raw.tinImage ?? null,
    tinVerification: raw.tinVerification
      ? {
          tinStatus: raw.tinVerification?.tinStatus ?? null,
          tinRejectReason: raw.tinVerification?.tinRejectReason ?? null,
        }
      : null,
    binNumber: raw.binNumber ?? null,
    binVerification: raw.binVerification
      ? {
          binStatus: raw.binVerification?.binStatus ?? null,
          binRejectReason: raw.binVerification?.binRejectReason ?? null,
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
    verificationRejectReason: raw.user?.verificationRejectReason ?? null,
  };
};