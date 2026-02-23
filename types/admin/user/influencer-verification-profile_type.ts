export type InfluencerVerificationStatus = "pending" | "approved" | "rejected";

export type InfluencerSocialPlatform =
  | "Instagram"
  | "Facebook"
  | "Tiktok"
  | "Youtube"
  | "X"
  | "LinkedIn"
  | string;

export type InfluencerAddress = {
  thana: string;
  zilla: string;
  country: string;
  addressName: string;
  fullAddress: string;
};

export type InfluencerSocialLink = {
  url: string;
  platform: InfluencerSocialPlatform;
};

export type InfluencerNidVerification = {
  nidStatus: InfluencerVerificationStatus;
  nidRejectReason: string;
};

export type InfluencerUserInfo = {
  id: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBlocked: boolean;
  fcmToken: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InfluencerVerificationProfile = {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profileImage: string | null;
  addresses: InfluencerAddress[];
  niches: string[] | null;
  skills: string[] | null;
  website: string | null;
  socialLinks: InfluencerSocialLink[];
  nidNumber: string | null;
  nidFrontImg: string | null;
  nidBackImg: string | null;
  nidVerification: InfluencerNidVerification;
  profileImg: string | null;
  isOnboardingComplete: boolean;
  payouts: unknown | null;
  averageRating: string;
  totalReviews: number;
  userId: string;
  user: InfluencerUserInfo;
  createdAt: string;
  updatedAt: string;
};

export type InfluencerVerificationProfileResponse = {
  success: boolean;
  data: InfluencerVerificationProfile;
};