export type VerificationStatus = "pending" | "approved" | "rejected";

export type SocialPlatform = "instagram" | "facebook" | "youtube" | "tiktok" | "linkedin" | string;

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
  profileImg: string;
  email: string;
  phone: string;
  thana: string;
  zilla: string;
  fullAddress: string;
  country: string;
  website: string;
  socialLinks: SocialLink[];
  nidNumber: string;
  nidFrontImg: string;
  nidBackImg: string;
  nidVerification: NidVerification;
  tradeLicenseNumber: string;
  tradeLicenseImg: string;
  tradeLicenseVerification: TradeLicenseVerification;
  tinNumber: string;
  tinImage: string;
  tinVerification: TinVerification;
  binNumber: string;
  binVerification: BinVerification;
  isOnboardingComplete: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
};