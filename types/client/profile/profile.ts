export type VerificationStatus = "pending" | "approved" | "rejected";

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | string;

export type SocialLink = {
  url: string;
  status: VerificationStatus | string;
  platform: SocialPlatform;
};

export type NidVerification = {
  nidStatus: VerificationStatus;
  nidRejectReason: string;
};

export type TradeLicenseVerification = {
  tradeLicenseStatus: VerificationStatus;
  tradeLicenseRejectReason: string;
};

export type TinVerification = {
  tinStatus: VerificationStatus;
  tinRejectReason: string;
};

export type BinVerification = {
  binStatus: VerificationStatus;
  binRejectReason: string;
};

export type BrandProfile = {
  id: string;
  brandName: string;
  firstName: string;
  lastName: string;
  profileImg: string | null;
  email: string;
  phone: string;
  primaryPhone?: string | null;
  thana: string | null;
  zilla: string | null;
  fullAddress: string | null;
  country: string | null;
  niches?: string[] | null;
  website: string | null;
  socialLinks: SocialLink[];
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification: NidVerification | null;
  tradeLicenseNumber: string | null;
  tradeLicenseImg: string | null;
  tradeLicenseVerification: TradeLicenseVerification | null;
  tinNumber: string | null;
  tinImage: string | null;
  tinVerification: TinVerification | null;
  binNumber: string | null;
  binVerification: BinVerification | null;
  isOnboardingComplete: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
};
